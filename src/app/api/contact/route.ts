import { Resend } from "resend";
import { NextResponse } from "next/server";

const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_COUNTRY = 80;
const MIN_COUNTRY = 2;
const MAX_MESSAGE = 5000;
const MIN_MESSAGE = 10;

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const to =
    process.env.CONTACT_TO_EMAIL?.trim() || "valentinacxzu@gmail.com";

  if (!apiKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  if (!from) {
    return NextResponse.json({ error: "from_not_configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { name, email, country, message, website } = body as Record<
    string,
    unknown
  >;

  if (typeof website === "string" && website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof country !== "string" ||
    typeof message !== "string"
  ) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  const nameTrim = name.trim();
  const emailTrim = email.trim();
  const countryTrim = country.trim();
  const messageTrim = message.trim();

  if (!nameTrim || nameTrim.length > MAX_NAME) {
    return NextResponse.json({ error: "invalid_name" }, { status: 400 });
  }
  if (!emailTrim || emailTrim.length > MAX_EMAIL || !isValidEmail(emailTrim)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (
    countryTrim.length < MIN_COUNTRY ||
    countryTrim.length > MAX_COUNTRY
  ) {
    return NextResponse.json({ error: "invalid_country" }, { status: 400 });
  }
  if (
    messageTrim.length < MIN_MESSAGE ||
    messageTrim.length > MAX_MESSAGE
  ) {
    return NextResponse.json({ error: "invalid_message" }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  const subject = `Web contact — ${nameTrim}`;

  const text = [
    `Name: ${nameTrim}`,
    `Email: ${emailTrim}`,
    `Country / region: ${countryTrim}`,
    "",
    messageTrim,
  ].join("\n");

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(nameTrim)}</p>
    <p><strong>Email:</strong> ${escapeHtml(emailTrim)}</p>
    <p><strong>Country / region:</strong> ${escapeHtml(countryTrim)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(messageTrim).replace(/\n/g, "<br/>")}</p>
  `;

  try {
    const result = await resend.emails.send({
      from,
      to: [to],
      replyTo: emailTrim,
      subject,
      text,
      html,
    });

    if (result.error) {
      console.error("[contact] Resend error:", result.error);
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Exception:", err);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
