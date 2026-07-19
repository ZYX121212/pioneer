import type { Resource } from "../data/resources";
import type { StartupResearchProfile } from "../data/startupProfiles";

export function StartupResearchDetail({ resource, startup }: { resource: Resource; startup: StartupResearchProfile }) {
  const currentStage = resource.fundingStage ?? resource.status;
  const productLayers = startup.product.map((item) => item.layer).join(" → ");
  const strongestSignal = startup.signals[0];
  const biggestRisk = startup.risks[0];
  const nextCheckpoint = startup.risks[0]?.watch ?? resource.timing;
  const positionRows = [
    {
      question: "用户为什么改变现状",
      alternative: "继续使用原有工具、人工流程或内部方案",
      choice: startup.snapshot.wedge,
      proof: strongestSignal.evidence,
    },
    {
      question: "为什么不是一个单点功能",
      alternative: `只解决 ${startup.product[0].layer} 的局部问题`,
      choice: productLayers,
      proof: startup.product[1]?.implication ?? startup.product[0].implication,
    },
    {
      question: "如何从项目走向公司",
      alternative: "依靠一次性项目或不可复制的定制交付",
      choice: startup.business.model,
      proof: startup.business.expansion,
    },
  ];

  return (
    <article className="detail-main organization-intelligence startup-intelligence">
      <nav className="organization-chapter-nav startup-chapter-nav" aria-label="创业项目研究章节">
        <a href="#startup-overview"><span>01</span>一分钟理解</a>
        <a href="#startup-timeline"><span>02</span>阶段脉络</a>
        <a href="#startup-users"><span>03</span>用户画像</a>
        <a href="#startup-product"><span>04</span>产品系统</a>
        <a href="#startup-business"><span>05</span>商业模式</a>
        <a href="#startup-evidence"><span>06</span>证据强度</a>
        <a href="#startup-position"><span>07</span>竞争位置</a>
        <a href="#startup-risks"><span>08</span>风险指标</a>
        <a href="#startup-lessons"><span>09</span>创业启示</a>
        <a href="#startup-verdict"><span>10</span>最终判断</a>
      </nav>

      <section className="organization-thesis startup-thesis" id="startup-overview">
        <span className="section-index">01 / ONE-MINUTE BRIEF</span>
        <h2>先用一分钟理解它</h2>
        <p>{resource.overview}</p>
        <div className="organization-verdict-strip startup-summary-strip">
          <div><span>产品是什么</span><strong>{startup.showcase?.what ?? startup.product.map((item) => item.layer).join(" + ")}</strong></div>
          <div><span>谁会使用</span><strong>{startup.snapshot.user}</strong></div>
          <div><span>完成什么任务</span><strong>{startup.showcase?.does ?? startup.snapshot.wedge}</strong></div>
          <div><span>当前验证信号</span><strong>{strongestSignal.evidence}</strong></div>
        </div>
        <div className="startup-purpose-map" aria-label={`${resource.name} 使用前后变化`}>
          <div><span>使用前</span><h3>用户正被什么困住</h3><p>{startup.snapshot.problem}</p></div>
          <i aria-hidden="true">→</i>
          <div><span>产品介入</span><h3>这个产品具体做什么</h3><p>{startup.showcase?.does ?? startup.snapshot.wedge}</p></div>
          <i aria-hidden="true">→</i>
          <div><span>业务结果</span><h3>为什么有人愿意付钱</h3><p>{startup.business.model}</p></div>
        </div>
        <div className="editorial-callout startup-editorial-callout"><span>PIONEER 核心判断 · 编辑分析</span><p>{resource.editorialNote}</p></div>
      </section>

      <section className="organization-chapter" id="startup-timeline">
        <header className="organization-chapter-heading"><span>02</span><div><small>STAGE &amp; EVIDENCE TRAIL</small><h2>它走到了哪一步</h2><p>不把融资新闻当作全部进展，而是把问题、产品、阶段和下一项验证连接起来。</p></div></header>
        <div className="startup-timeline" aria-label={`${resource.name} 阶段与证据脉络`}>
          <div><span>01</span><small>问题起点</small><h3>{startup.signals[0].label}</h3><p>{startup.signals[0].evidence}</p><b>{startup.signals[0].interpretation}</b></div>
          <div><span>02</span><small>产品形成</small><h3>{productLayers}</h3><p>{startup.product.map((item) => item.detail).join(" ")}</p><b>判断重点：这些层次能否形成持续的数据与使用闭环。</b></div>
          <div><span>03</span><small>当前阶段</small><h3>{currentStage}</h3><p>{resource.status} · {resource.timing}</p><b>{resource.verified}，融资、产品和经营信息仍应以官方最新披露为准。</b></div>
          <div><span>04</span><small>下一验证</small><h3>{biggestRisk.title}</h3><p>{biggestRisk.risk}</p><b>接下来观察：{nextCheckpoint}</b></div>
        </div>
        <div className="startup-public-facts">
          {resource.highlights.map((fact) => <div key={fact.label}><span>{fact.label}</span><strong>{fact.value}</strong></div>)}
        </div>
      </section>

      <section className="organization-chapter" id="startup-users">
        <header className="organization-chapter-heading"><span>03</span><div><small>USER &amp; BUYER PORTRAIT</small><h2>谁在使用，谁在付钱</h2><p>创业项目能否成立，取决于使用者的任务、付款者的预算和两者是否指向同一价值。</p></div></header>
        <div className="startup-persona-table">
          <div className="startup-persona-head"><span>角色</span><span>是谁</span><span>核心任务或痛点</span><span>为什么会行动</span></div>
          <div><strong>核心用户</strong><p>{startup.snapshot.user}</p><p>{startup.snapshot.problem}</p><p>{startup.snapshot.wedge}</p></div>
          <div><strong>产品客户</strong><p>{startup.business.customer}</p><p>{startup.product[0].detail}</p><p>{startup.product[0].implication}</p></div>
          <div><strong>实际付款者</strong><p>{startup.business.payer}</p><p>需要用预算解决效率、增长、风险或基础设施问题。</p><p>{startup.business.model}</p></div>
        </div>
        <div className="organization-subheading"><span>FIT</span><h3>哪些创业者最值得研究它</h3><p>不是要求你复制这个项目，而是判断其决策方法是否与你的问题相似。</p></div>
        <div className="startup-fit-grid">{resource.bestFor.map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p></div>)}</div>
      </section>

      <section className="organization-chapter" id="startup-product">
        <header className="organization-chapter-heading"><span>04</span><div><small>PRODUCT SYSTEM</small><h2>产品不是一个功能，而是一套系统</h2><p>逐层观察核心能力如何变成产品、交付和可以持续扩张的基础设施。</p></div></header>
        {startup.showcase?.secondaryImage ? (
          <figure className="startup-product-interface">
            <img src={startup.showcase.secondaryImage} alt={startup.showcase.secondaryAlt ?? `${resource.name} 产品界面`} width="1941" height="1140" loading="lazy" />
            <figcaption><span>PRODUCT INTERFACE</span><strong>不只展示机器人本体，也展示生产效率、质量、成本与设备健康如何被管理。</strong><a href={startup.showcase.sourceUrl} target="_blank" rel="noreferrer">查看官方产品手册 ↗</a></figcaption>
          </figure>
        ) : null}
        <div className="startup-system-flow">
          {startup.product.map((item, index) => (
            <div className="startup-system-node" key={item.layer}>
              <div><span>0{index + 1}</span><small>{index === 0 ? "切入层" : index === startup.product.length - 1 ? "扩张层" : "连接层"}</small></div>
              <h3>{item.layer}</h3><p>{item.detail}</p><strong>产品含义</strong><p>{item.implication}</p>
            </div>
          ))}
        </div>
        <div className="startup-loop"><span>PRODUCT LOOP</span><p>真实任务 → 用户使用 → 产生数据与反馈 → 改善核心能力 → 扩展到更多任务与客户</p></div>
      </section>

      <section className="organization-chapter" id="startup-business">
        <header className="organization-chapter-heading"><span>05</span><div><small>BUSINESS MODEL &amp; GTM</small><h2>它准备如何形成商业价值</h2><p>把客户、付款者、收入模型和扩张路径放在同一个商业系统里判断。</p></div></header>
        <div className="startup-business-map">
          <div><span>01 / CUSTOMER</span><h3>谁使用</h3><p>{startup.business.customer}</p></div>
          <div><span>02 / PAYER</span><h3>谁付钱</h3><p>{startup.business.payer}</p></div>
          <div><span>03 / REVENUE</span><h3>如何收费</h3><p>{startup.business.model}</p></div>
          <div><span>04 / EXPANSION</span><h3>如何扩大</h3><p>{startup.business.expansion}</p></div>
        </div>
        <div className="startup-business-test">
          <span>商业模式判断</span>
          <p>真正需要继续验证的不是“市场是否足够大”，而是一次成功交付能否被标准化、复购，并以更低成本复制到下一位客户。</p>
          <div><strong>当前状态</strong><b>{resource.status}</b></div><div><strong>阶段口径</strong><b>{currentStage}</b></div><div><strong>近期节奏</strong><b>{resource.timing}</b></div>
        </div>
      </section>

      <section className="organization-chapter" id="startup-evidence">
        <header className="organization-chapter-heading"><span>06</span><div><small>EVIDENCE &amp; SIGNALS</small><h2>哪些信息是证据，哪些只是故事</h2><p>融资是资本信号，产品是能力信号，客户使用与复购才更接近商业质量。</p></div></header>
        <div className="startup-evidence-grid">
          {startup.signals.map((signal, index) => (
            <div key={signal.label}><span>公开信号 0{index + 1}</span><h3>{signal.label}</h3><p>{signal.evidence}</p><strong>Pioneer 解读</strong><p>{signal.interpretation}</p></div>
          ))}
        </div>
        <div className="evidence-note startup-evidence-legend">
          <div><span>官方事实</span><p>公司、产品、融资和数字只采用右侧所列来源可支持的口径。</p></div>
          <div><span>编辑判断</span><p>阶段归类、产品含义、竞争位置和风险优先级由 Pioneer 整理。</p></div>
          <div><span>仍然未知</span><p>未公开收入、毛利、复购和交付数据时，会把它们保留为尽调问题。</p></div>
        </div>
      </section>

      <section className="organization-chapter" id="startup-position">
        <header className="organization-chapter-heading"><span>07</span><div><small>POSITION &amp; ALTERNATIVES</small><h2>它必须战胜什么</h2><p>早期项目真正的竞争对手通常不是另一家明星公司，而是客户继续维持现状。</p></div></header>
        <div className="startup-position-table">
          <div className="startup-position-head"><span>判断问题</span><span>客户原来的选择</span><span>这个项目的选择</span><span>仍需证明</span></div>
          {positionRows.map((row) => <div key={row.question}><strong>{row.question}</strong><p>{row.alternative}</p><p>{row.choice}</p><p>{row.proof}</p></div>)}
        </div>
        <div className="editorial-callout startup-position-callout"><span>竞争位置判断</span><p>{resource.whyItMatters}</p></div>
      </section>

      <section className="organization-chapter" id="startup-risks">
        <header className="organization-chapter-heading"><span>08</span><div><small>RISKS &amp; WATCHLIST</small><h2>每一项风险都要对应观察指标</h2><p>风险不是一句“竞争激烈”，而是某个关键假设失败时，应该看到什么变化。</p></div></header>
        <div className="startup-risk-grid">
          {startup.risks.map((item, index) => (
            <div key={item.title}><div><span>R0{index + 1}</span><b>关键风险</b></div><h3>{item.title}</h3><p>{item.risk}</p><strong>继续观察</strong><p>{item.watch}</p></div>
          ))}
        </div>
        <div className="organization-subheading"><span>!</span><h3>研究时不能忽略</h3><p>这些事项不代表项目一定失败，而是行动前需要主动复核的边界。</p></div>
        <ul className="boundary-list startup-boundary-list">{resource.considerations.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="organization-chapter" id="startup-lessons">
        <header className="organization-chapter-heading"><span>09</span><div><small>FOUNDER PLAYBOOK</small><h2>创业者真正可以借鉴什么</h2><p>不复制表面功能，而是把这个项目的关键选择转化成你本周可以执行的动作。</p></div></header>
        <div className="research-playbook startup-playbook">
          {startup.lessons.map((item, index) => (
            <div key={item.title}><span>0{index + 1}</span><div><small>可迁移原则</small><h3>{item.title}</h3><p>{item.lesson}</p></div><strong>本周行动：{item.action}</strong></div>
          ))}
        </div>
      </section>

      <section className="organization-chapter startup-verdict-section" id="startup-verdict">
        <header className="organization-chapter-heading"><span>10</span><div><small>FINAL VERDICT &amp; DILIGENCE</small><h2>最终判断，以及下一步看什么</h2><p>一份研究档案不负责替你下结论，而是让下一次判断更有证据。</p></div></header>
        <div className="startup-verdict-grid">
          <div><span>当前阶段</span><strong>{currentStage}</strong></div>
          <div><span>最强信号</span><strong>{strongestSignal.label}</strong><p>{strongestSignal.evidence}</p></div>
          <div><span>最大不确定性</span><strong>{biggestRisk.title}</strong><p>{biggestRisk.risk}</p></div>
          <div><span>未来 6 个月观察</span><strong>{nextCheckpoint}</strong></div>
        </div>
        <div className="organization-subheading"><span>Q</span><h3>继续研究时必须回答</h3><p>这些问题比新闻热度更接近项目的长期质量。</p></div>
        <div className="diligence-list">{startup.questions.map((question, index) => <div key={question}><span>Q{index + 1}</span><p>{question}</p></div>)}</div>
        <div className="organization-final-verdict startup-final-verdict"><span>PIONEER 最终判断 · {resource.verified}</span><h2>{resource.name}</h2><p>{resource.whyItMatters}</p><div><span>行动建议</span><p>先核验右侧官方来源，再用本页的用户、商业模式、证据和风险问题建立自己的判断，不把融资规模或媒体热度当作结论。</p></div></div>
      </section>
    </article>
  );
}
