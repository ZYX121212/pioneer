import { AudienceCount, PageViewCount } from "./AudienceCounter";
import { resources } from "../data/resources";

export function HomeIcon({ kind }: { kind: "globe" | "document" | "people" | "compass" | "database" | "search" }) {
  const paths = {
    globe: <><circle cx="16" cy="16" r="12" /><ellipse cx="16" cy="16" rx="5" ry="12" /><path d="M4 16h24M6 9h20M6 23h20" /></>,
    document: <><path d="M9 3h11l6 6v20H9a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3ZM19 3v7h7M12 15h8M12 20h8M12 25h5" /></>,
    people: <><circle cx="12" cy="10" r="5" /><path d="M2 28v-4a10 10 0 0 1 20 0v4ZM23 6a5 5 0 0 1 0 10M25 20a8 8 0 0 1 5 8" /></>,
    compass: <><circle cx="16" cy="16" r="12" /><path d="m21 11-3 7-7 3 3-7 7-3Z" /></>,
    database: <><ellipse cx="16" cy="7" rx="11" ry="5" /><path d="M5 7v18c0 7 22 7 22 0V7M5 16c0 7 22 7 22 0M5 22c0 7 22 7 22 0" /></>,
    search: <><circle cx="18" cy="13" r="9" /><path d="M11 20 3 29" /></>,
  };
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>;
}

function HomeMetricIcon({ index }: { index: number }) {
  const shapes = [
    <><circle cx="13" cy="9" r="6" /><path d="M2 29v-5a11 11 0 0 1 22 0v5ZM24 4a5 5 0 0 1 0 10v-10ZM26 17a9 9 0 0 1 5 9v3h-5V17Z" /></>,
    <path key="document" fillRule="evenodd" d="M7 1h14l9 9v18a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Zm13 2v9h8ZM10 16v2h13v-2Zm0 6v2h13v-2Zm0 5v2h7v-2Z" />,
    <><ellipse cx="16" cy="7" rx="12" ry="6" /><path d="M4 12c7 6 17 6 24 0v5c-7 6-17 6-24 0ZM4 21c7 6 17 6 24 0v4c0 8 24 8 24 0v-4Z" /></>,
    <path key="compass" fillRule="evenodd" d="M16 1a15 15 0 1 0 0 30 15 15 0 0 0 0-30Zm7 8-4 10-10 4 4-10 10-4ZM15 15l2 2 1-4-3 2Z" />,
  ];
  return <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">{shapes[index]}</svg>;
}

export function HomeFeatures({ lang }: { lang: "zh" | "en" }) {
  const rows = lang === "zh" ? [
    ["全球覆盖", "多个国家和地区"], ["核验记录", "日期与来源可查"],
    ["多元生态", "机构 · 活动 · 项目 · 资金"], ["开放共享", "公开资料无需注册"],
  ] : [["Global coverage", "Across countries & regions"], ["Review records", "Dates & sources included"], ["Startup ecosystem", "Programs, events & teams"], ["Open access", "Browse without an account"]];
  return <div className="home-features">{rows.map(([title, note], index) => <div key={title}><HomeIcon kind={(["globe", "document", "people", "compass"] as const)[index]} /><div><strong>{title}</strong><span>{note}</span></div></div>)}</div>;
}

export { InteractiveGlobe as HomeSignalPanel } from "./InteractiveGlobe";

export function HomeMetrics({ lang }: { lang: "zh" | "en" }) {
  const labels = lang === "zh" ? ["累计独立访客", "累计浏览次数", "站内整理档案", "独立资源目录"] : ["Unique visitors", "Page views", "Curated briefs", "Resource directories"];
  const values = [<AudienceCount key="visitors" />, <PageViewCount key="views" />, resources.length, 4];
  return <section className="home-metrics" aria-label={lang === "zh" ? "平台数据" : "Platform metrics"}>{labels.map((label, index) => <div className="home-metric" key={label}><HomeMetricIcon index={index} /><div><strong>{values[index]}</strong><span>{label}</span></div></div>)}<p><span aria-hidden="true">“</span>{lang === "zh" ? "可按资源类型、地区、创业阶段和标签筛选，找到适合你的机会。" : "Filter by resource type, location, founder stage and tags to find relevant opportunities."}<span aria-hidden="true">”</span></p></section>;
}
