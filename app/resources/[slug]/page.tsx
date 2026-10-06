import { DecisionProfileSections } from "../../components/DecisionProfileSections";
import { getDecisionProfile, hasDecisionProfile } from "../../data/decisionProfiles";
import { EventDecisionDetail } from "../../components/EventDecisionDetail";
import { ContentPoints } from "../../components/ContentPoints";
import { freshnessLabel, resourceFreshness } from "../../lib/resourceFreshness";
import { SaveResource } from "../../components/SaveResource";
import { ResourceReport } from "../../components/ResourceReport";
/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrganizationResearchDetail } from "../../components/OrganizationResearchDetail";
import { InvestmentResearchDetail } from "../../components/InvestmentResearchDetail";
import { StartupResearchDetail } from "../../components/StartupResearchDetail";
import { ResourceCard } from "../../components/ResourceCard";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { getOrganizationProfile } from "../../data/organizationProfiles";
import { getInvestmentProfile } from "../../data/investmentProfiles";
import { getResourceProfile } from "../../data/resourceProfiles";
import { getResourceBySlug, resources, typeConfig } from "../../data/resources";
import { getStartupProfile } from "../../data/startupProfiles";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) return {};
  return {
    title: `${resource.name} — Pioneer 整理详情`,
    description: resource.description,
    alternates: {
      canonical: resource.detailPath ?? `/resources/${resource.slug}`,
      languages: {
        "zh-CN": resource.detailPath ?? `/resources/${resource.slug}`,
        en: `/en/resources/${resource.slug}`,
      },
    },
  };
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  const profile = (hasDecisionProfile(slug) ? getDecisionProfile(slug, "zh") : getResourceProfile(slug))!;
  const investmentProfile = getInvestmentProfile(slug);
  const startupProfile = getStartupProfile(slug);
  if (!resource || (!profile && !investmentProfile && !startupProfile)) notFound();
  const organizationProfile = resource.type === "organization" ? getOrganizationProfile(slug) : undefined;

  if (resource.type === "event") return <EventDecisionDetail resource={resource} lang="zh" />;

  const freshness = resourceFreshness(resource);
  const config = typeConfig[resource.type];
  const directlyRelated = (resource.relatedSlugs ?? [])
    .map((relatedSlug) => getResourceBySlug(relatedSlug))
    .filter((entry) => Boolean(entry));
  const fallbackRelated = resources.filter(
    (entry) => entry.type === resource.type && entry.id !== resource.id,
  );
  const related = [...directlyRelated, ...fallbackRelated]
    .filter((entry, index, entries) => entries.findIndex((candidate) => candidate?.id === entry?.id) === index)
    .slice(0, 3);

  return (
    <main>
      <SiteHeader languageHref={`/en/resources/${resource.slug}`} />
      <section className={`detail-hero detail-${resource.type}${startupProfile ? " detail-hero-with-product" : ""}`}>
        <div className="detail-breadcrumbs">
          <a href="/">首页</a><span>/</span>
          <a href={config.path}>{config.title}</a><span>/</span>
          <b>{resource.name}</b>
        </div>
        <div className={`detail-hero-body${startupProfile ? " detail-hero-body-startup" : ""}`}>
          <div className="detail-hero-copy">
            <div className="detail-identity">
              <span className={`resource-logo detail-logo logo-${resource.color}`}>{resource.monogram}</span>
              <span className="resource-status"><i />{freshness === "reviewed" ? resource.status : freshnessLabel(freshness, "zh")}</span>
            </div>
            <span className="section-index">{resource.kind} · PIONEER PROFILE</span>
            <h1>{resource.name}</h1>
            <p>{resource.description}</p>
            {freshness !== "reviewed" && <p className="workspace-message">{freshness === "historical" ? "本届活动或行动窗口已结束。本页保留历史资料供复盘与下一届准备；原官网可能已切换到新一届，新一届资格与日期尚未核验。" : "档案内容反映上次整理时的信息；当前窗口尚未重新核验，请在官方来源确认资格、日期、名额与费用。"}</p>}
        <div className="detail-tags">
              {resource.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </div>
          {startupProfile ? (
            <aside className={`startup-product-hero${startupProfile.showcase ? " startup-product-hero-media" : ""}`} aria-label={`${resource.name} 产品速览`}>
              {startupProfile.showcase ? (
                <figure>
                  <img src={startupProfile.showcase.heroImage} alt={startupProfile.showcase.heroAlt} width="1600" height="1032" loading="eager" />
                  <figcaption>
                    <span>OFFICIAL PRODUCT VIEW</span>
                    <a href={startupProfile.showcase.sourceUrl} target="_blank" rel="noreferrer">图片来源：{startupProfile.showcase.mediaSource} ↗</a>
                  </figcaption>
                </figure>
              ) : (
                <div className="startup-hero-use-case">
                  <span>ONE-SENTENCE PRODUCT</span>
                  <strong>{resource.description}</strong>
                  <div className="startup-use-flow" aria-label={`${resource.name} 产品使用流程`}>
                    <div><small>使用前的问题</small><p>{startupProfile.snapshot.problem}</p></div>
                    <i aria-hidden="true">→</i>
                    <div><small>产品怎么介入</small><p>{startupProfile.product.map((item) => item.layer).join(" + ")}</p></div>
                    <i aria-hidden="true">→</i>
                    <div><small>用户得到什么</small><p>{startupProfile.snapshot.wedge}</p></div>
                  </div>
                </div>
              )}
              <div className="startup-hero-product-copy">
                <span>PRODUCT AT A GLANCE</span>
                <h2>{startupProfile.showcase?.productName ?? resource.name}</h2>
                <p>{startupProfile.showcase?.tagline ?? resource.description}</p>
                <div>
                  <a href={startupProfile.showcase?.productUrl ?? "#startup-product"} target={startupProfile.showcase ? "_blank" : undefined} rel={startupProfile.showcase ? "noreferrer" : undefined}>{startupProfile.showcase ? "查看官方产品" : "看懂产品怎么工作"} <span aria-hidden="true">↗</span></a>
                  <a href="#startup-overview">一分钟理解 <span aria-hidden="true">↓</span></a>
                </div>
              </div>
              <div className="startup-hero-facts">
                <div><span>产品形态</span><strong>{startupProfile.showcase?.what ?? startupProfile.product.map((item) => item.layer).join(" + ")}</strong></div>
                <div><span>给谁使用</span><strong>{startupProfile.snapshot.user}</strong></div>
                <div><span>具体做什么</span><strong>{startupProfile.showcase?.does ?? startupProfile.snapshot.wedge}</strong></div>
                <div><span>怎么赚钱</span><strong>{startupProfile.business.model}</strong></div>
              </div>
            </aside>
          ) : null}
        </div>
      </section>

      <section className={`detail-layout detail-layout-${resource.type}`}>
        {startupProfile ? (
          <StartupResearchDetail resource={resource} startup={startupProfile} />
        ) : investmentProfile ? (
          <InvestmentResearchDetail resource={resource} investment={investmentProfile} />
        ) : organizationProfile && profile ? (
          <OrganizationResearchDetail resource={resource} profile={profile} organization={organizationProfile} />
        ) : (
        <article className="detail-main">
          <DecisionProfileSections profile={profile} lang="zh" overview={resource.overview} whyItMatters={resource.whyItMatters} historical={freshness === "historical"} />
          <section className="detail-section detail-verdict">
            <span className="detail-index">10</span>
            <div>
              <span className="section-index">FINAL VERDICT</span>
              <h2>编辑备注</h2>
              <div className="editorial-callout"><span>最大价值 · 适合人群 · 主要限制</span><ContentPoints text={resource.editorialNote} /></div>
            </div>
          </section>
        </article>
        )}

        <aside className="detail-sidebar">
          <div className="fact-card">
            <span className="section-index">KEY FACTS</span>
            {resource.highlights.map((fact) => (
              <div key={fact.label}><span>{fact.label}</span><strong>{fact.value}</strong></div>
            ))}
            <div><span>地点</span><strong>{resource.location}</strong></div>
          </div>
          <div className="source-card">
            <span className="section-index">{freshness === "historical" ? "SOURCE ARCHIVE" : "SOURCE & ACTION"}</span>
            <strong>{resource.source}</strong>
            <p>{resource.verified}。{freshness === "historical" ? "以下链接是本档案的原始来源，不代表旧窗口仍可报名。" : "申请条件、价格与时间可能变化，行动前请在官方页面再次确认。"}</p>
            <a href={resource.url} target="_blank" rel="noreferrer">
              {freshness === "historical" ? "查看历史官方来源" : "前往官方页面"} <span aria-hidden="true">↗</span>
            </a>
            {resource.sources && resource.sources.length > 1 ? (
              <div className="source-reference-list">
                <span>原始参考来源</span>
                {resource.sources.slice(1).map((source) => (
                  <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>
                    {source.label} <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            ) : null}
          </div>
          <p className="editorial-disclaimer">Pioneer 的判断用于帮助你缩小选择范围，不构成投资、录取或商业结果保证。</p>
        </aside>
      </section>

      <section className="section related-section">
        <div className="section-heading">
          <div>
            <span className="section-index">KEEP EXPLORING</span>
            <h2>{directlyRelated.length ? "相关机构与开放计划" : `继续比较同类${config.singular}`}</h2>
          </div>
          <a className="text-link" href={config.path}>查看全部{config.title} →</a>
        </div>
        <div className="resource-grid">
          {related.map((entry) => entry && <ResourceCard resource={entry} key={entry.id} />)}
        </div>
      </section>
      <SaveResource slug={resource.slug} lang="zh" />
      <ResourceReport resourceKey={resource.slug} lang="zh" />
      <SiteFooter />
    </main>
  );
}
