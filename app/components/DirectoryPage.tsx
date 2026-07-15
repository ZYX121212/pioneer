/* eslint-disable @next/next/no-html-link-for-pages */
import { getResourcesByType, type ResourceType, typeConfig } from "../data/resources";
import { DirectoryExplorer } from "./DirectoryExplorer";
import { SiteFooter, SiteHeader } from "./SiteChrome";

export function DirectoryPage({ type }: { type: ResourceType }) {
  const config = typeConfig[type];
  const entries = getResourcesByType(type);

  return (
    <main>
      <SiteHeader />
      <section className={`directory-hero directory-hero-${type}`}>
        <div>
          <a className="breadcrumb" href="/">PIONEER / 首页</a>
          <span className="section-index">{config.eyebrow}</span>
          <h1>{config.title}</h1>
          <p>{config.intro}</p>
        </div>
        <aside className="directory-guide">
          <span>HOW TO CHOOSE</span>
          <strong>先判断是否适合，再决定是否行动。</strong>
          <p>{config.guide}</p>
          <div><b>{entries.length}</b><small>条站内整理</small></div>
        </aside>
      </section>

      <section className="section directory-content">
        <div className="section-heading">
          <div>
            <span className="section-index">CURATED DIRECTORY</span>
            <h2>经过整理，不只是链接</h2>
          </div>
          <p>进入详情查看适合人群、注意事项、关键事实、Pioneer 判断与官方来源。</p>
        </div>
        <DirectoryExplorer resources={entries} />
      </section>
      <SiteFooter />
    </main>
  );
}
