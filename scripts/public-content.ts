import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
export function publicContent(root: string, date = new Date().toISOString().slice(0, 10)) {
  const projects = JSON.parse(
    readFileSync(path.join(root, "content/projects.json"), "utf8"),
  ).items.filter((p: { status: string }) => p.status === "published");
  const posts = readdirSync(path.join(root, "content/posts"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(path.join(root, "content/posts", f), "utf8")))
    .filter(
      (p) =>
        p.status === "published" &&
        /^\d{4}-\d{2}-\d{2}$/.test(p.publishedAt) &&
        p.publishedAt <= date,
    );
  return { projects, posts };
}

