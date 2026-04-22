"use client";

import emailjs from "@emailjs/browser";
import { useState } from "react";

type ErrorCode =
  | "invalid_name"
  | "invalid_email"
  | "invalid_country"
  | "invalid_message"
  | "send_failed"
  | "not_configured";

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

const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_COUNTRY = 80;
const MIN_COUNTRY = 2;
const MAX_MESSAGE = 5000;
const MIN_MESSAGE = 10;

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function validateFields(
  nameTrim: string,
  emailTrim: string,
  countryTrim: string,
  messageTrim: string,
): ErrorCode | null {
  if (!nameTrim || nameTrim.length > MAX_NAME) return "invalid_name";
  if (!emailTrim || emailTrim.length > MAX_EMAIL || !isValidEmail(emailTrim)) {
    return "invalid_email";
  }
  if (
    countryTrim.length < MIN_COUNTRY ||
    countryTrim.length > MAX_COUNTRY
  ) {
    return "invalid_country";
  }
  if (
    messageTrim.length < MIN_MESSAGE ||
    messageTrim.length > MAX_MESSAGE
  ) {
    return "invalid_message";
  }
  return null;
}

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

    if (honeypot.trim() !== "") {
      setStatus("success");
      setName("");
      setEmail("");
      setCountry("");
      setMessage("");
      return;
    }

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID?.trim() ?? "";
    const templateId =
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID?.trim() ?? "";
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.trim() ?? "";

    if (!serviceId || !templateId || !publicKey) {
      setStatus("error");
      setErrorCode("not_configured");
      return;
    }

    const nameTrim = name.trim();
    const emailTrim = email.trim();
    const countryTrim = country.trim();
    const messageTrim = message.trim();

    const validationError = validateFields(
      nameTrim,
      emailTrim,
      countryTrim,
      messageTrim,
    );
    if (validationError) {
      setStatus("error");
      setErrorCode(validationError);
      return;
    }

    try {
      const result = await emailjs.send(
        serviceId,
        templateId,
        {
          name: nameTrim,
          email: emailTrim,
          country: countryTrim,
          message: messageTrim,
        },
        { publicKey },
      );

      if (result.status !== 200) {
        setStatus("error");
        setErrorCode("send_failed");
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setCountry("");
      setMessage("");
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
