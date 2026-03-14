import { validateEnvironment } from "./utils/env";

// cloudflare workers ONLY!
export type HBindings = {};

export type HVariables = {};

export type HTypes = {
  Bindings: HBindings;
  Variables: HVariables;
};
