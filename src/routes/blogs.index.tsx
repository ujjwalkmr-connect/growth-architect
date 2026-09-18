import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Nav, Section, Footer } from "./index";
import { PageLinks } from "@/components/PageLinks";
import { posts } from "@/lib/posts";
export const Route = createFileRoute("/blogs/")({
  head: () => ({ meta: [{ title: "Blogs — Ujjwal Kumar" }] }),
  component: Blogs,
});
function Blogs() {
  const [query, setQuery] = useState("");
  const visible = posts.filter((p) =>
    (p.title + " " + p.category + " " + p.excerpt).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav standalone />
      <main className="pt-20">
        <Section
          eyebrow="Blogs"
          title="Notes on growth, systems and operations."
          intro="Ideas and lessons from the work."
        >
          <label className="block mb-8 text-sm text-muted-foreground">
            Search articles
            <input
              className="mt-2 block w-full max-w-md rounded-xl border border-border bg-surface/30 px-4 py-3 text-foreground"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Title, topic or keyword"
            />
          </label>
          {visible.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visible.map((p) => (
                <a
                  className="rounded-2xl border border-border bg-surface/30 p-6 md:p-8 transition-all hover:-translate-y-1 hover:border-[color:var(--accent-cyan)]/40"
                  key={p.slug}
                  href={"/blogs/" + p.slug}
                >
                  <div className="text-xs uppercase tracking-wider text-[color:var(--accent-cyan)]">
                    {p.category}
                  </div>
                  <h2 className="mt-3 text-2xl font-bold">{p.title}</h2>
                  <p className="mt-4 text-sm text-muted-foreground">{p.excerpt}</p>
                  <div className="mt-6 flex justify-between text-sm text-muted-foreground">
                    <time>{p.publishedAt}</time>
                    <ArrowUpRight size={18} />
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-surface/30 p-8">
              <h2 className="text-xl font-bold">
                {posts.length ? "No matching articles." : "Articles are on their way."}
              </h2>
              <p className="mt-3 text-muted-foreground">
                {posts.length
                  ? "Try another search."
                  : "This space will hold my writing on growth, marketing operations and automation."}
              </p>
            </div>
          )}
        </Section>
        <PageLinks />
      </main>
      <Footer />
    </div>
  );
}

