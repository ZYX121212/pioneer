/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResourceCard } from "../../components/ResourceCard";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { getResourceBySlug, resources, typeConfig } from "../../data/resources";

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
  };
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) notFound();

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

  const fitTitle = {
    program: "这项计划适合谁",
    organization: "谁值得关注这个机构",
    event: "谁适合参加",
    startup: "谁值得研究这个项目",
  }[resource.type];

  const matterTitle = {
    program: "为什么值得申请",
    organization: "它在创业生态中的价值",
    event: "怎样获得真实参会价值",
    startup: "项目为什么值得关注",
  }[resource.type];

  return (
    <main>
      <SiteHeader />
      <section className={`detail-hero detail-${resource.type}`}>
        <div className="detail-breadcrumbs">
          <a href="/">首页</a><span>/</span>
          <a href={config.path}>{config.title}</a><span>/</span>
          <b>{resource.name}</b>
        </div>
        <div className="detail-identity">
          <span className={`resource-logo detail-logo logo-${resource.color}`}>{resource.monogram}</span>
          <span className="resource-status"><i />{resource.status}</span>
        </div>
        <span className="section-index">{resource.kind} · PIONEER PROFILE</span>
        <h1>{resource.name}</h1>
        <p>{resource.description}</p>
        <div className="detail-tags">
          {resource.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </section>

      <section className="detail-layout">
        <article className="detail-main">
          <section className="detail-section detail-overview">
            <span className="detail-index">01</span>
            <div>
              <span className="section-index">OVERVIEW</span>
              <h2>先用一分钟理解它</h2>
              <p>{resource.overview}</p>
            </div>
          </section>

          <section className="editorial-callout">
            <span>PIONEER 判断</span>
            <p>{resource.editorialNote}</p>
          </section>

          <section className="detail-section">
            <span className="detail-index">02</span>
            <div>
              <span className="section-index">FIT CHECK</span>
              <h2>{fitTitle}</h2>
              <ul className="fit-list positive">
                {resource.bestFor.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <h3>行动之前需要注意</h3>
              <ul className="fit-list caution">
                {resource.considerations.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </section>

          <section className="detail-section">
            <span className="detail-index">03</span>
            <div>
              <span className="section-index">WHY IT MATTERS</span>
              <h2>{matterTitle}</h2>
              <p>{resource.whyItMatters}</p>
            </div>
          </section>
        </article>

        <aside className="detail-sidebar">
          <div className="fact-card">
            <span className="section-index">KEY FACTS</span>
            {resource.highlights.map((fact) => (
              <div key={fact.label}><span>{fact.label}</span><strong>{fact.value}</strong></div>
            ))}
            <div><span>地点</span><strong>{resource.location}</strong></div>
          </div>
          <div className="source-card">
            <span className="section-index">SOURCE & ACTION</span>
            <strong>{resource.source}</strong>
            <p>{resource.verified}。申请条件、价格与时间可能变化，行动前请在官方页面再次确认。</p>
            <a href={resource.url} target="_blank" rel="noreferrer">
              前往官方页面 <span aria-hidden="true">↗</span>
            </a>
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
      <SiteFooter />
    </main>
  );
}
