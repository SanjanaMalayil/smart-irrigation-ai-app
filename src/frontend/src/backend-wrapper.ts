// Single source of truth for backend bindings.
//
// The bindgen-generated `./backend` (matching `./backend.d.ts` and the actual
// backend.did) is the canonical actor wrapper. This file is a thin
// compatibility layer that:
//   1. Re-exports the bindgen `Backend` class, `createActor`, and all Candid
//      types so callers import from one place.
//   2. Re-exports `ExternalBlob` (defined in the bindgen file) unchanged, so
//      feature components that build `ExternalBlob.fromBytes(...)` keep working.
//   3. Provides a 2-arg `createActor(canisterId, options)` wrapper that supplies
//      no-op upload/download callbacks required by the bindgen 4-arg signature,
//      so `useActor` can construct the actor without passing blob plumbing.
//
// Do NOT re-implement the Backend class or drift the types — edit the bindgen
// output (`./backend`) via `pnpm bindgen` instead.

import {
  type Backend as BindgenBackend,
  type CreateActorOptions,
  createActor as bindgenCreateActor,
} from "./backend";

// Re-export CreateActorOptions from the bindgen source of truth (do not
// redeclare it locally — that caused TS2440 import/declaration conflict).
export type { CreateActorOptions };

// Re-export the bindgen ExternalBlob (used by feature components) and all
// Candid record types so there is a single import surface.
export {
  ExternalBlob,
  type ChatMessage,
  type HttpHeader,
  type HttpRequestResult,
  type IrrigationRecommendation,
  type PlantHealthAnalysis,
  type TransformationInput,
  type TransformationOutput,
  type WeatherData,
  type backendInterface,
} from "./backend";

// The concrete actor type callers use.
export type Backend = BindgenBackend;

// No-op blob plumbing. The bindgen `createActor` requires upload/download
// callbacks because the IDL may reference blob types, but this app handles
// image bytes client-side (see useAnalyzePlantHealth), so the callbacks just
// pass the bytes through.
const noopUpload = async (file: { getBytes(): Promise<Uint8Array> }) =>
  file.getBytes();
const noopDownload = async (file: Uint8Array) => file;

export function createActor(
  canisterId: string,
  options: CreateActorOptions = {},
): Backend {
  return bindgenCreateActor(
    canisterId,
    noopUpload as never,
    noopDownload as never,
    options,
  );
}
