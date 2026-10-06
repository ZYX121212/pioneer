import { ContentPoints } from "./ContentPoints";
import type { Resource } from "../data/resources";
import type { StartupResearchProfile } from "../data/startupProfiles";
import { getStartupStory } from "../data/startupStories";

export function StartupResearchDetail({ resource, startup }: { resource: Resource; startup: StartupResearchProfile }) {
  const currentStage = resource.fundingStage ?? resource.status;
  const productLayers = startup.product.map((item) => item.layer).join(" → ");
  const strongestSignal = startup.signals[0];
  const biggestRisk = startup.risks[0];
  const nextCheckpoint = startup.risks[0]?.watch ?? resource.timing;
  const story = getStartupStory(resource.slug);
  const fundingSignals = startup.signals.filter((signal) => /融资|轮|资本|上市|IPO|公开市场/.test(`${signal.label}${signal.evidence}`));
  const sourceLinks = [
    ...(resource.sources ?? []),
    { label: resource.source, href: resource.url },
    ...(story?.coverage ?? []).map((item) => ({ label: item.title, href: item.href })),
  ].filter((item, index, items) => items.findIndex((candidate) => candidate.href === item.href) === index);
  const positionRows = [
    {
      question: "用户为什么改变现状",
      alternative: "继续使用原有工具、人工流程或内部方案",
      choice: startup.snapshot.wedge,
      proof: strongestSignal.evidence,
    },
    {
      question: "产品组成",
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
        <a href="#startup-timeline"><span>02</span>人物与历程</a>
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
        <h2>项目简介</h2>
        <ContentPoints text={resource.overview} />
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
        <div className="editorial-callout startup-editorial-callout"><span>编辑分析</span><ContentPoints text={resource.editorialNote} /></div>
      </section>

      <section className="organization-chapter" id="startup-timeline">
        <header className="organization-chapter-heading"><span>02</span><div><small>FOUNDERS &amp; JOURNEY</small><h2>创始团队与发展历程</h2><p>介绍创始团队的背景、创办公司的原因，以及公司从成立至今的重要发展节点。</p></div></header>
        <div className={`startup-founder-portrait${story ? " startup-founder-portrait-confirmed" : ""}`}>
          <div className="startup-founder-mark"><span>{resource.monogram}</span><small>{story?.founded ? `创立于 ${story.founded}` : "创始资料待确认"}</small></div>
          <div className="startup-founder-story">
            <span>FOUNDER PORTRAIT</span>
            <h3>{story ? story.founders.map((founder) => founder.name).join(" · ") : "创始团队公开资料正在补充"}</h3>
            <p>{story?.origin ?? "当前收录的官方来源尚不足以确认创始人的姓名、经历与分工。Pioneer 不根据媒体转述或搜索摘要推测填写。"}</p>
            {story ? <div className="startup-founder-people">{story.founders.map((founder) => <div key={founder.name}><strong>{founder.name}</strong><small>{founder.role}</small><p>{founder.background}</p></div>)}</div> : null}
          </div>
          <div className="startup-founder-thesis">
            <span>创始团队与项目的匹配度</span>
            <p>{story?.founderThesis ?? `需要继续确认：团队过去的经历是否与“${startup.snapshot.problem}”这一问题形成真实的 Founder–Market Fit。`}</p>
            {story ? <a href={story.founderSource.href} target="_blank" rel="noreferrer">{story.founderSource.label} ↗</a> : <small>资料不足时明确留白，不把推测写成事实。</small>}
          </div>
        </div>
        <div className="organization-subheading startup-journey-heading"><span>PATH</span><h3>融资与重要发展节点</h3><p>按时间查看公司的融资、产品发布、客户验证和当前阶段。</p></div>
        <div className="startup-timeline" aria-label={`${resource.name} 阶段与证据脉络`}>
          <div><span>01</span><small>创立起点</small><h3>{story?.founded ? `${story.founded} · 公司创立` : "从问题出发"}</h3><p>{story?.origin ?? startup.snapshot.problem}</p><b>{story?.founderThesis ?? startup.snapshot.wedge}</b></div>
          {(story?.funding.length ? story.funding : fundingSignals.slice(0, 2)).map((item, index) => "round" in item ? (
            <div key={`${item.date}-${item.round}`}><span>0{index + 2}</span><small>{item.date}</small><h3>{item.round} · {item.amount}</h3><p>{item.detail}</p><b><a href={item.source.href} target="_blank" rel="noreferrer">{item.source.label} ↗</a></b></div>
          ) : (
            <div key={item.label}><span>0{index + 2}</span><small>公开融资信号</small><h3>{item.label}</h3><p>{item.evidence}</p><b>{item.interpretation}</b></div>
          ))}
          <div><span>→</span><small>当前阶段</small><h3>{currentStage}</h3><p>{resource.status} · {resource.timing}</p><b>{resource.verified}，融资、产品和经营信息仍应以官方最新披露为准。</b></div>
          <div><span>?</span><small>下一验证</small><h3>{biggestRisk.title}</h3><p>{biggestRisk.risk}</p><b>接下来观察：{nextCheckpoint}</b></div>
        </div>
        <div className="startup-public-facts">
          {resource.highlights.map((fact) => <div key={fact.label}><span>{fact.label}</span><strong>{fact.value}</strong></div>)}
        </div>
      </section>

      <section className="organization-chapter" id="startup-users">
        <header className="organization-chapter-heading"><span>03</span><div><small>USERS &amp; CUSTOMERS</small><h2>用户与客户</h2><p>介绍产品的主要使用者、购买者以及他们希望解决的具体问题。</p></div></header>
        <div className="startup-persona-table">
          <div className="startup-persona-head"><span>角色</span><span>是谁</span><span>核心任务或痛点</span><span>为什么会行动</span></div>
          <div><strong>核心用户</strong><p>{startup.snapshot.user}</p><p>{startup.snapshot.problem}</p><p>{startup.snapshot.wedge}</p></div>
          <div><strong>产品客户</strong><p>{startup.business.customer}</p><p>{startup.product[0].detail}</p><p>{startup.product[0].implication}</p></div>
          <div><strong>实际付款者</strong><p>{startup.business.payer}</p><p>需要用预算解决效率、增长、风险或基础设施问题。</p><p>{startup.business.model}</p></div>
        </div>
        <div className="organization-subheading"><span>FIT</span><h3>适合参考这个项目的人</h3><p>这些项目经验更适合面临相似用户、产品或商业问题的创业者参考。</p></div>
        <div className="startup-fit-grid">{resource.bestFor.map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p></div>)}</div>
      </section>

      <section className="organization-chapter" id="startup-product">
        <header className="organization-chapter-heading"><span>04</span><div><small>PRODUCT &amp; FEATURES</small><h2>产品与核心功能</h2><p>介绍产品由哪些部分组成、各部分解决什么问题，以及它们如何共同完成用户任务。</p></div></header>
        {startup.showcase?.secondaryImage ? (
          <figure className="startup-product-interface">
            <img src={startup.showcase.secondaryImage} alt={startup.showcase.secondaryAlt ?? `${resource.name} 产品界面`} width="1941" height="1140" loading="lazy" />
            <figcaption><span>PRODUCT INTERFACE</span><strong>产品界面包括生产效率、质量、成本与设备健康管理。</strong><a href={startup.showcase.sourceUrl} target="_blank" rel="noreferrer">查看官方产品手册 ↗</a></figcaption>
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
        <header className="organization-chapter-heading"><span>05</span><div><small>BUSINESS MODEL</small><h2>商业模式</h2><p>介绍谁在使用、谁负责付费、公司如何收费，以及未来准备如何扩大业务。</p></div></header>
        <div className="startup-business-map">
          <div><span>01 / CUSTOMER</span><h3>谁使用</h3><p>{startup.business.customer}</p></div>
          <div><span>02 / PAYER</span><h3>谁付钱</h3><p>{startup.business.payer}</p></div>
          <div><span>03 / REVENUE</span><h3>如何收费</h3><p>{startup.business.model}</p></div>
          <div><span>04 / EXPANSION</span><h3>如何扩大</h3><p>{startup.business.expansion}</p></div>
        </div>
        <div className="startup-business-test">
          <span>商业模式判断</span>
          <p>需要验证交付标准、复购情况，以及服务下一位客户的成本。</p>
          <div><strong>当前状态</strong><b>{resource.status}</b></div><div><strong>阶段口径</strong><b>{currentStage}</b></div><div><strong>近期节奏</strong><b>{resource.timing}</b></div>
        </div>
      </section>

      <section className="organization-chapter" id="startup-evidence">
        <header className="organization-chapter-heading"><span>06</span><div><small>PROGRESS &amp; COVERAGE</small><h2>公司进展与相关报道</h2><p>汇总公司已经公开的产品、融资、客户和经营进展，并提供可以继续阅读的原始资料。</p></div></header>
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
        <div className="organization-subheading startup-coverage-heading"><span>READ</span><h3>相关报道与原始信息</h3><p>每条资料列出来源、主要信息和适用范围。</p></div>
        <div className="startup-coverage-grid">
          {(story?.coverage ?? sourceLinks.map((source) => ({ type: /融资|轮/.test(source.label) ? "融资披露" as const : "官方公告" as const, date: resource.verified.replace(" 核验", ""), title: source.label, summary: "查看项目的原始公开资料，核对产品、融资、经营或公司阶段的具体表述。", href: source.href }))).map((item, index) => (
            <a href={item.href} target="_blank" rel="noreferrer" key={`${item.href}-${index}`}>
              <div><span>{item.type}</span><small>{item.date}</small></div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <strong>阅读原始信息 ↗</strong>
            </a>
          ))}
        </div>
        <p className="startup-coverage-note">Pioneer 优先展示公司公告、产品资料和创始人原始访谈。媒体报道只有在能够补充独立验证或不同观点时才值得加入。</p>
      </section>

      <section className="organization-chapter" id="startup-position">
        <header className="organization-chapter-heading"><span>07</span><div><small>MARKET &amp; COMPETITION</small><h2>市场与竞争</h2><p>介绍客户目前使用的替代方案、这个项目的差异，以及它仍然需要证明的优势。</p></div></header>
        <div className="startup-position-table">
          <div className="startup-position-head"><span>判断问题</span><span>客户原来的选择</span><span>这个项目的选择</span><span>仍需证明</span></div>
          {positionRows.map((row) => <div key={row.question}><strong>{row.question}</strong><p>{row.alternative}</p><p>{row.choice}</p><p>{row.proof}</p></div>)}
        </div>
        <div className="editorial-callout startup-position-callout"><span>竞争位置判断</span><ContentPoints text={resource.whyItMatters} /></div>
      </section>

      <section className="organization-chapter" id="startup-risks">
        <header className="organization-chapter-heading"><span>08</span><div><small>RISKS &amp; WATCHLIST</small><h2>风险与挑战</h2><p>列出项目当前最重要的不确定性，以及后续可以用来判断变化的观察指标。</p></div></header>
        <div className="startup-risk-grid">
          {startup.risks.map((item, index) => (
            <div key={item.title}><div><span>R0{index + 1}</span><b>关键风险</b></div><h3>{item.title}</h3><p>{item.risk}</p><strong>继续观察</strong><p>{item.watch}</p></div>
          ))}
        </div>
        <div className="organization-subheading"><span>!</span><h3>需要特别注意的信息</h3><p>这些事项不代表项目一定失败，但在形成判断前需要进一步核实。</p></div>
        <ul className="boundary-list startup-boundary-list">{resource.considerations.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="organization-chapter" id="startup-lessons">
        <header className="organization-chapter-heading"><span>09</span><div><small>FOUNDER LESSONS</small><h2>创业启示</h2><p>总结这个项目在产品、市场和公司建设方面值得其他创业者参考的做法。</p></div></header>
        <div className="research-playbook startup-playbook">
          {startup.lessons.map((item, index) => (
            <div key={item.title}><span>0{index + 1}</span><div><small>可迁移原则</small><h3>{item.title}</h3><p>{item.lesson}</p></div><strong>本周行动：{item.action}</strong></div>
          ))}
        </div>
      </section>

      <section className="organization-chapter startup-verdict-section" id="startup-verdict">
        <header className="organization-chapter-heading"><span>10</span><div><small>SUMMARY &amp; NEXT STEPS</small><h2>总结与后续观察</h2><p>总结项目目前的阶段、优势和不确定性，以及接下来最值得关注的变化。</p></div></header>
        <div className="startup-verdict-grid">
          <div><span>当前阶段</span><strong>{currentStage}</strong></div>
          <div><span>最强信号</span><strong>{strongestSignal.label}</strong><p>{strongestSignal.evidence}</p></div>
          <div><span>最大不确定性</span><strong>{biggestRisk.title}</strong><p>{biggestRisk.risk}</p></div>
          <div><span>未来 6 个月观察</span><strong>{nextCheckpoint}</strong></div>
        </div>
        <div className="organization-subheading"><span>Q</span><h3>仍需进一步确认的问题</h3><p>这些尚未公开或尚未充分验证的信息，会影响对项目长期质量的判断。</p></div>
        <div className="diligence-list">{startup.questions.map((question, index) => <div key={question}><span>Q{index + 1}</span><p>{question}</p></div>)}</div>
        <div className="organization-final-verdict startup-final-verdict"><span>编辑备注 · {resource.verified}</span><h2>{resource.name}</h2><ContentPoints text={resource.whyItMatters} /><div><span>行动建议</span><p>先核验右侧官方来源，再用本页的用户、商业模式、证据和风险问题建立自己的判断，不把融资规模或媒体热度当作结论。</p></div></div>
      </section>
    </article>
  );
}
