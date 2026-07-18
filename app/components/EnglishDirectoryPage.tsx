import { englishTypeConfig } from "../data/english";
import { getResourcesByType, type ResourceType } from "../data/resources";
import { DirectoryExplorer } from "./DirectoryExplorer";
import { SiteFooter, SiteHeader } from "./SiteChrome";

export function EnglishDirectoryPage({ type }: { type: ResourceType }) {
  const config = englishTypeConfig[type];
  const entries = getResourcesByType(type);

  return (
    <main>
      <SiteHeader lang="en" languageHref={config.path.replace("/en", "")} />
      <section className={`directory-hero directory-hero-${type}`}>
        <div>
          <a className="breadcrumb" href="/en">PIONEER / Home</a>
          <span className="section-index">{config.eyebrow}</span>
          <h1>{config.title}</h1>
          <p>{config.intro}</p>
        </div>
        <aside className="directory-guide">
          <span>HOW TO CHOOSE</span>
          <strong>Decide whether it fits before you act.</strong>
          <p>{config.guide}</p>
          <div><b>{entries.length}</b><small>curated entries</small></div>
        </aside>
      </section>

      <section className="section directory-content">
        <div className="section-heading">
          <div>
            <span className="section-index">CURATED DIRECTORY</span>
            <h2>More Than A Link List</h2>
          </div>
          <p>Open each brief to see fit, trade-offs, key facts, Pioneer&apos;s editorial judgment and the official source.</p>
        </div>
        <DirectoryExplorer resources={entries} lang="en" />
      </section>
      <SiteFooter lang="en" />
    </main>
  );
}
