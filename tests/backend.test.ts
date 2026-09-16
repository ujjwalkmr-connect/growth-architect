import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID, createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";

import vm from "node:vm";
import path from "node:path";
import {
  getLeadConfig,
  leadSchema,
  readLimitedJson,
  signEnvelope,
  trustedOrigin,
  verifyEnvelope,
  verifyTurnstile,
  saveLead,
} from "../server/leads.js";
import {
  createResumeToken,
  verifyResumeToken,
  readPrivateResume,
  checkPrivateResume,
} from "../server/resume.js";

const secret = "test-secret-only-1234567890123456789012345";
const env = {
  NODE_ENV: "production",
  SITE_URL: "https://example.com",
  TURNSTILE_SECRET_KEY: "test",
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/example/exec",
  GOOGLE_BRIDGE_SECRET: secret,
  RESUME_SIGNING_SECRET: secret,
} as NodeJS.ProcessEnv;
const lead = {
  name: "Test Person",
  email: "test@example.com",
  phone: "+919876543210",
  company: "",
  purpose: "general",
  message: "A valid test message.",
  consent: true,
  website: "",
  turnstileToken: "test-token",
  idempotencyKey: "9ec95313-ea41-4a02-a7d1-e952cbe05a18",
};

test("valid lead normalizes whitespace and email", () => {
  const parsed = leadSchema.parse({
    ...lead,
    name: "  Test Person  ",
    email: "TEST@example.com",
  });
  assert.equal(parsed.name, "Test Person");
  assert.equal(parsed.email, "test@example.com");
});

