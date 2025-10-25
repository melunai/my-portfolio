import React, { useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import type{ JSX } from "react";

export type ContactFormProps = {
  /** получатель (по умолчанию — из DATA) */
  targetEmail?: string;
  /** плейсхолдер/подсказка для Telegram */
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

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

export default function ContactForm({
  targetEmail = (import.meta.env.VITE_TARGET_EMAIL as string) || "seon.takago@gmail.com",
  defaultTelegram = "@melunai",
}: ContactFormProps): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [telegram, setTelegram] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [sent, setSent] = useState<null | "ok" | "fail">(null);

  const canSubmit = useMemo<boolean>(() => {
    const hasContact =
      (email && EMAIL_RE.test(email)) || (telegram && TELEGRAM_RE.test(telegram));
    const len = message.trim().length;
    const msgOk = len >= 20 && len <= 2000;
    // строго boolean — без строк/undefined
    return Boolean(hasContact && msgOk && consent && !submitting);
  }, [email, telegram, message, consent, submitting]);

  function validate(): boolean {
    const next: FieldErrors = {};

    if (!email && !telegram) {
      next.email = "Укажите email или Telegram";
      next.telegram = "Укажите email или Telegram";
    }
    if (email && !EMAIL_RE.test(email)) next.email = "Некорректный email";
    if (telegram && !TELEGRAM_RE.test(telegram))
      next.telegram = "Некорректный @ник (мин. 5 символов, латиница/цифры/_)";

    const m = message.trim();
    if (m.length < 20) next.message = "Опишите задачу подробнее (минимум 20 символов)";
    else if (m.length > 2000) next.message = "Слишком длинное описание (максимум 2000 символов)";

    if (!consent) next.consent = "Необходимо согласие на обработку данных";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
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
            ? (telegram.startsWith("@") ? telegram : "@" + telegram)
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
      className="contact-form relative rounded-2xl p-6 md:p-8 shadow-lg overflow-hidden"
      style={{
        // плавный градиент: розовый → белый/почти-чёрный (в зависимости от темы)
        background:
          "linear-gradient(145deg, color-mix(in oklab, var(--accent) 20%, transparent), color-mix(in oklab, var(--bg) 85%, var(--accent) 8%))",
        border:
          "1px solid color-mix(in oklab, var(--border), var(--accent) 18%)",
        boxShadow:
          "0 8px 32px -12px color-mix(in oklab, var(--glow), transparent 60%)",
      }}
    >
      {/* Мягкое боковое свечение — без масок и артефактов */}
      <div
        aria-hidden
        className="absolute -inset-[2px] rounded-2xl opacity-70 blur-xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 10% 20%, color-mix(in oklab, var(--accent), transparent 50%) 0%, transparent 60%), radial-gradient(circle at 90% 80%, color-mix(in oklab, var(--accent), transparent 50%) 0%, transparent 60%)",
        }}
      />

      <div className="relative grid gap-5">
        {/* Две колонки вверху: email + telegram */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              inputMode="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className={`${fieldBase} ${errors.email ? "border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,.35)]" : ""}`}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "err-email" : undefined}
              placeholder=" "
            />
            <label
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-70 transition-all
                         peer-focus:top-1 peer-focus:text-xs peer-focus:opacity-100
                         peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs"
            >
              Email
            </label>
            {errors.email && (
              <p id="err-email" className="mt-1 text-xs text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          {/* Telegram */}
          <div className="relative">
            <input
              type="text"
              inputMode="text"
              value={telegram}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelegram(e.target.value)}
              className={`${fieldBase} ${errors.telegram ? "border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,.35)]" : ""}`}
              aria-invalid={Boolean(errors.telegram)}
              aria-describedby={errors.telegram ? "err-telegram" : undefined}
              placeholder=" "
            />
            <label
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-70 transition-all
                         peer-focus:top-1 peer-focus:text-xs peer-focus:opacity-100
                         peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs"
            >
              Telegram ({defaultTelegram})
            </label>
            {errors.telegram && (
              <p id="err-telegram" className="mt-1 text-xs text-red-400">
                {errors.telegram}
              </p>
            )}
          </div>
        </div>

        {/* Сообщение */}
        <div className="relative">
          <textarea
            rows={6}
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            className={`${fieldBase} resize-y min-h-[140px] ${errors.message ? "border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,.35)]" : ""}`}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "err-message" : undefined}
            placeholder=" "
          />
          <label
            className="pointer-events-none absolute left-3 top-3 text-sm opacity-70 transition-all
                       peer-focus:top-2 peer-focus:text-xs peer-focus:opacity-100
                       peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs"
          >
            Опишите задачу (минимум 20 символов)
          </label>
          <div className="mt-1 flex items-center justify-between text-xs opacity-80">
            <span>{message.trim().length}/2000</span>
            {errors.message && (
              <p id="err-message" className="text-red-400">
                {errors.message}
              </p>
            )}
          </div>
        </div>

        {/* Согласие */}
        <div className="flex items-start gap-2">
          <input
            id="consent"
            type="checkbox"
            checked={consent}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConsent(e.target.checked)}
            className="mt-1"
          />
        <label htmlFor="consent" className="text-sm opacity-90">
            Согласен на обработку персональных данных для ответа на заявку.
          </label>
        </div>
        {errors.consent && (
          <p className="text-xs text-red-400">{errors.consent}</p>
        )}

        {/* Действия */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className={`btn btn-primary px-4 py-2 rounded-xl ${
              canSubmit ? "" : "opacity-60 cursor-not-allowed"
            }`}
            aria-busy={submitting}
          >
            {submitting ? "Отправка…" : "Отправить заявку"}
          </button>

          {sent === "ok" && (
            <span
              className="text-sm"
              style={{
                color: "color-mix(in oklab, var(--accent), white 20%)",
              }}
            >
              Готово! Я получил заявку ✨
            </span>
          )}
          {sent === "fail" && (
            <span className="text-sm" style={{ color: "rgb(248 113 113)" }}>
              Ошибка отправки. Напишите на {targetEmail}.
            </span>
          )}
        </div>

        <p className="text-xs opacity-75">
          * Можно указать только email или только Telegram — достаточно одного способа связи.
        </p>
      </div>
    </form>
  );
}
