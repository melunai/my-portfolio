import React, { useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import type { JSX } from "react";
import { useI18n } from "../i18n/i18n";

export type ContactFormProps = {
  targetEmail?: string;
  defaultTelegram?: string;
};

type FieldErrors = Partial<{
  email: string;
  telegram: string;
  message: string;
  consent: string;
}>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const TELEGRAM_RE = /^@?[a-zA-Z0-9_]{5,}$/;

const SERVICE_ID = import.meta.env
  .VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env
  .VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env
  .VITE_EMAILJS_PUBLIC_KEY as string | undefined;

export default function ContactForm({
  targetEmail = (import.meta.env.VITE_TARGET_EMAIL as string) ||
    "seon.takago@gmail.com",
  defaultTelegram = "@melunai",
}: ContactFormProps): JSX.Element {
  const { t } = useI18n();

  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "fail">(null);

  const canSubmit = useMemo(() => {
    const hasContact =
      (email && EMAIL_RE.test(email)) ||
      (telegram && TELEGRAM_RE.test(telegram));
    const len = message.trim().length;
    const msgOk = len >= 20 && len <= 2000;
    return Boolean(hasContact && msgOk && consent && !submitting);
  }, [email, telegram, message, consent, submitting]);

  function validate(): boolean {
    const next: FieldErrors = {};

    if (!email && !telegram) {
      const msg = t("sections.contact.errors.needOne");
      next.email = msg;
      next.telegram = msg;
    }

    if (email && !EMAIL_RE.test(email)) {
      next.email = t("sections.contact.errors.emailBad");
    }

    if (telegram && !TELEGRAM_RE.test(telegram)) {
      next.telegram = t("sections.contact.errors.tgBad");
    }

    const m = message.trim();
    if (m.length < 20) {
      next.message = t("sections.contact.errors.tooShort");
    } else if (m.length > 2000) {
      next.message = t("sections.contact.errors.tooLong");
    }

    if (!consent) {
      next.consent = t("sections.contact.errors.needConsent");
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(null);
    if (!validate()) return;
    setSubmitting(true);

    try {
      if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        throw new Error("EmailJS env missing");
      }

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          to_email: targetEmail,
          from_email: email || "(не указан)",
          from_telegram: telegram
            ? telegram.startsWith("@")
              ? telegram
              : "@" + telegram
            : "(не указан)",
          message,
        },
        { publicKey: PUBLIC_KEY }
      );

      setSent("ok");
      setEmail("");
      setTelegram("");
      setMessage("");
      setConsent(false);
      setErrors({});
    } catch (err) {
      console.error("[EmailJS error]", err);
      setSent("fail");
    } finally {
      setSubmitting(false);
    }
  }

  const fieldBase =
    "peer w-full rounded-xl px-3 py-3 outline-none transition border bg-[var(--card)] text-[color:var(--fg)] border-[var(--border)] focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--ring),transparent_70%)] focus:border-[var(--ring)]";

  const msgLen = message.trim().length;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="contact-form relative rounded-2xl p-6 md:p-8 shadow-lg overflow-hidden"
      style={{
        background:
          "linear-gradient(145deg, color-mix(in oklab, var(--accent) 20%, transparent), color-mix(in oklab, var(--bg) 85%, var(--accent) 8%))",
        border:
          "1px solid color-mix(in oklab, var(--border), var(--accent) 18%)",
        boxShadow:
          "0 8px 32px -12px color-mix(in oklab, var(--glow), transparent 60%)",
      }}
    >
      {/* Мягкое боковое свечение */}
      <div
        aria-hidden
        className="absolute -inset-[2px] rounded-2xl opacity-70 blur-xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 10% 20%, color-mix(in oklab, var(--accent), transparent 50%) 0%, transparent 60%), radial-gradient(circle at 90% 80%, color-mix(in oklab, var(--accent), transparent 50%) 0%, transparent 60%)",
        }}
      />

      <div className="relative grid gap-5">
        {/* Email и Telegram */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="relative">
            <input
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${fieldBase} ${
                errors.email
                  ? "border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,.35)]"
                  : ""
              }`}
              placeholder=" "
            />
            <label className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-70 transition-all peer-focus:top-1 peer-focus:text-xs peer-focus:opacity-100 peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs">
              {t("sections.contact.email")}
            </label>
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              inputMode="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              className={`${fieldBase} ${
                errors.telegram
                  ? "border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,.35)]"
                  : ""
              }`}
              placeholder=" "
            />
            <label className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-70 transition-all peer-focus:top-1 peer-focus:text-xs peer-focus:opacity-100 peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs">
              {t("sections.contact.telegram")} ({defaultTelegram})
            </label>
            {errors.telegram && (
              <p className="mt-1 text-xs text-red-400">{errors.telegram}</p>
            )}
          </div>
        </div>

        {/* Сообщение */}
        <div className="relative">
          <textarea
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${fieldBase} resize-y min-h-[140px] ${
              errors.message
                ? "border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,.35)]"
                : ""
            }`}
            placeholder=" "
          />
          <label className="pointer-events-none absolute left-3 top-3 text-sm opacity-70 transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:opacity-100 peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs">
            {t("sections.contact.messageLabel")}
          </label>
          <div className="mt-1 flex items-center justify-between text-xs opacity-80">
            <span>
              {msgLen}/2000&nbsp;{t("sections.contact.msgCounter")}
            </span>
            {errors.message && (
              <p className="text-red-400">{errors.message}</p>
            )}
          </div>
        </div>

        {/* Согласие */}
        <div className="flex items-start gap-2">
          <input
            id="consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="consent" className="text-sm opacity-90">
            {t("sections.contact.consent")}
          </label>
        </div>
        {errors.consent && (
          <p className="text-xs text-red-400">{errors.consent}</p>
        )}

        {/* Кнопка */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className={`btn btn-primary px-4 py-2 rounded-xl ${
              canSubmit ? "" : "opacity-60 cursor-not-allowed"
            }`}
            aria-busy={submitting}
          >
            {submitting
              ? t("sections.contact.sending")
              : t("sections.contact.submit")}
          </button>

          {sent === "ok" && (
            <span
              className="text-sm"
              style={{
                color:
                  "color-mix(in oklab, var(--accent), white 20%)",
              }}
            >
              {t("sections.contact.sentOk")}
            </span>
          )}
          {sent === "fail" && (
            <span
              className="text-sm"
              style={{ color: "rgb(248 113 113)" }}
            >
              {t("sections.contact.sentFail", targetEmail)}
            </span>
          )}
        </div>

        <p className="text-xs opacity-75 text-center">
          {t("sections.contact.footnote")}
        </p>

        {/* кастомная подпись reCAPTCHA — просто иконка */}
        <div className="mt-4 flex items-center gap-2 text-xs opacity-70 justify-center select-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="opacity-80"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2l7 4v6a9 9 0 11-14 0V6l7-4z"
            />
          </svg>
        </div>
      </div>
    </form>
  );
}