test("phone is mandatory for contact and resume, normalizes formatting and accepts consulting enquiries", () => {
  for (const purpose of ["general", "consulting", "resume"]) {
    for (const phone of [undefined, null, "", "  "]) {
      assert.equal(leadSchema.safeParse({ ...lead, purpose, phone }).success, false);
    }
  }
  const parsed = leadSchema.parse({ ...lead, phone: "+91 (98765) 43210", purpose: "consulting" });
  assert.equal(parsed.phone, "+919876543210");
  assert.equal(parsed.purpose, "consulting");
  for (const phone of [
    "123",
    "1234567890123456",
    "abc1234567",
    "+91\n9876543210",
    "++919876543210",
    "=123456789",
    123456789,
  ]) {
    assert.equal(leadSchema.safeParse({ ...lead, phone }).success, false, String(phone));
  }
});
test("validation rejects absent consent, honeypot, unknown fields, invalid email and short message", () => {
  for (const change of [
    { consent: false },
    { website: "spam" },
    { admin: true },
    { email: "invalid" },
    { message: "short" },
    { name: "Hi\nBcc: secret" },
    { idempotencyKey: "123" },
    { turnstileToken: "" },
  ])
    assert.equal(leadSchema.safeParse({ ...lead, ...change }).success, false);
  assert.equal(leadSchema.safeParse({ ...lead, purpose: "resume", message: "" }).success, true);
});
test("missing secrets and untrusted bridge/site fail closed", () => {
  for (const key of [
    "SITE_URL",
    "TURNSTILE_SECRET_KEY",
    "GOOGLE_SCRIPT_URL",
    "GOOGLE_BRIDGE_SECRET",
    "RESUME_SIGNING_SECRET",
  ])
    assert.throws(() => getLeadConfig({ ...env, [key]: "" }));
  for (const url of [
    "https://evil.example/macros/s/x/exec",
    "http://script.google.com/macros/s/x/exec",
    "https://script.google.com/macros/s/x/exec?x=1",
  ])
    assert.throws(() => getLeadConfig({ ...env, GOOGLE_SCRIPT_URL: url }));
  assert.throws(() => getLeadConfig({ ...env, SITE_URL: "http://localhost:3000" }));
  assert.throws(() => getLeadConfig({ ...env, SITE_URL: "https://localhost:3000" }));
  assert.equal(
    getLeadConfig({
      ...env,
      NODE_ENV: "development",
      SITE_URL: "http://127.0.0.1:3000",
    }).siteUrl.origin,
    "http://127.0.0.1:3000",
  );
});
test("origin requires the exact configured scheme, hostname and port", () => {
  const config = getLeadConfig(env);
  assert.equal(trustedOrigin("https://example.com", config), true);
  for (const origin of [
    null,
    "null",
    "https://example.com.attacker.test",
    "http://example.com",
    "https://example.com:444",
  ])
    assert.equal(trustedOrigin(origin, config), false);
});
test("JSON reader enforces streaming byte limits and media type", async () => {
  assert.deepEqual(
    await readLimitedJson(
      new Request("https://example.com", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: '{"ok":true}',
      }),
    ),
    { ok: true },
  );
  await assert.rejects(
    readLimitedJson(new Request("https://example.com", { method: "POST", body: "{}" })),
  );
  await assert.rejects(
    readLimitedJson(
      new Request("https://example.com", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "x".repeat(200),
      }),
      100,
    ),
  );
});
test("bridge signatures reject tampering, different nonces, expired and future envelopes", () => {
  const now = 1_700_000_000_000,
    nonce = randomUUID(),
    signed = signEnvelope({ ok: true }, secret, now, nonce);
  assert.deepEqual(verifyEnvelope(signed, secret, nonce, now), { ok: true });
  assert.throws(() => verifyEnvelope({ ...signed, payload: '{"ok":false}' }, secret, nonce, now));
  assert.throws(() => verifyEnvelope(signed, secret, randomUUID(), now));
  assert.throws(() => verifyEnvelope(signed, secret, nonce, now + 300_001));
  assert.throws(() => verifyEnvelope(signed, secret, nonce, now - 300_001));
});
test("Turnstile checks success, action and hostname", async () => {
  const config = getLeadConfig(env);
  for (const data of [
    { success: false, hostname: "example.com", action: "lead" },
    { success: true, hostname: "evil.test", action: "lead" },
    { success: true, hostname: "example.com", action: "other" },
  ]) {
    assert.equal(
      await verifyTurnstile("token", config, (async () => Response.json(data)) as typeof fetch),
      false,
    );
  }
  assert.equal(
    await verifyTurnstile("token", config, (async () =>
      Response.json({
        success: true,
        hostname: "example.com",
        action: "lead",
      })) as typeof fetch),
    true,
  );
});
test("saved success requires signed durable confirmation and matching idempotency key", async () => {
  const config = getLeadConfig(env),
    parsed = leadSchema.parse(lead);
  const fake = (payload: object) =>
    (async (_url: unknown, init?: RequestInit) => {
      const sent = JSON.parse(String(init?.body));
      return Response.json(signEnvelope(payload, secret, Date.now(), sent.nonce));
    }) as typeof fetch;
  await saveLead(
    parsed,
    "a".repeat(64),
    { subject: "test", message: "test" },
    config,
    fake({ ok: true, saved: true, idempotencyKey: lead.idempotencyKey }),
  );
  for (const payload of [
    { ok: true, saved: false },
    { ok: true, saved: true, idempotencyKey: randomUUID() },
  ])
    await assert.rejects(
      saveLead(parsed, "a".repeat(64), { subject: "test", message: "test" }, config, fake(payload)),
    );
});
test("resume grant expires, rejects tampering and invalidates on version/secret change", () => {
  const now = 1_700_000_000_000,
    token = createResumeToken(secret, "v1", now);
  assert.equal(verifyResumeToken(token, secret, "v1", now + 599_000), true);
  assert.equal(verifyResumeToken(token, secret, "v1", now + 600_000), false);
  assert.equal(verifyResumeToken(token, secret, "v2", now), false);
  assert.equal(verifyResumeToken(token, secret + "changed", "v1", now), false);
  assert.equal(verifyResumeToken(token + "x", secret, "v1", now), false);
  assert.equal(verifyResumeToken(token, undefined, "v1", now), false);
  assert.equal(verifyResumeToken(undefined, secret, "v1", now), false);
});
test("resume path allowlist rejects traversal and public files", async () => {
  for (const file of [
    "private/resume/../../secret.pdf",
    "public/resume.pdf",
    "private/resume/sub/file.pdf",
    "private\\resume\\x.pdf",
    "private/resume/file.html",
  ])
    await assert.rejects(readPrivateResume(file));
});

