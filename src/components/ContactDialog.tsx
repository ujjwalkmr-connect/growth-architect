import { useEffect, useRef, useState } from "react";
import { Mail, ArrowUpRight, LoaderCircle, CheckCircle2, Download } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      remove: (id: string) => void;
      reset: (id: string) => void;
    };
  }
}
let captchaScript: Promise<void> | undefined;
function loadCaptcha() {
  if (window.turnstile) return Promise.resolve();
  if (!captchaScript)
    captchaScript = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        captchaScript = undefined;
        script.remove();
        reject(new Error("Security check could not load."));
      };
      document.head.appendChild(script);
    });
  return captchaScript;
}
const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed";
const inputClass =
  "mt-2 block w-full rounded-xl border border-border bg-surface/50 px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-cyan)]";
export function ContactDialog({
  resume = false,
  className = buttonClass,
  showTrigger = true,
}: {
  resume?: boolean;
  className?: string;
  showTrigger?: boolean;
}) {
  const [open, setOpen] = useState(
    () => !resume && new URLSearchParams(window.location.search).get("connect") === "1",
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showTrigger && (
        <DialogTrigger asChild>
          <button type="button" className={className}>
            {resume ? <Download size={16} /> : <Mail size={17} />}
            {resume ? "Download Resume" : "Connect Now"}
            {!resume && <ArrowUpRight size={17} />}
          </button>
        </DialogTrigger>
      )}
      <DialogContent className="w-[calc(100%-2rem)] max-w-xl max-h-[90dvh] overflow-y-auto rounded-2xl border-border bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {resume ? "Request my resume" : "Connect with Ujjwal"}
          </DialogTitle>
          <DialogDescription>
            {resume
              ? "Complete the form to unlock the PDF download."
              : "Send your enquiry without leaving this page."}
          </DialogDescription>
        </DialogHeader>
        <ContactForm resume={resume} />
      </DialogContent>
    </Dialog>
  );
}
export function ContactForm({ resume = false }: { resume?: boolean }) {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ message: string; downloadUrl?: string } | null>(null);
  const host = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  const submission = useRef({ key: "", fingerprint: "" });
  useEffect(() => {
    let stopped = false;
    if (siteKey)
      loadCaptcha()
        .then(() => {
          if (stopped || !host.current) return;
          widget.current = window.turnstile?.render(host.current, {
            sitekey: siteKey,
            action: "lead",
            theme: "dark",
            size: "compact",
            callback: (value: string) => setToken(value),
            "expired-callback": () => setToken(""),
            "error-callback": () => {
              setToken("");
              setError("The security check failed. Please refresh the page to retry.");
            },
          });
        })
        .catch(() => {
          if (!stopped) setError("The security check could not load. Please try again.");
        });
    return () => {
      stopped = true;
      if (widget.current) window.turnstile?.remove(widget.current);
    };
  }, [siteKey]);
  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setError("");
    const form = new FormData(e.currentTarget);
    const details = {
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "")
        .trim()
        .toLowerCase(),
      company: String(form.get("company") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      purpose: resume ? "resume" : String(form.get("purpose")),
      message: String(form.get("message") || "").trim(),
      consent: form.get("consent") === "on",
      website: String(form.get("website") || ""),
    };
    const fingerprint = JSON.stringify(details);
    if (submission.current.fingerprint !== fingerprint)
      submission.current = { key: crypto.randomUUID(), fingerprint };
    setBusy(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...details,
          turnstileToken: token,
          idempotencyKey: submission.current.key,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok)
        throw new Error(data.error || "Your message could not be saved. Please try again.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send. Please try again.");
      setToken("");
      if (widget.current) window.turnstile?.reset(widget.current);
    } finally {
      setBusy(false);
    }
  }
  if (result)
    return (
      <div role="status" className="py-6 space-y-5 text-center">
        <CheckCircle2 className="mx-auto text-[color:var(--accent-cyan)]" size={40} />
        <h3 className="text-xl font-bold">
          {resume ? "Your resume is ready." : "Thank you for connecting."}
        </h3>
        <p className="text-sm text-muted-foreground">{result.message}</p>
        {result.downloadUrl && (
          <a href={result.downloadUrl} className={buttonClass}>
            <Download size={17} />
            Download PDF
          </a>
        )}
        <p className="text-xs text-muted-foreground">
          {resume ? "Download permission lasts ten minutes." : "You can continue browsing."}
        </p>
      </div>
    );
  return (
    <form className="space-y-4" onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Your name *
          <input
            name="name"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          Email address *
          <input
            type="email"
            name="email"
            required
            maxLength={254}
            autoComplete="email"
            className={inputClass}
          />
        </label>
      </div>
      <label className="block text-sm">
        Phone number *
        <input
          type="tel"
          name="phone"
          required
          autoComplete="tel"
          inputMode="tel"
          maxLength={40}
          pattern={"[+]?[ .\\(\\)\\-]*(?:[0-9][ .\\(\\)\\-]*){7,15}"}
          title="Enter 7 to 15 digits, with a country code if applicable. Spaces, brackets and hyphens are accepted."
          placeholder="e.g. +91 98765 43210"
          className={inputClass}
        />
      </label>
      <label className="block text-sm">
        Organisation <span className="text-muted-foreground">(optional)</span>
        <input name="company" autoComplete="organization" maxLength={150} className={inputClass} />
      </label>
      {!resume && (
        <label className="block text-sm">
          Enquiry type
          <select name="purpose" className={inputClass} defaultValue="recruitment">
            <option value="recruitment">Recruitment opportunity</option>
            <option value="networking">Professional connection</option>
            <option value="consulting">Consulting Services</option>
            <option value="general">General enquiry</option>
          </select>
        </label>
      )}
      <label className="block text-sm">
        {resume ? "A note (optional)" : "Your message *"}
        <textarea
          name="message"
          required={!resume}
          minLength={resume ? 0 : 10}
          maxLength={3000}
          rows={3}
          className={inputClass}
        />
      </label>
      <div className="sr-only" aria-hidden="true">
        <label>
          Leave empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="flex items-start gap-3 text-xs text-muted-foreground">
        <input type="checkbox" required name="consent" className="mt-1 accent-cyan-400" />
        <span>
          I agree to use of my details to respond to this enquiry and send one acknowledgement.{" "}
          <a
            className="text-[color:var(--accent-cyan)] underline"
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy notice
          </a>
        </span>
      </label>
      {siteKey && <div ref={host} />}
      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy || !siteKey || !token}
        className={buttonClass + " w-full"}
      >
        {busy ? (
          <>
            <LoaderCircle size={17} className="animate-spin" />
            Saving your enquiry
          </>
        ) : resume ? (
          "Submit & unlock resume"
        ) : (
          "Send message"
        )}
      </button>
    </form>
  );
}
