import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, Linkedin, MapPin, ArrowUpRight } from "lucide-react";
import { Nav, Section, Footer } from "./index";
import { PageLinks } from "@/components/PageLinks";
import { ContactDialog, ContactForm } from "@/components/ContactDialog";
export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Ujjwal Kumar" }] }),
  component: Contact,
});
function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav standalone />
      <main className="pt-20">
        <Section
          eyebrow="Contact"
          title="Let’s connect."
          intro="Have a recruitment opportunity, a question about my work, or a professional connection in mind?"
        >
          <div className="grid gap-8 md:grid-cols-2">
            <div className="self-start rounded-2xl border border-border bg-surface/30 p-8">
              <h2 className="text-xl font-bold">Ujjwal Kumar</h2>
              <div className="mt-6 space-y-5 text-sm text-muted-foreground">
                <a
                  className="flex gap-3 items-center hover:text-foreground"
                  href="mailto:ujjwalkmr@outlook.com"
                >
                  <Mail size={18} />
                  ujjwalkmr@outlook.com
                </a>
                <a
                  className="flex gap-3 items-center hover:text-foreground"
                  href="tel:+917762903717"
                >
                  <Phone size={18} />
                  +91 77629 03717
                </a>
                <a
                  className="flex gap-3 items-center hover:text-foreground"
                  href="https://www.linkedin.com/in/ujjwal-kmr/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin size={18} />
                  LinkedIn <ArrowUpRight size={15} />
                </a>
                <p className="flex gap-3 items-center">
                  <MapPin size={18} />
                  Ranchi, India
                </p>
              </div>
              <div className="mt-8">
                <ContactDialog resume />
              </div>
            </div>
            <div
              id="contact-form"
              className="scroll-mt-24 rounded-2xl border border-border bg-surface/30 p-8"
            >
              <h2 className="text-xl font-bold">Start a conversation.</h2>
              <p className="mt-4 mb-6 text-sm text-muted-foreground leading-relaxed">
                Share a little about your enquiry. I’ll receive your message and you’ll receive an
                acknowledgement by email.
              </p>
              <ContactForm />
            </div>
          </div>
          <ContactDialog showTrigger={false} />
        </Section>
        <PageLinks />
      </main>
      <Footer />
    </div>
  );
}
