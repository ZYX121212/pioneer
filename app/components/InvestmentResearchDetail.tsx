import type { Resource } from "../data/resources";
import type { InvestmentProfile } from "../data/investmentProfiles";

export function InvestmentResearchDetail({ resource, investment }: { resource: Resource; investment: InvestmentProfile }) {
  return (
    <article className="detail-main organization-intelligence">
      <nav className="organization-chapter-nav" aria-label="投资机构档案章节">
        <a href="#investment-portrait">机构画像</a>
        <a href="#investment-fit">融资匹配</a>
        <a href="#investment-access">接触路径</a>
        <a href="#investment-decision">决策判断</a>
      </nav>

      <section className="organization-thesis">
        <span className="section-index">INVESTMENT THESIS</span>
        <h2>先理解它为什么会投资</h2>
        <p>{investment.thesis}</p>
        <div className="organization-verdict-strip">
          <div><span>核心阶段</span><strong>{investment.stage}</strong></div>
          <div><span>地域重点</span><strong>{investment.geography}</strong></div>
          <div><span>支票信息</span><strong>{investment.check}</strong></div>
        </div>
      </section>

      <section className="organization-chapter" id="investment-portrait">
        <header className="organization-chapter-heading"><span>01</span><div><small>FIRM PORTRAIT</small><h2>投资机构画像</h2><p>把品牌拆成阶段、赛道、地域与组合风格。</p></div></header>
        <div className="identity-model-grid">
          <div><span>投资阶段</span><p>{investment.stage}</p></div>
          <div><span>投资地域</span><p>{investment.geography}</p></div>
          <div><span>常见支票</span><p>{investment.check}</p></div>
        </div>
        <div className="organization-subheading"><span>A</span><h3>重点赛道</h3><p>赛道标签只用于初筛，最终仍要匹配具体投资人。</p></div>
        <div className="tag-list detail-tags">{investment.sectors.map((sector) => <span key={sector}>{sector}</span>)}</div>
        <div className="organization-subheading"><span>B</span><h3>代表性投资组合</h3><p>用来观察机构长期积累，不代表它仍会投资同类项目。</p></div>
        <div className="offer-detail-grid">
          {investment.portfolio.map((company, index) => <div className="offer-detail-card" key={company.name}><span>0{index + 1}</span><h3>{company.name}</h3><p>{company.note}</p></div>)}
        </div>
      </section>

      <section className="organization-chapter" id="investment-fit">
        <header className="organization-chapter-heading"><span>02</span><div><small>FUNDRAISING FIT</small><h2>它可能会被什么吸引</h2><p>融资匹配首先是阶段与投资逻辑匹配，其次才是品牌。</p></div></header>
        <div className="fit-columns research-fit-columns">
          <div><h3>创始人匹配</h3><ul className="fit-list positive">{investment.founderFit.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><h3>优先信号</h3><ul className="fit-list positive">{investment.signals.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </div>
        <div className="organization-subheading"><span>VALUE</span><h3>投资后可能提供什么</h3><p>这些是机构能力方向，不是每家公司都自动获得的权益。</p></div>
        <div className="capability-grid">
          {investment.support.map((item, index) => <div className="capability-row" key={item}><strong>能力 0{index + 1}</strong><span className="capability-level strength-强">可能提供</span><p>{item}</p></div>)}
        </div>
      </section>

      <section className="organization-chapter" id="investment-access">
        <header className="organization-chapter-heading"><span>03</span><div><small>ACCESS PATHS</small><h2>怎样更有效地接触它</h2><p>公开投递不是唯一入口，但材料质量永远比介绍人身份更重要。</p></div></header>
        <div className="entry-path-list">
          {investment.access.map((item, index) => <div className="entry-path" key={item}><span>0{index + 1}</span><div><h3>{index === 0 ? "第一入口" : index === 1 ? "关系入口" : "材料准备"}</h3><p>{item}</p></div></div>)}
        </div>
        <div className="organization-subheading"><span>Q</span><h3>第一次会面前问自己</h3><p>好的融资材料先替投资人回答核心风险。</p></div>
        <div className="diligence-list">{investment.questions.map((question, index) => <div key={question}><span>Q{index + 1}</span><p>{question}</p></div>)}</div>
      </section>

      <section className="organization-chapter" id="investment-decision">
        <header className="organization-chapter-heading"><span>04</span><div><small>DECISION</small><h2>什么时候值得优先接触</h2><p>融资不是收集 Logo，而是选择未来多年一起做关键决定的人。</p></div></header>
        <div className="comparison-grid">
          <div className="comparison-choose"><span>优先选择，当</span><p>{investment.verdict.choose}</p></div>
          <div className="comparison-avoid"><span>暂不优先，当</span><p>{investment.verdict.avoid}</p></div>
          <div className="comparison-with"><span>还应该比较</span><p>{investment.verdict.compare}</p></div>
        </div>
        <div className="organization-final-verdict"><span>PIONEER 判断</span><h3>{resource.name}</h3><p>{resource.editorialNote}</p></div>
      </section>
    </article>
  );
}
