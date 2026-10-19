import fs from "node:fs";
import path from "node:path";
import { build, transformSync } from "esbuild";

process.chdir(path.resolve(import.meta.dirname, ".."));

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

const files = [
  ...walk("src"),
  "vite.config.js",
  ...fs
    .readdirSync("scripts")
    .filter((file) => file.endsWith(".mjs"))
    .map((file) => `scripts/${file}`),
].filter((file) => /\.(jsx?|mjs)$/.test(file));
for (const file of files) {
  transformSync(fs.readFileSync(file, "utf8"), {
    loader: file.endsWith(".jsx") ? "jsx" : "js",
    jsx: "automatic",
    sourcefile: file,
    logLevel: "error",
  });
}
await build({
  entryPoints: ["src/main.jsx"],
  bundle: true,
  write: false,
  outdir: "dist",
  jsx: "automatic",
  loader: { ".css": "empty" },
  logLevel: "error",
});
console.log(
  `JavaScript checks passed (${files.length} files + application imports).`,
);
