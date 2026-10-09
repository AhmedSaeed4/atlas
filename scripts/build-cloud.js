import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const entryPoint = resolve(root, "public/src/cloud-entry.js");
const outputFile = resolve(root, "public/src/cloud-service.bundle.js");

await build({
  entryPoints: [entryPoint],
  outfile: outputFile,
  bundle: true,
  platform: "browser",
  format: "esm",
  target: ["es2022"],
  minify: true,
  treeShaking: true,
  legalComments: "inline",
  sourcemap: false,
});

console.log("Built public/src/cloud-service.bundle.js with the locally pinned Firebase SDK.");
