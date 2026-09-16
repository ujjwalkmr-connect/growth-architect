import { createFileRoute } from "@tanstack/react-router";
import { Nav, Experience, Footer } from "./index";
import { PageLinks } from "@/components/PageLinks";
export const Route = createFileRoute("/experience")({
  head: () => ({ meta: [{ title: "Experience — Ujjwal Kumar" }] }),
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <Nav standalone />
      <main className="pt-20">
        <Experience />
        <PageLinks />
      </main>
      <Footer />
    </div>
  ),
});

