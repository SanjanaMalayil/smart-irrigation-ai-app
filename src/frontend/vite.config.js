import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// In production the Caffeine platform injects PUBLIC_CANISTER_ID variables and
// sets the `ic_env` cookie on the asset canister that hosts the frontend. In
// dev (vite serve) there is no asset canister, so we simulate the cookie here.
//
// The cookie format expected by @icp-sdk/core's getCanisterEnv is:
//   ic_env=<url-encoded "key=value&key=value">; Path=/
// where `ic_root_key` is a hex-encoded IC root key (133 bytes when decoded)
// and `PUBLIC_CANISTER_ID:backend` is the backend canister id.
//
// For dev we point at the local replica's backend canister id and let the
// agent fetch the replica's root key (shouldFetchRootKey: true in useActor),
// so the ic_root_key value here only needs to be a valid-length placeholder.

// Local replica backend canister id (dfx-style placeholder). Replace with the
// real id printed by `caffeine deploy --local` if you deploy locally.
const DEV_BACKEND_CANISTER_ID =
  process.env.CANISTER_ID_BACKEND || "uxrrr-q7777-77774-qaaca-cai";

// 133-byte dev root key as hex (all zeros placeholder — never used to verify
// because useActor sets shouldFetchRootKey: true in dev). 133 bytes = 266 hex
// chars.
const DEV_ROOT_KEY_HEX = "00".repeat(133);

const DEV_IC_ENV_VALUE = encodeURIComponent(
  `PUBLIC_CANISTER_ID:backend=${DEV_BACKEND_CANISTER_ID}&ic_root_key=${DEV_ROOT_KEY_HEX}`,
);

const ii_url =
  process.env.DFX_NETWORK === "local"
    ? `http://uqzsh-gqaaa-aaaaq-qaada-cai.localhost:8081/authorize`
    : `https://id.ai/authorize`;

process.env.II_URL = process.env.II_URL || ii_url;
process.env.STORAGE_GATEWAY_URL =
  process.env.STORAGE_GATEWAY_URL || "https://blob.caffeine.ai";

export default defineConfig(({ command }) => {
  const isServe = command === "serve";

  return {
    logLevel: "error",
    build: {
      emptyOutDir: true,
      sourcemap: false,
      minify: false,
    },
    css: {
      postcss: "./postcss.config.js",
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:4943",
          changeOrigin: true,
        },
      },
    },
    plugins: [
      // Simulate the ic_env cookie in dev so @icp-sdk/core's getCanisterEnv can
      // read PUBLIC_CANISTER_ID:backend. In production the platform sets this
      // cookie on the asset canister, so no plugin is needed for builds.
      isServe && {
        name: "caffeine-ic-env-cookie",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            // Only set the cookie if the client hasn't already got one; this
            // keeps the dev override from clobbering a real cookie in hybrid
            // setups.
            const existing = req.headers.cookie || "";
            if (!/(^|;\s*)ic_env=/.test(existing)) {
              const setCookie = `ic_env=${DEV_IC_ENV_VALUE}; Path=/; SameSite=Lax`;
              res.setHeader("Set-Cookie", setCookie);
            }
            next();
          });
        },
      },
      react(),
    ].filter(Boolean),
    resolve: {
      alias: [
        {
          find: "declarations",
          replacement: fileURLToPath(
            new URL("../declarations", import.meta.url),
          ),
        },
        {
          find: "@",
          replacement: fileURLToPath(new URL("./src", import.meta.url)),
        },
      ],
      dedupe: ["@icp-sdk/core"],
    },
  };
});
