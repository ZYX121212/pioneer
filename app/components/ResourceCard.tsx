import { freshnessLabel, resourceFreshness } from "../lib/resourceFreshness";
import { SaveResource } from "./SaveResource";
import { getEnglishResource } from "../data/english";
import type { Resource } from "../data/resources";

export function ResourceCard({ resource, lang = "zh" }: { resource: Resource; lang?: "zh" | "en" }) {
  const english = lang === "en" ? getEnglishResource(resource.slug) : undefined;
  const copy = english ?? resource;
  const detailHref = lang === "en"
    ? (resource.detailPath ? `/en${resource.detailPath}` : `/en/resources/${resource.slug}`)
    : resource.detailPath ?? `/resources/${resource.slug}`;
  const freshness = resourceFreshness(resource);
  const status = freshness === "reviewed" ? copy.status : freshnessLabel(freshness, lang);
  const detailLabel = lang === "en" ? "Research brief" : "整理详情";
  const sourceLine = resource.verification === "link-only" ? (lang === "en" ? `${resource.verified} · Community source check` : `${resource.verified} · 社区来源核验`) : lang === "en" ? `${resource.verified.replace("核验", "reviewed")} · Curated by Pioneer` : `${resource.verified} · Pioneer 已整理`;
  const stageLabels = {
    seed: lang === "en" ? "Seed / early" : "种子 / 早期",
    "series-a": lang === "en" ? "Series A" : "A 轮",
    "series-bc": lang === "en" ? "Series B–C" : "B–C 轮",
    growth: lang === "en" ? "Growth stage" : "成长期",
    scale: lang === "en" ? "Scaled" : "规模化",
  };

  return (
    <article className="resource-card">
      <div className="resource-card-top">
        <span className={`resource-logo logo-${resource.color}`}>{resource.monogram}</span>
        <div className="resource-status-group">
          <span className="resource-status"><i />{status}</span>
          <span className="resource-kind">{copy.kind}</span>
        </div>
      </div>
      <div className="resource-location">{copy.location}</div>
      {resource.stageType ? <div className={`resource-stage stage-${resource.stageType}`}>{stageLabels[resource.stageType]}<span>{lang === "en" ? "Company stage" : resource.fundingStage}</span></div> : null}
      <h3>{resource.name}</h3>
      <p className="resource-card-description">{copy.description}</p>
      <div className="finder-fit"><strong>{lang === "en" ? "Best for" : "适合"}</strong><span>{copy.bestFor[0] || (lang === "en" ? "Audience not supplied; check eligibility" : "未提供适合人群，请核对资格")}</span></div>
      <div className="tag-list">
        {copy.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <div className="resource-footer">
        <div className="resource-source">
          <strong>{freshness === "historical" ? (lang === "en" ? "Ended window · reference only" : "窗口已结束 · 仅供参考") : copy.timing}</strong>
          <span>{sourceLine}</span>
        </div>
        <a
          href={detailHref}
          aria-label={`${detailLabel}: ${resource.name}`}
          data-audience-event="resource:open"
          data-audience-target={resource.slug}
        >
          {detailLabel} <span aria-hidden="true">→</span>
        </a>
      </div>
      <SaveResource slug={resource.slug} lang={lang} />
    </article>
  );
}
