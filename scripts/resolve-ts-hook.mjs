import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const EXTENSIONS = [".ts", ".tsx", ".js", ".mjs", ".cjs"];

function resolveExisting(base) {
  if (existsSync(base) && !base.endsWith(path.sep)) {
    const statExt = path.extname(base);
    if (statExt) return base;
  }
  for (const ext of EXTENSIONS) {
    const file = base + ext;
    if (existsSync(file)) return file;
    const index = path.join(base, `index${ext}`);
    if (existsSync(index)) return index;
  }
  return null;
}

function fileFromSpecifier(specifier, parentURL) {
  if (specifier === "@payload-config") {
    return path.resolve(process.cwd(), "payload.config.ts");
  }
  if (specifier.startsWith("@/")) {
    return path.resolve(process.cwd(), specifier.slice(2));
  }
  if (specifier.startsWith(".") && parentURL) {
    return path.resolve(path.dirname(fileURLToPath(parentURL)), specifier);
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    const base = fileFromSpecifier(specifier, context.parentURL);
    if (!base) throw error;
    const file = resolveExisting(base);
    if (!file) throw error;
    return nextResolve(pathToFileURL(file).href, context);
  }
}
