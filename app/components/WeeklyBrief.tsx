import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import { WeeklyShareActions } from "./WeeklyShareActions";
import { getActionableWeekly, isWeeklyCurrent, weeklyIssue, weeklyOpportunities, type WeeklyLanguage } from "../data/weekly";
import { siteOrigin } from "../lib/site";

export function weeklyMetadata(lang: WeeklyLanguage, archive = false): Metadata {
  const prefix = lang === "en" ? "/en" : "";
  const path = `${prefix}/weekly${archive ? "/archive/003" : ""}`;
  const title = lang === "en" ? "Founder opportunities | 2026.10.05 — Pioneer" : "创业机会核验期刊｜2026.10.05 — Pioneer";
  return {
    title, description: weeklyIssue.summary[lang],
    alternates: { canonical: path, languages: { "zh-CN": `/weekly${archive ? "/archive/003" : ""}`, en: `/en/weekly${archive ? "/archive/003" : ""}` } },
    // The previous issue's raster cover contains obsolete opportunity/date text.
    openGraph: { title, description: weeklyIssue.summary[lang], url: `${siteOrigin}${path}`, images: [] },
    twitter: { card: "summary", title, description: weeklyIssue.summary[lang], images: [] },
  };
}

export function WeeklyBrief({ lang, archive = false, now = new Date() }: { lang: WeeklyLanguage; archive?: boolean; now?: Date }) {
  const en = lang === "en";
  const prefix = en ? "/en" : "";
  const current = !archive && isWeeklyCurrent(now);
  const active = getActionableWeekly(now);
  const entries = current ? active : weeklyOpportunities;
  const copy = (zh: string, english: string) => en ? english : zh;
  const structuredData = { "@context": "https://schema.org", "@type": "ItemList", name: "Pioneer Weekly 003", dateModified: weeklyIssue.checkedAt, itemListElement: entries.map((entry, index) => ({ "@type": "ListItem", position: index + 1, name: entry.name, url: entry.url })) };
  return <main>
    <SiteHeader lang={lang} languageHref={`${en ? "" : "/en"}/weekly${archive ? "/archive/003" : ""}`} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <section className="weekly-hero">
      <div className="weekly-edition"><span>WEEKLY SIGNAL · {weeklyIssue.id}</span><strong>{weeklyIssue.range}</strong></div>
      <div className="weekly-hero-copy"><span className="section-index">FOUNDER OPPORTUNITY BRIEF</span><h1>{current ? copy("本周值得行动的", "Worth acting on this week") : copy("历史核验期刊", "Historical checked issue")}<br /><em>{copy(`${entries.length} 个创业机会`, `${entries.length} founder opportunities`)}</em></h1><p>{copy("为什么现在值得看、适合谁，以及今天应该完成什么。", "Why now, who it fits and what to finish today.")}</p></div>
      <aside className="weekly-principle"><span>{copy("本期判断原则", "SELECTION RULE")}</span><strong>{copy("时间敏感", "Time-sensitive")}</strong><strong>{copy("创业者可行动", "Founder-actionable")}</strong><strong>{copy("官方信息可核验", "Officially verifiable")}</strong><p>{copy("核验于 2026 年 10 月 5 日；本期有效至 10 月 11 日（北京时间）。行动前请再次查看官方页面。", "Checked October 5, 2026; valid through October 11 (Asia/Shanghai). Recheck official pages before acting.")}</p></aside>
    </section>
    {!current && <section className="weekly-share-band"><div><h2>{copy("历史记录 · 不代表当前可行动", "Historical record · availability needs rechecking")}</h2><p>{copy("本页保留 10 月 5 日的核验结果。已停止发布本期行动按钮和日历事件，请重新核验官方状态。", "This page preserves the October 5 check. Action buttons and calendar events are disabled for this historical issue. Recheck official availability.")}</p>{archive && <a href={`${prefix}/weekly`}>{copy("查看最新核验期 →", "Read the latest checked issue →")}</a>}</div></section>}
    <section className="weekly-summary" aria-label={copy("本周机会概览", "Weekly summary")}><div><strong>02</strong><span>{copy("申请截止", "APPLICATION DEADLINES")}</span><p>YC · Techstars NYC</p></div><div><strong>02</strong><span>{copy("活动日期", "EVENT DATES")}</span><p>Slush 365 · Slush 2026</p></div><div><strong>{current ? "04" : "00"}</strong><span>{copy("本期可行动", "CURRENT ACTIONS")}</span><p>{copy("截止日与活动日分别标注", "Deadlines and event dates labelled separately")}</p></div></section>
    {current && <section className="weekly-share-band"><div><span className="section-index">SAVE · SHARE · FOLLOW</span><h2>{copy("给机会一个明确的下一步。", "Give each opportunity a next step.")}</h2><p>{copy("把 2 个申请截止和 2 个活动日期加入日历；Techstars 的提醒仅含日期，不假设时区。", "Save two application cutoffs and two event dates. The Techstars reminder supplies a date, without assuming a timezone.")}</p></div><WeeklyShareActions lang={lang} /></section>}
    <section className="weekly-list">{entries.map((entry, index) => {
      const item = entry[lang];
      return <article className="weekly-signal" key={entry.id}><div className="weekly-signal-number"><span>{String(index + 1).padStart(2, "0")}</span><small>{item.signal}</small></div><div className="weekly-signal-main"><div className="weekly-deadline"><span>{current ? copy("10 月 5 日核验", "CHECKED OCT 5") : copy("历史窗口", "HISTORICAL WINDOW")}</span><strong>{item.deadline}</strong></div><span className="section-index">{entry.location}</span><h2>{entry.name}</h2><p className="weekly-signal-description">{item.description}</p><div className="weekly-judgment"><div><span>{copy("为什么是现在", "WHY NOW")}</span><p>{item.whyNow}</p></div><div><span>{copy("更适合谁", "BEST FOR")}</span><p>{item.bestFor}</p></div></div></div><aside className="weekly-action-card"><span>{current ? "TODAY'S ACTION" : "HISTORICAL CHECKLIST"}</span><h3>{current ? copy("今天完成这三步", "Finish these three steps") : copy("当期行动清单（历史）", "Original checklist")}</h3><ol>{item.action.map(step => <li key={step}>{step}</li>)}</ol><p>{item.sourceNote}</p>{entry.sources.map(source => <p key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label} ↗</a></p>)}{current && <a href={entry.url} target="_blank" rel="noreferrer" data-audience-event="weekly:official" data-audience-target={entry.id}>{copy("打开官方页面", "Open official page")} ↗</a>}</aside></article>;
    })}</section>
    <section className="weekly-share-band"><div><h2>{copy("历史归档", "ISSUE ARCHIVE")}</h2><p>{copy("旧窗口保留用于研究，不再作为当前机会。", "Past windows remain available for research.")}</p><a href={`${prefix}/weekly/archive/002`}>002 · 2026.07.30—08.05 →</a><p><a href={`${prefix}/weekly/archive/003`}>003 · {weeklyIssue.range} →</a></p></div></section>
    <SiteFooter lang={lang} />
  </main>;
}
