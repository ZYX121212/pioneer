import Link from "next/link";
import type { ChineseAdditionalGuide } from "../data/additionalGuides";
import { pioneerGuides } from "../data/knowledge";
import { GuideProgress } from "./GuideProgress";
import { SiteFooter, SiteHeader } from "./SiteChrome";

export function AdditionalGuidePage({ guide }: { guide: ChineseAdditionalGuide }) {
  const guideMeta = pioneerGuides.find((entry) => entry.slug === guide.slug)!;
  return <main className="guide-page">
    <SiteHeader languageHref={`/en/knowledge/${guide.slug}`} />
    <header className="guide-hero guide-hero-blue"><div className="guide-breadcrumbs"><Link href="/">首页</Link><span>/</span><Link href="/knowledge">创业指南</Link><span>/</span><b>{guide.stage}</b></div><div className="guide-hero-grid"><div><span className="guide-kicker">PIONEER GUIDE {guide.number} · {guide.stage}</span><h1>{guide.title}</h1><p>{guide.description}</p></div><aside className="guide-output-card"><span>完成这篇指南后</span><strong>不是多知道几个概念，<br />而是完成一次真实判断。</strong><ol>{guide.outcome.map((item) => <li key={item}>{item}</li>)}</ol><small>{guide.duration} · 更新于 {guide.updated}</small></aside></div></header>
    <GuideProgress guide={guideMeta} judgment={guide.description} mistakes={["只看行业平均，不验证自己的客户", "用口头兴趣替代真实购买动作", "没有提前写下继续与停止标准"]} action={`填写“${guide.worksheet[0]}”，并完成一个可验证的下一步。`} />
    <div className="guide-reading-layout" id="deep-guide">
      <aside className="guide-toc" aria-label="本篇目录"><span>本篇目录</span>{guide.sections.map((section, index) => <a href={`#${section.id}`} key={section.id}>{String(index + 1).padStart(2, "0")} · {section.title}</a>)}<a href="#worksheet">实践工作表</a><a href="#decision">阶段判断</a><a href="#sources">参考来源</a></aside>
      <article className="guide-article">
        {guide.sections.map((section, index) => <section className="guide-section" id={section.id} key={section.id}><div className="guide-section-heading"><span>{String(index + 1).padStart(2, "0")}</span><div><small>{section.eyebrow}</small><h2>{section.title}</h2></div></div><p className="guide-lead">{section.lead}</p><div className="guide-card-grid">{section.points.map((point) => <article key={point.title}><strong>{point.title}</strong><p>{point.body}</p></article>)}</div></section>)}
        <section className="guide-section" id="worksheet"><div className="guide-section-heading"><span>W</span><div><small>WORKSHEET</small><h2>把这次判断写下来</h2></div></div><div className="workbook-panel"><ol>{guide.worksheet.map((item) => <li key={item}><strong>{item}</strong><p>________________________________________________</p></li>)}</ol></div></section>
        <section className="guide-section" id="decision"><div className="guide-section-heading"><span>D</span><div><small>CONTINUE · ADJUST · STOP</small><h2>用证据决定下一步</h2></div></div><div className="three-way-decision"><div><span>继续</span><p>{guide.decision.continue}</p></div><div><span>调整</span><p>{guide.decision.adjust}</p></div><div><span>暂不推进</span><p>{guide.decision.stop}</p></div></div></section>
        <section className="guide-sources" id="sources"><div className="guide-section-heading"><span>S</span><div><small>SOURCES &amp; SCOPE</small><h2>参考来源与适用边界</h2></div></div><p>本页是创业决策教育内容，不构成法律、税务、会计、证券、监管或针对具体公司的专业意见。涉及正式安排时，请咨询适用法域的专业人士。</p><div className="source-list">{guide.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><div><span>{source.publisher} · 英文</span><strong>{source.title}</strong><p>{source.use}</p></div><b aria-hidden="true">↗</b></a>)}</div></section>
      </article>
      <aside className="guide-sidecard"><span>完成标准</span><strong>离开本页前至少写清：</strong><ul>{guide.worksheet.slice(0, 5).map((item) => <li key={item}>{item}</li>)}</ul><Link href="#worksheet">打开工作表 →</Link></aside>
    </div>
    <section className="guide-next"><span>继续创业决策路径</span><h2>不要把答案留在阅读里。</h2><p>回到创业指南，选择下一项最接近你当前风险的决策。</p><Link href="/knowledge">查看全部创业指南 <span aria-hidden="true">→</span></Link></section>
    <SiteFooter />
  </main>;
}
