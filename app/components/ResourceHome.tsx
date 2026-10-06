"use client";
import { resources } from "../data/resources";
import { useCommunityResources } from "../lib/useCommunityResources";
import { DirectoryExplorer } from "./DirectoryExplorer";
import { SiteHeader, SiteFooter } from "./SiteChrome";
import { WeeklySpotlight } from "./WeeklySpotlight";
export function ResourceHome({ lang = "zh" }: { lang?: "zh" | "en" }) {
  const community = useCommunityResources(lang);
  const en = lang === "en", prefix = en ? "/en" : "";
  return <main id="top" className="finder-home">
    <SiteHeader lang={lang} />
    <section className="finder-shell" aria-labelledby="finder-title">
      <div className="finder-heading"><span>PIONEER / {en ? "RESOURCE FINDER" : "创业资源"}</span><h1 id="finder-title">{en ? "Find resources for your startup" : "找到你需要的创业资源"}</h1><p>{en ? "Search programs, investors, incubators and events. Browse without signing in." : "搜索计划、投资机构、孵化器与活动。浏览无需登录。"}</p></div>
      <DirectoryExplorer resources={[...resources, ...community.resources]} lang={lang} />
      {community.state === "error" && <p role="status">{en ? "Community additions could not load. Curated resources are available." : "社区新增资源暂时无法加载，已有资源仍可查找。"} <button onClick={community.retry}>{en ? "Retry" : "重试"}</button></p>}
      <div className="finder-help"><a href={`${prefix}/knowledge`}>{en ? "Founder guides" : "创业指南"} →</a><a href={`${prefix}/workspace`}>{en ? "Saved resources & project tasks" : "已收藏资源与项目任务"} →</a><a href={`${prefix}/submit`}>{en ? "Suggest a resource" : "提交资源"} →</a></div>
      <WeeklySpotlight lang={lang} />
    </section>
    <SiteFooter lang={lang} />
  </main>;
}
