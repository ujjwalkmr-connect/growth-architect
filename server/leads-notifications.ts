import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Lead } from "./leads.js";

export async function notificationTemplate(
  lead: Lead,
): Promise<{ subject: string; message: string }> {
  let settings: Record<string, unknown> = {};
  try {
    settings = JSON.parse(
      await readFile(path.join(process.cwd(), "content/settings/notifications.json"), "utf8"),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const subject = settings.acknowledgementSubject ?? "Thank you for contacting Ujjwal Kumar";
  const message =
    settings.acknowledgementMessage ??
    "Hello {name},\n\nThank you for your {purpose} enquiry. Your submission has been recorded. I will review it and reply when appropriate.\n\nUjjwal Kumar";
  if (
    typeof subject !== "string" ||
    subject.length > 160 ||
    /[\r\n\u0000]/.test(subject) ||
    typeof message !== "string" ||
    message.length > 8000
  )
    throw new Error("Invalid notification settings");
  const substitute = (text: string) =>
    text.replace(/\{(name|purpose)\}/g, (_, key: "name" | "purpose") =>
      key === "purpose" && lead.purpose === "consulting" ? "Consulting Services" : lead[key],
    );
  return { subject: substitute(subject), message: substitute(message) };
}
