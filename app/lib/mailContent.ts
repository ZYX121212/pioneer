import { getActionableWeekly, weeklyIssue } from "../data/weekly";
import { pioneerGuides } from "../data/knowledge";
import { getEnglishGuide } from "../data/knowledgeEnglish";
export type MailEdition = { id: string; topic: "weekly" | "cases"; title: string; validUntil: string | null; zh: { subject: string; text: string }; en: { subject: string; text: string } };
export function buildMailEdition(topic: string, guideSlug: string, origin: string, now = new Date()): MailEdition {
  if (topic === "weekly") {
    const entries = getActionableWeekly(now); if (!entries.length) throw new Error("本期机会已过核验期，先更新周刊再发送。");
    const content = (lang: "zh" | "en") => { const en = lang === "en", prefix = en ? "/en" : ""; return { subject: `Pioneer ${en ? "Weekly opportunities" : "本周机会"} ${weeklyIssue.id} · ${weeklyIssue.range}`, text: [weeklyIssue.summary[lang], en ? `Sources checked ${weeklyIssue.checkedAt}; recheck eligibility before acting.` : `官方来源核验于 ${weeklyIssue.checkedAt}；行动前仍需确认资格与最新状态。`, ...entries.map(entry => [entry.name, entry[lang].deadline, entry[lang].bestFor, entry[lang].whyNow, entry[lang].sourceNote, ...entry.sources.map(source => source.href)].join("\n")), `${origin}${prefix}/weekly`, `${origin}${prefix}/weekly/deadlines.ics`].join("\n\n") }; };
    return { id: `weekly-${weeklyIssue.id}`, topic: "weekly", title: `本周机会 ${weeklyIssue.id}`, validUntil: new Date(Math.min(Date.parse(weeklyIssue.validUntil), ...entries.map(entry => Date.parse(entry.expiresAt)))).toISOString(), zh: content("zh"), en: content("en") };
  }
  const zh = pioneerGuides.find(guide => guide.slug === guideSlug), en = getEnglishGuide(guideSlug);
  if (topic !== "cases" || !zh || !en) throw new Error("请选择已发布的双语创业指南。");
  const content = (lang: "zh" | "en") => { const guide = lang === "en" ? en : zh; return { subject: `Pioneer · ${guide.title}`, text: [guide.description, ...(guide.outcome ?? []), `${origin}${lang === "en" ? "/en" : ""}/knowledge/${guide.slug}`, ...(guide.sources ?? []).map(source => `${source.publisher} · ${source.title}\n${source.url}`)].join("\n\n") }; };
  return { id: `guide-${zh.slug}-${zh.updated.replace(/[^0-9]/g, "")}`, topic: "cases", title: zh.title, validUntil: null, zh: content("zh"), en: content("en") };
}
