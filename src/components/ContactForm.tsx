"use client";

import { useState } from "react";

type ErrorCode =
  | "invalid_name"
  | "invalid_email"
  | "invalid_country"
  | "invalid_message"
  | "invalid_fields"
  | "invalid_json"
  | "send_failed"
  | "not_configured"
  | "from_not_configured";

export type ContactFormMessages = {
  nameLabel: string;
  emailLabel: string;
  countryLabel: string;
  messageLabel: string;
  submit: string;
  sending: string;
  success: string;
  errorGeneric: string;
  errors: Record<ErrorCode, string>;
};

type Props = {
  messages: ContactFormMessages;
};

export function ContactForm({ messages: t }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorCode(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          country,
          message,
          website: honeypot,
        }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (res.ok && data.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setCountry("");
        setMessage("");
        return;
      }

      setStatus("error");
      const code = data.error as ErrorCode | undefined;
      if (code && code in t.errors) {
        setErrorCode(code);
      } else {
        setErrorCode("send_failed");
      }
    } catch {
      setStatus("error");
      setErrorCode("send_failed");
    }
  }

  return (
    <form className="contact__form" onSubmit={handleSubmit} noValidate>
      {status === "success" && (
        <p className="contact__form-status contact__form-status--success" role="status">
          {t.success}
        </p>
      )}
      <div className="contact__field">
        <label htmlFor="contact-name">{t.nameLabel}</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={120}
          required
          value={name}
          onChange={(e) => {
            if (status === "success") setStatus("idle");
            setName(e.target.value);
          }}
          className="contact__input"
        />
      </div>
      <div className="contact__field">
        <label htmlFor="contact-email">{t.emailLabel}</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
          value={email}
          onChange={(e) => {
            if (status === "success") setStatus("idle");
            setEmail(e.target.value);
          }}
          className="contact__input"
        />
      </div>
      <div className="contact__field">
        <label htmlFor="contact-country">{t.countryLabel}</label>
        <input
          id="contact-country"
          name="country"
          type="text"
          autoComplete="country-name"
          maxLength={80}
          required
          value={country}
          onChange={(e) => {
            if (status === "success") setStatus("idle");
            setCountry(e.target.value);
          }}
          className="contact__input"
        />
      </div>
      <div className="contact__field">
        <label htmlFor="contact-message">{t.messageLabel}</label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          maxLength={5000}
          value={message}
          onChange={(e) => {
            if (status === "success") setStatus("idle");
            setMessage(e.target.value);
          }}
          className="contact__textarea"
        />
      </div>
      <div className="contact__hp" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
      {status === "error" && (
        <p className="contact__form-status contact__form-status--error" role="alert">
          {errorCode && t.errors[errorCode]
            ? t.errors[errorCode]
            : t.errorGeneric}
        </p>
      )}
      <button
        type="submit"
        className="contact__submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? t.sending : t.submit}
      </button>
    </form>
  );
}
