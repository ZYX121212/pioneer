import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "../../../components/SiteChrome";
import { englishGuides, getEnglishGuide } from "../../../data/knowledgeEnglish";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params; const guide = getEnglishGuide(slug); if (!guide) return {};
  return { title: `${guide.title} — Pioneer Founder Guide`, description: guide.description, alternates: { canonical: `/en/knowledge/${slug}`, languages: { "zh-CN": `/knowledge/${slug}`, en: `/en/knowledge/${slug}` } } };
}

export default async function EnglishGuidePage({ params }: PageProps) {
  const { slug } = await params; const guide = getEnglishGuide(slug); if (!guide) notFound();
  const index = englishGuides.findIndex((entry) => entry.slug === slug); const previous = englishGuides[index - 1]; const next = englishGuides[index + 1];
  return (
    <main className="guide-page">
      <SiteHeader lang="en" languageHref={`/knowledge/${slug}`} />
      <header className="guide-hero guide-hero-blue">
        <div className="guide-breadcrumbs"><Link href="/en">Home</Link><span>/</span><Link href="/en/knowledge">Founder Guides</Link><span>/</span><b>{guide.stage}</b></div>
        <div className="guide-hero-grid"><div><span className="guide-kicker">PIONEER GUIDE {guide.number} · {guide.stage}</span><h1>{guide.title}</h1><p>{guide.description}</p></div><aside className="guide-output-card"><span>AFTER THIS GUIDE</span><strong>Leave with a decision,<br />not more notes.</strong><ol>{guide.outcome.map((item) => <li key={item}>{item}</li>)}</ol><small>{guide.duration} · Updated {guide.updated}</small></aside></div>
      </header>
      <div className="guide-reading-layout">
        <aside className="guide-toc" aria-label="Guide contents"><span>IN THIS GUIDE</span>{guide.sections.map((section, i) => <a href={`#${section.id}`} key={section.id}>{String(i + 1).padStart(2, "0")} · {section.title}</a>)}<a href="#worksheet">Worksheet</a><a href="#decision">Decision</a><a href="#sources">Sources</a></aside>
        <article className="guide-article">
          {guide.sections.map((section, i) => <section className="guide-section" id={section.id} key={section.id}><div className="guide-section-heading"><span>{String(i + 1).padStart(2, "0")}</span><div><small>{section.eyebrow}</small><h2>{section.title}</h2></div></div><p className="guide-lead">{section.lead}</p><div className="guide-card-grid">{section.points.map((point) => <article key={point.title}><strong>{point.title}</strong><p>{point.body}</p></article>)}</div></section>)}
          <section className="guide-section" id="worksheet"><div className="guide-section-heading"><span>W</span><div><small>WORKSHEET</small><h2>Write the decision before you leave</h2></div></div><div className="workbook-panel"><ol>{guide.worksheet.map((item) => <li key={item}><strong>{item}</strong><p>________________________________________________</p></li>)}</ol></div></section>
          <section className="guide-section" id="decision"><div className="guide-section-heading"><span>D</span><div><small>CONTINUE · ADJUST · STOP</small><h2>Use evidence to choose the next move</h2></div></div><div className="three-way-decision"><div><span>CONTINUE</span><p>{guide.decision.continue}</p></div><div><span>ADJUST</span><p>{guide.decision.adjust}</p></div><div><span>STOP</span><p>{guide.decision.stop}</p></div></div></section>
          <section className="guide-sources" id="sources"><div className="guide-section-heading"><span>S</span><div><small>SOURCES &amp; SCOPE</small><h2>Original references and how they are used</h2></div></div><p>This guide is an educational decision framework, not legal, financial, medical, tax or regulatory advice. Apply professional guidance where the decision requires it.</p><div className="source-list">{guide.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><div><span>{source.publisher}</span><strong>{source.title}</strong><p>{source.use}</p></div><b aria-hidden="true">↗</b></a>)}</div></section>
        </article>
        <aside className="guide-sidecard"><span>COMPLETION STANDARD</span><strong>You should be able to state:</strong><ul>{guide.worksheet.slice(0, 5).map((item) => <li key={item}>{item}</li>)}</ul><Link href="#worksheet">Open the worksheet →</Link></aside>
      </div>
      <section className="guide-next"><span>{next ? "NEXT GUIDE" : "COMPLETE PATH"}</span><h2>{next?.title ?? "Return to the founder library"}</h2><p>{next?.description ?? "Review the thirteen decisions and return to the one with the weakest evidence."}</p><Link href={next ? `/en/knowledge/${next.slug}` : "/en/knowledge"}>{next ? "Continue to the next guide" : "View all founder guides"} <span aria-hidden="true">→</span></Link>{previous ? <small>Previous: <Link href={`/en/knowledge/${previous.slug}`}>{previous.title}</Link></small> : null}</section>
      <SiteFooter lang="en" />
    </main>
  );
}
