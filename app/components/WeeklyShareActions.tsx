"use client";

import { useState } from "react";
import { trackAudienceEvent } from "./AudienceCounter";

export function WeeklyShareActions({ lang = "zh" }: { lang?: "zh" | "en" }) {
  const [status, setStatus] = useState<"idle" | "shared" | "copied" | "error">("idle");

  async function shareWeekly() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: lang === "en" ? "4 startup opportunities worth acting on this week | Pioneer" : "本周值得行动的 4 个创业机会｜Pioneer",
          text: lang === "en" ? "EF, Berkeley SkyDeck, AWS Activate and TechBBQ: timing, fit and the action to take today." : "EF、Berkeley SkyDeck、AWS Activate、TechBBQ：时间、适合谁，以及今天应该完成什么。",
          url,
        });
        trackAudienceEvent("weekly:share", "native");
        setStatus("shared");
        return;
      }

      await navigator.clipboard.writeText(url);
      trackAudienceEvent("weekly:share", "copy");
      setStatus("copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("error");
    }
  }

  return (
    <div className="weekly-share-actions" aria-label={lang === "en" ? "Save and share this issue" : "保存和分享本期机会"}>
      <button type="button" onClick={shareWeekly}>
        {lang === "en" ? (status === "shared" ? "Share opened" : status === "copied" ? "Link copied" : "Share this issue") : (status === "shared" ? "已打开分享" : status === "copied" ? "链接已复制" : "分享本期")}
        <span aria-hidden="true">↗</span>
      </button>
      <a
        href={lang === "en" ? "/en/weekly/deadlines.ics" : "/weekly/deadlines.ics"}
        data-audience-event="weekly:calendar"
        data-audience-target="issue-002"
      >
        {lang === "en" ? "Add deadlines" : "加入日历"} <span aria-hidden="true">↓</span>
      </a>
      <a
        href={lang === "en" ? "/en/feed.xml" : "/feed.xml"}
        data-audience-event="weekly:rss"
        data-audience-target="issue-002"
      >
        {lang === "en" ? "RSS feed" : "RSS 订阅"} <span aria-hidden="true">＋</span>
      </a>
      <span className="weekly-share-status" aria-live="polite">
        {status === "error" ? (lang === "en" ? "Unable to copy. Please copy the URL from your browser." : "暂时无法复制，请从浏览器地址栏复制链接") : ""}
      </span>
    </div>
  );
}
