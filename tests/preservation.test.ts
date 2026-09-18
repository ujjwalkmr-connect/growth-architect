import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import ts from "typescript";
import { publicContent } from "../scripts/public-content.js";
const read = (f: string) => JSON.parse(readFileSync(f, "utf8"));
const fixture = read("tests/fixtures/original-contract.json");
const hash = (data: string | Buffer) => createHash("sha256").update(data).digest("hex");
test("original CSS, particle animation and portrait remain byte-identical", () => {
  for (const [file, digest] of Object.entries(fixture.files))
    assert.equal(hash(readFileSync(file)), digest, file);
});
test("untouched homepage sections retain their original component bodies", () => {
  const source = readFileSync("src/routes/index.tsx", "utf8");
  const ast = ts.createSourceFile(
    "index.tsx",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  for (const [name, digest] of Object.entries(fixture.functions)) {
    const node = ast.statements.find(
      (s) => ts.isFunctionDeclaration(s) && s.name?.text === name,
    ) as ts.FunctionDeclaration;
    assert.ok(node?.body, name);
    let body = node.body.getText(ast).replaceAll("\r\n", "\n");
    if (name === "Hero") {
      // Only the user-requested CTA row may change; compare the rest to the original hash.
      const actions =
        /<div className="mt-9 flex flex-wrap items-center gap-3">[\s\S]*?(?=<div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">)/g;
      assert.equal([...body.matchAll(actions)].length, 1);
      body = body.replace(actions, () => fixture.heroOriginalActions);
    }
    assert.equal(hash(body), digest, name);
  }
});
test("existing experience, certifications and six projects retain every original field and ordering", () => {
  for (const collection of ["experience", "certifications", "projects"]) {
    const items = read(`content/${collection}.json`).items;
    for (const [i, old] of fixture[collection].entries()) {
      for (const [key, value] of Object.entries(old as object))
        assert.deepEqual(items[i][key], value, `${collection}[${i}].${key}`);
    }
  }
});
test("each project has a unique stable URL id and all six CV additions are present", () => {
  const projects = read("content/projects.json").items;
  assert.equal(projects.length, 12);
  assert.equal(new Set(projects.map((p: { id: string }) => p.id)).size, 12);
  for (const p of projects) assert.match(p.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
});
test("draft and future content is removed before client bundling", () => {
  const root = mkdtempSync(path.join(tmpdir(), "portfolio-public-test-"));
  try {
    mkdirSync(path.join(root, "content/posts"), { recursive: true });
    writeFileSync(
      path.join(root, "content/projects.json"),
      JSON.stringify({
        items: [
          { id: "live", status: "published" },
          { id: "secret", status: "draft" },
        ],
      }),
    );
    for (const [slug, status, date] of [
      ["live", "published", "2026-09-16"],
      ["draft", "draft", "2026-09-16"],
      ["future", "published", "2099-01-01"],
    ])
      writeFileSync(
        path.join(root, "content/posts", slug + ".json"),
        JSON.stringify({ slug, status, publishedAt: date }),
      );
    const result = publicContent(root, "2026-09-16");
    assert.deepEqual(
      result.projects.map((p: { id: string }) => p.id),
      ["live"],
    );
    assert.deepEqual(
      result.posts.map((p) => p.slug),
      ["live"],
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
