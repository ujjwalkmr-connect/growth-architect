import assert from "node:assert/strict";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { finishCmsAuth, startCmsAuth } from "../server/cms-oauth.js";

const site = "https://ujjwalkmr.vercel.app";
const env = {
  SITE_URL: site,
  CMS_REPO: "ujjwalkmr-connect/growth-architect",
  GITHUB_OAUTH_CLIENT_ID: "test-client",
  GITHUB_OAUTH_CLIENT_SECRET: "test-secret-never-client-side",
  CMS_COOKIE_SECRET: "test-cookie-secret-at-least-thirty-two-characters",
};
const now = () => 1_800_000_000_000;
async function flow() {
  const start = await startCmsAuth(
    new Request(`${site}/api/cms-auth?provider=github&site_id=ujjwalkmr.vercel.app`),
    { env, now },
  );
  const location = new URL(start.headers.get("location")!);
  const cookie = start.headers.get("set-cookie")!.split(";")[0];
  const callback = new URL(`${site}/api/cms-callback`);
  callback.search = new URLSearchParams({
    code: "test-code",
    state: location.searchParams.get("state")!,
  }).toString();
  return { start, location, cookie, callback };
}
function mockGitHub(push = true) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const send: typeof fetch = async (input, init) => {
    const url = String(input);
    calls.push({ url, init });
    if (url === "https://github.com/login/oauth/access_token") {
      return Response.json({ access_token: "sensitive-test-token", token_type: "bearer" });
    }
    if (url === "https://api.github.com/repos/ujjwalkmr-connect/growth-architect") {
      return Response.json({ full_name: env.CMS_REPO, permissions: { push } });
    }
    throw new Error("Unexpected outbound URL");
  };
  return { send, calls };
}

test("missing or unsafe configuration fails closed without a redirect", async () => {
  for (const config of [
    {},
    { ...env, CMS_COOKIE_SECRET: "short" },
    { ...env, SITE_URL: "https://evil.example" },
    { ...env, CMS_REPO: "other/repo" },
  ]) {
    const response = await startCmsAuth(new Request(`${site}/api/cms-auth`), { env: config });
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("location"), null);
  }
});

test("start sets random state in a signed secure, HttpOnly, expiring cookie", async () => {
  const first = await flow();
  const second = await flow();
  assert.equal(first.start.status, 302);
  assert.equal(first.location.origin, "https://github.com");
  assert.equal(first.location.searchParams.get("scope"), "public_repo");
  assert.equal(first.location.searchParams.get("redirect_uri"), `${site}/api/cms-callback`);
  assert.notEqual(
    first.location.searchParams.get("state"),
    second.location.searchParams.get("state"),
  );
  assert.match(
    first.start.headers.get("set-cookie")!,
    /HttpOnly; Secure; SameSite=Lax; Max-Age=600/,
  );
  assert.equal(first.start.headers.get("cache-control"), "no-store, max-age=0");
  assert.ok(!first.location.href.includes(env.GITHUB_OAUTH_CLIENT_SECRET));
});

test("rejects foreign origins, hosts, provider and site_id", async () => {
  for (const request of [
    new Request(`${site}/api/cms-auth`, { headers: { origin: "https://evil.example" } }),
    new Request("https://evil.example/api/cms-auth"),
    new Request(`${site}/api/cms-auth?provider=gitlab`),
    new Request(`${site}/api/cms-auth?site_id=evil.example`),
  ]) {
    const response = await startCmsAuth(request, { env });
    assert.ok([400, 403].includes(response.status));
    assert.equal(response.headers.get("location"), null);
  }
});

test("missing, tampered, mismatched and expired state is rejected before token exchange", async () => {
  const { cookie, callback } = await flow();
  let calls = 0;
  const send: typeof fetch = async () => {
    calls++;
    throw new Error("No external call expected");
  };
  const badUrl = new URL(callback);
  badUrl.searchParams.set("state", "forged");
  for (const [url, value, clock] of [
    [callback, "", now],
    [callback, cookie + "tampered", now],
    [badUrl, cookie, now],
    [callback, cookie, () => now() + 600_000],
    [callback, cookie, () => now() - 1],
    [callback, `${cookie}; ${cookie}`, now],
  ] as const) {
    const response = await finishCmsAuth(new Request(url, { headers: { cookie: value } }), {
      env,
      now: clock,
      fetch: send,
    });
    assert.equal(response.status, 403);
    assert.match(response.headers.get("set-cookie")!, /Max-Age=0/);
  }
  assert.equal(calls, 0);
});

