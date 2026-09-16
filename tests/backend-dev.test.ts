import test from "node:test";
import assert from "node:assert/strict";
import { request as nodeRequest } from "node:http";
import type { AddressInfo } from "node:net";
import { createDevApiServer } from "../scripts/api-dev.js";

test("local adapter refuses production and hosted execution", () => {
  const previous = { ...process.env };
  try {
    Object.assign(process.env, { NODE_ENV: "production" });
    delete process.env.VERCEL;
    assert.throws(createDevApiServer);
    Object.assign(process.env, { NODE_ENV: "development", VERCEL: "1" });
    assert.throws(createDevApiServer);
  } finally {
    for (const key of ["NODE_ENV", "VERCEL"]) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
});

test("local adapter routes Web Requests, restricts hosts/methods and bounds fixed and streamed bodies", async () => {
  const previous = { ...process.env };
  Object.assign(process.env, { NODE_ENV: "development", GOOGLE_BRIDGE_SECRET: "" });
  delete process.env.VERCEL;
  const server = createDevApiServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address() as AddressInfo,
    base = `http://127.0.0.1:${address.port}`;
  try {
    assert.equal((await fetch(`${base}/other`)).status, 404);
    assert.equal((await fetch(`${base}/api/leads`)).status, 405);
    const foreignHostStatus = await new Promise<number>((resolve, reject) => {
      const request = nodeRequest(
        `${base}/api/leads`,
        { method: "POST", headers: { host: "evil.test" } },
        (response) => {
          response.resume();
          response.on("end", () => resolve(response.statusCode || 0));
          response.on("error", reject);
        },
      );
      request.on("error", reject);
      request.end("{}");
    });
    assert.equal(foreignHostStatus, 403);
    const unavailable = await fetch(`${base}/api/leads`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    });
    assert.equal(unavailable.status, 503);
    assert.equal((await unavailable.json()).ok, false);
    assert.equal(
      (await fetch(`${base}/api/leads`, { method: "POST", body: "x".repeat(17000) })).status,
      413,
    );
    const streamedStatus = await new Promise<number>((resolve, reject) => {
      const request = nodeRequest(
        `${base}/api/leads`,
        {
          method: "POST",
          headers: { "content-type": "application/json", "transfer-encoding": "chunked" },
        },
        (response) => {
          response.resume();
          response.on("end", () => resolve(response.statusCode || 0));
          response.on("error", reject);
        },
      );
      request.on("error", reject);
      request.write("x".repeat(10000));
      request.end("x".repeat(10000));
    });
    assert.equal(streamedStatus, 413);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
    for (const key of ["NODE_ENV", "VERCEL", "GOOGLE_BRIDGE_SECRET"]) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
});

