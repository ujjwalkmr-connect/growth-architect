import { createHmac, timingSafeEqual } from "node:crypto";
import { readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { getLeadConfig, readLimitedJson, signEnvelope, verifyEnvelope, type Envelope } from "./leads.js";

export const RESUME_COOKIE = "resume_access";
export const RESUME_TTL_SECONDS = 600;
export const RESUME_MAX_BYTES = 1024 * 1024;
const MAX_RESUME_ENVELOPE_BYTES = Math.ceil(RESUME_MAX_BYTES / 3) * 4 + 4096;

function requiresPrivateDrive(): boolean {
  return Boolean(process.env.VERCEL) || process.env.NODE_ENV === "production";
}

async function driveResume(action: "resume/check" | "resume/read", version: string): Promise<Buffer | undefined> {
  const config = getLeadConfig();
  const envelope = signEnvelope({ action, version }, config.bridgeSecret);
  const response = await fetch(config.bridgeUrl, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(envelope),
    signal: AbortSignal.timeout(20_000), redirect: "follow", cache: "no-store",
  });
  if (!response.ok) throw new Error("Private resume bridge unavailable");
  const signed = await readLimitedJson(response, MAX_RESUME_ENVELOPE_BYTES) as Envelope;
  const data = verifyEnvelope(signed, config.bridgeSecret, envelope.nonce, Date.now(), MAX_RESUME_ENVELOPE_BYTES) as Record<string, unknown>;
  if (data.ok !== true || data.available !== true || data.version !== version || data.mimeType !== "application/pdf" ||
      !Number.isSafeInteger(data.size) || Number(data.size) < 5 || Number(data.size) > RESUME_MAX_BYTES) throw new Error("Invalid private resume metadata");
  if (action === "resume/check") return undefined;
  if (typeof data.pdfBase64 !== "string" || data.pdfBase64.length > Math.ceil(RESUME_MAX_BYTES / 3) * 4 ||
      data.pdfBase64.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(data.pdfBase64)) throw new Error("Invalid private PDF encoding");
  const buffer = Buffer.from(data.pdfBase64, "base64");
  if (buffer.length !== data.size || buffer.length > RESUME_MAX_BYTES || buffer.subarray(0, 5).toString() !== "%PDF-" || buffer.toString("base64") !== data.pdfBase64)
    throw new Error("Invalid private PDF");
  return buffer;
}

export function createResumeToken(secret: string, version: string, now = Date.now()): string {
  if (secret.length < 32) throw new Error("Resume signing is not configured");
  const payload = Buffer.from(
    JSON.stringify({
      version,
      expires: Math.floor(now / 1000) + RESUME_TTL_SECONDS,
    }),
  ).toString("base64url");
  return `${payload}.${createHmac("sha256", secret).update(payload).digest("base64url")}`;
}
export function verifyResumeToken(
  token: string | undefined,
  secret: string | undefined,
  version: string,
  now = Date.now(),
): boolean {
  if (!token || !secret || secret.length < 32 || token.length > 1024) return false;
  const parts = token.split(".");
  if (
    parts.length !== 2 ||
    !/^[A-Za-z0-9_-]+$/.test(parts[0]) ||
    !/^[A-Za-z0-9_-]{43}$/.test(parts[1])
  )
    return false;
  const expected = createHmac("sha256", secret).update(parts[0]).digest();
  const supplied = Buffer.from(parts[1], "base64url");
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return false;
  try {
    const payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    const seconds = Math.floor(now / 1000);
    return (
      payload.version === version &&
      Number.isSafeInteger(payload.expires) &&
      payload.expires > seconds &&
      payload.expires <= seconds + RESUME_TTL_SECONDS
    );
  } catch {
    return false;
  }
}

export async function readResumeSettings(
  root = process.cwd(),
): Promise<{ file: string; version: string }> {
  const value = JSON.parse(await readFile(path.join(root, "content/settings/resume.json"), "utf8"));
  if (
    typeof value.file !== "string" ||
    !/^private\/resume\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.pdf$/.test(value.file) ||
    typeof value.version !== "string" ||
    !/^[a-zA-Z0-9._-]{1,64}$/.test(value.version)
  )
    throw new Error("Invalid private resume settings");
  return value;
}

export async function readPrivateResume(file: string, root = process.cwd()): Promise<Buffer> {
  if (requiresPrivateDrive()) {
    const { version } = await readResumeSettings(root);
    const result = await driveResume("resume/read", version);
    if (!result) throw new Error("Private resume unavailable");
    return result;
  }
  if (!/^private\/resume\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.pdf$/.test(file))
    throw new Error("Invalid resume path");
  const privateRoot = await realpath(path.join(root, "private/resume"));
  const fullPath = await realpath(path.join(root, file));
  const relative = path.relative(privateRoot, fullPath);
  if (relative.startsWith("..") || path.isAbsolute(relative))
    throw new Error("Invalid resume location");
  const buffer = await readFile(fullPath);
  if (buffer.length > RESUME_MAX_BYTES || buffer.subarray(0, 5).toString() !== "%PDF-")
    throw new Error("Invalid resume document");
  return buffer;
}

export async function checkPrivateResume(file: string, root = process.cwd()): Promise<void> {
  if (requiresPrivateDrive()) {
    const { version } = await readResumeSettings(root);
    await driveResume("resume/check", version);
  } else await readPrivateResume(file, root);
}
