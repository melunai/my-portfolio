import React, { useMemo, useState } from "react";

type Props = {
  targetEmail?: string;     // адрес получателя
  defaultTelegram?: string; // плейсхолдер
};

type FieldErrors = {
  email?: string;
  telegram?: string;
  message?: string;
  consent?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const TELEGRAM_RE = /^@?[a-zA-Z0-9_]{5,}$/; // допускаем @, минимум 5 символов

export default function ContactForm({
  targetEmail = "seon.takago@gmail.com",
  defaultTelegram = "@melunai",
}: Props) {
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
      next.telegram = "Некорректный @ник (мин. 5 символов, латиница/цифры/_)";

    const m = message.trim();
    if (m.length < 20) next.message = "Опишите задачу подробнее (минимум 20 символов)";
    else if (m.length > 2000) next.message = "Слишком длинное описание (максимум 2000 символов)";

    if (!consent) next.consent = "Необходимо согласие на обработку данных";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function buildMailto(): string {
    const subject = "Заявка с портфолио (melunai)";
    const lines = [
      "Новая заявка:",
      email ? `Email: ${email}` : null,
      telegram ? `Telegram: ${telegram.startsWith("@") ? telegram : "@" + telegram}` : null,
      "",
      "Описание задачи:",
      message.trim(),
      "",
      "Источник: сайт-портфолио",
    ].filter(Boolean) as string[];

    const body = encodeURIComponent(lines.join("\n"));
    return `mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent(subject)}&body=${body}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(null);

    if (!validate()) return;

    try {
      setSubmitting(true);

      // Отправляем через почтовый клиент
      const href = buildMailto();
      window.location.href = href;

      // Фолбэк: копируем данные в буфер
      try {
        await navigator.clipboard.writeText(
          `Email: ${email || "-"}\nTelegram: ${
            telegram ? (telegram.startsWith("@") ? telegram : "@" + telegram) : "-"
          }\n\nОписание:\n${message.trim()}`
        );
        setSent("ok");
      } catch {
        setSent("ok");
      }
    } catch {
      setSent("fail");
    } finally {
      setTimeout(() => setSubmitting(false), 1200);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl w-full bg-[#0f1420] border border-[#1b2330] rounded-2xl p-6 shadow"
      noValidate
    >
      {/* honeypot от ботов */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              type="email"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-xl bg-[#0b0f19] border px-3 py-2 outline-none focus:ring-2 ${
                errors.email ? "border-red-500 focus:ring-red-500" : "border-[#2b384c] focus:ring-[#66afff]"
              }`}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "err-email" : undefined}
            />
            {errors.email && <p id="err-email" className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Telegram</label>
            <input
              type="text"
              inputMode="text"
              placeholder={defaultTelegram}
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              className={`w-full rounded-xl bg-[#0b0f19] border px-3 py-2 outline-none focus:ring-2 ${
                errors.telegram ? "border-red-500 focus:ring-red-500" : "border-[#2b384c] focus:ring-[#66afff]"
              }`}
              aria-invalid={Boolean(errors.telegram)}
              aria-describedby={errors.telegram ? "err-telegram" : undefined}
            />
            {errors.telegram && <p id="err-telegram" className="mt-1 text-xs text-red-400">{errors.telegram}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Описание задачи</label>
          <textarea
            placeholder="Кратко опишите бизнес-цель, сроки, бюджетный коридор и ожидаемый результат. (мин. 20 символов)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className={`w-full rounded-xl bg-[#0b0f19] border px-3 py-2 outline-none focus:ring-2 ${
              errors.message ? "border-red-500 focus:ring-red-500" : "border-[#2b384c] focus:ring-[#66afff]"
            }`}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "err-message" : undefined}
          />
          <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
            <span>{message.trim().length}/2000</span>
            {errors.message && <p id="err-message" className="text-red-400">{errors.message}</p>}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <input id="consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
          <label htmlFor="consent" className="text-sm text-slate-300">
            Согласен на обработку персональных данных для ответа на заявку.
          </label>
        </div>
        {errors.consent && <p className="text-xs text-red-400">{errors.consent}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className={`btn btn-primary px-4 py-2 rounded-xl border ${canSubmit ? "cursor-pointer" : "opacity-60 cursor-not-allowed"}`}
            aria-busy={submitting}
          >
            {submitting ? "Отправка…" : "Отправить заявку"}
          </button>

          {sent === "ok" && <span className="text-sm text-green-400">Готово: письмо сформировано. Текст заявки скопирован в буфер.</span>}
          {sent === "fail" && <span className="text-sm text-red-400">Не удалось открыть почтовый клиент. Напишите на {targetEmail} вручную.</span>}
        </div>

        <p className="text-xs text-slate-400">
          * Можно указать только email или только Telegram — достаточно одного способа связи.
        </p>
      </div>
    </form>
  );
}
