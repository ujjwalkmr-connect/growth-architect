import {
  readPrivateResume,
  readResumeSettings,
  RESUME_COOKIE,
  verifyResumeToken,
} from "../server/resume.js";

const headers = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
};

function resumeCookie(request: Request): string | undefined {
  const values = (request.headers.get("cookie") || "")
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part.startsWith(`${RESUME_COOKIE}=`));
  // Duplicate permission cookies are ambiguous and must not grant access.
  return values.length === 1 ? values[0].slice(RESUME_COOKIE.length + 1) : undefined;
}

export async function GET(request: Request): Promise<Response> {
  try {
    const settings = await readResumeSettings();
    if (
      !verifyResumeToken(resumeCookie(request), process.env.RESUME_SIGNING_SECRET, settings.version)
    )
      return Response.json(
        { ok: false, error: "Please complete the resume request form first." },
        { status: 403, headers },
      );
    const pdf = await readPrivateResume(settings.file);
    return new Response(new Uint8Array(pdf), {
      headers: {
        ...headers,
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Ujjwal-Kumar-Resume.pdf"',
        "Content-Length": String(pdf.length),
      },
    });
  } catch {
    return Response.json(
      { ok: false, error: "The resume is temporarily unavailable." },
      { status: 503, headers },
    );
  }
}