test("lead route fails closed without configuration and rejects foreign origins without granting a cookie", async () => {
  const { POST } = await import("../api/leads.js");
  const previous = { ...process.env };
  try {
    Object.assign(process.env, env, { GOOGLE_BRIDGE_SECRET: "" });
    const unavailable = await POST(
      new Request("https://example.com/api/leads", { method: "POST" }),
    );
    assert.equal(unavailable.status, 503);
    assert.equal(unavailable.headers.get("set-cookie"), null);
    assert.equal((await unavailable.json()).ok, false);
    Object.assign(process.env, env);
    const rejected = await POST(
      new Request("https://example.com/api/leads", {
        method: "POST",
        headers: { origin: "https://evil.test" },
      }),
    );
    assert.equal(rejected.status, 403);
    assert.equal(rejected.headers.get("set-cookie"), null);
  } finally {
    for (const key of Object.keys(env)) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
});

test("lead route never grants success or access when a bridge falsely claims an unsigned save", async () => {
  const { POST } = await import("../api/leads.js");
  const previous = { ...process.env },
    originalFetch = globalThis.fetch;
  try {
    Object.assign(process.env, env);
    globalThis.fetch = (async (url: string | URL | Request) =>
      String(url).includes("siteverify")
        ? Response.json({
            success: true,
            action: "lead",
            hostname: "example.com",
          })
        : Response.json({
            ok: true,
            saved: true,
            idempotencyKey: lead.idempotencyKey,
          })) as typeof fetch;
    const response = await POST(
      new Request("https://example.com/api/leads", {
        method: "POST",
        headers: {
          origin: "https://example.com",
          "content-type": "application/json",
        },
        body: JSON.stringify(lead),
      }),
    );
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("set-cookie"), null);
    assert.equal((await response.json()).ok, false);
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of Object.keys(env)) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
});

test("resume route integration grants PDF only after a confirmed durable request and rejects bypasses", async () => {
  const { POST } = await import("../api/leads.js");
  const { GET } = await import("../api/resume.js");
  const previous = { ...process.env },
    originalFetch = globalThis.fetch,
    originalCwd = process.cwd();
  const root = await mkdtemp(path.join(tmpdir(), "portfolio-resume-test-"));
  try {
    await mkdir(path.join(root, "content/settings"), { recursive: true });
    await mkdir(path.join(root, "private/resume"), { recursive: true });
    await writeFile(
      path.join(root, "content/settings/resume.json"),
      JSON.stringify({ file: "private/resume/test.pdf", version: "test-v1" }),
    );
    await writeFile(
      path.join(root, "private/resume/test.pdf"),
      "%PDF-1.4\nTest fixture, not a real resume.\n%%EOF",
    );
    process.chdir(root);
    Object.assign(process.env, env);
    for (const cookie of ["", "resume_access=forged"]) {
      const denied = await GET(
        new Request("https://example.com/api/resume", {
          headers: { cookie },
        }),
      );
      assert.equal(denied.status, 403);
      assert.match(denied.headers.get("cache-control") || "", /no-store/);
    }
    let confirmed = false,
      resumeAvailable = false,
      durableSaveCalls = 0;
    globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
      if (String(url).includes("siteverify"))
        return Response.json({
          success: true,
          action: "lead",
          hostname: "example.com",
        });
      const envelope = JSON.parse(String(init?.body));
      const payload = JSON.parse(envelope.payload);
      if (payload.action === "resume/check" || payload.action === "resume/read") {
        const bytes = Buffer.from("%PDF-1.4\nPrivate mocked resume\n");
        return Response.json(
          signEnvelope(
            {
              ok: resumeAvailable,
              available: resumeAvailable,
              version: "test-v1",
              mimeType: "application/pdf",
              size: bytes.length,
              ...(payload.action === "resume/read" ? { pdfBase64: bytes.toString("base64") } : {}),
            },
            secret,
            Date.now(),
            envelope.nonce,
          ),
        );
      }
      durableSaveCalls++;
      return Response.json(
        signEnvelope(
          {
            ok: confirmed,
            saved: confirmed,
            idempotencyKey: lead.idempotencyKey,
          },
          secret,
          Date.now(),
          envelope.nonce,
        ),
      );
    }) as typeof fetch;
    const request = () =>
      new Request("https://example.com/api/leads", {
        method: "POST",
        headers: {
          origin: "https://example.com",
          "content-type": "application/json",
        },
        body: JSON.stringify({ ...lead, purpose: "resume", message: "" }),
      });
    const unavailable = await POST(request());
    assert.equal(unavailable.status, 503);
    assert.equal(unavailable.headers.get("set-cookie"), null);
    assert.equal(
      durableSaveCalls,
      0,
      "Unavailable Drive PDF must fail before the lead is saved or a cookie is granted",
    );
    resumeAvailable = true;
    const failed = await POST(request());
    assert.equal(failed.status, 503);
    assert.equal(failed.headers.get("set-cookie"), null);
    confirmed = true;
    const accepted = await POST(request());
    assert.equal(accepted.status, 200);
    assert.equal((await accepted.json()).downloadUrl, "/api/resume");
    const cookie = accepted.headers.get("set-cookie") || "";
    for (const flag of [
      /HttpOnly/i,
      /Secure/i,
      /SameSite=strict/i,
      /Path=\/api\/resume/i,
      /Max-Age=600/i,
    ])
      assert.match(cookie, flag);
    const pdf = await GET(
      new Request("https://example.com/api/resume", {
        headers: { cookie: cookie.split(";")[0] },
      }),
    );
    assert.equal(pdf.status, 200);
    assert.equal(pdf.headers.get("content-type"), "application/pdf");
    assert.match(pdf.headers.get("cache-control") || "", /no-store/);
    assert.match(pdf.headers.get("content-disposition") || "", /attachment/);
    assert.match(await pdf.text(), /^%PDF-/);
  } finally {
    process.chdir(originalCwd);
    globalThis.fetch = originalFetch;
    for (const key of Object.keys(env)) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
    assert.equal(path.dirname(root), path.resolve(tmpdir()));
    assert.match(path.basename(root), /^portfolio-resume-test-/);
    await rm(root, { recursive: true, force: true });
  }
});

