"use client";

import { FormEvent, useState } from "react";
import { trackAudienceEvent } from "./AudienceCounter";

type FailureCaseSignupProps = { lang?: "zh" | "en" };

const copy = {
  zh: {
    eyebrow: "FAILURE CASE NOTES",
    title: "每两周，拆解一个失败项目。",
    description: "不消费失败，也不只讲结局。我们追踪最早失效的假设、被忽略的信号，以及本可以更早做出的决定。",
    items: ["失败时间线", "关键证据", "可执行预警"],
    placeholder: "你的邮箱",
    submit: "订阅失败案例",
    success: "订阅成功，下一篇案例见。",
    invalid: "请填写有效邮箱。",
    error: "暂时无法订阅，请稍后再试。",
  },
  en: {
    eyebrow: "FAILURE CASE NOTES",
    title: "One startup failure review, every two weeks.",
    description: "No failure theatre and no one-line verdicts. We trace the first broken assumption, the ignored signal and the decision that was still reversible.",
    items: ["Failure timeline", "Key evidence", "Actionable warning"],
    placeholder: "Your email",
    submit: "Get failure case notes",
    success: "Subscribed. See you in the next case.",
    invalid: "Enter a valid email address.",
    error: "Subscription is temporarily unavailable. Please try again.",
  },
} as const;

export function FailureCaseSignup({ lang = "zh" }: FailureCaseSignupProps) {
  const text = copy[lang];
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.includes("@")) {
      setStatus("error");
      setMessage(text.invalid);
      return;
    }

    const form = new FormData(event.currentTarget);
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          language: lang,
          sourcePath: `/${lang === "en" ? "en/" : ""}knowledge/failure-cases`,
          website: form.get("website"),
        }),
      });
      if (!response.ok) throw new Error("Unable to subscribe");
      setStatus("success");
      setMessage(text.success);
      setEmail("");
      trackAudienceEvent("newsletter:subscribe", `failure-cases:${lang}`);
    } catch {
      setStatus("error");
      setMessage(text.error);
    }
  }

  return (
    <section className="failure-signup" aria-labelledby={`failure-signup-${lang}`}>
      <div className="failure-signup-copy">
        <span>{text.eyebrow}</span>
        <h2 id={`failure-signup-${lang}`}>{text.title}</h2>
        <p>{text.description}</p>
      </div>
      <div className="failure-signup-action">
        <ul>{text.items.map((item) => <li key={item}>{item}</li>)}</ul>
        <form onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor={`failure-email-${lang}`}>{text.placeholder}</label>
          <input id={`failure-email-${lang}`} type="email" inputMode="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={text.placeholder} disabled={status === "submitting" || status === "success"} required />
          <input className="newsletter-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <button type="submit" disabled={status === "submitting" || status === "success"}>{status === "submitting" ? "…" : text.submit}</button>
        </form>
        <div className="failure-signup-feedback" aria-live="polite">{message}</div>
      </div>
    </section>
  );
}
