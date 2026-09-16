import {
  clientHash,
  getLeadConfig,
  leadSchema,
  readLimitedJson,
  saveLead,
  trustedOrigin,
  verifyTurnstile,
} from "../server/leads.js";
import { notificationTemplate } from "../server/leads-notifications.js";
import {
  createResumeToken,
  checkPrivateResume,
  readResumeSettings,
  RESUME_COOKIE,
  RESUME_TTL_SECONDS,
} from "../server/resume.js";

const failure = (error: string, status: number) =>
  Response.json({ ok: false, error }, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request): Promise<Response> {
  let config;
  try {
    config = getLeadConfig();
  } catch {
    return failure(
      "This form is not configured yet. Please use the email link to contact me.",
      503,
    );
  }
  if (!trustedOrigin(request.headers.get("origin"), config))
    return failure("This request is not permitted.", 403);
  let input;
  try {
    input = leadSchema.safeParse(await readLimitedJson(request));
  } catch {
    return failure("Please submit a valid form within the size limit.", 400);
  }
  if (!input.success)
    return failure("Please check your details, message, consent and verification.", 400);
  const lead = input.data;
  try {
    if (!(await verifyTurnstile(lead.turnstileToken, config)))
      return failure("Verification failed. Please try the security check again.", 400);
    const resume = lead.purpose === "resume" ? await readResumeSettings() : undefined;
    if (resume) await checkPrivateResume(resume.file);
    await saveLead(
      lead,
      clientHash(request, config.bridgeSecret),
      await notificationTemplate(lead),
      config,
    );
    const headers = new Headers({ "Cache-Control": "no-store" });
    if (resume) {
      const token = createResumeToken(config.resumeSecret, resume.version);
      headers.set(
        "Set-Cookie",
        `${RESUME_COOKIE}=${token}; Path=/api/resume; Max-Age=${RESUME_TTL_SECONDS}; HttpOnly; SameSite=Strict${config.siteUrl.protocol === "https:" ? "; Secure" : ""}`,
      );
    }
    return Response.json(
      {
        ok: true,
        message: resume
          ? "Your request has been saved. Your resume download is ready."
          : "Your message has been saved. Thank you for getting in touch.",
        ...(resume ? { downloadUrl: "/api/resume" } : {}),
      },
      { headers },
    );
  } catch {
    return failure(
      "We could not confirm your request. Please retry with the same form or use the email link.",
      503,
    );
  }
}