type Cell = string | number | boolean;
class MockSheet {
  rows: Cell[][] = [];
  appendRow(row: Cell[]) {
    this.rows.push([...row]);
  }
  setFrozenRows() {}
  getLastRow() {
    return this.rows.length;
  }
  deleteRow(row: number) {
    this.rows.splice(row - 1, 1);
  }
  getRange(row: number, column: number, count = 1, width = 1) {
    return {
      getValues: () =>
        this.rows
          .slice(row - 1, row - 1 + count)
          .map((r) => r.slice(column - 1, column - 1 + width)),
      setValue: (value: Cell) => {
        this.rows[row - 1][column - 1] = value;
      },
    };
  }
}
function scriptHarness(
  options: { mime?: string; bytes?: Buffer; sharing?: string; version?: string } = {},
) {
  const sheets: Record<string, MockSheet> = {},
    sent: unknown[] = [];
  let quota = 100,
    failSend = false,
    locked = false;
  const driveReads: string[] = [];
  const driveBytes = options.bytes ?? Buffer.from("%PDF-1.4\nPrivate mocked resume\n");
  const context = vm.createContext({
    PropertiesService: {
      getScriptProperties: () => ({
        getProperties: () => ({
          BRIDGE_SECRET: secret,
          SHEET_ID: "private-test",
          OWNER_EMAIL: "owner@outlook.com",
          RESUME_FILE_ID: "privateConfiguredFileId123",
          RESUME_VERSION: options.version ?? "2026-09",
        }),
      }),
    },
    Utilities: {
      base64Encode: (bytes: number[]) => Buffer.from(bytes).toString("base64"),
      computeHmacSha256Signature: (text: string, key: string) => [
        ...createHmac("sha256", key).update(text).digest(),
      ],
    },
    DriveApp: {
      Access: { PRIVATE: "PRIVATE" },
      getFileById: (id: string) => {
        driveReads.push(id);
        return {
          getSharingAccess: () => options.sharing ?? "PRIVATE",
          getMimeType: () => options.mime ?? "application/pdf",
          getSize: () => driveBytes.length,
          getBlob: () => ({
            getBytes: () => [...driveBytes],
            getContentType: () => options.mime ?? "application/pdf",
          }),
        };
      },
    },
    ContentService: {
      MimeType: { JSON: "application/json" },
      createTextOutput: (text: string) => ({ setMimeType: () => text }),
    },
    SpreadsheetApp: {
      openById: () => ({
        getSheetByName: (name: string) => sheets[name],
        insertSheet: (name: string) => (sheets[name] = new MockSheet()),
      }),
      flush: () => {},
    },
    LockService: {
      getScriptLock: () => ({
        tryLock: () => {
          assert.equal(locked, false);
          locked = true;
          return true;
        },
        releaseLock: () => {
          locked = false;
        },
      }),
    },
    MailApp: {
      getRemainingDailyQuota: () => quota,
      sendEmail: (email: unknown) => {
        sent.push(email);
        if (failSend) throw new Error("Ambiguous transport failure");
        quota--;
      },
    },
  });
  vm.runInContext(
    readFileSync(path.join(process.cwd(), "google-apps-script/Code.gs"), "utf8"),
    context,
  );
  const record = {
    ...lead,
    ipHash: "a".repeat(64),
    notification: { subject: "Thanks", message: "Your message was saved." },
  };
  const post = (payload: unknown = record, envelope = signEnvelope(payload, secret)) => {
    const result = JSON.parse(context.doPost({ postData: { contents: JSON.stringify(envelope) } }));
    return JSON.parse(result.payload || JSON.stringify(result));
  };
  return {
    context,
    sheets,
    sent,
    record,
    driveReads,
    post,
    setQuota: (value: number) => {
      quota = value;
    },
    failSend: () => {
      failSend = true;
    },
  };
}
test("Apps Script saves once on retry, rejects changed payload and nonce replay", () => {
  const h = scriptHarness(),
    envelope = signEnvelope(h.record, secret);
  assert.equal(h.post(h.record, envelope).saved, true);
  assert.equal(h.post(h.record, envelope).ok, false);
  assert.equal(h.post().saved, true);
  assert.equal(h.sheets.Leads.rows.length, 2);
  assert.equal(h.post({ ...h.record, message: "Different content" }).ok, false);
  assert.equal(h.sent.length, 0, "doPost must never send real-time mail");
});
test("Apps Script rejects unauthenticated and stale envelopes before creating sheets", () => {
  const h = scriptHarness();
  assert.equal(h.post(h.record, signEnvelope(h.record, "wrong-secret")).ok, false);
  assert.equal(h.post(h.record, signEnvelope(h.record, secret, Date.now() - 300_001)).ok, false);
  assert.deepEqual(Object.keys(h.sheets), []);
});
test("Apps Script enforces durable email rate limits and escapes spreadsheet formulas", () => {
  const h = scriptHarness();
  for (let i = 0; i < 3; i++)
    assert.equal(
      h.post({
        ...h.record,
        idempotencyKey: randomUUID(),
        message: '=HYPERLINK("evil")',
      }).saved,
      true,
    );
  assert.equal(h.post({ ...h.record, idempotencyKey: randomUUID() }).ok, false);
  assert.equal(h.sheets.Leads.rows[1][9], '\'=HYPERLINK("evil")');
});
test("notification queue tracks both deliveries separately and never repeats sent mail", () => {
  const h = scriptHarness();
  h.post();
  h.context.processNotifications();
  assert.equal(h.sheets.Leads.rows[1][11], "sent");
  assert.equal(h.sheets.Leads.rows[1][12], "sent");
  assert.equal((h.sent[1] as { replyTo: string }).replyTo, "owner@outlook.com");
  assert.equal(h.sent.length, 2);
  h.context.processNotifications();
  assert.equal(h.sent.length, 2);
});

