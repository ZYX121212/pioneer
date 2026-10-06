import type { Resource } from "../data/resources";
import { getEnglishResource } from "../data/english";
import { resourceFreshness } from "./resourceFreshness";

export type CardFact = { label: string; value: string; icon: "calendar" | "people" | "building" | "money" | "layers" };

/** Summaries use documented fields; missing amounts or eligibility are never inferred from a brand. */
export function resourceCardSummary(resource: Resource, lang: "zh" | "en" = "zh", now = new Date()): [CardFact, CardFact] {
  const english = lang === "en" ? getEnglishResource(resource.slug) : undefined;
  const copy = english ?? resource;
  const label = (zh: string, en: string) => lang === "en" ? en : zh;
  const missing = label("未提供", "Not supplied");
  const pick = (pattern: RegExp) => copy.highlights.find(row => pattern.test(row.label) && row.value.trim())?.value;
  const fact = (zh: string, en: string, value: string | undefined, icon: CardFact["icon"]): CardFact => ({ label: label(zh, en), value: value || missing, icon });
  const historical = resourceFreshness(resource, now) === "historical";
  const audience = () => fact("适合团队", "Best for", copy.bestFor.find(value => value.trim()), "people");
  const stage = pick(/适合阶段|核心阶段|投资阶段|Stage/i);

  if (resource.type === "startup") {
    const stages = { seed: ["种子 / 早期", "Seed / early"], "series-a": ["A 轮", "Series A"], "series-bc": ["B–C 轮", "Series B–C"], growth: ["成长期", "Growth"], scale: ["规模化", "Scaled"] };
    const explicitStage = stage || (resource.stageType ? stages[resource.stageType][lang === "en" ? 1 : 0] : undefined);
    return [fact("项目阶段", "Project stage", explicitStage, "layers"), fact("所需资源", "Resource needs", pick(/所需资源|资源需求|Resource needs|Seeking/i) || label("未公开需求", "Needs not published"), "people")];
  }
  if (resource.type === "event") {
    const date = fact(historical ? "历史会期" : "大会时间", historical ? "Past event dates" : "Event dates", pick(/活动日期|大会时间|Dates|Event date/i) || copy.timing, "calendar");
    const scale = copy.highlights.find(row => /大会规模|预计规模|人数上限|展商|Scale|Capacity|Exhibitors|Attendance/i.test(row.label) && row.value.trim());
    const audienceFact = copy.highlights.find(row => /核心人群|适合目标|核心阶段|Audience|Goals|Stage/i.test(row.label) && row.value.trim());
    return [date, scale ? { label: scale.label, value: scale.value, icon: "people" } : audienceFact ? { label: audienceFact.label, value: audienceFact.value, icon: "people" } : audience()];
  }
  if (/投资机构|风险投资|Venture capital|Investor/i.test(resource.kind)) {
    return [fact("投资阶段", "Investment stage", stage, "layers"), fact("支票规模", "Check size", pick(/支票|Check|Cheque|Ticket size/i) || label("未统一公开", "No published standard"), "money")];
  }
  if (/创业园区|Startup campus/i.test(resource.kind)) {
    const count = pick(/项目数量|Programs|Program count/i);
    const sectors = pick(/覆盖领域|重点领域|重点方向|Focus areas|Sectors|Sector focus/i);
    return [fact("入驻规模", "Campus programs", count ? `${count}${/计划|项目|program/i.test(count) ? "" : label(" 创业计划", " programs")}` : undefined, "building"), sectors ? fact("覆盖领域", "Focus areas", sectors, "layers") : fact("生态重点", "Ecosystem focus", pick(/生态重点|^Focus$|Ecosystem focus/i), "people")];
  }
  if (resource.type === "organization") {
    const scale = copy.highlights.find(row => /公开孵化|服务规模|Incubat|Projects supported/i.test(row.label) && row.value.trim());
    const coverage = pick(/覆盖市场|覆盖范围|覆盖区域|Coverage|Markets|Reach/i);
    return [scale ? fact("孵化记录", "Incubation record", scale.value, "building") : fact("覆盖范围", "Coverage", coverage || copy.location, "building"), coverage && scale ? fact("覆盖市场", "Markets", coverage, "layers") : audience()];
  }
  if (/课程|公开知识|Course|Learning resource/i.test(resource.kind)) {
    return [fact("参与方式", "Format", pick(/参与形式|参与方式|Format/i) || copy.timing, "layers"), fact("学习成本", "Learning cost", pick(/学习成本|Cost/i), "money")];
  }
  const deadline = pick(/常规截止|申请截止|截止时间|截止日期|Deadline|Cutoff/i);
  return [fact(historical ? "历史截止" : "申请截止", historical ? "Past deadline" : "Apply by", deadline || (historical ? label("已结束，查看归档", "Ended; see archive") : label("按具体项目核对", "Check the specific program")), "calendar"), stage ? fact("适合阶段", "Stage fit", stage, "people") : audience()];
}
