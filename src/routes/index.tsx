import { createFileRoute } from "@tanstack/react-router";
import {
  Mail,
  Linkedin,
  MapPin,
  Phone,
  Target,
  Cpu,
  BarChart3,
  GitBranch,
  Search,
  PhoneCall,
  Users,
  Sparkles,
  TrendingUp,
  Zap,
  Clock,
  IndianRupee,
  Workflow,
  Building2,
  Award,
  GraduationCap,
  ArrowUpRight,
  Heart,
  Stethoscope,
  Landmark,
  Bot,
} from "lucide-react";
import { ParticleField } from "@/components/ParticleField";
import profilePhoto from "@/assets/ujjwal_kumar_02.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ujjwal Kumar — Growth & RevOps Architect" },
      {
        name: "description",
        content:
          "Portfolio of Ujjwal Kumar — 9+ years architecting automated growth engines, RevOps systems, and AI-led marketing operations.",
      },
      { property: "og:title", content: "Ujjwal Kumar — Growth & RevOps Architect" },
      {
        property: "og:description",
        content:
          "Building predictable, automated engines for scale across healthcare, fintech and real estate.",
      },
    ],
  }),
  component: Portfolio,
});

const EMAIL = "ujjwalkmr@outlook.com";
const PHONE = "+91 77629 03717";
const LINKEDIN = "https://www.linkedin.com/in/ujjwal-kmr/";

