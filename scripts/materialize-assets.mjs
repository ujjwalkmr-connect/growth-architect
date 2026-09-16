import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(path.join(root, "assets-encoded/manifest.json"), "utf8"));
for (const item of manifest) {
  const target = path.resolve(root, item.path);
  if (!target.startsWith(root + path.sep)) throw new Error("Invalid asset path");
  if (
    existsSync(target) &&
    createHash("sha256").update(readFileSync(target)).digest("hex") === item.sha256
  )
    continue;
  const bytes = Buffer.from(readFileSync(path.join(root, item.encoded), "utf8"), "base64");
  if (createHash("sha256").update(bytes).digest("hex") !== item.sha256)
    throw new Error("Asset integrity mismatch: " + item.path);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, bytes);
  console.log("Restored " + item.path);
}

