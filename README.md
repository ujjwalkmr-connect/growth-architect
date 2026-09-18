# Growth Architect — additions to the original website

This is the original React/Vite portfolio with the requested pages, project detail pages, editable content and contact integration. It replaces the earlier proposed redesign. The production site has not been changed.

**Start here: [Simple step-by-step deployment guide](DEPLOYMENT_GUIDE.md).** It explains copying this folder into GitHub Desktop, uploading to your existing repository, connecting Google and the CMS, and publishing through your existing Vercel project.

## Preview and run

Use Node.js 22.12 or newer (verified here with Node 24). Run `npm ci`, then `npm run dev`. The local address is `http://127.0.0.1:5173`. In another terminal run `npm run dev:api` for the local API adapter. A missing email/Turnstile configuration is displayed honestly; the form does not pretend to submit.

The delivered source includes a byte-preserving asset bootstrap because Windows protection prevented writing binary files to the deliverables folder. `npm run assets` reconstructs the original portrait from its local encoded asset. It also runs automatically before dev, build and tests. The original portrait is unchanged. The resume is deliberately excluded from the source: production retrieves it from private Google Drive after authorization; an untracked local copy can be used for development.

Routes: `/`, `/projects`, `/projects/:id`, `/experience`, `/blogs`, `/blogs/:slug`, `/contact`, `/privacy`, and `/admin/`.

## What changed

- Six CV-backed projects are appended after the six original homepage projects.
- Every published project has its own detail page. The CMS controls its title, organization, card description, tags, featured status, Markdown details, cover image, gallery, captions, contribution, period and outcome. Markdown supports project links. Uploaded images appear on the detail page without changing the existing homepage card design.
- Projects, Experience and Blogs have dedicated pages, using the original components, colors, typography and card styles. Blog entries also have individual article pages. The blog starts empty; its example draft is not published or bundled.
- Contact shows email, phone, LinkedIn and a dedicated visible form. Phone is required for both contact and resume requests, validated, saved as text in the Sheet and included in the owner alert. **Consulting Services** is available as an enquiry type. Project Connect Now CTAs still open `/contact?connect=1` with a dialog.
- Gmail-account email sending via Apps Script and private Google Sheet storage are implemented. Owner alerts and one configurable acknowledgement are queued separately. The queue runs every five minutes after owner setup; delivery is subject to Google's quotas and is not instant.
- The homepage buttons are **LinkedIn**, **Get In Touch** (opens Contact) and **Download Resume** (opens a form popup on the current page). There is no separate resume page; old `/resume` links redirect to Contact on Vercel. A saved resume form submission is required before `/api/resume` grants a ten-minute PDF download. The PDF is held privately in Google Drive, outside both the public Git repository and static build.
- Decap CMS edits JSON in GitHub. Vercel's Git integration deploys those changes. Production access requires GitHub write permission and the supplied OAuth configuration.

## What was preserved

Original stylesheet, portrait PNG and particle animation are byte-identical. The hero retains its original body except the requested CTA row. Metrics, capabilities, experience renderer, shared section component and footer retain their original function bodies. Existing experience records, certifications, education and the original six project descriptions remain intact. No replacement copy, new hero image, color system, typography or animation was introduced.

The existing desktop navigation now links Experience and Projects to their new pages, adds Blogs, and routes Contact to the contact page. Existing homepage section anchors still work. Project titles link to their new detail pages. These are the deliberate navigation additions. The original mobile header behavior is retained; new pages also have an Explore pages navigation.

## Editing content locally

Run the site and, from this repository in a second PowerShell terminal:

```powershell
$env:BIND_HOST = '127.0.0.1'
$env:ORIGIN = 'http://127.0.0.1:5173'
npx --yes decap-server@3.11.2
```

Open `http://127.0.0.1:5173/admin/` and choose Login. This is a loopback-only file editor, not production authentication. Stop its terminal when finished. CMS saves modify local files directly. Production saves commit to the configured Git branch.

Keep project IDs and article slugs unique and stable. Projects need `published` status to appear; Featured selects homepage display. Future-dated posts become visible only after a build on or after that date. Draft text is excluded before bundling, but uploaded images under public/media are public regardless of draft status.

The supplied project document contains operational screenshots with lead names, phone numbers, emails and internal system identifiers. Those raw screenshots are not included in public assets. Galleries start empty and are ready for publication-safe images through the CMS; no stock images or invented evidence were inserted.

## Activate the existing production site

1. Connect GitHub write access to `ujjwalkmr-connect/growth-architect` and the Vercel account owning `ujjwalkmr.vercel.app`. The repository is public; the source intentionally excludes the private resume and secrets.
2. Review and apply this source to a branch of the existing repository. Preserve the existing Vercel project/domain. Do not upload node_modules, dist, .env.local or old .vercel deployment output.
3. Follow [CMS setup](docs/cms.md) to create the GitHub OAuth application and configure server-only Vercel variables.
4. Follow [Gmail and Google Sheet setup](google-apps-script/README.md). Create a private Sheet, upload the supplied resume to private Google Drive storage, authorize Apps Script in the intended Google account, set its properties and deploy the authenticated bridge. The sender is that Google account; the owner alert recipient can be the existing Outlook contact address or another chosen address.
5. Configure Turnstile for the site, set Vercel environment variables, and deploy. Never paste secrets into chat or commit them. Use only `VITE_TURNSTILE_SITE_KEY` as a public browser variable.
6. Verify an actual submission using an address you control: one Sheet row, owner notification, acknowledgement, and resume access only after submission. Verify GitHub CMS login, a draft save, publication, uploaded image display and the resulting Vercel deployment.

These account-dependent steps are still pending. No Google resources have been created, no real email sent, and no production deployment performed.

## Validation

Run `npm test`, `npm run typecheck` and `npm run build`. See [verification evidence](docs/verification.md). Automated external-service tests use mocks; they do not prove live Google or GitHub delivery. This remains a Vite SPA, so article metadata is client-rendered and unknown dynamic URLs show an in-app 404, not a server-generated article response.