const navLinks = [
  { label: "Overview", href: "#about" },
  { label: "Impact", href: "#metrics" },
  { label: "Stack", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
];

const metrics = [
  { value: "5.2×", label: "Qualified lead growth", icon: TrendingUp },
  { value: "<3 min", label: "Lead response time", icon: Clock },
  { value: "65%", label: "CPL reduction", icon: Target },
  { value: "₹10L+", label: "Monthly ad budget", icon: IndianRupee },
  { value: "20+", label: "Automated workflows", icon: Workflow },
  { value: "5", label: "Healthcare centres scaled", icon: Building2 },
];

const capabilities = [
  {
    icon: Target,
    title: "Paid Acquisition",
    body:
      "Google, Meta and YouTube performance campaigns engineered around CAC, ROAS and lifetime value — not vanity reach.",
    tags: ["Google Ads", "Meta Ads", "YouTube", "Performance Max"],
  },
  {
    icon: Cpu,
    title: "Marketing Automation",
    body:
      "20+ production workflows across n8n, Make and HubSpot that route, score and nurture leads in under three minutes.",
    tags: ["n8n", "Make", "HubSpot", "Zapier"],
  },
  {
    icon: BarChart3,
    title: "Analytics & Data",
    body:
      "Attribution stacks in GA4, Looker Studio and Power BI that turn channel noise into pipeline-grade signal.",
    tags: ["GA4", "Looker Studio", "Power BI", "GTM"],
  },
  {
    icon: GitBranch,
    title: "CRM & RevOps",
    body:
      "HubSpot, Zoho and Salesforce builds that align marketing, inside-sales and clinical teams around one revenue model.",
    tags: ["HubSpot", "Zoho", "Salesforce", "Pipeline ops"],
  },
  {
    icon: Search,
    title: "SEO & AEO",
    body:
      "Technical SEO and answer-engine optimization for ChatGPT, Perplexity and Google AI Overviews — built for the next search.",
    tags: ["Technical SEO", "AEO", "Schema", "Content ops"],
  },
  {
    icon: PhoneCall,
    title: "Cloud Telephony",
    body:
      "Exotel, Knowlarity and Ozonetel integrations that capture every call as a tracked, attributed touchpoint.",
    tags: ["Exotel", "Knowlarity", "Ozonetel", "Call tracking"],
  },
  {
    icon: Sparkles,
    title: "Demand Generation",
    body:
      "Full-funnel programs — paid, organic, referral and CRM — designed to compound rather than flare.",
    tags: ["Funnels", "Content", "Lifecycle", "Referrals"],
  },
  {
    icon: Users,
    title: "Leadership",
    body:
      "Hiring and operating high-leverage growth pods: writers, designers, performance leads, automation engineers.",
    tags: ["Team building", "Vendor ops", "Roadmaps", "Hiring"],
  },
];

const experience = [
  {
    current: true,
    role: "Head of Digital Marketing & Growth",
    company: "Ankuram IVF · Blossom Maternity & Child Care Hospital · Medica365",
    period: "Nov 2022 — Present",
    location: "Ranchi, India",
    summary:
      "Multi-location IVF & fertility healthcare brand — performance marketing, funnel architecture, automation, and clinical ops alignment.",
    bullets: [
      "Designed and scaled a Meta + Google acquisition engine that grew qualified lead volume 5.2× while reducing blended CPL by 65% and CPA by 25% over 12 months — achieved through structured intent targeting, negative keyword frameworks, and a disciplined A/B experimentation cadence.",
      "Architected a unified conversion funnel (Ad → Landing Page → WhatsApp/Call → Telecalling → Consultation → Treatment) mapped to CRM pipeline stages, lifting lead-to-consult conversion by 18 percentage points and consult-to-treatment conversion by 9 percentage points.",
      "Built an automation stack (n8n / Make / Zapier) that ingests 100% of Meta and Google leads into CRM in near-real-time, cutting first-response time from 45–60 minutes to under 5 minutes for priority cohorts — reducing lead leakage by 30–40%.",
      "Deployed centre-wise and agent-wise lead assignment logic integrated with Tata Smartflo telephony, boosting contact rate by 20% and enabling measurable SLA accountability across telecalling teams.",
      "Implemented GA4 + GTM with advanced event tracking, custom conversions, and call/OPD attribution; weekly cohort reviews informed budget reallocation decisions that improved estimated ROAS 20–30% across channels.",
      "Led IVF-specific SEO and AEO roadmap, driving 70–90% YoY growth in organic IVF-intent sessions and securing top-3 positions for core high-intent fertility keywords in target geographies.",
      "Standardised cross-functional dashboards (marketing, telecalling, clinical) via CRM/HMS integration, enabling centre-wise, doctor-wise, and campaign-wise performance reviews used in monthly business decisions.",
      "Built and managed an in-house team (designers, video editors, telecallers) and external agency relationships with SOPs covering campaign QA, escalation protocols, and launch checklists — scaling marketing volume 2× without proportional headcount growth.",
    ],
  },
  {
    role: "Marketing Manager",
    company: "Homeline Builders",
    period: "Jul 2021 — Oct 2022",
    location: "Ranchi, India",
    summary:
      "Residential real estate developer — digital-first lead generation and sales pipeline support.",
    bullets: [
      "Orchestrated marketing strategies that increased project visibility and contributed to higher property inquiries and site visits through digital-first campaigns.",
      "Managed end-to-end digital campaigns (Meta + Google) for project launches and ongoing inventory, improving qualified site-visit volume and optimising CPL through iterative creative and targeting experiments.",
      "Established data-led performance reviews using campaign and CRM sales metrics; reallocated spend across micro-markets based on lead-quality signals, continuously improving pipeline conversion rates.",
      "Executed integrated digital and on-ground initiatives — brochures, events, digital assets — maintaining consistent brand messaging and supporting booking conversions across multiple active projects.",
      "Collaborated with leadership to maintain consistent and compelling brand communication across brochures, digital assets, events, and on-ground collaterals.",
    ],
  },
  {
    role: "Projects Manager",
    company: "RIAOM Services Pvt. Ltd.",
    period: "Jun 2017 — Jun 2021",
    location: "Jharkhand, India",
    summary:
      "BFSI, government programs, and social enterprise — operations, field sales, and stakeholder management.",
    bullets: [
      "Onboarded 350+ retail banking kiosks across Jharkhand for financial inclusion programs; managed full-cycle rollout from lead generation and site selection to partner onboarding, agent certification, and post-go-live support.",
      "Oversaw end-to-end rollout from lead generation to field sales, training, certification, and post-go-live technical support, ensuring productive and compliant kiosk operations.",
      "Collaborated with JSLPS (Govt. of Jharkhand) to train Self Help Groups and establish market linkages for low-infrastructure manufacturing, generating measurable income for rural communities.",
      "Led livelihood projects inside Central Jails of Jharkhand (Home & Prisons Dept.) during Covid-19, coordinating with district administration on logistics, field ops, and compliance reporting.",
      "Coordinated with Ranchi District Administration on citizen-centric initiatives, including distribution of medicines and essentials, aligning field ops, communication, and reporting.",
    ],
  },
  {
    role: "Projects Executive",
    company: "Superwave Media Pvt. Ltd.",
    period: "Jun 2016 — May 2017",
    location: "India",
    summary:
      "Agency-side marketing execution — real-estate client work across digital and traditional channels.",
    bullets: [
      "Developed and executed integrated marketing strategies to enhance visibility and appeal of Homeline Builders' properties as a key client.",
      "Managed digital campaigns across social media and search, improving online presence and lead flow for real-estate launches and ongoing projects.",
      "Utilized both digital and traditional channels to expand reach and drive higher-quality property inquiries supporting sales targets.",
      "Monitored performance metrics and used insights to adjust messaging, offers, and media mix in line with evolving market conditions.",
      "Contributed to creation of marketing materials and brand assets, ensuring consistent and effective communication of the brand.",
    ],
  },
];

const projects = [
  {
    icon: Stethoscope,
    title: "IVF Growth Engine",
    org: "Ankuram IVF",
    body:
      "End-to-end acquisition system — paid, SEO, CRM and counsellor routing — that became the operating model for the entire fertility vertical. Designed an integrated system mapping campaigns straight through CRM milestones down to clinical outcomes, allowing weekly data reviews based on actual treatments instead of simple lead volume clicks.",
    tags: ["Healthcare", "Paid + SEO", "HubSpot"],
  },
  {
    icon: Bot,
    title: "Automation-First Marketing Org",
    org: "Medica365 group",
    body:
      "Replaced 20+ manual handoffs with n8n and Make workflows — lead routing, WhatsApp nurture, missed-call recovery, daily ops digests. Orchestrated 20+ active automated micro-workflows for real-time lead capture, automated reminders, assignment routing, and reactivation across n8n, Make, and Zapier stacks.",
    tags: ["n8n", "Make", "WhatsApp", "Ops"],
  },
  {
    icon: Search,
    title: "AEO & AI-Search Alignment",
    org: "Blossom Fertility",
    body:
      "Content, schema and entity strategy that surfaces clinic answers inside ChatGPT, Perplexity and Google AI Overviews.",
    tags: ["AEO", "Schema", "AI Search"],
  },
  {
    icon: Landmark,
    title: "Saral Pe FinTech Launch",
    org: "Saral Pe",
    body:
      "Go-to-market for a merchant fintech network — brand, performance and field activation across multiple cities.",
    tags: ["FinTech", "GTM", "Field + digital"],
  },
  {
    icon: Heart,
    title: "COVID-19 Emergency Response",
    org: "RIAOM Services",
    body:
      "District-scale logistics, awareness and community mobilization during the pandemic across Jharkhand.",
    tags: ["Public health", "Ops", "Comms"],
  },
  {
    icon: Stethoscope,
    title: "Rural Telemedicine Pilots",
    org: "Jharkhand state program",
    body:
      "Connected rural primary-care patients to specialists via telemedicine — protocols, training and adoption tracking.",
    tags: ["Telemedicine", "Rural", "Pilots"],
  },
];

const certifications: { name: string; issuer: string; date: string; url: string }[] = [
  { name: "Prompt Engineering & Programming with OpenAI", issuer: "Columbia+", date: "May 2026", url: "#" },
  { name: "HubSpot Revenue Operations Certification", issuer: "HubSpot Academy", date: "Jan 2026", url: "#" },
  { name: "Social Media Marketing II Certification", issuer: "HubSpot Academy", date: "Jan 2026", url: "#" },
  { name: "Google Analytics Certification", issuer: "Google", date: "Jan 2026", url: "#" },
  { name: "Attract & Engage Customers with Digital Marketing", issuer: "Google (Coursera)", date: "Mar 2024", url: "#" },
  { name: "Foundations of Digital Marketing & E-commerce", issuer: "Google (Coursera)", date: "Jan 2024", url: "#" },
  { name: "Facebook Marketing", issuer: "Meta", date: "Jan 2024", url: "#" },
  { name: "Grow Your Business", issuer: "Meta", date: "Jan 2024", url: "#" },
  { name: "Instagram Marketing", issuer: "Meta", date: "Jan 2024", url: "#" },
  { name: "Meta Ads Manager Learning", issuer: "Meta", date: "Jan 2024", url: "#" },
  { name: "WhatsApp Marketing", issuer: "Meta", date: "Jan 2024", url: "#" },
  { name: "Marketing with Canva", issuer: "Canva Design School", date: "Jan 2026", url: "#" },
  { name: "Scale Creative Campaigns", issuer: "Canva Design School", date: "Jan 2026", url: "#" },
  { name: "The Field Guide to Human-Centered Design", issuer: "Canva Design School", date: "Jan 2026", url: "#" },
  { name: "Power BI Workshop", issuer: "Office Master", date: "Aug 2025", url: "#" },
  { name: "AI Appreciate Badge — AI For All", issuer: "Intel", date: "Jul 2025", url: "#" },
  { name: "AI Aware Badge — AI Aware 2025", issuer: "Intel", date: "Jul 2025", url: "#" },
];

function Portfolio() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Metrics />
        <Capabilities />
        <Experience />
        <Projects />
        <EducationCerts />
      </main>
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#about" className="text-sm font-bold tracking-[0.18em] text-gradient-brand">
          UJJWAL KUMAR
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
              <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-gradient-brand transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
        <a
          href={`mailto:${EMAIL}`}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
        >
          <Mail className="h-4 w-4" />
          Contact
        </a>
      </div>
    </header>
  );
}

