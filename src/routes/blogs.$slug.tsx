import { createFileRoute, notFound } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { posts } from "@/lib/posts";
import { Nav, Section, Footer } from "./index";
import { PageLinks } from "@/components/PageLinks";
export const Route = createFileRoute("/blogs/$slug")({
  loader: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => ({ meta: [{ title: loaderData?.title + " — Ujjwal Kumar" }] }),
  component: Article,
});
function Article() {
  const p = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav standalone />
      <main className="pt-20">
        <Section eyebrow={p.category} title={p.title} intro={p.excerpt}>
          <div className="max-w-3xl">
            <p className="mb-8 text-sm text-muted-foreground">
              Ujjwal Kumar · <time>{p.publishedAt}</time>
            </p>
            <article className="space-y-5 text-muted-foreground leading-relaxed [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:text-xl [&_a]:text-[color:var(--accent-cyan)] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-surface [&_pre]:p-5 [&_img]:rounded-xl [&_table]:block [&_table]:overflow-x-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
                {p.body}
              </ReactMarkdown>
            </article>
          </div>
        </Section>
        <PageLinks />
      </main>
      <Footer />
    </div>
  );
}

