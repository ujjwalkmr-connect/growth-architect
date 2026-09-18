import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { loadEnvFile } from "node:process";
import { pathToFileURL } from "node:url";
import { POST } from "../api/leads.js";
import { GET } from "../api/resume.js";

const MAX_BYTES = 16_384;
const reject = (
  response: ServerResponse,
  status: number,
  error: string,
  extra: Record<string, string> = {},
) => {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    ...extra,
  });
  response.end(JSON.stringify({ ok: false, error }));
};

/** Loopback-only development adapter. This file is never a production API entrypoint. */
export function createDevApiServer() {
  if (process.env.NODE_ENV !== "development" || process.env.VERCEL)
    throw new Error("The API development adapter is unavailable outside local development.");
  return createServer(
    { requestTimeout: 15_000, headersTimeout: 10_000, maxHeaderSize: 8192 },
    async (incoming: IncomingMessage, outgoing: ServerResponse) => {
      const host = incoming.headers.host || "";
      const match = host.match(/^(localhost|127\.0\.0\.1|\[::1\])(?::([1-9][0-9]{0,4}))?$/i);
      if (!match || (match[2] && Number(match[2]) > 65535))
        return reject(outgoing, 403, "Invalid local host.");
      const url = new URL(incoming.url || "/", `http://${host}`);
      const expectedMethod =
        url.pathname === "/api/leads" ? "POST" : url.pathname === "/api/resume" ? "GET" : undefined;
      if (!expectedMethod) return reject(outgoing, 404, "Not found.");
      if (incoming.method !== expectedMethod)
        return reject(outgoing, 405, "Method not allowed.", { Allow: expectedMethod });
      if (Number(incoming.headers["content-length"] || 0) > MAX_BYTES) {
        incoming.resume();
        return reject(outgoing, 413, "Request too large.");
      }
      try {
        const chunks: Buffer[] = [];
        let length = 0;
        for await (const chunk of incoming) {
          const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          length += buffer.byteLength;
          if (length > MAX_BYTES) {
            reject(outgoing, 413, "Request too large.");
            incoming.resume();
            return;
          }
          chunks.push(buffer);
        }
        const headers = new Headers();
        for (const [name, value] of Object.entries(incoming.headers)) {
          if (Array.isArray(value)) for (const item of value) headers.append(name, item);
          else if (value !== undefined) headers.set(name, value);
        }
        const request = new Request(url, {
          method: expectedMethod,
          headers,
          ...(expectedMethod === "POST" ? { body: new Uint8Array(Buffer.concat(chunks)) } : {}),
        });
        const result = await (expectedMethod === "POST" ? POST(request) : GET(request));
        outgoing.writeHead(result.status, Object.fromEntries(result.headers.entries()));
        outgoing.end(Buffer.from(await result.arrayBuffer()));
      } catch {
        if (!outgoing.headersSent) reject(outgoing, 500, "Local API request failed.");
        else outgoing.end();
      }
    },
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL)
    throw new Error("Refusing to run the local adapter in production.");
  try {
    loadEnvFile(".env.local");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  if (process.env.NODE_ENV === "production" || process.env.VERCEL)
    throw new Error("Refusing production configuration.");
  Object.assign(process.env, { NODE_ENV: "development" });
  createDevApiServer().listen(3003, "127.0.0.1", () =>
    console.log("Local API listening at http://127.0.0.1:3003"),
  );
}

