import React, { useState, useMemo } from "react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;
const TARGET_EMAIL = import.meta.env.VITE_TARGET_EMAIL as string;

type FieldErrors = {
  email?: string;
  telegram?: string;
  message?: string;
  consent?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const TELEGRAM_RE = /^@?[a-zA-Z0-9_]{5,}$/;

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "fail">(null);

  const canSubmit = useMemo(() => {
    const hasContact =
      (email && EMAIL_RE.test(email)) || (telegram && TELEGRAM_RE.test(telegram));
    const msgOk = message.trim().length >= 20 && message.trim().length <= 2000;
    return hasContact && msgOk && consent && !submitting;
  }, [email, telegram, message, consent, submitting]);

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!email && !telegram) {
      next.email = "Укажите email или Telegram";
      next.telegram = "Укажите email или Telegram";
    }
    if (email && !EMAIL_RE.test(email)) next.email = "Некорректный email";
    if (telegram && !TELEGRAM_RE.test(telegram))
      next.telegram = "Некорректный @ник";
    const m = message.trim();
    if (m.length < 20) next.message = "Минимум 20 символов";
    else if (m.length > 2000) next.message = "Максимум 2000 символов";
    if (!consent) next.consent = "Нужно согласие на обработку данных";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(null);
    if (!validate()) return;
    setSubmitting(true);

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          to_email: TARGET_EMAIL,
          from_email: email || "(не указан)",
          from_telegram: telegram || "(не указан)",
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
      console.error(err);
      setSent("fail");
    } finally {
      setSubmitting(false);
    }
  }

  const fieldBase =
    "peer w-full rounded-xl px-3 py-3 outline-none transition border bg-[var(--card)] text-[color:var(--fg)] border-[var(--border)] focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--ring),transparent_70%)] focus:border-[var(--ring)]";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-2xl w-full relative rounded-2xl p-6 shadow"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in oklab, var(--accent) 22%, transparent), color-mix(in oklab, var(--bg) 86%, var(--accent) 4%))",
        border: "1px solid color-mix(in oklab, var(--border), var(--accent) 12%)",
        boxShadow:
          "0 8px 28px -16px color-mix(in oklab, var(--glow), transparent 40%), inset 0 0 0 1px color-mix(in oklab, var(--chip-border), transparent 50%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          padding: 1,
          background:
            "conic-gradient(from var(--angle), var(--accent), color-mix(in oklab, var(--accent), white 30%), var(--accent))",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          animation: "gradient-flow 9s linear infinite",
        }}
      />

      <div className="grid gap-5 relative">
        <div className="grid md:grid-cols-2 gap-5">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${fieldBase} ${errors.email ? "border-red-500" : ""}`}
              placeholder=" "
            />
            <label
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-70 transition-all
                         peer-focus:top-1 peer-focus:text-xs peer-focus:opacity-100
                         peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs"
            >
              Email
            </label>
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>

          {/* Telegram */}
          <div className="relative">
            <input
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              className={`${fieldBase} ${errors.telegram ? "border-red-500" : ""}`}
              placeholder=" "
            />
            <label
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-70 transition-all
                         peer-focus:top-1 peer-focus:text-xs peer-focus:opacity-100
                         peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs"
            >
              Telegram
            </label>
            {errors.telegram && <p className="mt-1 text-xs text-red-400">{errors.telegram}</p>}
          </div>
        </div>

        {/* Message */}
        <div className="relative">
          <textarea
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${fieldBase} resize-y min-h-[140px] ${errors.message ? "border-red-500" : ""}`}
            placeholder=" "
          />
          <label
            className="pointer-events-none absolute left-3 top-3 text-sm opacity-70 transition-all
                       peer-focus:top-2 peer-focus:text-xs peer-focus:opacity-100
                       peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs"
          >
            Опишите задачу
          </label>
          <div className="mt-1 flex items-center justify-between text-xs opacity-80">
            <span>{message.trim().length}/2000</span>
            {errors.message && <p className="text-red-400">{errors.message}</p>}
          </div>
        </div>

        {/* Consent */}
        <div className="flex items-start gap-2">
          <input
            id="consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="consent" className="text-sm opacity-90">
            Согласен на обработку персональных данных.
          </label>
        </div>
        {errors.consent && <p className="text-xs text-red-400">{errors.consent}</p>}

        {/* Button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className={`btn btn-primary px-4 py-2 rounded-xl ${canSubmit ? "" : "opacity-60 cursor-not-allowed"}`}
          >
            {submitting ? "Отправка…" : "Отправить"}
          </button>
          {sent === "ok" && (
            <span className="text-sm text-[color:var(--accent)]">
              ✨ Заявка отправлена!
            </span>
          )}
          {sent === "fail" && (
            <span className="text-sm text-red-400">
              Ошибка отправки. Попробуйте позже.
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
