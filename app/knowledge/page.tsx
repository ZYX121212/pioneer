import Link from "next/link";
import { KnowledgeExplorer } from "../components/KnowledgeExplorer";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { learningPath, pioneerGuide } from "../data/knowledge";

export default function KnowledgePage() {
  return (
    <main>
      <SiteHeader />
      <section className="knowledge-section knowledge-page" id="knowledge">
        <div className="knowledge-heading">
          <div>
            <Link className="knowledge-breadcrumb" href="/">PIONEER / 首页</Link>
            <span className="section-index light">FOUNDER LIBRARY</span>
            <h1>不是多读几篇，<br />而是做对下一个决定。</h1>
          </div>
          <div className="knowledge-heading-copy">
            <span>创业决策指南 · PIONEER GUIDES</span>
            <p>从创业者眼前的问题出发，Pioneer 负责讲清判断、设计行动；公开课程和专业资料放在最后，供你核验与深入。</p>
          </div>
        </div>

        <article className="guide-spotlight">
          <div className="guide-spotlight-meta">
            <span>首篇指南 · {pioneerGuide.stage}</span>
            <b>{pioneerGuide.number}</b>
          </div>
          <div className="guide-spotlight-copy">
            <span>START HERE · {pioneerGuide.duration}</span>
            <h2>{pioneerGuide.title}</h2>
            <p>{pioneerGuide.description}</p>
            <Link href={`/knowledge/${pioneerGuide.slug}`}>阅读 Pioneer 指南 <b aria-hidden="true">→</b></Link>
          </div>
          <div className="guide-spotlight-outcome">
            <span>看完你会带走</span>
            <ul>
              {pioneerGuide.outcome.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </article>

        <div className="learning-path-shell">
          <aside className="learning-path-intro">
            <span>DECISION PATH</span>
            <strong>你现在，<br />卡在哪里？</strong>
            <p>不要求从头学完。找到最接近你当前处境的问题，只完成下一次判断。</p>
            <a href="#source-library">查看原始资料库 <span aria-hidden="true">↓</span></a>
          </aside>
          <div className="learning-path" aria-label="创业入门学习路径">
            {learningPath.map((step) => step.href ? (
              <Link className="learning-step available" href={step.href} key={step.number}>
                <span>{step.number}</span>
                <div><strong>{step.title}</strong><small>{step.note}</small></div>
                <b>阅读 →</b>
              </Link>
            ) : (
              <div className={`learning-step ${step.status}`} key={step.number}>
                <span>{step.number}</span>
                <div><strong>{step.title}</strong><small>{step.note}</small></div>
                <b>{step.status === "next" ? "下一篇" : "规划中"}</b>
              </div>
            ))}
          </div>
        </div>

        <KnowledgeExplorer />
      </section>
      <SiteFooter />
    </main>
  );
}
