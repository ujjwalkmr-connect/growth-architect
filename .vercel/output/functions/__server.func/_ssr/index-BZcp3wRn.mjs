import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { M as Mail, Z as Zap, P as Phone, f as Linkedin, g as MapPin, k as TrendingUp, c as Clock, T as Target, I as IndianRupee, W as Workflow, b as Building2, d as Cpu, C as ChartColumn, G as GitBranch, S as Search, h as PhoneCall, i as Sparkles, U as Users, j as Stethoscope, B as Bot, L as Landmark, H as Heart, A as ArrowUpRight, e as GraduationCap, a as Award } from "../_libs/lucide-react.mjs";
function ParticleField({ className = "" }) {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const count = Math.min(80, Math.floor(width * height / 16e3));
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6
    }));
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140) {
          const f = (140 - Math.sqrt(d2)) / 140;
          p.vx += dx / Math.sqrt(d2 + 0.01) * f * 0.02;
          p.vy += dy / Math.sqrt(d2 + 0.01) * f * 0.02;
        }
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            const alpha = (1 - d / 120) * 0.35;
            ctx.strokeStyle = `rgba(110, 220, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        ctx.fillStyle = "rgba(150, 230, 255, 0.85)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      "aria-hidden": "true",
      className: `pointer-events-auto absolute inset-0 h-full w-full ${className}`
    }
  );
}
const profilePhoto = "/assets/ujjwal_kumar_02-DLlbqqVd.png";
const EMAIL = "ujjwalkmr@outlook.com";
const PHONE = "+91 77629 03717";
const LINKEDIN = "https://www.linkedin.com/in/ujjwal-kmr/";
const navLinks = [{
  label: "Overview",
  href: "#about"
}, {
  label: "Impact",
  href: "#metrics"
}, {
  label: "Stack",
  href: "#skills"
}, {
  label: "Experience",
  href: "#experience"
}, {
  label: "Projects",
  href: "#projects"
}];
const metrics = [{
  value: "5.2×",
  label: "Qualified lead growth",
  icon: TrendingUp
}, {
  value: "<3 min",
  label: "Lead response time",
  icon: Clock
}, {
  value: "65%",
  label: "CPL reduction",
  icon: Target
}, {
  value: "₹10L+",
  label: "Monthly ad budget",
  icon: IndianRupee
}, {
  value: "20+",
  label: "Automated workflows",
  icon: Workflow
}, {
  value: "5",
  label: "Healthcare centres scaled",
  icon: Building2
}];
const capabilities = [{
  icon: Target,
  title: "Paid Acquisition",
  body: "Google, Meta and YouTube performance campaigns engineered around CAC, ROAS and lifetime value — not vanity reach.",
  tags: ["Google Ads", "Meta Ads", "YouTube", "Performance Max"]
}, {
  icon: Cpu,
  title: "Marketing Automation",
  body: "20+ production workflows across n8n, Make and HubSpot that route, score and nurture leads in under three minutes.",
  tags: ["n8n", "Make", "HubSpot", "Zapier"]
}, {
  icon: ChartColumn,
  title: "Analytics & Data",
  body: "Attribution stacks in GA4, Looker Studio and Power BI that turn channel noise into pipeline-grade signal.",
  tags: ["GA4", "Looker Studio", "Power BI", "GTM"]
}, {
  icon: GitBranch,
  title: "CRM & RevOps",
  body: "HubSpot, Zoho and Salesforce builds that align marketing, inside-sales and clinical teams around one revenue model.",
  tags: ["HubSpot", "Zoho", "Salesforce", "Pipeline ops"]
}, {
  icon: Search,
  title: "SEO & AEO",
  body: "Technical SEO and answer-engine optimization for ChatGPT, Perplexity and Google AI Overviews — built for the next search.",
  tags: ["Technical SEO", "AEO", "Schema", "Content ops"]
}, {
  icon: PhoneCall,
  title: "Cloud Telephony",
  body: "Exotel, Knowlarity and Ozonetel integrations that capture every call as a tracked, attributed touchpoint.",
  tags: ["Exotel", "Knowlarity", "Ozonetel", "Call tracking"]
}, {
  icon: Sparkles,
  title: "Demand Generation",
  body: "Full-funnel programs — paid, organic, referral and CRM — designed to compound rather than flare.",
  tags: ["Funnels", "Content", "Lifecycle", "Referrals"]
}, {
  icon: Users,
  title: "Leadership",
  body: "Hiring and operating high-leverage growth pods: writers, designers, performance leads, automation engineers.",
  tags: ["Team building", "Vendor ops", "Roadmaps", "Hiring"]
}];
const experience = [{
  current: true,
  role: "Head of Digital Marketing & Growth",
  company: "Ankuram IVF · Blossom Maternity & Child Care Hospital · Medica365",
  period: "Nov 2022 — Present",
  location: "Ranchi, India",
  summary: "Multi-location IVF & fertility healthcare brand — performance marketing, funnel architecture, automation, and clinical ops alignment.",
  bullets: ["Designed and scaled a Meta + Google acquisition engine that grew qualified lead volume 5.2× while reducing blended CPL by 65% and CPA by 25% over 12 months — achieved through structured intent targeting, negative keyword frameworks, and a disciplined A/B experimentation cadence.", "Architected a unified conversion funnel (Ad → Landing Page → WhatsApp/Call → Telecalling → Consultation → Treatment) mapped to CRM pipeline stages, lifting lead-to-consult conversion by 18 percentage points and consult-to-treatment conversion by 9 percentage points.", "Built an automation stack (n8n / Make / Zapier) that ingests 100% of Meta and Google leads into CRM in near-real-time, cutting first-response time from 45–60 minutes to under 5 minutes for priority cohorts — reducing lead leakage by 30–40%.", "Deployed centre-wise and agent-wise lead assignment logic integrated with Tata Smartflo telephony, boosting contact rate by 20% and enabling measurable SLA accountability across telecalling teams.", "Implemented GA4 + GTM with advanced event tracking, custom conversions, and call/OPD attribution; weekly cohort reviews informed budget reallocation decisions that improved estimated ROAS 20–30% across channels.", "Led IVF-specific SEO and AEO roadmap, driving 70–90% YoY growth in organic IVF-intent sessions and securing top-3 positions for core high-intent fertility keywords in target geographies.", "Standardised cross-functional dashboards (marketing, telecalling, clinical) via CRM/HMS integration, enabling centre-wise, doctor-wise, and campaign-wise performance reviews used in monthly business decisions.", "Built and managed an in-house team (designers, video editors, telecallers) and external agency relationships with SOPs covering campaign QA, escalation protocols, and launch checklists — scaling marketing volume 2× without proportional headcount growth."]
}, {
  role: "Marketing Manager",
  company: "Homeline Builders",
  period: "Jul 2021 — Oct 2022",
  location: "Ranchi, India",
  summary: "Residential real estate developer — digital-first lead generation and sales pipeline support.",
  bullets: ["Orchestrated marketing strategies that increased project visibility and contributed to higher property inquiries and site visits through digital-first campaigns.", "Managed end-to-end digital campaigns (Meta + Google) for project launches and ongoing inventory, improving qualified site-visit volume and optimising CPL through iterative creative and targeting experiments.", "Established data-led performance reviews using campaign and CRM sales metrics; reallocated spend across micro-markets based on lead-quality signals, continuously improving pipeline conversion rates.", "Executed integrated digital and on-ground initiatives — brochures, events, digital assets — maintaining consistent brand messaging and supporting booking conversions across multiple active projects.", "Collaborated with leadership to maintain consistent and compelling brand communication across brochures, digital assets, events, and on-ground collaterals."]
}, {
  role: "Projects Manager",
  company: "RIAOM Services Pvt. Ltd.",
  period: "Jun 2017 — Jun 2021",
  location: "Jharkhand, India",
  summary: "BFSI, government programs, and social enterprise — operations, field sales, and stakeholder management.",
  bullets: ["Onboarded 350+ retail banking kiosks across Jharkhand for financial inclusion programs; managed full-cycle rollout from lead generation and site selection to partner onboarding, agent certification, and post-go-live support.", "Oversaw end-to-end rollout from lead generation to field sales, training, certification, and post-go-live technical support, ensuring productive and compliant kiosk operations.", "Collaborated with JSLPS (Govt. of Jharkhand) to train Self Help Groups and establish market linkages for low-infrastructure manufacturing, generating measurable income for rural communities.", "Led livelihood projects inside Central Jails of Jharkhand (Home & Prisons Dept.) during Covid-19, coordinating with district administration on logistics, field ops, and compliance reporting.", "Coordinated with Ranchi District Administration on citizen-centric initiatives, including distribution of medicines and essentials, aligning field ops, communication, and reporting."]
}, {
  role: "Projects Executive",
  company: "Superwave Media Pvt. Ltd.",
  period: "Jun 2016 — May 2017",
  location: "India",
  summary: "Agency-side marketing execution — real-estate client work across digital and traditional channels.",
  bullets: ["Developed and executed integrated marketing strategies to enhance visibility and appeal of Homeline Builders' properties as a key client.", "Managed digital campaigns across social media and search, improving online presence and lead flow for real-estate launches and ongoing projects.", "Utilized both digital and traditional channels to expand reach and drive higher-quality property inquiries supporting sales targets.", "Monitored performance metrics and used insights to adjust messaging, offers, and media mix in line with evolving market conditions.", "Contributed to creation of marketing materials and brand assets, ensuring consistent and effective communication of the brand."]
}];
const projects = [{
  icon: Stethoscope,
  title: "IVF Growth Engine",
  org: "Ankuram IVF",
  body: "End-to-end acquisition system — paid, SEO, CRM and counsellor routing — that became the operating model for the entire fertility vertical. Designed an integrated system mapping campaigns straight through CRM milestones down to clinical outcomes, allowing weekly data reviews based on actual treatments instead of simple lead volume clicks.",
  tags: ["Healthcare", "Paid + SEO", "HubSpot"]
}, {
  icon: Bot,
  title: "Automation-First Marketing Org",
  org: "Medica365 group",
  body: "Replaced 20+ manual handoffs with n8n and Make workflows — lead routing, WhatsApp nurture, missed-call recovery, daily ops digests. Orchestrated 20+ active automated micro-workflows for real-time lead capture, automated reminders, assignment routing, and reactivation across n8n, Make, and Zapier stacks.",
  tags: ["n8n", "Make", "WhatsApp", "Ops"]
}, {
  icon: Search,
  title: "AEO & AI-Search Alignment",
  org: "Blossom Fertility",
  body: "Content, schema and entity strategy that surfaces clinic answers inside ChatGPT, Perplexity and Google AI Overviews.",
  tags: ["AEO", "Schema", "AI Search"]
}, {
  icon: Landmark,
  title: "Saral Pe FinTech Launch",
  org: "Saral Pe",
  body: "Go-to-market for a merchant fintech network — brand, performance and field activation across multiple cities.",
  tags: ["FinTech", "GTM", "Field + digital"]
}, {
  icon: Heart,
  title: "COVID-19 Emergency Response",
  org: "RIAOM Services",
  body: "District-scale logistics, awareness and community mobilization during the pandemic across Jharkhand.",
  tags: ["Public health", "Ops", "Comms"]
}, {
  icon: Stethoscope,
  title: "Rural Telemedicine Pilots",
  org: "Jharkhand state program",
  body: "Connected rural primary-care patients to specialists via telemedicine — protocols, training and adoption tracking.",
  tags: ["Telemedicine", "Rural", "Pilots"]
}];
const certifications = [{
  name: "Prompt Engineering & Programming with OpenAI",
  issuer: "Columbia+",
  date: "May 2026",
  url: "https://badges.plus.columbia.edu/4fd07485-6288-4bf9-af4f-dd4c763b4677#acc.xEH8owDz"
}, {
  name: "HubSpot Revenue Operations Certification",
  issuer: "HubSpot Academy",
  date: "Jan 2026",
  url: "https://app-na2.hubspot.com/academy/achievements/g2xnr1tq/en/1/ujjwal-kumar/revenue-operations"
}, {
  name: "Social Media Marketing II Certification",
  issuer: "HubSpot Academy",
  date: "Jan 2026",
  url: "https://app-na2.hubspot.com/academy/achievements/5gvn7m4d/en/1/ujjwal-kumar/social-media-marketing-certification-ii"
}, {
  name: "Google Analytics Certification",
  issuer: "Google",
  date: "Jan 2026",
  url: "https://skillshop.credential.net/458473f1-e244-463d-a17e-c634d7cfb4a8"
}, {
  name: "Attract & Engage Customers with Digital Marketing",
  issuer: "Google (Coursera)",
  date: "Mar 2024",
  url: "https://www.coursera.org/account/accomplishments/verify/DHPEG3WZPSSM"
}, {
  name: "Foundations of Digital Marketing & E-commerce",
  issuer: "Google (Coursera)",
  date: "Jan 2024",
  url: "https://www.coursera.org/account/accomplishments/verify/ZXMQHFZK8X8Q"
}, {
  name: "Facebook Marketing",
  issuer: "Meta",
  date: "Jan 2024",
  url: "https://www.facebookblueprint.com/student/award/gyUnAA1ASQuK5kc8gm6JSYHt"
}, {
  name: "Grow Your Business",
  issuer: "Meta",
  date: "Jan 2024",
  url: "https://www.facebookblueprint.com/student/award/LvxcibS4pmKvkgzCjsPHEMm9"
}, {
  name: "Instagram Marketing",
  issuer: "Meta",
  date: "Jan 2024",
  url: "https://www.facebookblueprint.com/student/award/sM8cn1UhE9Wg2Dy9yHfJ4Daf"
}, {
  name: "Meta Ads Manager Learning",
  issuer: "Meta",
  date: "Jan 2024",
  url: "https://www.facebookblueprint.com/student/award/b3jdZPrYLfJg7Vk6Rz7tEXEN"
}, {
  name: "WhatsApp Marketing",
  issuer: "Meta",
  date: "Jan 2024",
  url: "https://www.facebookblueprint.com/student/award/2YUSGfebc846Ga36zKSF9Hp2"
}, {
  name: "Marketing with Canva",
  issuer: "Canva Design School",
  date: "Jan 2026",
  url: "https://www.canva.com/design-school/certification-award/48e2877f-33de-4fe9-be59-900b4411d419"
}, {
  name: "Scale Creative Campaigns",
  issuer: "Canva Design School",
  date: "Jan 2026",
  url: "https://www.canva.com/design-school/certification-award/6da97b35-2259-4153-b31b-b587f394f00c"
}, {
  name: "The Field Guide to Human-Centered Design",
  issuer: "Canva Design School",
  date: "Jan 2026",
  url: "https://www.canva.com/design-school/certification-award/aeb24999-f0f4-4971-beee-4362307b27c3"
}, {
  name: "Power BI Workshop",
  issuer: "Office Master",
  date: "Aug 2025",
  url: "https://certx.in/certificate/36a28147-6eed-47a5-8342-e5f926ebba61599409"
}, {
  name: "AI Appreciate Badge — AI For All",
  issuer: "Intel",
  date: "Jul 2025",
  url: "https://ai-for-all.in/#/badge?id=U2FsdGVkX19Rp1L2u3SENHug4tp1L2u3S6b3T2CPUryY7Ys1L2a3S4hRySPz7koe1Q2u3A4l"
}, {
  name: "AI Aware Badge — AI Aware 2025",
  issuer: "Intel",
  date: "Jul 2025",
  url: "https://ai-for-all.in/#/badge?id=U2FsdGVkX18nckW8T3ckTL8b5Y4rfwTYp1L2u3SWds1L2a3S4hv2zs1L2a3S4h6mIe1Q2u3A4l"
}];
function Portfolio() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Metrics, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Capabilities, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Experience, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Projects, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(EducationCerts, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function Nav() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "fixed inset-x-0 top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-7xl items-center justify-between px-6 py-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#about", className: "text-sm font-bold tracking-[0.18em] text-gradient-brand", children: "UJJWAL KUMAR" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden md:flex items-center gap-8", children: navLinks.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: l.href, className: "group relative text-sm text-muted-foreground transition-colors hover:text-foreground", children: [
      l.label,
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-gradient-brand transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100" })
    ] }, l.href)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `mailto:${EMAIL}`, className: "inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }),
      "Contact"
    ] })
  ] }) });
}
function Section({
  id,
  eyebrow,
  title,
  intro,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id, className: "scroll-mt-24 px-6 py-24 md:py-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl", children: [
    (eyebrow || title || intro) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-16 max-w-3xl", children: [
      eyebrow && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-cyan)]/30 bg-[color:var(--accent-cyan)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-cyan)]", children: eyebrow }),
      title && /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-5xl font-extrabold tracking-tight text-foreground", children: title }),
      intro && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-base md:text-lg text-muted-foreground", children: intro })
    ] }),
    children
  ] }) });
}
function Hero() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "about", className: "relative scroll-mt-24 overflow-hidden px-6 pt-36 pb-24 md:pt-44 md:pb-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute inset-0 -z-10", style: {
      background: "radial-gradient(60% 50% at 20% 20%, color-mix(in oklab, var(--accent-cyan) 18%, transparent) 0%, transparent 60%), radial-gradient(50% 40% at 85% 10%, color-mix(in oklab, var(--accent-indigo) 22%, transparent) 0%, transparent 60%), radial-gradient(40% 40% at 70% 90%, color-mix(in oklab, var(--accent-teal) 16%, transparent) 0%, transparent 60%)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 -z-10 opacity-70", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ParticleField, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-7", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-cyan)]/30 bg-[color:var(--accent-cyan)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-cyan)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5" }),
          "Growth & RevOps Architect · 9+ years"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl md:text-7xl lg:text-[5.25rem] font-extrabold tracking-[-0.02em] leading-[0.95] text-foreground", children: [
          "UJJWAL ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-brand", children: "KUMAR" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-2xl md:text-3xl font-semibold tracking-tight text-foreground/90 leading-tight", children: [
          "Building predictable,",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-brand", children: "automated engines" }),
          " for scale."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed", children: "I lead Performance Marketing, RevOps and AI automation at Ankuram IVF, Blossom Maternity and Child Care Hospital and Medica365 — five healthcare centres operating as one growth system. Across my ten years, I’ve built paid-acquisition, CRM and automation stacks that compound: 5.2× lead growth, 65% lower CPL, and under-three-minute response across every channel." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-9 flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `mailto:${EMAIL}`, className: "inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_color-mix(in_oklab,var(--accent-cyan)_55%,transparent)] active:translate-y-0 active:scale-[0.98]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }),
            " Email me"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: TEL_HREF_FROM_PHONE(), className: "inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[color:var(--accent-cyan)]/50 hover:bg-surface active:translate-y-0 active:scale-[0.98]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4 text-[color:var(--accent-cyan)]" }),
            " ",
            PHONE
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: LINKEDIN, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[color:var(--accent-indigo)]/50 hover:bg-surface active:translate-y-0 active:scale-[0.98]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { className: "h-4 w-4 text-[color:var(--accent-indigo)]" }),
            " LinkedIn"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-[color:var(--accent-cyan)]" }),
            " Ranchi, India"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 text-[color:var(--accent-cyan)]" }),
            " ",
            EMAIL
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto w-full max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": "true", className: "absolute -inset-6 rounded-[2rem] opacity-70 blur-2xl", style: {
          background: "var(--gradient-brand)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface/40 p-2 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-[2rem] opacity-60", "aria-hidden": "true", style: {
            background: "linear-gradient(140deg, color-mix(in oklab, var(--accent-cyan) 30%, transparent), transparent 45%, color-mix(in oklab, var(--accent-indigo) 35%, transparent))",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: 1
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: profilePhoto, alt: "Portrait of Ujjwal Kumar", className: "aspect-square w-full rounded-[1.75rem] object-cover", loading: "eager" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-5 left-5 rounded-2xl border border-white/10 bg-background/70 px-4 py-3 backdrop-blur-xl shadow-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-cyan)]", children: "Currently" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-sm font-semibold text-foreground", children: "Head of Digital Marketing & Growth" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Ankuram IVF · Blossom · Medica365" })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
function TEL_HREF_FROM_PHONE() {
  return `tel:${PHONE.replace(/\s/g, "")}`;
}
function Metrics() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { id: "metrics", eyebrow: "Impact", title: "Numbers that compound, not just spike.", intro: "A snapshot of the growth system I operate today across Ankuram IVF, Blossom Fertility and Medica365.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6", children: metrics.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group rounded-2xl border border-border bg-surface/30 p-6 md:p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-[color:var(--accent-cyan)]/40 hover:bg-surface/60 hover:shadow-[0_20px_50px_-20px_color-mix(in_oklab,var(--accent-cyan)_45%,transparent)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--accent-cyan)]/10 text-[color:var(--accent-cyan)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(m.icon, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl md:text-4xl font-extrabold tracking-tight text-gradient-brand", children: m.value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm text-muted-foreground", children: m.label })
  ] }, m.label)) }) });
}
function Capabilities() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { id: "skills", eyebrow: "Stack", title: "A full-stack growth operator.", intro: "Performance media, automation, analytics and RevOps — built as one connected system, not eight separate tools.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6", children: capabilities.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group rounded-2xl border border-border bg-surface/30 p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-[color:var(--accent-cyan)]/40 hover:bg-surface/60 hover:shadow-[0_20px_50px_-20px_color-mix(in_oklab,var(--accent-cyan)_45%,transparent)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--accent-cyan)]/10 text-[color:var(--accent-cyan)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(c.icon, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-foreground", children: c.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed", children: c.body }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 flex flex-wrap gap-2", children: c.tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-border bg-surface/60 px-2.5 py-1 text-xs text-muted-foreground", children: t }, t)) })
  ] }, c.title)) }) });
}
function Experience() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { id: "experience", eyebrow: "Experience", title: "Nine years of building growth engines.", intro: "Healthcare, real estate, public health and agency — each role left a documented playbook behind.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "relative border-l border-border pl-8 md:pl-10 space-y-12", children: experience.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute -left-[42px] md:-left-[50px] top-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full ${e.current ? "bg-[color:var(--accent-cyan)] ring-4 ring-[color:var(--accent-cyan)]/20" : "bg-surface-2 ring-4 ring-border/40"}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface/30 p-6 md:p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium text-muted-foreground", children: e.period }),
        e.current && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-[color:var(--accent-cyan)]/30 bg-[color:var(--accent-cyan)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--accent-cyan)]", children: "Current" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: e.location })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl md:text-2xl font-bold text-foreground", children: e.role }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm font-medium text-[color:var(--accent-cyan)]", children: e.company }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm md:text-base text-muted-foreground leading-relaxed", children: e.summary }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-5 space-y-2.5", children: e.bullets.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-2 inline-block h-1.5 w-1.5 flex-none rounded-full bg-[color:var(--accent-cyan)]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "leading-relaxed", children: b })
      ] }, i)) })
    ] })
  ] }, e.company)) }) });
}
function Projects() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { id: "projects", eyebrow: "Projects", title: "Featured Growth Projects", intro: "From IVF growth engines to district-scale public health programs — outcome-led, system-built.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6", children: projects.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "group rounded-2xl border border-border bg-surface/30 p-6 md:p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-[color:var(--accent-cyan)]/40 hover:bg-surface/60 hover:shadow-[0_20px_50px_-20px_color-mix(in_oklab,var(--accent-cyan)_45%,transparent)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--accent-indigo)]/10 text-[color:var(--accent-indigo)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(p.icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-cyan)]", children: p.org }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 text-xl font-bold text-foreground", children: p.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground leading-relaxed", children: p.body }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 flex flex-wrap gap-2", children: p.tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-border bg-surface/60 px-2.5 py-1 text-xs text-muted-foreground", children: t }, t)) })
  ] }, p.title)) }) });
}
function EducationCerts() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { eyebrow: "Credentials", title: "Education & certifications.", intro: "Foundation in business administration, sharpened through continuous specialist certifications.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface/30 p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--accent-teal)]/10 text-[color:var(--accent-teal)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 text-lg font-bold text-foreground", children: "Bachelor of Business Administration" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm text-[color:var(--accent-cyan)]", children: "Amity University" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground leading-relaxed", children: "Core grounding in marketing, finance and operations — the lens I bring to every growth program I build." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 rounded-2xl border border-border bg-surface/30 p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--accent-indigo)]/10 text-[color:var(--accent-indigo)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 text-lg font-bold text-foreground", children: "Certifications" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3", children: certifications.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-2 inline-block h-1.5 w-1.5 flex-none rounded-full bg-[color:var(--accent-indigo)]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: c.url, target: "_blank", rel: "noopener noreferrer", className: "font-medium text-foreground hover:text-[color:var(--accent-cyan)] transition-colors", children: c.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-0.5", children: [
            c.issuer,
            " · ",
            c.date
          ] })
        ] })
      ] }, c.name)) })
    ] })
  ] }) });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-border/40 px-6 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-surface/30 p-10 md:p-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-cyan)]", children: "Let’s build" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-3 text-3xl md:text-5xl font-extrabold tracking-tight", children: [
        "Ready to engineer your",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-brand", children: "next growth engine?" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `mailto:${EMAIL}`, className: "inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }),
          " ",
          EMAIL
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: LINKEDIN, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2 rounded-full border border-border bg-surface/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { className: "h-4 w-4" }),
          " LinkedIn"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `tel:${PHONE.replace(/\s/g, "")}`, className: "inline-flex items-center gap-2 rounded-full border border-border bg-surface/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
          PHONE
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Ujjwal Kumar. Built with ❤️ in Bharat."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tracking-[0.18em] uppercase", children: "Growth · RevOps · AI Automation" })
    ] })
  ] }) });
}
export {
  Portfolio as component
};
