import { createFileRoute } from "@tanstack/react-router";
import { Nav, Section, Footer } from "./index";
export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy — Ujjwal Kumar" }] }),
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <Nav standalone />
      <main className="pt-20">
        <Section eyebrow="Privacy" title="How enquiries are handled.">
          <div className="max-w-3xl space-y-6 text-muted-foreground">
            <p>
              Forms collect your name, email, phone number, optional organisation, message,
              enquiry purpose and consent. Requests are saved to a private Google Sheet and used to
              respond to you and send one acknowledgement. This does not subscribe you to a mailing
              list.
            </p>
            <p>
              Vercel hosts the website. Google Apps Script processes the records and sends
              notifications from the owner's Google account. Cloudflare Turnstile processes security
              signals to prevent spam. A keyed hash of your connection address, request identifiers
              and delivery states support rate limits and deduplication.
            </p>
            <p>
              A successful resume request creates a signed, short-lived download cookie. Resume
              files and form records are not public website assets. The owner intends to review and
              remove enquiry records after 12 months unless an ongoing conversation requires
              retention.
            </p>
            <p>
              For access, correction or deletion requests, email{" "}
              <a className="text-[color:var(--accent-cyan)]" href="mailto:ujjwalkmr@outlook.com">
                ujjwalkmr@outlook.com
              </a>
              . Please do not include sensitive information in the contact form.
            </p>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  ),
});