test("GitHub denial and missing code do not exchange credentials", async () => {
  const { cookie, callback } = await flow();
  callback.searchParams.set("error", "access_denied");
  let calls = 0;
  const send: typeof fetch = async () => {
    calls++;
    throw new Error("No call expected");
  };
  const denied = await finishCmsAuth(new Request(callback, { headers: { cookie } }), {
    env,
    now,
    fetch: send,
  });
  assert.equal(denied.status, 400);
  callback.searchParams.delete("error");
  callback.searchParams.delete("code");
  const missing = await finishCmsAuth(new Request(callback, { headers: { cookie } }), {
    env,
    now,
    fetch: send,
  });
  assert.equal(missing.status, 400);
  assert.equal(calls, 0);
});

test("push permission is required and rejected users never receive a token", async () => {
  const { cookie, callback } = await flow();
  const mock = mockGitHub(false);
  const response = await finishCmsAuth(new Request(callback, { headers: { cookie } }), {
    env,
    now,
    fetch: mock.send,
  });
  assert.equal(response.status, 403);
  assert.equal(mock.calls.length, 2);
  assert.ok(!(await response.text()).includes("sensitive-test-token"));
});

test("success exchanges server-side and only releases token to exact opener after handshake", async () => {
  const { cookie, callback } = await flow();
  const mock = mockGitHub();
  const response = await finishCmsAuth(new Request(callback, { headers: { cookie } }), {
    env,
    now,
    fetch: mock.send,
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("location"), null);
  assert.match(response.headers.get("set-cookie")!, /Max-Age=0/);
  assert.match(response.headers.get("content-security-policy")!, /default-src 'none'/);
  assert.equal(mock.calls[0].init?.method, "POST");
  assert.match(String(mock.calls[0].init?.body), /test-secret-never-client-side/);
  for (const call of mock.calls) {
    assert.ok(!call.url.includes("test-secret"));
    assert.ok(!call.url.includes("sensitive-test-token"));
    assert.equal(call.init?.redirect, "error");
  }
  const html = await response.text();
  assert.ok(!html.includes(env.GITHUB_OAUTH_CLIENT_SECRET));
  assert.ok(!html.includes(env.CMS_COOKIE_SECRET));
  const script = html.match(/<script nonce="[^"]+">([\s\S]+)<\/script>/)![1];
  const messages: { value: string; origin: string }[] = [];
  const opener = {
    postMessage: (value: string, origin: string) => messages.push({ value, origin }),
  };
  let listener: (event: unknown) => void = () => {};
  let removed = false;
  const window = {
    opener,
    addEventListener: (_: string, fn: typeof listener) => {
      listener = fn;
    },
    removeEventListener: () => {
      removed = true;
    },
    close: () => {},
  };
  runInNewContext(script, { window });
  assert.deepEqual(messages, [{ value: "authorizing:github", origin: site }]);
  listener({ origin: "https://evil.example", source: opener, data: "authorizing:github" });
  listener({ origin: site, source: {}, data: "authorizing:github" });
  listener({ origin: site, source: opener, data: "wrong-handshake" });
  assert.equal(messages.length, 1);
  listener({ origin: site, source: opener, data: "authorizing:github" });
  assert.equal(messages.length, 2);
  assert.equal(messages[1].origin, site);
  assert.match(messages[1].value, /^authorization:github:success:/);
  assert.equal(
    JSON.parse(messages[1].value.slice("authorization:github:success:".length)).token,
    "sensitive-test-token",
  );
  assert.equal(removed, true);
});

test("upstream errors never expose returned tokens or exception details", async () => {
  const { cookie, callback } = await flow();
  const send: typeof fetch = async () => {
    throw new Error("sensitive-test-token upstream secret");
  };
  const response = await finishCmsAuth(new Request(callback, { headers: { cookie } }), {
    env,
    now,
    fetch: send,
  });
  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes("sensitive-test-token"));
});