test("consulting phone persists as text and reaches owner email without changing queue columns", () => {
  const h = scriptHarness();
  const record = { ...h.record, purpose: "consulting", phone: "+919876543210" };
  assert.equal(h.post(record).saved, true);
  assert.equal(h.sheets.Leads.rows[0][21], "phone");
  assert.equal(h.sheets.Leads.rows[1][21], "'+919876543210");
  assert.equal(h.post({ ...record, phone: "+919876543211" }).ok, false);
  h.context.processNotifications();
  assert.match((h.sent[0] as { body: string }).body, /Phone: \+919876543210/);
  assert.match((h.sent[0] as { subject: string }).subject, /Consulting Services/);
  assert.equal(h.sheets.Leads.rows[1][11], "sent");
  assert.equal(h.sheets.Leads.rows[1][12], "sent");
});

test("existing Sheet gains phone header without overwriting old records and rejects malformed phones", () => {
  const h = scriptHarness();
  h.post();
  h.sheets.Leads.rows = h.sheets.Leads.rows.map((row) => row.slice(0, 21));
  assert.equal(h.post().saved, true, "phone-header migration preserves idempotency");
  assert.equal(h.sheets.Leads.rows.length, 2);
  assert.equal(h.sheets.Leads.rows[0][21], "phone");
  assert.equal(h.sheets.Leads.rows[1][6], lead.email);
  for (const phone of [
    undefined,
    null,
    "",
    "  ",
    "123",
    "=123456789",
    "1234567890123456",
    "abc123456789",
    123456789,
  ]) {
    assert.equal(h.post({ ...h.record, phone, idempotencyKey: randomUUID() }).ok, false);
  }
  const next = { ...h.record, phone: "0123456789", idempotencyKey: randomUUID() };
  assert.equal(h.post(next).saved, true);
  assert.equal(h.sheets.Leads.rows[2][21], "'0123456789");
  h.sheets.Leads.rows[0][21] = "Custom data";
  assert.equal(h.post({ ...next, idempotencyKey: randomUUID() }).ok, false);
  assert.equal(h.sheets.Leads.rows[0][21], "Custom data");
});
test("quota defers both notifications without attempting mail", () => {
  const h = scriptHarness();
  h.post();
  h.setQuota(0);
  h.context.processNotifications();
  assert.equal(h.sent.length, 0);
  assert.equal(h.sheets.Leads.rows[1][11], "deferred");
  assert.equal(h.sheets.Leads.rows[1][12], "deferred");
  assert.ok(Number(h.sheets.Leads.rows[1][15]) > Date.now());
  h.sheets.Leads.rows[1][13] = 8;
  h.sheets.Leads.rows[1][15] = 0;
  h.context.processNotifications();
  assert.equal(h.sheets.Leads.rows[1][11], "failed");
});
test("ambiguous sends and stale sending are marked needs_review and never automatically resent", () => {
  const h = scriptHarness();
  h.post();
  h.failSend();
  h.context.processNotifications();
  assert.equal(h.sheets.Leads.rows[1][11], "needs_review");
  assert.equal(h.sheets.Leads.rows[1][12], "needs_review");
  const count = h.sent.length;
  h.context.processNotifications();
  assert.equal(h.sent.length, count);
  h.sheets.Leads.rows[1][11] = "sending";
  h.sheets.Leads.rows[1][17] = Date.now() - 600_001;
  h.context.processNotifications();
  assert.equal(h.sheets.Leads.rows[1][11], "needs_review");
  assert.equal(h.sent.length, count);
});

