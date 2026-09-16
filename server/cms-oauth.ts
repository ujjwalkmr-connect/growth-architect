import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

type Environment = Record<string, string | undefined>;
type Dependencies = { env?: Environment; fetch?: typeof fetch; now?: () => number };
const SITE = "https://ujjwalkmr.vercel.app";
const REPOSITORY = "ujjwalkmr-connect/growth-architect";
const COOKIE = "__Secure-cms-oauth";
const TTL = 600;

function configuration(env: Environment) {
  const clientId = env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = env.GITHUB_OAUTH_CLIENT_SECRET;
  const cookieSecret = env.CMS_COOKIE_SECRET;
  if (
    !clientId ||
    !clientSecret ||
    !cookieSecret ||
    cookieSecret.length < 32 ||
    env.SITE_URL !== SITE ||
    env.CMS_REPO !== REPOSITORY
  )
    return null;
  return { clientId, clientSecret, cookieSecret, site: SITE, repo: REPOSITORY };
}

function headers() {
  return new Headers({
    "Cache-Control": "no-store, max-age=0",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  });
}

function fail(status: number, message: string, clearCookie = false) {
  const resultHeaders = headers();
  resultHeaders.set("Content-Type", "text/plain; charset=utf-8");
  if (clearCookie) resultHeaders.set("Set-Cookie", cookie("", 0));
  return new Response(message, { status, headers: resultHeaders });
}

function cookie(value: string, age: number) {
  return `${COOKIE}=${value}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`;
}

function signature(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function equal(a: string, b: string) {
  const first = Buffer.from(a);
  const second = Buffer.from(b);
  return first.length === second.length && timingSafeEqual(first, second);
}

function readState(request: Request, secret: string, now: number) {
  const cookies =
    request.headers
      .get("cookie")
      ?.split(";")
      .map((value) => value.trim()) ?? [];
  const matches = cookies.filter((value) => value.startsWith(`${COOKIE}=`));
  if (matches.length !== 1) return null;
  const token = matches[0].slice(COOKIE.length + 1);
  if (token.length > 2048) return null;
  const [payload, digest, extra] = token.split(".");
  if (!payload || !digest || extra || !equal(signature(payload, secret), digest)) return null;
  try {
    const state = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (
      typeof state.nonce !== "string" ||
      !/^[A-Za-z0-9_-]{43}$/.test(state.nonce) ||
      state.origin !== SITE ||
      !Number.isSafeInteger(state.created) ||
      state.created > now ||
      now - state.created >= TTL * 1000
    )
      return null;
    return state as { nonce: string; origin: string; created: number };
  } catch {
    return null;
  }
}

function allowedRequest(request: Request) {
  const url = new URL(request.url);
  const origin = request.headers.get("origin");
  return url.origin === SITE && (!origin || origin === SITE);
}

export async function startCmsAuth(request: Request, dependencies: Dependencies = {}) {
  if (request.method !== "GET") return fail(405, "Method not allowed.");
  const config = configuration(dependencies.env ?? process.env);
  if (!config) return fail(503, "CMS authentication is not configured.");
  if (!allowedRequest(request)) return fail(403, "This origin is not permitted.");
  const url = new URL(request.url);
  if (
    (url.searchParams.get("provider") ?? "github") !== "github" ||
    (url.searchParams.has("site_id") && url.searchParams.get("site_id") !== new URL(SITE).hostname)
  ) {
    return fail(400, "Invalid authentication request.");
  }
  const nonce = randomBytes(32).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({ nonce, origin: SITE, created: (dependencies.now ?? Date.now)() }),
  ).toString("base64url");
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.search = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: `${config.site}/api/cms-callback`,
    scope: "public_repo",
    state: nonce,
  }).toString();
  const resultHeaders = headers();
  resultHeaders.set(
    "Set-Cookie",
    cookie(`${payload}.${signature(payload, config.cookieSecret)}`, TTL),
  );
  resultHeaders.set("Location", authorize.href);
  return new Response(null, { status: 302, headers: resultHeaders });
}

function javascript(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function popup(token: string) {
  const nonce = randomBytes(24).toString("base64url");
  const resultHeaders = headers();
  resultHeaders.set("Set-Cookie", cookie("", 0));
  resultHeaders.set("Content-Type", "text/html; charset=utf-8");
  resultHeaders.set(
    "Content-Security-Policy",
    `default-src 'none'; script-src 'nonce-${nonce}'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'`,
  );
  const message = `authorization:github:success:${JSON.stringify({ token, provider: "github" })}`;
  return new Response(
    `<!doctype html><html lang="en"><meta charset="utf-8"><title>CMS sign-in</title><p id="status">Completing GitHub sign-in…</p><script nonce="${nonce}">
(() => {
  const origin = ${javascript(SITE)};
  const opener = window.opener;
  if (!opener) { document.getElementById('status').textContent = 'Open sign-in from the site admin page.'; return; }
  function receive(event) {
    if (event.origin !== origin || event.source !== opener || event.data !== 'authorizing:github') return;
    window.removeEventListener('message', receive);
    opener.postMessage(${javascript(message)}, origin);
    window.close();
  }
  window.addEventListener('message', receive);
  opener.postMessage('authorizing:github', origin);
})();
</script></html>`,
    { headers: resultHeaders },
  );
}

export async function finishCmsAuth(request: Request, dependencies: Dependencies = {}) {
  if (request.method !== "GET") return fail(405, "Method not allowed.", true);
  const config = configuration(dependencies.env ?? process.env);
  if (!config) return fail(503, "CMS authentication is not configured.", true);
  if (!allowedRequest(request)) return fail(403, "This origin is not permitted.", true);
  const url = new URL(request.url);
  const state = readState(request, config.cookieSecret, (dependencies.now ?? Date.now)());
  const suppliedState = url.searchParams.get("state");
  if (!state || !suppliedState || !equal(state.nonce, suppliedState))
    return fail(403, "Sign-in expired or invalid. Return to admin and try again.", true);
  const code = url.searchParams.get("code");
  if (url.searchParams.has("error") || !code || code.length > 1024)
    return fail(400, "GitHub sign-in was not completed.", true);
  const send = dependencies.fetch ?? fetch;
  try {
    const exchange = await send("https://github.com/login/oauth/access_token", {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: `${config.site}/api/cms-callback`,
      }),
    });
    if (!exchange.ok) return fail(502, "GitHub authentication is temporarily unavailable.", true);
    const credentials = await exchange.json();
    if (
      credentials.error ||
      typeof credentials.access_token !== "string" ||
      !credentials.access_token ||
      credentials.access_token.length > 4096 ||
      typeof credentials.token_type !== "string" ||
      credentials.token_type.toLowerCase() !== "bearer"
    ) {
      return fail(401, "GitHub did not authorize sign-in.", true);
    }
    const repository = await send(`https://api.github.com/repos/${config.repo}`, {
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${credentials.access_token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    if (!repository.ok) return fail(403, "Repository write access is required.", true);
    const access = await repository.json();
    if (
      access.full_name?.toLowerCase() !== config.repo.toLowerCase() ||
      access.permissions?.push !== true
    )
      return fail(403, "Repository write access is required.", true);
    return popup(credentials.access_token);
  } catch {
    return fail(
      502,
      "GitHub authentication is temporarily unavailable. Return to admin and try again.",
      true,
    );
  }
}
