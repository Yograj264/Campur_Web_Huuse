import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
process.chdir(projectRoot);
const assetDirectory = path.resolve(projectRoot, "static/frontend/assets");
if (!assetDirectory.startsWith(projectRoot + path.sep)) {
  throw new Error("Asset output must remain inside the project.");
}
// Read the successful build before replacing the previously generated assets.
const html = fs.readFileSync("dist/index.html", "utf8");
if (!fs.existsSync("dist/assets"))
  throw new Error("Missing frontend build assets.");
fs.mkdirSync("templates", { recursive: true });
fs.mkdirSync("static/frontend", { recursive: true });
fs.rmSync(assetDirectory, { recursive: true, force: true });
fs.cpSync("dist/assets", "static/frontend/assets", { recursive: true });
// Copy public assets (such as landing photos) into Django's static directory.
for (const entry of fs.readdirSync("dist", { withFileTypes: true })) {
  if (entry.name === "index.html" || entry.name === "assets") continue;
  fs.cpSync(
    path.join("dist", entry.name),
    path.join("static/frontend", entry.name),
    { recursive: true },
  );
}
fs.writeFileSync("templates/index.html", html);
console.log("Django template and frontend assets updated.");
