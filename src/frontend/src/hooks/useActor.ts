import { loadConfig } from "@caffeineai/core-infrastructure";
import { safeGetCanisterEnv } from "@icp-sdk/core/agent/canister-env";
import { useCallback, useEffect, useState } from "react";
import { type Backend, createActor } from "../backend-wrapper";

// Shape of the ic_env cookie for this app. The platform injects
// PUBLIC_CANISTER_ID:backend (and IC_ROOT_KEY, always present) into the
// ic_env cookie at deploy time; in dev, vite.config.js simulates it.
type AppCanisterEnv = {
  // biome-ignore lint/complexity/useLiteralKeys: key contains a colon, quotes are required
  readonly ["PUBLIC_CANISTER_ID:backend"]: string;
  // getCanisterEnv decodes the ic_root_key hex from the cookie into a
  // Uint8Array, so this is a Uint8Array (not a string) at runtime. Typing it
  // as Uint8Array keeps it assignable to HttpAgentOptions.rootKey.
  readonly IC_ROOT_KEY?: Uint8Array;
};

// Shape of the env.json config loaded via @caffeineai/core-infrastructure's
// loadConfig. The platform populates backend_canister_id at deploy time (the
// same way it fills ii_derivation_origin and storage_gateway_url). This is the
// production fallback when the ic_env cookie is absent.
type AppConfig = {
  readonly backend_canister_id?: string;
};

export interface ActorState {
  actor: Backend | null;
  isFetching: boolean;
  error: string | null;
  retry: () => void;
}

const FAILURE_STATE = (
  message: string,
): Pick<ActorState, "actor" | "isFetching" | "error"> => ({
  actor: null,
  isFetching: false,
  error: message,
});

export function useActor(): ActorState {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<
    Pick<ActorState, "actor" | "isFetching" | "error">
  >({
    actor: null,
    isFetching: true,
    error: null,
  });

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: attempt is intentionally a dep so retry re-runs init
  useEffect(() => {
    let cancelled = false;

    async function init() {
      setState({ actor: null, isFetching: true, error: null });

      try {
        // Resolve the backend canister ID and agent root-key options.
        //
        // Primary path (dev + any deployment where the platform sets the
        // ic_env cookie): read PUBLIC_CANISTER_ID:backend and IC_ROOT_KEY from
        // the ic_env cookie via safeGetCanisterEnv. safeGetCanisterEnv returns
        // undefined (instead of throwing) when the cookie is missing or
        // malformed.
        //
        // Fallback path (production where the ic_env cookie is absent): read
        // backend_canister_id from env.json via loadConfig. The Caffeine
        // platform populates this field at deploy time. The loadConfig path
        // does not provide IC_ROOT_KEY, so we default shouldFetchRootKey to
        // true — the production host (icp0.io / ic0.app) serves a verifiable
        // root key.
        let canisterId: string | undefined;
        let agentOptions: {
          host?: string;
          shouldFetchRootKey?: boolean;
          rootKey?: Uint8Array;
        };

        const env = safeGetCanisterEnv<AppCanisterEnv>();
        if (env) {
          canisterId = env["PUBLIC_CANISTER_ID:backend"];
          const isDev = import.meta.env.DEV;
          agentOptions = isDev
            ? { shouldFetchRootKey: true }
            : { rootKey: env.IC_ROOT_KEY };
        } else {
          // ic_env cookie absent — production fallback to env.json.
          const config = (await loadConfig()) as AppConfig | undefined;
          canisterId = config?.backend_canister_id;

          // env.json may surface an empty backend_canister_id (e.g. before the
          // platform has finished wiring the deployment). The platform can set
          // the ic_env cookie slightly after initial page load, so re-read it
          // once before giving up.
          if (!canisterId) {
            const envRetry = safeGetCanisterEnv<AppCanisterEnv>();
            if (envRetry) {
              canisterId = envRetry["PUBLIC_CANISTER_ID:backend"];
            }
          }

          // Derive an explicit host so HttpAgent.createSync talks to the right
          // boundary node. On icp0.io / ic0.app the canister is reachable at
          // https://<canisterId>.<domain>. On local dev / unknown hosts we
          // leave host unset and let the agent use its default (replica on
          // localhost). shouldFetchRootKey stays true in every case — the
          // production boundary still serves a verifiable root key.
          const hostname =
            typeof window !== "undefined" ? window.location.hostname : "";
          let host: string | undefined;
          if (hostname.endsWith(".icp0.io")) {
            host = `https://${canisterId}.icp0.io`;
          } else if (hostname.endsWith(".ic0.app")) {
            host = `https://${canisterId}.ic0.app`;
          }
          agentOptions = host
            ? { host, shouldFetchRootKey: true }
            : { shouldFetchRootKey: true };
        }

        if (!canisterId) {
          if (!cancelled) {
            setState(
              FAILURE_STATE(
                "Backend canister ID not found. The deployment may still be in progress — retry once it is ready.",
              ),
            );
          }
          return;
        }

        const actor = createActor(canisterId, { agentOptions });
        if (!cancelled) {
          setState({ actor, isFetching: false, error: null });
        }
      } catch (error) {
        console.error("Failed to create actor:", error);
        if (!cancelled) {
          setState(
            FAILURE_STATE(
              error instanceof Error
                ? error.message
                : "Failed to connect to the backend. Please retry.",
            ),
          );
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  return { ...state, retry };
}
