# Content administration

The existing public layout and copy are preserved. Visit `/admin/` to edit Experience, Projects, Education, Certifications, Blog posts and the contact acknowledgement email. Content is committed as JSON to the `main` branch of `ujjwalkmr-connect/growth-architect`; the connected Vercel Git integration must deploy those commits before edits appear publicly. The homepage profile and other fixed homepage text are intentionally outside the CMS.

Decap CMS is pinned to version 3.16.2 and loaded from `https://unpkg.com/decap-cms@3.16.2/dist/decap-cms.js` only on the admin page. It is never imported by the public React application. The admin page requires access to that CDN. There are no client-side OAuth secrets.

## Production setup

1. In GitHub, create an OAuth App with homepage `https://ujjwalkmr.vercel.app` and authorization callback URL `https://ujjwalkmr.vercel.app/api/cms-callback`.
2. Set Vercel server environment variables `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`, `CMS_COOKIE_SECRET`, `CMS_REPO=ujjwalkmr-connect/growth-architect`, and `SITE_URL=https://ujjwalkmr.vercel.app`. Generate `CMS_COOKIE_SECRET` using a cryptographically random value of at least 32 characters (for example `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`). Never put these values in `VITE_` variables or commit them.
3. Ensure `/api/cms-auth` and `/api/cms-callback` resolve to the Vercel functions, and `/admin/`, `/admin/config.yml`, and `/media/` assets remain static assets instead of reaching the SPA fallback. OAuth popups require the admin page to retain its opener; do not add `Cross-Origin-Opener-Policy: same-origin` to admin/auth routes.
4. Deploy, then open `/admin/` and sign in with a GitHub user who has push permission to this repository. The functions deliberately accept only the configured production site and repository. For a domain change, update both server constants and CMS config, then update GitHub and Vercel settings together.
5. Create a draft post, save it, inspect its GitHub commit, then publish and verify the real deployed article. Check that a GitHub account without repository write permission is refused.

Real GitHub sign-in, repository writes, and production deployment remain unverified until the OAuth App, repository access, environment variables and deployment are available. A local CMS save is not evidence that production authentication works.

## Editor workflow

- Choose **Portfolio**, select a collection, edit list entries, and save. Keep stable IDs unique and unchanged when editing existing entries.
- Projects can be `draft` or `published`; **Featured** selects homepage display. Blog posts start as drafts; set **Publication status** to `published` when ready. Keep URL slugs unique and stable.
- Optional project details and blog bodies accept Markdown. Preview is disabled because Decap's generic preview does not represent the public layout; verify the deployed page after a successful build.
- Each project has its own detail page. Add an optional cover image and description, gallery images with descriptions and captions, project role, period, outcome, and Markdown details. Optional contribution and gallery fields start empty; the Markdown overview uses the existing project description. Only add genuine project information and publication-safe images. Existing homepage cards retain their current content and presentation.
- Uploaded images are committed under `public/media` and served from `/media`. Give meaningful image descriptions for accessibility; use captions when additional context helps.
- Education and certification collections may be empty. Do not add placeholder qualifications. Credential URLs must use HTTPS.
- **Email settings** changes only the plain-text acknowledgement subject and message. Email delivery credentials and recipient addresses are server configuration.
- Save commits directly to `main`. Content edits are therefore published through the normal Git deployment flow, subject to the content's draft status. Git history provides rollback; review the commit before reverting.

## Local editing

Run the site development server and the pinned loopback proxy using the PowerShell commands in the main README. Open the local site at `/admin/`. Only a literal localhost, `127.0.0.1`, or `[::1]` page enables Decap's local proxy on `http://127.0.0.1:8081/api/v1`; production explicitly sets `local_backend: false`. Bind the development server/proxy to loopback and do not expose the proxy to the network.

Local saves change repository files directly and do not prove GitHub authentication. Use a temporary draft to test, verify the written JSON, then remove the temporary entry. Stop the proxy after use. OAuth endpoints intentionally do not accept localhost; local editing uses the Decap proxy.

## Authentication controls

Authentication fails closed without all five server settings. The OAuth flow uses a cryptographically random state nonce in a signed, Secure, HttpOnly, SameSite=Lax cookie expiring after ten minutes. The callback checks the browser cookie, matching state, age and exact configured origin before exchanging the code. The exchange occurs server-side at GitHub's fixed HTTPS endpoint, and the repository API must return explicit push permission for the expected repository. Redirects on outbound requests are rejected.

The token is sent only through Decap's popup protocol after a message from the exact trusted origin and exact opener window. It never appears in a redirect URL or application logs. Responses disable caching, clear the state cookie on callback, escape script data, and restrict the callback page using a nonce-based Content Security Policy. Decap's GitHub backend receives and manages the access token in the administrator's browser; use trusted devices and sign out when finished. This public repository uses GitHub's `public_repo` scope rather than private-repository access. That scope still covers public repositories the signed-in user can access; the server additionally requires push permission for this exact repository. If the repository becomes private, review the OAuth scope and authorization configuration before changing them.

## References

- [Decap GitHub backend](https://decapcms.org/docs/github-backend/)
- [GitHub OAuth scopes](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps)
- [Decap manual initialization](https://decapcms.org/docs/manual-initialization/)
- [Decap authentication handshake source](https://github.com/decaporg/decap-cms/blob/master/packages/decap-cms-lib-auth/src/netlify-auth.js)
- [Decap local proxy](https://decapcms.org/docs/working-with-a-local-git-repository/)
- [Vercel Node.js functions](https://vercel.com/docs/functions/runtimes/node-js)
