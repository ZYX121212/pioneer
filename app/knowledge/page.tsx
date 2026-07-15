import Link from "next/link";
import { KnowledgeExplorer } from "../components/KnowledgeExplorer";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { learningPath } from "../data/knowledge";

export default function KnowledgePage() {
  return (
    <main>
      <SiteHeader />
      <section className="knowledge-section knowledge-page" id="knowledge">
        <div className="knowledge-heading">
          <div>
            <Link className="knowledge-breadcrumb" href="/">PIONEER / 首页</Link>
            <span className="section-index light">FOUNDER LIBRARY</span>
            <h1>发现机会，<br />也知道怎么开始。</h1>
          </div>
          <div className="knowledge-heading-copy">
            <span>创业指南 · PIONEER LIBRARY</span>
            <p>不是一堆等待收藏的链接。我们按创业阶段整理公开课程、专业指南与行动线索，并标注来源和适用边界。</p>
          </div>
        </div>

        <div className="learning-path-shell">
          <aside className="learning-path-intro">
            <span>START HERE · 60 MIN</span>
            <strong>创业前的<br />第一张地图</strong>
            <p>适合第一次接触创业的人。先建立完整认知，再决定需要深入的方向。</p>
            <a href="#knowledge-library">查看精选资料 <span aria-hidden="true">↓</span></a>
          </aside>
          <div className="learning-path" aria-label="创业入门学习路径">
            {learningPath.map((step) => (
              <a href="#knowledge-library" key={step.number}>
                <span>{step.number}</span>
                <div>
                  <strong>{step.title}</strong>
                  <small>{step.note}</small>
                </div>
                <b aria-hidden="true">↘</b>
              </a>
            ))}
          </div>
        </div>

        <KnowledgeExplorer />
      </section>
      <SiteFooter />
    </main>
  );
}
