"use client";

import { useEffect, useState } from "react";
import { isWeeklyCurrent, weeklyIssue, type WeeklyLanguage } from "../data/weekly";

export function WeeklySpotlight({ lang = "zh" }: { lang?: WeeklyLanguage }) {
  // Same initial state for SSR and hydration; re-evaluate on mount and while open.
  const [current, setCurrent] = useState(false);
  useEffect(() => {
    const update = () => setCurrent(isWeeklyCurrent());
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);
  const en = lang === "en";
  return <section className="weekly-home-spotlight" aria-label={en ? "Weekly founder brief" : "创业机会核验期刊"}>
    <div className="weekly-home-index"><span>WEEKLY SIGNAL</span><strong>{weeklyIssue.id}</strong></div>
    <div><span>{weeklyIssue.range} · {en ? "CHECKED OCT 5, 2026" : "2026 年 10 月 5 日核验"}</span><h2>{current ? (en ? "4 startup opportunities worth acting on" : "本周值得行动的 4 个创业机会") : (en ? "Latest checked founder brief" : "最近一期 · 4 个创业机会核验")}</h2><p>{weeklyIssue.summary[lang]}</p><p>{en ? "Verification valid through Oct 11 (Asia/Shanghai); recheck availability afterward." : "核验有效至 10 月 11 日（北京时间），之后需重新核验。"}</p></div>
    <a href={en ? "/en/weekly" : "/weekly"} data-audience-event="weekly:open" data-audience-target="home-spotlight">{en ? "Read the checked brief" : "查看核验期刊"} <span aria-hidden="true">→</span></a>
  </section>;
}
