## Portfolio for Ujjwal Kumar — Dark Tech / RevOps Dashboard

A single-page TanStack Start site adapting the attached HTML's visual system (deep navy + cyan/teal/indigo gradients, Plus Jakarta Sans, rounded panel cards, lucide icons) to a polished React build using the full content from your resume.

### Visual system (copied verbatim from the reference HTML)

- **Tokens added to `src/styles.css`**:
  - `--background: #0B132B`, `--surface: #1C2541`, `--foreground: #F4F7F6`
  - `--accent-cyan: #22d3ee`, `--accent-teal: #2dd4bf`, `--accent-indigo: #818cf8`
  - Slate border tones; gradient utility `--gradient-brand: linear-gradient(to right, var(--accent-cyan), var(--accent-indigo))`
- **Font**: Plus Jakarta Sans (300/400/500/600/700) loaded via Google Fonts in `__root.tsx` head
- **Components**: rounded-2xl panels, tinted icon chips, gradient text wordmark + headline highlight, pill CTAs with shadow glow, dot+ring timeline markers

### Page structure (single route `/`)

1. **Fixed nav** — Gradient "UJJWAL KUMAR" wordmark, anchors (Overview · Impact · Stack · Experience · Projects), gradient "Contact" mailto pill.
2. **Hero (#about)** — "Growth & RevOps Architect" cyan badge, headline *"Building predictable, **automated engines** for scale."* (gradient on phrase), full professional summary, primary email CTA + LinkedIn secondary, meta row (Ranchi · phone).
3. **Metrics dashboard (#metrics)** — 6-up panel grid: 5.2× lead growth · <3 min response · 65% CPL reduction · ₹10L+ monthly budget · 20+ workflows · 5 centres.
4. **Capabilities (#skills)** — 4-up icon cards: Paid Acquisition, Automation Ops, Analytics & Data, CRM & RevOps. Add a second row of 4 cards (SEO/AEO, Cloud Telephony, Demand Generation, Leadership) so all 8 resume competencies are present.
5. **Experience timeline (#experience)** — Vertical timeline with cyan dot for current role, 4 entries: Ankuram IVF/Blossom/Medica365 (current), Homeline Builders, RIAOM Services, Superwave Media — each with role, dates pill, sub-context, 3–4 bullet highlights drawn from the resume.
6. **Featured projects (#projects)** — 2-col grid, 6 cards: IVF Growth Engine, Automation-First Marketing Org, AEO & AI-Search Alignment, COVID-19 Emergency Response, Telemedicine Pilots (Jharkhand), Saral Pe FinTech Launch, Prison Rehabilitation Program, JSLPS Rural Livelihood — short outcome-led descriptions.
7. **Education & certifications** — 3-col band: BBA Amity left; certifications grid right (HubSpot RevOps, Google Analytics, Columbia Prompt Engineering, Meta suite, Canva HCD, Power BI, Intel AI badges) with award icons.
8. **Footer** — Copyright + tagline + LinkedIn/email/phone repeat.

### Technical changes

- Add Google Fonts `<link>` + Plus Jakarta Sans body font in `src/routes/__root.tsx` head; update meta (title, description, OG) for Ujjwal's portfolio.
- Add dark theme tokens + brand gradient to `src/styles.css` `:root` and `@theme inline`.
- Replace placeholder in `src/routes/index.tsx` with portfolio composition pulling from small section components in `src/components/portfolio/`: `Nav`, `Hero`, `Metrics`, `Capabilities`, `Experience`, `Projects`, `EducationCerts`, `Footer`.
- Install `lucide-react` for icons (Zap, Mail, Linkedin, MapPin, Phone, Target, Cpu, BarChart3, GitBranch, Search, PhoneCall, TrendingUp, Users, Award, etc.).
- Smooth scroll via `scroll-smooth` on `<html>` and same-page `#anchor` nav (single-page site, so hash anchors are appropriate).
- No backend, no images, no contact form.

### Out of scope

- Multi-page routing, blog, CMS, light-mode toggle, server actions, animations beyond CSS transitions.