test("private Drive bridge authenticates, rejects replay/version/file selectors, and signs the configured PDF", () => {
  const h = scriptHarness();
  const payload = { action: "resume/read", version: "2026-09" };
  assert.equal(h.post(payload, signEnvelope(payload, "wrong-secret")).ok, false);
  assert.equal(h.post({ ...payload, version: "wrong" }).ok, false);
  assert.equal(h.post({ ...payload, fileId: "attacker-file" }).ok, false);
  assert.equal(h.driveReads.length, 0);
  const envelope = signEnvelope(payload, secret);
  const signed = JSON.parse(h.context.doPost({ postData: { contents: JSON.stringify(envelope) } }));
  const result = verifyEnvelope(signed, secret, envelope.nonce) as Record<string, unknown>;
  assert.equal(result.version, "2026-09");
  assert.equal(result.mimeType, "application/pdf");
  assert.match(Buffer.from(String(result.pdfBase64), "base64").toString(), /^%PDF-/);
  assert.deepEqual(h.driveReads, ["privateConfiguredFileId123"]);
  assert.equal(h.post(payload, envelope).ok, false);
  const check = h.post({ action: "resume/check", version: "2026-09" });
  assert.equal(check.available, true);
  assert.equal(check.pdfBase64, undefined);
  assert.equal(h.sent.length, 0);
});

test("private Drive bridge rejects public files, wrong MIME/header and oversized PDFs", () => {
  for (const options of [
    { sharing: "ANYONE" },
    { mime: "text/html" },
    { bytes: Buffer.from("<html>not a PDF</html>") },
    { bytes: Buffer.alloc(1024 * 1024 + 1) },
  ]) {
    const h = scriptHarness(options);
    assert.equal(h.post({ action: "resume/check", version: "2026-09" }).ok, false);
    assert.equal(h.post({ action: "resume/read", version: "2026-09" }).ok, false);
  }
});

