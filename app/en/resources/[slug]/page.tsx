import { freshnessLabel, resourceFreshness } from "../../../lib/resourceFreshness";
import { SaveResource } from "../../../components/SaveResource";
import { ResourceReport } from "../../../components/ResourceReport";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEnglishResource, englishTypeConfig } from "../../../data/english";
import { getResourceBySlug, resources } from "../../../data/resources";
import { ResourceCard } from "../../../components/ResourceCard";
import { SiteFooter, SiteHeader } from "../../../components/SiteChrome";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  const english = getEnglishResource(slug);
  if (!resource || !english) return {};
  return {
    title: `${resource.name} — Pioneer Brief`,
    description: english.description,
    alternates: {
      canonical: `/en/resources/${resource.slug}`,
      languages: {
        "zh-CN": resource.detailPath ?? `/resources/${resource.slug}`,
        en: `/en/resources/${resource.slug}`,
      },
    },
  };
}

export default async function EnglishResourceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  const english = getEnglishResource(slug);
  if (!resource || !english) notFound();

  const freshness = resourceFreshness(resource);
  const config = englishTypeConfig[resource.type];
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
      <SiteHeader lang="en" languageHref={resource.detailPath ?? `/resources/${resource.slug}`} />
      <section className={`detail-hero detail-${resource.type}`}>
        <div className="detail-breadcrumbs">
          <a href="/en">Home</a><span>/</span>
          <a href={config.path}>{config.title}</a><span>/</span>
          <b>{resource.name}</b>
        </div>
        <div className="detail-identity">
          <span className={`resource-logo detail-logo logo-${resource.color}`}>{resource.monogram}</span>
          <span className="resource-status"><i />{freshness === "reviewed" ? english.status : freshnessLabel(freshness, "en")}</span>
        </div>
        <span className="section-index">{english.kind} · PIONEER BRIEF</span>
        <h1>{resource.name}</h1>
        <p>{english.description}</p>
        {freshness !== "reviewed" && <p className="workspace-message">{freshness === "historical" ? "This edition or action window has ended. Keep this brief for retrospective research and planning a future edition. The original website may now show a new edition whose dates and eligibility have not been checked." : "This brief reflects its last review. The current window has not been reverified; confirm eligibility, dates, capacity and costs on the official source."}</p>}
        <div className="detail-tags">
          {english.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </section>

      <section className={`detail-layout detail-layout-${resource.type}`}>
        <article className="detail-main">
          <section className="detail-section detail-overview">
            <span className="detail-index">01</span>
            <div>
              <span className="section-index">DECISION SUMMARY</span>
              <h2>What It Actually Is</h2>
              <p>{english.overview}</p>
              <div className="identity-model-grid">
                <div><span>Category</span><p>{english.kind}</p></div>
                <div><span>Primary value</span><p>{english.whyItMatters}</p></div>
                <div><span>Action lens</span><p>{english.editorialNote}</p></div>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <span className="detail-index">02</span>
            <div>
              <span className="section-index">FIT CHECK</span>
              <h2>Who Should Pay Attention</h2>
              <div className="fit-columns research-fit-columns">
                <div><h3>Good fit</h3><ul className="fit-list positive">{english.bestFor.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div><h3>Check carefully</h3><ul className="fit-list caution">{english.considerations.map((item) => <li key={item}>{item}</li>)}</ul></div>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <span className="detail-index">03</span>
            <div>
              <span className="section-index">WHY IT MATTERS</span>
              <h2>Why Founders Might Use It</h2>
              <p>{english.whyItMatters}</p>
              <div className="editorial-callout"><span>PIONEER JUDGMENT</span><p>{english.editorialNote}</p></div>
            </div>
          </section>

          <section className="detail-section">
            <span className="detail-index">04</span>
            <div>
              <span className="section-index">{freshness === "historical" ? "ARCHIVE RESEARCH" : "NEXT ACTION"}</span>
              <h2>{freshness === "historical" ? "Review the Past Window" : "Before You Click Apply"}</h2>
              <div className="diligence-list">
                <div><span>Q1</span><p>Does this resource match your current stage, not just your ambition?</p></div>
                <div><span>Q2</span><p>Can you name the exact outcome you want from it: customers, capital, talent, learning or market entry?</p></div>
                <div><span>Q3</span><p>Have you checked the latest dates, terms, eligibility and costs on the official page?</p></div>
              </div>
            </div>
          </section>
        </article>

        <aside className="detail-sidebar">
          <div className="fact-card">
            <span className="section-index">KEY FACTS</span>
            {english.highlights.map((fact) => (
              <div key={fact.label}><span>{fact.label}</span><strong>{fact.value}</strong></div>
            ))}
            <div><span>Location</span><strong>{english.location}</strong></div>
          </div>
          <div className="source-card">
            <span className="section-index">{freshness === "historical" ? "SOURCE ARCHIVE" : "SOURCE & ACTION"}</span>
            <strong>{english.source}</strong>
            <p>{resource.verified.replace("核验", "reviewed")}. {freshness === "historical" ? "These are original archive sources, not confirmation that the old window remains open." : "Eligibility, pricing, terms and dates can change. Recheck the official page before acting."}</p>
            <a href={resource.url} target="_blank" rel="noreferrer">
              {freshness === "historical" ? "View historical official source" : "Open official page"} <span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="editorial-disclaimer">Pioneer briefs help narrow your choices. They are not admission, investment or business outcome guarantees.</p>
        </aside>
      </section>

      <section className="section related-section">
        <div className="section-heading">
          <div>
            <span className="section-index">KEEP EXPLORING</span>
            <h2>Compare Related Resources</h2>
          </div>
          <a className="text-link" href={config.path}>View all {config.title} →</a>
        </div>
        <div className="resource-grid">
          {related.map((entry) => entry && <ResourceCard resource={entry} lang="en" key={entry.id} />)}
        </div>
      </section>
      <SaveResource slug={resource.slug} lang="en" />
      <ResourceReport resourceKey={resource.slug} lang="en" />
      <SiteFooter lang="en" />
    </main>
  );
}
