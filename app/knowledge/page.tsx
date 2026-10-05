import type { Metadata } from "next";
import Link from "next/link";
import { FailureCaseSignup } from "../components/FailureCaseSignup";
import { FounderJourney } from "../components/FounderJourney";
import { KnowledgeExplorer } from "../components/KnowledgeExplorer";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { learningPath, pioneerGuide, pioneerGuides, startupFailureGuide } from "../data/knowledge";

export const metadata: Metadata = { title: "创业决策指南 — Pioneer", description: "从发现真问题到融资判断，把创业知识变成下一步行动。", alternates: { canonical: "/knowledge", languages: { "zh-CN": "/knowledge", en: "/en/knowledge" } } };

export default function KnowledgePage() {
  return (
    <main>
      <SiteHeader languageHref="/en/knowledge" />
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

        <FounderJourney />

        <section className="knowledge-system-overview">
          <div className="knowledge-system-heading">
            <div><span>GUIDES · CASES · TOOLS · SOURCES</span><h2>不止告诉你该怎么想，<br />还陪你完成一次行动。</h2></div>
            <p>每个主题都分成快速判断、深度指南、跨行业案例和实践工作表。你可以先读结论，也可以进入工具直接开始。</p>
          </div>
          <div className="knowledge-layer-grid">
            <article className="knowledge-layer-main">
              <div className="knowledge-layer-main-summary">
                <span>01 · 深度指南</span>
                <strong>{pioneerGuides.length} 篇已上线</strong>
                <p>从发现问题、完成访谈和首批销售，到留存、指标、招聘与融资执行，已经形成连续决策路径。</p>
              </div>
              <div className="knowledge-layer-guide-grid">{pioneerGuides.map((guide) => <Link href={`/knowledge/${guide.slug}`} key={guide.slug}><b>{guide.number}</b><span>{guide.title}</span><i aria-hidden="true">→</i></Link>)}</div>
            </article>
            <Link href={`/knowledge/${startupFailureGuide.slug}#cases`} className="knowledge-layer-card layer-cases">
              <span>02 · 失败案例</span><strong>找到最早失效的假设</strong><p>从 Quibi、Cydoc 与 Net30 的第一方复盘中识别使用情境、商业模式和销售周期的早期信号。</p><b>开始复盘 →</b>
            </Link>
            <a href={`/knowledge/${pioneerGuide.slug}#problem-workbook`} className="knowledge-layer-card layer-tools">
              <span>03 · 实践工具</span><strong>可保存的实践工作表</strong><p>从问题陈述、访谈记录到团队验证与融资判断，登录后可将结果保存到私密工作台，在不同设备继续推进。</p><b>开始填写 →</b>
            </a>
            <a href="#source-library" className="knowledge-layer-card layer-sources">
              <span>04 · 原始来源</span><strong>观点可以追溯</strong><p>保留原作者、适用范围与 Pioneer 的具体使用方式。</p><b>查阅来源 ↓</b>
            </a>
          </div>
        </section>

        <FailureCaseSignup />

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
