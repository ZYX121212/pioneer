import { organizationComparison, type OrganizationIntelligenceProfile } from "../data/organizationProfiles";
import type { ResourceResearchProfile } from "../data/resourceProfiles";
import type { Resource } from "../data/resources";

type Props = {
  resource: Resource;
  profile: ResourceResearchProfile;
  organization: OrganizationIntelligenceProfile;
};

const organizationNames: Record<string, string> = {
  "station-f": "STATION F",
  block71: "BLOCK71",
  "entrepreneur-first": "Entrepreneur First",
  "berkeley-skydeck": "Berkeley SkyDeck",
};

export function OrganizationResearchDetail({ resource, profile, organization }: Props) {
  const priorityStages = profile.stageFit
    .filter((item) => item.fit === "优先考虑")
    .map((item) => item.stage)
    .join(" / ");

  return (
    <article className="detail-main organization-intelligence">
      <nav className="organization-chapter-nav" aria-label="机构档案章节">
        <a href="#institution-dna"><span>01</span>机构身份</a>
        <a href="#resource-architecture"><span>02</span>资源结构</a>
        <a href="#entry-system"><span>03</span>进入与使用</a>
        <a href="#institution-decision"><span>04</span>适合度与决策</a>
      </nav>

      <section className="organization-thesis">
        <span className="section-index">PIONEER INSTITUTION THESIS</span>
        <h2>先看结论，再看资源。</h2>
        <p>{organization.thesis}</p>
        <div className="organization-verdict-strip">
          <div><span>适合阶段</span><strong>{priorityStages || "按具体项目判断"}</strong></div>
          <div><span>核心入口</span><strong>{organization.dna[5].value}</strong></div>
          <div><span>地理价值</span><strong>{organization.dna[4].value}</strong></div>
          <div><span>资本角色</span><strong>{organization.dna[3].value}</strong></div>
        </div>
      </section>

      <section className="organization-chapter" id="institution-dna">
        <header className="organization-chapter-heading">
          <span>01 / INSTITUTION DNA</span>
          <div><h2>机构身份与运作逻辑</h2><p>先辨认机构原型，避免把园区、基金、加速器和创业社区混为一谈。</p></div>
        </header>
        <div className="institution-dna-grid">
          {organization.dna.map((item, index) => (
            <div key={item.label}>
              <span>0{index + 1}</span>
              <small>{item.label}</small>
              <strong>{item.value}</strong>
              <p>{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="organization-chapter" id="resource-architecture">
        <header className="organization-chapter-heading">
          <span>02 / RESOURCE ARCHITECTURE</span>
          <div><h2>资源结构：有资源，不等于你能获得</h2><p>每项资源同时说明“提供什么、怎么进入、边界在哪里”。</p></div>
        </header>
        <div className="resource-architecture-table">
          <div className="resource-architecture-head"><span>资源</span><span>强度</span><span>提供什么</span><span>如何获得</span><span>主要边界</span></div>
          {organization.resources.map((item) => (
            <div className="resource-architecture-row" key={item.label}>
              <strong>{item.label}</strong>
              <span className={`capability-level strength-${item.strength}`}>{item.strength}</span>
              <p>{item.provides}</p>
              <p>{item.access}</p>
              <p>{item.boundary}</p>
            </div>
          ))}
        </div>
        <div className="organization-evidence-note">
          <span>PIONEER 说明</span>
          <p>强度表示该资源在机构整体模式中的重要程度，不表示每位参与者都能获得相同结果。真正的资源权益以具体项目为准。</p>
        </div>
      </section>

      <section className="organization-chapter" id="entry-system">
        <header className="organization-chapter-heading">
          <span>03 / ENTRY &amp; USAGE</span>
          <div><h2>项目组合、生态角色与进入方式</h2><p>把机构拆成可以行动的入口，而不是停留在品牌介绍。</p></div>
        </header>

        <div className="organization-subheading"><span>A</span><h3>项目组合</h3><p>不同入口服务不同阶段，不能互相替代。</p></div>
        <div className="portfolio-table">
          {organization.portfolio.map((item, index) => (
            <div key={item.name}>
              <span>0{index + 1}</span>
              <div><small>{item.stage}</small><h3>{item.name}</h3></div>
              <p>{item.mechanism}</p>
              <p><b>更适合</b>{item.fit}</p>
            </div>
          ))}
        </div>

        <div className="organization-subheading"><span>B</span><h3>生态中的关键角色</h3><p>机构价值通常通过这些角色传递。</p></div>
        <div className="ecosystem-grid">
          {organization.ecosystem.map((item) => (
            <div key={item.actor}><strong>{item.actor}</strong><p>{item.role}</p><div><span>创业者如何使用</span><p>{item.founderUse}</p></div></div>
          ))}
        </div>

        <div className="organization-subheading"><span>C</span><h3>按你的需求选择入口</h3><p>从资源目标倒推路径，而不是先申请再想用途。</p></div>
        <div className="scenario-route-list">
          {organization.scenarios.map((item, index) => (
            <div key={item.need}>
              <span>SCENARIO 0{index + 1}</span>
              <h3>{item.need}</h3>
              <dl><div><dt>建议路径</dt><dd>{item.route}</dd></div><div><dt>第一步</dt><dd>{item.firstMove}</dd></div><div><dt>成功标准</dt><dd>{item.success}</dd></div></dl>
            </div>
          ))}
        </div>
      </section>

      <section className="organization-chapter" id="institution-decision">
        <header className="organization-chapter-heading">
          <span>04 / FIT &amp; DECISION</span>
          <div><h2>最后判断：是否值得进入</h2><p>把阶段、总成本、替代选择和进入后的行动放在同一个决策面板中。</p></div>
        </header>

        <div className="organization-decision-grid">
          <div className="organization-stage-panel">
            <span className="organization-panel-label">STAGE FIT</span>
            {profile.stageFit.map((item) => <div key={item.stage}><strong>{item.stage}</strong><span className={`fit-badge fit-${item.fit}`}>{item.fit}</span><p>{item.reason}</p></div>)}
          </div>
          <div className="organization-red-flags">
            <span className="organization-panel-label">RED FLAGS</span>
            <h3>出现这些情况，先不要申请</h3>
            <ol>{organization.redFlags.map((item) => <li key={item}>{item}</li>)}</ol>
          </div>
        </div>

        <div className="organization-subheading"><span>A</span><h3>成本与需要复核的问题</h3><p>公开资源之外，真正决定回报的是隐性成本。</p></div>
        <div className="organization-risk-grid">
          <div className="organization-cost-list">
            {profile.costs.map((cost) => <div key={cost.label}><span className={`cost-level cost-${cost.level}`}>{cost.level}</span><div><strong>{cost.label}</strong><p>{cost.detail}</p></div></div>)}
          </div>
          <div className="organization-question-list">
            {profile.diligence.map((question, index) => <div key={question}><span>Q{index + 1}</span><p>{question}</p></div>)}
          </div>
        </div>

        <div className="organization-subheading"><span>B</span><h3>进入后的 90 天使用计划</h3><p>机构不是结果，使用机构的方法才是结果。</p></div>
        <div className="organization-playbook">
          {profile.playbook.map((step, index) => <div key={step.title}><span>0{index + 1}</span><small>{step.phase}</small><h3>{step.title}</h3><p>{step.action}</p><strong>产出：{step.output}</strong></div>)}
        </div>

        <div className="organization-subheading"><span>C</span><h3>四家机构横向比较</h3><p>比较机构原型，而不只比较品牌大小。</p></div>
        <div className="organization-comparison-table">
          <div className="organization-comparison-head"><span>比较维度</span>{Object.values(organizationNames).map((name) => <span key={name}>{name}</span>)}</div>
          {organizationComparison.map((row) => (
            <div key={row.dimension}><strong>{row.dimension}</strong><p>{row["station-f"]}</p><p>{row.block71}</p><p>{row["entrepreneur-first"]}</p><p>{row["berkeley-skydeck"]}</p></div>
          ))}
        </div>

        <div className="organization-final-verdict">
          <span>PIONEER FINAL VERDICT</span>
          <h2>{resource.name} 值得进入吗？</h2>
          <p>{resource.editorialNote}</p>
          <div><span>优先选择，当</span><p>{profile.comparison.chooseWhen}</p></div>
          <div><span>暂不选择，当</span><p>{profile.comparison.avoidWhen}</p></div>
        </div>
      </section>
    </article>
  );
}
