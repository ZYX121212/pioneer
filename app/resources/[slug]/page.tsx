/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrganizationResearchDetail } from "../../components/OrganizationResearchDetail";
import { InvestmentResearchDetail } from "../../components/InvestmentResearchDetail";
import { StartupResearchDetail } from "../../components/StartupResearchDetail";
import { ResourceCard } from "../../components/ResourceCard";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { getOrganizationProfile } from "../../data/organizationProfiles";
import { getInvestmentProfile } from "../../data/investmentProfiles";
import { getResourceProfile } from "../../data/resourceProfiles";
import { getResourceBySlug, resources, typeConfig } from "../../data/resources";
import { getStartupProfile } from "../../data/startupProfiles";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) return {};
  return {
    title: `${resource.name} — Pioneer 整理详情`,
    description: resource.description,
  };
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  const profile = getResourceProfile(slug)!;
  const investmentProfile = getInvestmentProfile(slug);
  const startupProfile = getStartupProfile(slug);
  if (!resource || (!profile && !investmentProfile && !startupProfile)) notFound();
  const organizationProfile = resource.type === "organization" ? getOrganizationProfile(slug) : undefined;

  const config = typeConfig[resource.type];
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
      <SiteHeader />
      <section className={`detail-hero detail-${resource.type}`}>
        <div className="detail-breadcrumbs">
          <a href="/">首页</a><span>/</span>
          <a href={config.path}>{config.title}</a><span>/</span>
          <b>{resource.name}</b>
        </div>
        <div className="detail-identity">
          <span className={`resource-logo detail-logo logo-${resource.color}`}>{resource.monogram}</span>
          <span className="resource-status"><i />{resource.status}</span>
        </div>
        <span className="section-index">{resource.kind} · PIONEER PROFILE</span>
        <h1>{resource.name}</h1>
        <p>{resource.description}</p>
        <div className="detail-tags">
          {resource.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </section>

      <section className={`detail-layout detail-layout-${resource.type}`}>
        {startupProfile ? (
          <StartupResearchDetail resource={resource} startup={startupProfile} />
        ) : investmentProfile ? (
          <InvestmentResearchDetail resource={resource} investment={investmentProfile} />
        ) : organizationProfile && profile ? (
          <OrganizationResearchDetail resource={resource} profile={profile} organization={organizationProfile} />
        ) : (
        <article className="detail-main">
          <section className="detail-section detail-overview">
            <span className="detail-index">01</span>
            <div>
              <span className="section-index">DECISION SUMMARY</span>
              <h2>先判断它究竟是什么</h2>
              <p>{resource.overview}</p>
              <div className="identity-model-grid">
                <div><span>运作模式</span><p>{profile!.identity.model}</p></div>
                <div><span>核心价值</span><p>{profile!.identity.primaryValue}</p></div>
                <div><span>价值发生条件</span><p>{profile!.identity.valueCondition}</p></div>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <span className="detail-index">02</span>
            <div>
              <span className="section-index">CAPABILITY PORTRAIT</span>
              <h2>能力画像：强在哪里，弱在哪里</h2>
              <div className="capability-grid" aria-label={`${resource.name} 能力画像`}>
                {profile.capabilities.map((capability) => (
                  <div className="capability-row" key={capability.label}>
                    <strong>{capability.label}</strong>
                    <span className={`capability-level strength-${capability.strength}`}>{capability.strength}</span>
                    <p>{capability.detail}</p>
                  </div>
                ))}
              </div>
              <p className="analysis-caption">能力强弱是 Pioneer 基于官方公开信息做出的定性判断，用于比较资源结构，不是机构排名或结果保证。</p>
            </div>
          </section>

          <section className="detail-section">
            <span className="detail-index">03</span>
            <div>
              <span className="section-index">WHAT YOU ACTUALLY GET</span>
              <h2>你实际能够获得什么</h2>
              <div className="offer-detail-grid">
                {profile.offers.map((offer, index) => (
                  <div className="offer-detail-card" key={offer.title}>
                    <span>0{index + 1}</span>
                    <h3>{offer.title}</h3>
                    <p>{offer.includes}</p>
                    <div><b>对创业者的价值</b><p>{offer.founderValue}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="detail-section">
            <span className="detail-index">04</span>
            <div>
              <span className="section-index">ENTRY PATHS</span>
              <h2>不是只有一个入口</h2>
              <div className="entry-path-list">
                {profile.entryPaths.map((path, index) => (
                  <div className="entry-path" key={path.title}>
                    <span>0{index + 1}</span>
                    <div>
                      <h3>{path.title}</h3>
                      <p><b>适合：</b>{path.forWhom}</p>
                      <p><b>需要准备：</b>{path.prepare}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="detail-section">
            <span className="detail-index">05</span>
            <div>
              <span className="section-index">STAGE FIT</span>
              <h2>不同阶段，价值完全不同</h2>
              <div className="stage-fit-table">
                {profile.stageFit.map((item) => (
                  <div key={item.stage}>
                    <strong>{item.stage}</strong>
                    <span className={`fit-badge fit-${item.fit}`}>{item.fit}</span>
                    <p>{item.reason}</p>
                  </div>
                ))}
              </div>
              <div className="fit-columns research-fit-columns">
                <div><h3>明确适合</h3><ul className="fit-list positive">{resource.bestFor.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div><h3>需要谨慎</h3><ul className="fit-list caution">{resource.considerations.map((item) => <li key={item}>{item}</li>)}</ul></div>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <span className="detail-index">06</span>
            <div>
              <span className="section-index">COSTS &amp; TRADE-OFFS</span>
              <h2>把隐性成本放到桌面上</h2>
              <div className="cost-map-grid">
                {profile.costs.map((cost) => (
                  <div className="cost-map-card" key={cost.label}>
                    <div><strong>{cost.label}</strong><span className={`cost-level cost-${cost.level}`}>{cost.level}成本</span></div>
                    <p>{cost.detail}</p>
                  </div>
                ))}
              </div>
              <div className="evidence-note">
                <div><span>官方事实</span><p>右侧关键信息和本页明确数字来自所列官方来源。</p></div>
                <div><span>编辑判断</span><p>能力强弱、适合度、成本等级和比较建议由 Pioneer 整理。</p></div>
                <div><span>行动前复核</span><p>价格、条款、资格、日期与项目权益可能变化。</p></div>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <span className="detail-index">07</span>
            <div>
              <span className="section-index">DUE DILIGENCE</span>
              <h2>行动前必须问清的问题</h2>
              <div className="diligence-list">
                {profile.diligence.map((question, index) => (
                  <div key={question}><span>Q{index + 1}</span><p>{question}</p></div>
                ))}
              </div>
            </div>
          </section>

          <section className="detail-section">
            <span className="detail-index">08</span>
            <div>
              <span className="section-index">FOUNDER PLAYBOOK</span>
              <h2>从研究变成下一步行动</h2>
              <div className="research-playbook">
                {profile.playbook.map((step, index) => (
                  <div key={step.title}>
                    <span>0{index + 1}</span>
                    <div><small>{step.phase}</small><h3>{step.title}</h3><p>{step.action}</p></div>
                    <strong>产出：{step.output}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="detail-section">
            <span className="detail-index">09</span>
            <div>
              <span className="section-index">COMPARE BEFORE DECIDING</span>
              <h2>什么时候选它，什么时候不要选</h2>
              <p>{resource.whyItMatters}</p>
              <div className="comparison-grid">
                <div className="comparison-choose"><span>优先选择，当</span><p>{profile.comparison.chooseWhen}</p></div>
                <div className="comparison-avoid"><span>暂时放弃，当</span><p>{profile.comparison.avoidWhen}</p></div>
                <div className="comparison-with"><span>还应该比较</span><p>{profile.comparison.compareWith}</p></div>
              </div>
            </div>
          </section>

          <section className="detail-section detail-verdict">
            <span className="detail-index">10</span>
            <div>
              <span className="section-index">FINAL VERDICT</span>
              <h2>Pioneer 最终判断</h2>
              <div className="editorial-callout"><span>最大价值 · 适合人群 · 主要限制</span><p>{resource.editorialNote}</p></div>
            </div>
          </section>
        </article>
        )}

        <aside className="detail-sidebar">
          <div className="fact-card">
            <span className="section-index">KEY FACTS</span>
            {resource.highlights.map((fact) => (
              <div key={fact.label}><span>{fact.label}</span><strong>{fact.value}</strong></div>
            ))}
            <div><span>地点</span><strong>{resource.location}</strong></div>
          </div>
          <div className="source-card">
            <span className="section-index">SOURCE & ACTION</span>
            <strong>{resource.source}</strong>
            <p>{resource.verified}。申请条件、价格与时间可能变化，行动前请在官方页面再次确认。</p>
            <a href={resource.url} target="_blank" rel="noreferrer">
              前往官方页面 <span aria-hidden="true">↗</span>
            </a>
            {resource.sources && resource.sources.length > 1 ? (
              <div className="source-reference-list">
                <span>原始参考来源</span>
                {resource.sources.slice(1).map((source) => (
                  <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>
                    {source.label} <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            ) : null}
          </div>
          <p className="editorial-disclaimer">Pioneer 的判断用于帮助你缩小选择范围，不构成投资、录取或商业结果保证。</p>
        </aside>
      </section>

      <section className="section related-section">
        <div className="section-heading">
          <div>
            <span className="section-index">KEEP EXPLORING</span>
            <h2>{directlyRelated.length ? "相关机构与开放计划" : `继续比较同类${config.singular}`}</h2>
          </div>
          <a className="text-link" href={config.path}>查看全部{config.title} →</a>
        </div>
        <div className="resource-grid">
          {related.map((entry) => entry && <ResourceCard resource={entry} key={entry.id} />)}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