test("production resume requires signed Drive bytes and never falls back to an existing local PDF", async () => {
  const { GET } = await import("../api/resume.js");
  const previous = { ...process.env },
    originalFetch = globalThis.fetch,
    originalCwd = process.cwd();
  const root = await mkdtemp(path.join(tmpdir(), "portfolio-resume-test-"));
  const bytes = Buffer.from("%PDF-1.4\nPrivate production resume\n");
  const good = {
    ok: true,
    available: true,
    version: "2026-09",
    mimeType: "application/pdf",
    size: bytes.length,
    pdfBase64: bytes.toString("base64"),
  };
  let reply: Record<string, unknown> = good,
    nonceOverride: string | undefined,
    unsigned = false,
    requests = 0;
  try {
    await mkdir(path.join(root, "content/settings"), { recursive: true });
    await mkdir(path.join(root, "private/resume"), { recursive: true });
    await writeFile(
      path.join(root, "content/settings/resume.json"),
      JSON.stringify({ file: "private/resume/test.pdf", version: "2026-09" }),
    );
    await writeFile(
      path.join(root, "private/resume/test.pdf"),
      "%PDF-1.4\nLocal fixture must never serve in production",
    );
    process.chdir(root);
    Object.assign(process.env, env);
    globalThis.fetch = (async (_url: unknown, init?: RequestInit) => {
      requests++;
      const envelope = JSON.parse(String(init?.body)),
        payload = JSON.parse(envelope.payload);
      assert.deepEqual(Object.keys(payload).sort(), ["action", "version"]);
      assert.equal(payload.version, "2026-09");
      return Response.json(
        unsigned ? reply : signEnvelope(reply, secret, Date.now(), nonceOverride ?? envelope.nonce),
      );
    }) as typeof fetch;
    const denied = await GET(new Request("https://example.com/api/resume"));
    assert.equal(denied.status, 403);
    assert.equal(requests, 0, "Unauthorized downloads must never read Drive");
    assert.deepEqual(await readPrivateResume("private/resume/test.pdf"), bytes);
    await checkPrivateResume("private/resume/test.pdf");
    const maximumPdf = Buffer.alloc(1024 * 1024, 32);
    maximumPdf.write("%PDF-1.4\n");
    reply = { ...good, size: maximumPdf.length, pdfBase64: maximumPdf.toString("base64") };
    assert.deepEqual(
      await readPrivateResume("private/resume/test.pdf"),
      maximumPdf,
      "Exactly 1 MiB survives the bounded signed envelope",
    );
    for (const change of [
      { version: "wrong" },
      { mimeType: "text/html" },
      { size: 1024 * 1024 + 1 },
      { pdfBase64: Buffer.from("not-a-pdf").toString("base64"), size: 9 },
      { size: bytes.length + 1 },
      { ok: false },
      { pdfBase64: "A".repeat(1_410_000) },
    ]) {
      reply = { ...good, ...change };
      await assert.rejects(readPrivateResume("private/resume/test.pdf"));
    }
    reply = good;
    nonceOverride = randomUUID();
    await assert.rejects(readPrivateResume("private/resume/test.pdf"));
    nonceOverride = undefined;
    unsigned = true;
    await assert.rejects(readPrivateResume("private/resume/test.pdf"));
    unsigned = false;
    Object.assign(process.env, { NODE_ENV: "development", VERCEL: "1" });
    assert.deepEqual(
      await readPrivateResume("private/resume/test.pdf"),
      bytes,
      "VERCEL always uses private Drive",
    );
    delete process.env.VERCEL;
    assert.match((await readPrivateResume("private/resume/test.pdf")).toString(), /Local fixture/);
  } finally {
    process.chdir(originalCwd);
    globalThis.fetch = originalFetch;
    for (const key of [...Object.keys(env), "VERCEL"]) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
    assert.equal(path.dirname(root), path.resolve(tmpdir()));
    assert.match(path.basename(root), /^portfolio-resume-test-/);
    await rm(root, { recursive: true, force: true });
  }
});
