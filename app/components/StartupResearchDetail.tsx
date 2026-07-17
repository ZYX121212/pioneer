import type { Resource } from "../data/resources";
import type { StartupResearchProfile } from "../data/startupProfiles";

export function StartupResearchDetail({ resource, startup }: { resource: Resource; startup: StartupResearchProfile }) {
  return (
    <article className="detail-main organization-intelligence">
      <nav className="organization-chapter-nav" aria-label="创业项目研究章节">
        <a href="#startup-problem">问题与切口</a>
        <a href="#startup-product">产品系统</a>
        <a href="#startup-business">商业逻辑</a>
        <a href="#startup-lessons">创业启示</a>
        <a href="#startup-risks">风险判断</a>
      </nav>

      <section className="organization-thesis">
        <span className="section-index">STARTUP THESIS</span>
        <h2>先理解它为什么现在成立</h2>
        <p>{resource.overview}</p>
        <div className="organization-verdict-strip">
          <div><span>解决的问题</span><strong>{startup.snapshot.problem}</strong></div>
          <div><span>核心用户</span><strong>{startup.snapshot.user}</strong></div>
          <div><span>初始切口</span><strong>{startup.snapshot.wedge}</strong></div>
        </div>
      </section>

      <section className="organization-chapter" id="startup-problem">
        <header className="organization-chapter-heading"><span>01</span><div><small>PROBLEM &amp; WEDGE</small><h2>它选择了什么问题</h2><p>先分清真实问题、目标用户和进入市场的最小切口。</p></div></header>
        <div className="identity-model-grid">
          <div><span>用户痛点</span><p>{startup.snapshot.problem}</p></div>
          <div><span>服务对象</span><p>{startup.snapshot.user}</p></div>
          <div><span>为什么是现在</span><p>{startup.snapshot.now}</p></div>
        </div>
        <div className="editorial-callout"><span>PIONEER 观察</span><p>{resource.editorialNote}</p></div>
      </section>

      <section className="organization-chapter" id="startup-product">
        <header className="organization-chapter-heading"><span>02</span><div><small>PRODUCT SYSTEM</small><h2>产品不是一个功能，而是一套系统</h2><p>拆解它如何从核心能力延伸到用户产品、平台和交付。</p></div></header>
        <div className="offer-detail-grid">
          {startup.product.map((item, index) => (
            <div className="offer-detail-card" key={item.layer}>
              <span>0{index + 1}</span><h3>{item.layer}</h3><p>{item.detail}</p>
              <div><b>产品含义</b><p>{item.implication}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="organization-chapter" id="startup-business">
        <header className="organization-chapter-heading"><span>03</span><div><small>BUSINESS MODEL</small><h2>它准备如何形成商业价值</h2><p>用户、付款者和收入模型可能不是同一个对象。</p></div></header>
        <div className="identity-model-grid">
          <div><span>使用者</span><p>{startup.business.customer}</p></div>
          <div><span>付款者</span><p>{startup.business.payer}</p></div>
          <div><span>收入模型</span><p>{startup.business.model}</p></div>
        </div>
        <div className="organization-subheading"><span>EXPAND</span><h3>下一步扩张路径</h3><p>{startup.business.expansion}</p></div>
        <div className="capability-grid">
          {startup.signals.map((signal) => (
            <div className="capability-row" key={signal.label}>
              <strong>{signal.label}</strong><span className="capability-level strength-强">公开信号</span><p>{signal.evidence}</p>
              <small>{signal.interpretation}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="organization-chapter" id="startup-lessons">
        <header className="organization-chapter-heading"><span>04</span><div><small>FOUNDER LESSONS</small><h2>创业者真正可以借鉴什么</h2><p>不复制表面功能，而是提炼可以迁移到自己项目的决策方法。</p></div></header>
        <div className="research-playbook">
          {startup.lessons.map((item, index) => (
            <div key={item.title}><span>0{index + 1}</span><div><small>可迁移原则</small><h3>{item.title}</h3><p>{item.lesson}</p></div><strong>行动：{item.action}</strong></div>
          ))}
        </div>
      </section>

      <section className="organization-chapter" id="startup-risks">
        <header className="organization-chapter-heading"><span>05</span><div><small>RISKS &amp; OPEN QUESTIONS</small><h2>增长信号之外，还要看什么</h2><p>创业项目研究不是成功故事，而是对关键假设的持续检查。</p></div></header>
        <div className="cost-map-grid">
          {startup.risks.map((item) => (
            <div className="cost-map-card" key={item.title}><div><strong>{item.title}</strong><span className="cost-level cost-高">关键风险</span></div><p>{item.risk}</p><small>继续观察：{item.watch}</small></div>
          ))}
        </div>
        <div className="organization-subheading"><span>Q</span><h3>继续研究时必须回答</h3><p>这些问题比新闻热度更接近项目的长期质量。</p></div>
        <div className="diligence-list">{startup.questions.map((question, index) => <div key={question}><span>Q{index + 1}</span><p>{question}</p></div>)}</div>
        <div className="organization-final-verdict"><span>PIONEER 最终判断</span><h3>{resource.name}</h3><p>{resource.whyItMatters}</p></div>
      </section>
    </article>
  );
}
