/* eslint-disable @next/next/no-html-link-for-pages */
import { getResourcesByType, type ResourceType, typeConfig } from "../data/resources";
import { communityEntries } from "../lib/community";
import { DirectoryExplorer } from "./DirectoryExplorer";
import { SiteFooter, SiteHeader } from "./SiteChrome";

export async function DirectoryPage({ type }: { type: ResourceType }) {
  const config = typeConfig[type];
  const community = await communityEntries(type, "zh");
  const entries = [...getResourcesByType(type), ...community.resources];

  return (
    <main className="finder-directory">
      <SiteHeader languageHref={`/en${config.path}`} />
      <section className={`directory-hero directory-hero-${type}`}>
        <div>
          <a className="breadcrumb" href="/">PIONEER / 首页</a>
          <span className="section-index">{config.eyebrow}</span>
          <h1>{config.title}</h1>
          <p>{config.intro}</p>
        </div>
        <details className="directory-guide"><summary>申请与参加条件</summary>
          <span>HOW TO CHOOSE</span>
          <strong>申请与参加条件</strong>
          <p>{config.guide}</p>
          <div><b>{entries.length}</b><small>条站内整理</small></div>
        </details>
      </section>

      <section className="section directory-content">
        <div className="section-heading">
          <div>
            <span className="section-index">CURATED DIRECTORY</span>
            <h2>资源列表</h2>
          </div>
          <p>详情包括适合人群、申请方式、费用、限制和官方来源。</p>
        </div>
        {community.unavailable && <p role="status">{"社区新增资源暂时无法加载，已有整理档案仍可使用。"}</p>}
        <p><a href="/community">查看社区资源与核验依据</a></p>
        <DirectoryExplorer resources={entries} />
      </section>
      <SiteFooter />
    </main>
  );
}