function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        {(eyebrow || title || intro) && (
          <div className="mb-16 max-w-3xl">
            {eyebrow && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-cyan)]/30 bg-[color:var(--accent-cyan)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-cyan)]">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                {title}
              </h2>
            )}
            {intro && <p className="mt-5 text-base md:text-lg text-muted-foreground">{intro}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section
      id="about"
      className="relative scroll-mt-24 overflow-hidden px-6 pt-36 pb-24 md:pt-44 md:pb-32"
    >
      {/* Ambient gradient mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 20%, color-mix(in oklab, var(--accent-cyan) 18%, transparent) 0%, transparent 60%), radial-gradient(50% 40% at 85% 10%, color-mix(in oklab, var(--accent-indigo) 22%, transparent) 0%, transparent 60%), radial-gradient(40% 40% at 70% 90%, color-mix(in oklab, var(--accent-teal) 16%, transparent) 0%, transparent 60%)",
        }}
      />
      {/* Particle constellation */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <ParticleField />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left column — text & actions */}
        <div className="lg:col-span-7">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-cyan)]/30 bg-[color:var(--accent-cyan)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-cyan)]">
            <Zap className="h-3.5 w-3.5" />
            Growth & RevOps Architect · 9+ years
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5.25rem] font-extrabold tracking-[-0.02em] leading-[0.95] text-foreground">
            UJJWAL <span className="text-gradient-brand">KUMAR</span>
          </h1>

          <p className="mt-6 text-2xl md:text-3xl font-semibold tracking-tight text-foreground/90 leading-tight">
            Building predictable,{" "}
            <span className="text-gradient-brand">automated engines</span> for scale.
          </p>

          <p className="mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            I lead marketing, RevOps and AI automation at Ankuram IVF, Blossom Fertility and
            Medica365 — five healthcare centres operating as one growth system. Across nine
            years, I&rsquo;ve built paid-acquisition, CRM and automation stacks that compound:
            5.2× lead growth, 65% lower CPL, and under-three-minute response across every
            channel.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_color-mix(in_oklab,var(--accent-cyan)_55%,transparent)] active:translate-y-0 active:scale-[0.98]"
            >
              <Mail className="h-4 w-4" /> Email me
            </a>
            <a
              href={TEL_HREF_FROM_PHONE()}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[color:var(--accent-cyan)]/50 hover:bg-surface active:translate-y-0 active:scale-[0.98]"
            >
              <Phone className="h-4 w-4 text-[color:var(--accent-cyan)]" /> {PHONE}
            </a>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[color:var(--accent-indigo)]/50 hover:bg-surface active:translate-y-0 active:scale-[0.98]"
            >
              <Linkedin className="h-4 w-4 text-[color:var(--accent-indigo)]" /> LinkedIn
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[color:var(--accent-cyan)]" /> Ranchi, India
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-[color:var(--accent-cyan)]" /> {EMAIL}
            </span>
          </div>
        </div>

        {/* Right column — profile portrait */}
        <div className="lg:col-span-5">
          <div className="relative mx-auto w-full max-w-md">
            {/* Glow */}
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-[2rem] opacity-70 blur-2xl"
              style={{ background: "var(--gradient-brand)" }}
            />
            {/* Frame */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface/40 p-2 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
              <div
                className="absolute inset-0 rounded-[2rem] opacity-60"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(140deg, color-mix(in oklab, var(--accent-cyan) 30%, transparent), transparent 45%, color-mix(in oklab, var(--accent-indigo) 35%, transparent))",
                  WebkitMask:
                    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  padding: 1,
                }}
              />
              <img
                src={profilePhoto}
                alt="Portrait of Ujjwal Kumar"
                className="aspect-square w-full rounded-[1.75rem] object-cover"
                loading="eager"
              />
              {/* Floating badge */}
              <div className="absolute bottom-5 left-5 rounded-2xl border border-white/10 bg-background/70 px-4 py-3 backdrop-blur-xl shadow-xl">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-cyan)]">
                  Currently
                </div>
                <div className="mt-0.5 text-sm font-semibold text-foreground">
                  Head of Digital Marketing & Growth
                </div>
                <div className="text-xs text-muted-foreground">
                  Ankuram IVF · Blossom · Medica365
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TEL_HREF_FROM_PHONE() {
  return `tel:${PHONE.replace(/\s/g, "")}`;
}

