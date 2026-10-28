import { register } from "node:module";

// Payload's CLI defaults to tsx, which mis-compiles Payload's ESM on this
// Node version. This hook only adds TypeScript extensions for our own
// extensionless imports so `node` can strip types natively.
register("./resolve-ts-hook.mjs", import.meta.url);
