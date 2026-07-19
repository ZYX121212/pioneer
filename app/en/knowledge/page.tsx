import type { Metadata } from "next";
import Link from "next/link";
import { FailureCaseSignup } from "../../components/FailureCaseSignup";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { englishGuides } from "../../data/knowledgeEnglish";

export const metadata: Metadata = { title: "Founder Decision Guides — Pioneer", description: "Fourteen practical guides from problem discovery to retention, hiring, fundraising and failure review.", alternates: { canonical: "/en/knowledge", languages: { "zh-CN": "/knowledge", en: "/en/knowledge" } } };

export default function EnglishKnowledgePage() {
  const first = englishGuides[0];
  const failure = englishGuides.find((guide) => guide.slug === "learn-from-startup-failures")!;
  return (
    <main>
      <SiteHeader lang="en" languageHref="/knowledge" />
      <section className="knowledge-section knowledge-page" id="knowledge">
        <div className="knowledge-heading">
          <div><Link className="knowledge-breadcrumb" href="/en">PIONEER / Home</Link><span className="section-index light">FOUNDER LIBRARY</span><h1>Do not read more.<br />Make the next decision better.</h1></div>
          <div className="knowledge-heading-copy"><span>FOUNDER DECISION GUIDES</span><p>Start with the decision in front of you. Pioneer turns public startup knowledge into judgment frameworks, concrete actions, worksheets and traceable sources.</p></div>
        </div>
        <article className="guide-spotlight">
          <div className="guide-spotlight-meta"><span>START HERE · {first.stage}</span><b>{first.number}</b></div>
          <div className="guide-spotlight-copy"><span>{first.duration}</span><h2>{first.title}</h2><p>{first.description}</p><Link href={`/en/knowledge/${first.slug}`}>Read the guide <b aria-hidden="true">→</b></Link></div>
          <div className="guide-spotlight-outcome"><span>YOU WILL LEAVE WITH</span><ul>{first.outcome.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </article>
        <section className="knowledge-system-overview">
          <div className="knowledge-system-heading"><div><span>GUIDES · CASES · TOOLS · SOURCES</span><h2>From first evidence<br />to operating the company.</h2></div><p>Fourteen connected guides now cover discovery, product, sales, retention, metrics, hiring, company structure, fundraising and failure review.</p></div>
          <div className="knowledge-layer-grid">
            <article className="knowledge-layer-main"><div className="knowledge-layer-main-summary"><span>01 · DEPTH GUIDES</span><strong>{englishGuides.length} guides live</strong><p>Use the sequence from beginning to end, or enter at the decision currently blocking your company.</p></div><div className="knowledge-layer-guide-grid">{englishGuides.map((guide) => <Link href={`/en/knowledge/${guide.slug}`} key={guide.slug}><b>{guide.number}</b><span>{guide.title}</span><i aria-hidden="true">→</i></Link>)}</div></article>
            <Link href={`/en/knowledge/${first.slug}#worksheet`} className="knowledge-layer-card layer-tools"><span>02 · WORKSHEETS</span><strong>Save the decision</strong><p>Turn reading into a written assumption, test, threshold and next action.</p><b>Open a worksheet →</b></Link>
            <Link href={`/en/knowledge/${failure.slug}#cases`} className="knowledge-layer-card layer-cases"><span>03 · FAILURE CASES</span><strong>Find the first broken assumption</strong><p>Read documented signals from Quibi, Cydoc and Net30.</p><b>Review the cases →</b></Link>
            <Link href={`/en/knowledge/${first.slug}#sources`} className="knowledge-layer-card layer-sources"><span>04 · SOURCES</span><strong>Trace the reasoning</strong><p>Original authors, scope and Pioneer&apos;s use remain visible.</p><b>Review sources →</b></Link>
          </div>
        </section>
        <FailureCaseSignup lang="en" />
        <div className="learning-path-shell">
          <aside className="learning-path-intro"><span>DECISION PATH</span><strong>Where are you<br />stuck now?</strong><p>You do not need to complete a course. Choose the closest question and finish one decision.</p></aside>
          <div className="learning-path" aria-label="Founder decision path">{englishGuides.map((guide) => <Link className="learning-step available" href={`/en/knowledge/${guide.slug}`} key={guide.slug}><span>{guide.number}</span><div><strong>{guide.title}</strong><small>{guide.stage} · {guide.duration}</small></div><b>Read →</b></Link>)}</div>
        </div>
      </section>
      <SiteFooter lang="en" />
    </main>
  );
}