function Metrics() {
  return (
    <Section
      id="metrics"
      eyebrow="Impact"
      title="Numbers that compound, not just spike."
      intro="A snapshot of the growth system I operate today across Ankuram IVF, Blossom Fertility and Medica365."
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="group rounded-2xl border border-border bg-surface/30 p-6 md:p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-[color:var(--accent-cyan)]/40 hover:bg-surface/60 hover:shadow-[0_20px_50px_-20px_color-mix(in_oklab,var(--accent-cyan)_45%,transparent)]"
          >
            <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--accent-cyan)]/10 text-[color:var(--accent-cyan)]">
              <m.icon className="h-5 w-5" />
            </div>
            <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-gradient-brand">
              {m.value}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{m.label}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Capabilities() {
  return (
    <Section
      id="skills"
      eyebrow="Stack"
      title="A full-stack growth operator."
      intro="Performance media, automation, analytics and RevOps — built as one connected system, not eight separate tools."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {capabilities.map((c) => (
          <div
            key={c.title}
            className="group rounded-2xl border border-border bg-surface/30 p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-[color:var(--accent-cyan)]/40 hover:bg-surface/60 hover:shadow-[0_20px_50px_-20px_color-mix(in_oklab,var(--accent-cyan)_45%,transparent)]"
          >
            <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--accent-cyan)]/10 text-[color:var(--accent-cyan)]">
              <c.icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{c.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.body}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {c.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-surface/60 px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Nine years of building growth engines."
      intro="Healthcare, real estate, public health and agency — each role left a documented playbook behind."
    >
      <ol className="relative border-l border-border pl-8 md:pl-10 space-y-12">
        {experience.map((e) => (
          <li key={e.company} className="relative">
            <span
              className={`absolute -left-[42px] md:-left-[50px] top-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full ${
                e.current
                  ? "bg-[color:var(--accent-cyan)] ring-4 ring-[color:var(--accent-cyan)]/20"
                  : "bg-surface-2 ring-4 ring-border/40"
              }`}
            />
            <div className="rounded-2xl border border-border bg-surface/30 p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  {e.period}
                </span>
                {e.current && (
                  <span className="rounded-full border border-[color:var(--accent-cyan)]/30 bg-[color:var(--accent-cyan)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--accent-cyan)]">
                    Current
                  </span>
                )}
                <span className="text-xs text-muted-foreground">{e.location}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground">{e.role}</h3>
              <div className="mt-1 text-sm font-medium text-[color:var(--accent-cyan)]">
                {e.company}
              </div>
              <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                {e.summary}
              </p>
              <ul className="mt-5 space-y-2.5">
                {e.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="mt-2 inline-block h-1.5 w-1.5 flex-none rounded-full bg-[color:var(--accent-cyan)]" />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Featured Growth Projects"
      intro="From IVF growth engines to district-scale public health programs — outcome-led, system-built."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {projects.map((p) => (
          <article
            key={p.title}
            className="group rounded-2xl border border-border bg-surface/30 p-6 md:p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-[color:var(--accent-cyan)]/40 hover:bg-surface/60 hover:shadow-[0_20px_50px_-20px_color-mix(in_oklab,var(--accent-cyan)_45%,transparent)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--accent-indigo)]/10 text-[color:var(--accent-indigo)]">
                <p.icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
            <div className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-cyan)]">
              {p.org}
            </div>
            <h3 className="mt-1 text-xl font-bold text-foreground">{p.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-surface/60 px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function EducationCerts() {
  return (
    <Section
      eyebrow="Credentials"
      title="Education & certifications."
      intro="Foundation in business administration, sharpened through continuous specialist certifications."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-border bg-surface/30 p-8">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--accent-teal)]/10 text-[color:var(--accent-teal)]">
            <GraduationCap className="h-5 w-5" />
          </div>
          <h3 className="mt-5 text-lg font-bold text-foreground">
            Bachelor of Business Administration
          </h3>
          <div className="mt-1 text-sm text-[color:var(--accent-cyan)]">Amity University</div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Core grounding in marketing, finance and operations — the lens I bring to every
            growth program I build.
          </p>
        </div>
        <div className="lg:col-span-2 rounded-2xl border border-border bg-surface/30 p-8">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--accent-indigo)]/10 text-[color:var(--accent-indigo)]">
            <Award className="h-5 w-5" />
          </div>
          <h3 className="mt-5 text-lg font-bold text-foreground">Certifications</h3>
          <ul className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {certifications.map((c) => (
              <li key={c.name} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-2 inline-block h-1.5 w-1.5 flex-none rounded-full bg-[color:var(--accent-indigo)]" />
                <div className="flex-1">
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:text-[color:var(--accent-cyan)] transition-colors"
                  >
                    {c.name}
                  </a>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {c.issuer} · {c.date}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-border bg-surface/30 p-10 md:p-16">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-cyan)]">
            Let&rsquo;s build
          </div>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">
            Ready to engineer your{" "}
            <span className="text-gradient-brand">next growth engine?</span>
          </h2>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
            >
              <Mail className="h-4 w-4" /> {EMAIL}
            </a>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
            >
              <Phone className="h-4 w-4" />{PHONE}
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Ujjwal Kumar. Built in Ranchi, India.</div>
          <div className="tracking-[0.18em] uppercase">Growth · RevOps · AI Automation</div>
        </div>
      </div>
    </footer>
  );
}
