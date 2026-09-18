# Private enquiries bridge

Nothing in this source deploys Google resources or sends mail automatically. The web form fails closed until configured. The website repository may be public, so never commit the resume PDF, an encoded copy, credentials, or a public download URL. Production obtains the PDF from private Google Drive only.

## Vercel environment

- `SITE_URL`: exact canonical origin, e.g. `https://ujjwalkmr.vercel.app` (no path). HTTP loopback is accepted only in development.
- `VITE_TURNSTILE_SITE_KEY`: browser widget key. Widget action must be `lead`.
- `TURNSTILE_SECRET_KEY`: matching private Cloudflare key. Configure its hostname allowlist.
- `GOOGLE_SCRIPT_URL`: deployed `https://script.google.com/macros/s/DEPLOYMENT_ID/exec` endpoint.
- `GOOGLE_BRIDGE_SECRET`: randomly generated secret of at least 32 characters; match Apps Script `BRIDGE_SECRET`.
- `RESUME_SIGNING_SECRET`: a separate randomly generated secret of at least 32 characters.

All private variables stay server-only. Other than localhost testing, this source assumes Vercel overwrites `x-vercel-forwarded-for`; other hosts need an equivalent trusted IP source. Only its HMAC digest is stored.

## Owner setup (enables actual external delivery)

1. Create a private Google Sheet and a private Apps Script project. Copy `Code.gs` and the manifest.
2. In Script Properties set `SHEET_ID`, `BRIDGE_SECRET`, and `OWNER_EMAIL` to the existing Outlook mailbox. Also upload the resume as a **private PDF** in Drive accessible to the Apps Script owner, and set `RESUME_FILE_ID` to that exact file ID and `RESUME_VERSION` to `2026-09`, matching `content/settings/resume.json`. Keep general access Restricted. The PDF must be at most 1 MiB. Do not paste credentials or the private file ID into chat or commit them.
3. Deploy a web app, executing as yourself, accessible to Anyone. HMAC authenticates every submission before access to the Sheet. Copy its deployment URL to Vercel.
4. When real emails are approved, run `setup` once and authorize scopes. It creates tabs and one five-minute queue trigger. No email delivery occurs from `doPost`.
5. Authorize the manifest's read-only Drive scope, configure Cloudflare Turnstile and Vercel variables, and deploy the updated Apps Script version. Redeploy the site. Complete one intentionally authorized test using an address you control; check the durable record, gated resume download and each notification independently. Never add the PDF to the website deployment bundle.

## Contract and security

POST `/api/leads` with JSON: `name`, `email`, required `phone`, optional `company`, `purpose` (`recruitment`, `networking`, `consulting`, `general`, `resume`), `message` (10–4000 chars except resume), `consent:true`, `website:""` honeypot, `turnstileToken`, `idempotencyKey` (UUID). Phone accepts 7–15 digits with an optional leading +; spaces, parentheses, dots and hyphens are normalized by the website API. Keep the same key for retries of an unchanged payload; reset Turnstile for a fresh token. Generate a fresh key after editing details or successful submission. Missing configuration, origin rejection, failed verification, or unconfirmed persistence never returns success. Successful response is `{ok:true,message,downloadUrl?}`; errors are `{ok:false,error}`.

Phone is stored as text in column V (`phone`) and included in the owner email. Existing columns and queue states retain their positions. On an existing Sheet, `setup` or the next valid submission adds the phone header if column V is empty; if it already contains a different header, move that custom column before proceeding. Existing stored records remain intact, including records without phone numbers. All new submissions and retries must supply a valid phone number. Deploy the updated Apps Script version before publishing the updated website, so Consulting Services is accepted by both.

The bridge verifies HMAC SHA-256 over `timestamp + "\n" + nonce + "\n" + payload` where payload is the exact JSON string. It rejects timestamps outside five minutes and repeated nonce values, then serializes persistence, deduplication, and rate checks with a script lock. The authenticated response echoes the request nonce. Idempotency conflicts reject; matching records return durable success. Limits are 3 new records/email/hour, 10/IP/hour, and 100 total/hour. Formula-leading cells are escaped. The private Sheet must never be published or shared publicly.

Both notification states are independent: `pending`, `deferred`, `sending`, `sent`, `needs_review`, `failed`. Queue work is bounded to eight notification attempts or three minutes per run. Quota exhaustion gets exponential backoff up to 24 hours and at most eight attempts. A send exception or stale `sending` state becomes `needs_review`, because delivery may have happened. This is **not exactly-once email delivery**. Owners must inspect Google sent mail/delivery records before manually moving a reviewed record back to `pending`; set that side's attempt count to 0 and next timestamp to current epoch milliseconds only when retry is warranted. No blind resend is provided. Monitor `needs_review`, `failed`, trigger errors, and Sheet access; archive old records according to the published retention policy while preserving idempotency records for the retry period.

Optional `content/settings/notifications.json` keys `acknowledgementSubject` and `acknowledgementMessage` are plain text; `{name}` and `{purpose}` placeholders are supported. These are loaded by the server, never trusted from browser input.

Resume settings live at `content/settings/resume.json`, e.g. `{"file":"private/resume/ujjwal-kumar.pdf","version":"2026-09"}`. The `file` path is used only in local development; it is ignored when `VERCEL` is present or `NODE_ENV=production`. Production has no filesystem fallback. Bundle only `content/settings/**` into the API functions, never `private/**`.

Authenticated `resume/check` and `resume/read` bridge actions accept exactly `{action,version}` and use the fixed `RESUME_FILE_ID` from Script Properties. A caller-supplied file ID is rejected. Both actions verify restricted Drive sharing, PDF MIME, the `%PDF-` header, size up to 1 MiB, and the exact configured version. They share the bridge's HMAC timestamp/nonce/replay protection. `resume/check` returns signed metadata before a lead is saved; `resume/read` returns bounded signed base64 bytes. The website verifies the response signature, request nonce, version, MIME, decoded size and PDF header before serving bytes.

A confirmed resume submission grants a signed HttpOnly, SameSite=Strict cookie for `/api/resume`, lasting ten minutes. The download route validates the cookie **before** contacting Drive. HTTPS cookies are Secure. PDF responses are no-store; a version change invalidates old grants. Change the local settings version and Apps Script `RESUME_VERSION` together when replacing the private PDF. The cookie is a short-lived bearer permission, not identity authentication. Anyone already possessing a downloaded copy can retain it; removing a previously public PDF does not retract copies or Git history.

Local tests mock Google and Cloudflare; they never send mail. Real persistence, Turnstile, quotas and two actual mail deliveries remain deployment acceptance checks.

## Local API adapter

Run `npx tsx scripts/api-dev.ts` beside the Vite development server. It loads `.env.local` if present and listens only on `127.0.0.1:3003`. Proxy `/api` from Vite to this address and retain the browser's Origin header. `SITE_URL` must exactly match the Vite browser origin, including its port. The adapter does not bypass form validation or fabricate success when credentials are absent. It refuses production or Vercel environments, limits request bodies to 16 KiB, and is not a deployment entrypoint.

Deployment uses the Web Standard `POST` export in `api/leads.ts` and `GET` in `api/resume.ts`; helpers are under `server/`. No Next.js runtime is needed. Keep `private/` untracked and out of every deployment artifact; keep `content/settings/` out of the public/static build output. An untracked local PDF directly within `private/resume/` can support development tests only. MailApp sends through the Google account that owns the Apps Script deployment; `OWNER_EMAIL` selects the recipient for owner notifications and the reply address for acknowledgements.
