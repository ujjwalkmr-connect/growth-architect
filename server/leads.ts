import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { z } from "zod";

export const leadSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z
      .string()
      .trim()
      .email()
      .max(254)
      .transform((value) => value.toLowerCase()),
    company: z.string().trim().max(150).optional().default(""),
    phone: z
      .string()
      .trim()
      .max(40)
      .regex(/^\+?[0-9 ().-]*$/)
      .transform((value) => value.replace(/[ ().-]/g, ""))
      .refine((value) => /^\+?[0-9]{7,15}$/.test(value), "Enter a valid phone number."),
    purpose: z.enum(["recruitment", "networking", "consulting", "general", "resume"]),
    message: z.string().trim().max(4000).default(""),
    consent: z.literal(true),
    website: z.string().max(0),
    turnstileToken: z.string().min(1).max(2048),
    idempotencyKey: z.string().uuid(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.purpose !== "resume" && value.message.length < 10)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["message"],
        message: "Please provide at least 10 characters.",
      });
    if (/[\r\n\u0000]/.test(value.name + value.email + value.company))
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["name"],
        message: "Invalid control characters.",
      });
  });
export type Lead = z.infer<typeof leadSchema>;
export type LeadConfig = {
  siteUrl: URL;
  turnstileSecret: string;
  bridgeUrl: string;
  bridgeSecret: string;
  resumeSecret: string;
};

export function getLeadConfig(env: NodeJS.ProcessEnv = process.env): LeadConfig {
  const siteUrl = new URL(env.SITE_URL || "missing:");
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(siteUrl.hostname);
  if (
    (local && env.NODE_ENV !== "development") ||
    siteUrl.username ||
    siteUrl.password ||
    siteUrl.pathname !== "/" ||
    siteUrl.search ||
    siteUrl.hash ||
    (siteUrl.protocol !== "https:" &&
      !(env.NODE_ENV === "development" && local && siteUrl.protocol === "http:"))
  )
    throw new Error("Invalid SITE_URL");
  const bridge = new URL(env.GOOGLE_SCRIPT_URL || "missing:");
  if (
    bridge.protocol !== "https:" ||
    bridge.hostname !== "script.google.com" ||
    !/^\/macros\/s\/[^/]+\/exec$/.test(bridge.pathname) ||
    bridge.search ||
    bridge.hash
  )
    throw new Error("Invalid bridge URL");
  if (
    !env.TURNSTILE_SECRET_KEY ||
    !env.GOOGLE_BRIDGE_SECRET ||
    env.GOOGLE_BRIDGE_SECRET.length < 32 ||
    !env.RESUME_SIGNING_SECRET ||
    env.RESUME_SIGNING_SECRET.length < 32
  )
    throw new Error("Missing secure form configuration");
  return {
    siteUrl,
    bridgeUrl: bridge.href,
    turnstileSecret: env.TURNSTILE_SECRET_KEY,
    bridgeSecret: env.GOOGLE_BRIDGE_SECRET,
    resumeSecret: env.RESUME_SIGNING_SECRET,
  };
}

export function trustedOrigin(origin: string | null, config: Pick<LeadConfig, "siteUrl">): boolean {
  return origin === config.siteUrl.origin;
}

export async function readLimitedJson(
  request: Request | Response,
  maxBytes = 16_384,
): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json")
    throw new Error("Expected JSON");
  if (Number(request.headers.get("content-length") || 0) > maxBytes)
    throw new Error("Request too large");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Empty request");
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > maxBytes) {
      await reader.cancel();
      throw new Error("Request too large");
    }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export type Envelope = {
  timestamp: number;
  nonce: string;
  payload: string;
  signature: string;
};
export function signEnvelope(
  payload: unknown,
  secret: string,
  now = Date.now(),
  nonce = randomUUID(),
): Envelope {
  const body = JSON.stringify(payload);
  const signature = createHmac("sha256", secret).update(`${now}\n${nonce}\n${body}`).digest("hex");
  return { timestamp: now, nonce, payload: body, signature };
}
export function verifyEnvelope(
  envelope: Envelope,
  secret: string,
  expectedNonce: string,
  now = Date.now(),
  maxPayloadBytes = 16_384,
): unknown {
  if (
    !envelope ||
    !Number.isSafeInteger(envelope.timestamp) ||
    Math.abs(now - envelope.timestamp) > 300_000 ||
    envelope.nonce !== expectedNonce ||
    typeof envelope.payload !== "string" ||
    envelope.payload.length > maxPayloadBytes ||
    !/^[a-f0-9]{64}$/.test(envelope.signature || "")
  )
    throw new Error("Invalid bridge response");
  const expected = createHmac("sha256", secret)
    .update(`${envelope.timestamp}\n${envelope.nonce}\n${envelope.payload}`)
    .digest();
  if (!timingSafeEqual(expected, Buffer.from(envelope.signature, "hex")))
    throw new Error("Invalid bridge signature");
  return JSON.parse(envelope.payload);
}

export async function verifyTurnstile(
  token: string,
  config: LeadConfig,
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  const result = await fetcher("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret: config.turnstileSecret,
      response: token,
    }),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  if (!result.ok) return false;
  const data = await result.json();
  return (
    data.success === true && data.hostname === config.siteUrl.hostname && data.action === "lead"
  );
}

export function clientHash(request: Request, secret: string): string {
  // Vercel overwrites this header. Other hosts must provide an equivalent trusted source before deployment.
  const address = process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim()
    : "local";
  return createHmac("sha256", secret)
    .update(address || "unknown")
    .digest("hex");
}

export async function saveLead(
  lead: Lead,
  ipHash: string,
  notification: { subject: string; message: string },
  config: LeadConfig,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  const { turnstileToken: _token, website: _website, ...record } = lead;
  const envelope = signEnvelope({ ...record, ipHash, notification }, config.bridgeSecret);
  const response = await fetcher(config.bridgeUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(envelope),
    signal: AbortSignal.timeout(20_000),
    redirect: "follow",
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Storage unavailable");
  const verified = verifyEnvelope(
    await response.json(),
    config.bridgeSecret,
    envelope.nonce,
  ) as Record<string, unknown>;
  if (
    verified.ok !== true ||
    verified.saved !== true ||
    verified.idempotencyKey !== lead.idempotencyKey
  )
    throw new Error("Storage did not confirm save");
}
