# Verification — 16 September 2026

## Verified locally

- 40 automated tests pass, covering mandatory phone validation for contact and resume, phone normalization, consulting enquiries, Sheet phone-column migration, owner-email phone inclusion, exact-origin checks, signed storage confirmation, Turnstile host/action checks, retries and idempotency, spreadsheet formula escaping, rate limits, independent mail queue states, quota deferral, ambiguous-delivery handling, gated PDF access, private Drive retrieval, local API isolation, CMS OAuth state and repository-permission checks, and original-site preservation.
- TypeScript type checking and the production Vite build pass.
- Existing stylesheet, particle component and portrait are byte-identical to the supplied archive. Original component body and content comparisons pass, with only the explicitly requested hero CTA row excluded from the original hero hash.
- Before the requested CTA update, the live homepage and local preserved homepage were compared at the same 1440px viewport. Hero, heading, portrait, metrics, skills and experience section geometry matched. Both use Plus Jakarta Sans. New project rows extend the project section as requested.
- Browser: all twelve projects render in their original card design; a project title opens its corresponding detail page; a project Connect Now link opens Contact with its dialog already open.
- Browser: Get In Touch leads to Contact, where email, phone, LinkedIn and a dedicated form are immediately available. Download Resume opens a form popup on the same page. No separate resume page remains; Vercel redirects old /resume URLs to Contact.
- Browser: Phone number is required in both Contact and the resume popup; empty values report valueMissing, a three-digit number reports patternMismatch, and a formatted international number passes native validation. Consulting Services remains available. The two requested informational lines are absent. No real submission was sent; submission remains disabled until Turnstile is configured.
- Mobile at 390px: the updated Contact page has no horizontal overflow and the inline form fits its card. The dialog retains its bounded, internally scrollable layout. Desktop resume popup was visually checked; temporary viewport overrides were reset.
- Local CMS Login loads Portfolio, Blog posts and Email settings. Projects editor exposes cover image, gallery, role, period, outcome and Markdown controls. A temporary contribution edit was saved through Decap, then observed on the project detail page. The original JSON was restored after the test.
- Draft/future content is filtered before the public client bundle is emitted. Draft media is public if uploaded into public/media.

## Not yet verified against real services

Correct GitHub/Vercel project access, production OAuth, repository commits from the editor, production image uploads, a real Turnstile token, Apps Script deployment, Google Sheet persistence, owner alert delivery, visitor acknowledgement, and the production PDF download. These require owner account configuration. Local mocked tests are not claims of production readiness.

## Scope notes

The repository was verified public on 16 September 2026. Production PDF storage therefore uses private Google Drive; no PDF or encoded PDF is included in the delivered source. The connected GitHub account ankuramivf has pull permission but no push permission. The connected Vercel team AIVF currently lists no projects. GitHub main commit 8589bd926060fce0b02230608feba6c7c271d95f matches the supplied archive's frontend source after normalizing checkout line endings.

CMS editors control content, not layout classes or animation settings. Baseline preservation tests intentionally flag later edits to original content; update the baseline only after intentionally approving such changes.
