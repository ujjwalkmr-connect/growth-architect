import { createFileRoute } from "@tanstack/react-router";
import { Nav, Projects, Footer } from "./index";
import { PageLinks } from "@/components/PageLinks";
export const Route = createFileRoute("/projects/")({
  head: () => ({ meta: [{ title: "Projects — Ujjwal Kumar" }] }),
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <Nav standalone />
      <main className="pt-20">
        <Projects all />
        <PageLinks />
      </main>
      <Footer />
    </div>
  ),
});

