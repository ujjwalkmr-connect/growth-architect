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
const PHONE = "+91 80820 20030";
const LINKEDIN = "https://www.linkedin.com/in/ujjwalkmr/";

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
    role: "Head of Marketing & Growth",
    company: "Ankuram IVF · Blossom Fertility · Medica365",
    period: "2023 — Present",
    location: "Ranchi, India",
    summary:
      "Leading marketing, RevOps and AI automation across five healthcare centres — fertility, wellness and primary care.",
    bullets: [
      "Scaled qualified lead volume 5.2× while reducing cost-per-lead by 65% through paid + organic + automation stack.",
      "Built a HubSpot + Exotel + n8n routing engine that delivers every new lead to counsellors in under three minutes.",
      "Designed AEO and schema strategy that surfaces clinic pages inside ChatGPT, Perplexity and Google AI Overviews.",
      "Operating ₹10L+ monthly ad budgets across Google, Meta and YouTube with attribution back to consult-booked revenue.",
    ],
  },
  {
    role: "Marketing Manager",
    company: "Homeline Builders",
    period: "2021 — 2023",
    location: "Ranchi, India",
    summary:
      "Owned end-to-end marketing for a residential real-estate brand — brand, performance and on-site conversion.",
    bullets: [
      "Built the digital sales funnel from zero — site, CRM, paid media — driving consistent qualified site-visits.",
      "Launched a referral and lifecycle program that turned home-owners into a repeatable acquisition channel.",
      "Stood up reporting in GA4 and Power BI to give leadership a weekly view of pipeline by source and project.",
    ],
  },
  {
    role: "Project Lead — Public Health & Livelihoods",
    company: "RIAOM Services",
    period: "2019 — 2021",
    location: "Jharkhand, India",
    summary:
      "Designed and ran state-level programs across emergency response, telemedicine and rural livelihood activation.",
    bullets: [
      "Led the COVID-19 emergency response program — logistics, awareness and community mobilization at district scale.",
      "Stood up telemedicine pilots across rural Jharkhand, connecting primary-care patients to specialists remotely.",
      "Ran a prison rehabilitation program and supported JSLPS on rural livelihood activation across multiple blocks.",
    ],
  },
  {
    role: "Digital Marketing Specialist",
    company: "Superwave Media",
    period: "2016 — 2019",
    location: "India",
    summary:
      "Cut performance teeth on agency-side work — SMB and mid-market campaigns across SEO, Google Ads and Meta.",
    bullets: [
      "Managed paid + organic programs for a portfolio of clients across e-commerce, education and local services.",
      "Built reporting, creative and landing-page workflows that became templates across the agency.",
    ],
  },
];

const projects = [
  {
    icon: Stethoscope,
    title: "IVF Growth Engine",
    org: "Ankuram IVF",
    body:
      "End-to-end acquisition system — paid, SEO, CRM and counsellor routing — that became the operating model for the entire fertility vertical.",
    tags: ["Healthcare", "Paid + SEO", "HubSpot"],
  },
  {
    icon: Bot,
    title: "Automation-First Marketing Org",
    org: "Medica365 group",
    body:
      "Replaced 20+ manual handoffs with n8n and Make workflows — lead routing, WhatsApp nurture, missed-call recovery, daily ops digests.",
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

const certifications = [
  "HubSpot RevOps Certified",
  "Google Analytics (GA4) Certified",
  "Columbia · Prompt Engineering for ChatGPT",
  "Meta Certified Digital Marketing Associate",
  "Canva · Human-Centered Design",
  "Microsoft Power BI Data Analyst",
  "Intel AI for All — AI Aware",
  "Google Ads Search & Display",
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
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
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
    <section id="about" className="scroll-mt-24 px-6 pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-cyan)]/30 bg-[color:var(--accent-cyan)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-cyan)]">
          <Zap className="h-3.5 w-3.5" />
          Growth & RevOps Architect · 9+ years
        </div>
        <h1 className="max-w-5xl text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
          Building predictable,{" "}
          <span className="text-gradient-brand">automated engines</span> for scale.
        </h1>
        <p className="mt-8 max-w-3xl text-lg md:text-xl text-muted-foreground leading-relaxed">
          I lead marketing, RevOps and AI automation at Ankuram IVF, Blossom Fertility and
          Medica365 — five healthcare centres operating as one growth system. Across nine years,
          I&rsquo;ve built paid-acquisition, CRM and automation stacks that compound: 5.2× lead
          growth, 65% lower CPL, and under-three-minute response across every channel.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
          >
            <Mail className="h-4 w-4" /> Start a conversation
          </a>
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
          >
            <Linkedin className="h-4 w-4" /> Connect on LinkedIn
          </a>
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[color:var(--accent-cyan)]" /> Ranchi, India
          </span>
          <span className="inline-flex items-center gap-2">
            <Phone className="h-4 w-4 text-[color:var(--accent-cyan)]" /> {PHONE}
          </span>
          <span className="inline-flex items-center gap-2">
            <Mail className="h-4 w-4 text-[color:var(--accent-cyan)]" /> {EMAIL}
          </span>
        </div>
      </div>
    </section>
  );
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
            className="group rounded-2xl border border-border bg-surface/30 p-6 md:p-8 transition-colors hover:bg-surface/60"
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
            className="rounded-2xl border border-border bg-surface/30 p-6 transition-colors hover:bg-surface/60"
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
      title="Selected work."
      intro="From IVF growth engines to district-scale public health programs — outcome-led, system-built."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {projects.map((p) => (
          <article
            key={p.title}
            className="group rounded-2xl border border-border bg-surface/30 p-6 md:p-8 transition-colors hover:bg-surface/60"
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
              <li key={c} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-2 inline-block h-1.5 w-1.5 flex-none rounded-full bg-[color:var(--accent-indigo)]" />
                <span>{c}</span>
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
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
            >
              <Phone className="h-4 w-4" /> {PHONE}
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
