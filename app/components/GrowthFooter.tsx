"use client";

import { FormEvent, useState } from "react";
import { trackAudienceEvent } from "./AudienceCounter";

type GrowthFooterProps = { lang: "zh" | "en" };

const copy = {
  zh: {
    eyebrow: "WEEKLY OPPORTUNITY SIGNAL",
    title: "从官方来源，找到值得行动的创业机会。",
    description: "开放计划、科技大会、创业机构与实用指南。邮件发送尚未启用；先登记意向，当前可通过 RSS 和日历获取更新。",
    placeholder: "你的邮箱",
    submit: "登记邮件通知",
    success: "通知意向已保存。邮件发送尚未启用，请先使用 RSS 或日历。",
    error: "暂时无法订阅，请稍后再试。",
    invalid: "请填写有效邮箱。",
    share: "分享 Pioneer",
    copied: "链接已复制",
  },
  en: {
    eyebrow: "WEEKLY OPPORTUNITY SIGNAL",
    title: "Find founder opportunities through official sources.",
    description: "Programs, events, institutions and practical guides. Email delivery is not enabled yet; register your interest and use RSS or the calendar for updates.",
    placeholder: "Your email",
    submit: "Register for email updates",
    success: "Your interest is saved. Email delivery is not enabled yet; use RSS or the calendar.",
    error: "Subscription is temporarily unavailable. Please try again.",
    invalid: "Enter a valid email address.",
    share: "Share Pioneer",
    copied: "Link copied",
  },
} as const;

export function GrowthFooter({ lang }: GrowthFooterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const text = copy[lang];

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
          sourcePath: window.location.pathname,
          website: form.get("website"),
        }),
      });

      if (!response.ok) throw new Error("Unable to subscribe");
      setStatus("success");
      setMessage(text.success);
      setEmail("");
      trackAudienceEvent("newsletter:subscribe", lang);
    } catch {
      setStatus("error");
      setMessage(text.error);
    }
  }

  async function handleShare() {
    const shareData = {
      title: "Pioneer",
      text: lang === "zh" ? "全球创业资源与创业指南" : "Global startup resources and founder briefs",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setMessage(text.copied);
      }
      trackAudienceEvent("share:site", window.location.pathname);
    } catch {
      // Cancelling the system share sheet is not an error the visitor needs to see.
    }
  }

  return (
    <section className="growth-footer" aria-labelledby={`growth-footer-${lang}`}>
      <div className="growth-footer-copy">
        <span>{text.eyebrow}</span>
        <h2 id={`growth-footer-${lang}`}>{text.title}</h2>
        <p>{text.description}</p><p><a href={lang === "en" ? "/en/feed.xml" : "/feed.xml"}>RSS</a> · <a href={lang === "en" ? "/en/weekly/deadlines.ics" : "/weekly/deadlines.ics"}>{lang === "en" ? "Deadline calendar" : "截止日历"}</a></p>
      </div>
      <div className="growth-footer-actions">
        <form onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor={`newsletter-email-${lang}`}>{text.placeholder}</label>
          <input
            id={`newsletter-email-${lang}`}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={text.placeholder}
            disabled={status === "submitting" || status === "success"}
            required
          />
          <input className="newsletter-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <button type="submit" disabled={status === "submitting" || status === "success"}>
            {status === "submitting" ? "…" : text.submit}
          </button>
        </form>
        <div className="growth-footer-feedback" aria-live="polite">{message}</div>
        <button className="share-site-button" type="button" onClick={handleShare}>{text.share} ↗</button>
      </div>
    </section>
  );
}
