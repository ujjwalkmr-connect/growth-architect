import { createFileRoute, notFound } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import content from "virtual:portfolio-content";
import { Nav, Section, Footer } from "./index";
import { PageLinks } from "@/components/PageLinks";
export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = content.projects.find((p) => p.id === params.slug);
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title + " — Ujjwal Kumar" },
      { name: "description", content: loaderData?.body },
    ],
  }),
  component: ProjectDetail,
});
function ProjectDetail() {
  const p = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav standalone />
      <main className="pt-20">
        <Section eyebrow={p.org} title={p.title} intro={p.body}>
          <a
            href="/projects"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[color:var(--accent-cyan)]"
          >
            <ArrowLeft size={16} />
            All projects
          </a>
          {p.cover && (
            <figure className="mb-10 overflow-hidden rounded-2xl border border-border bg-surface/30">
              <img
                src={p.cover}
                alt={p.coverAlt || p.title}
                className="w-full max-h-[600px] object-contain"
              />
            </figure>
          )}
          <div className="grid gap-8 lg:grid-cols-3">
            <article className="lg:col-span-2 rounded-2xl border border-border bg-surface/30 p-6 md:p-8">
              <div className="space-y-5 text-sm md:text-base leading-relaxed text-muted-foreground [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-[color:var(--accent-cyan)] [&_pre]:overflow-x-auto [&_pre]:p-4 [&_img]:rounded-xl [&_table]:block [&_table]:overflow-x-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
                  {p.details || p.body}
                </ReactMarkdown>
              </div>
            </article>
            <aside className="rounded-2xl border border-border bg-surface/30 p-6 md:p-8 self-start">
              {p.role && (
                <div className="mb-6">
                  <h2 className="font-bold">My contribution</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{p.role}</p>
                </div>
              )}
              {p.period && (
                <div className="mb-6">
                  <h2 className="font-bold">Period</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{p.period}</p>
                </div>
              )}
              {p.outcome && (
                <div className="mb-6">
                  <h2 className="font-bold">Outcome & context</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{p.outcome}</p>
                </div>
              )}
              <h2 className="font-bold">Tools & focus</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-surface/60 px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <a
                href="/contact?connect=1"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
              >
                Connect Now
                <ArrowUpRight size={16} />
              </a>
            </aside>
          </div>
          {!!p.gallery?.length && (
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {p.gallery.map((image, i) => (
                <figure
                  key={i}
                  className="overflow-hidden rounded-2xl border border-border bg-surface/30"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={image.image}
                      alt={image.alt || p.title}
                      loading="lazy"
                      className={`h-full w-full ${image.fit === "contain" ? "object-contain" : "object-cover"}`}
                      style={{ objectPosition: image.position || "center" }}
                    />
                  </div>
                  {image.caption && (
                    <figcaption className="p-5 text-sm text-muted-foreground">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </Section>
        <PageLinks />
      </main>
      <Footer />
    </div>
  );
}
