import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { pioneerGuide } from "../../data/knowledge";

export const metadata: Metadata = {
  title: "发现真问题 — Pioneer 创业指南",
  description: "暂停做产品，用真实行为判断一个创业问题是否值得继续投入，并完成问题陈述、假设卡与三天验证计划。",
};

const evidenceLevels = [
  { level: "弱", title: "态度", example: "“听起来不错，我可能会用。”", note: "礼貌和想象很多，不能作为继续投入的依据。" },
  { level: "较弱", title: "意向", example: "“如果有这个功能，我愿意试试。”", note: "比态度具体，但仍然没有真实成本。" },
  { level: "较强", title: "过去行为", example: "“上周又遇到一次，我花了两小时处理。”", note: "出现了具体时间、场景和损失。" },
  { level: "强", title: "现有替代", example: "“我们现在用表格加人工，每月支付 800 元。”", note: "用户已经为问题付出时间、金钱或改变行为。" },
  { level: "更强", title: "真实承诺", example: "愿意介绍决策者、预约试用、交付数据或付费。", note: "承诺并不等于成功，但比口头喜欢更接近真实需求。" },
];

const interviewQuestions = [
  "最近一次遇到这个问题是什么时候？当时发生了什么？",
  "哪一部分最麻烦？为什么？",
  "你现在怎么解决？能带我看一遍吗？",
  "这个问题带来了多少时间、金钱、机会或情绪成本？",
  "谁最在意这个问题？谁决定是否更换方案？",
  "你尝试过其他方法吗？最后为什么继续或放弃？",
];

export default function FindTheRealProblemGuide() {
  return (
    <main>
      <SiteHeader />

      <header className="guide-hero">
        <div className="guide-breadcrumbs">
          <Link href="/">首页</Link><span>/</span>
          <Link href="/knowledge">创业指南</Link><span>/</span>
          <b>发现真问题</b>
        </div>
        <div className="guide-hero-grid">
          <div>
            <span className="guide-kicker">PIONEER GUIDE 01 · {pioneerGuide.stage}</span>
            <h1>{pioneerGuide.title}</h1>
            <p>{pioneerGuide.description}</p>
          </div>
          <aside className="guide-output-card">
            <span>完成这篇指南后</span>
            <strong>不要只留下笔记，<br />带走三个行动结果。</strong>
            <ol>
              {pioneerGuide.outcome.map((item) => <li key={item}>{item}</li>)}
            </ol>
            <small>{pioneerGuide.duration} · 更新于 {pioneerGuide.updated}</small>
          </aside>
        </div>
      </header>

      <div className="guide-reading-layout">
        <aside className="guide-toc" aria-label="本篇目录">
          <span>本篇目录</span>
          <a href="#signal">01 · 先判断是否适合你</a>
          <a href="#principle">02 · 什么才算真问题</a>
          <a href="#observe">03 · 把想法改写成观察</a>
          <a href="#interview">04 · 用访谈收集证据</a>
          <a href="#experiment">05 · 完成三天验证</a>
          <a href="#decision">06 · 继续、调整或停止</a>
          <a href="#sources">参考来源</a>
        </aside>

        <article className="guide-article">
          <section className="guide-entry" id="signal">
            <div>
              <span className="guide-label">进入信号</span>
              <h2>如果你正在说这些话，先别急着做产品。</h2>
            </div>
            <ul>
              <li>“我觉得大家都会需要。”</li>
              <li>“市场这么大，只要拿到 1% 就够了。”</li>
              <li>“朋友都说这个想法很好。”</li>
              <li>“我已经列好了第一版的功能。”</li>
            </ul>
            <p>这些话并不证明方向错误，只说明你现在拥有的是<strong>一个关于解决方案的信念</strong>，还不是关于用户问题的证据。</p>
          </section>

          <section className="guide-section" id="principle">
            <div className="guide-section-heading"><span>01</span><div><small>FIRST PRINCIPLE</small><h2>创业不是从“产品”开始，而是从“谁正在为什么挣扎”开始。</h2></div></div>
            <p className="guide-lead">一个问题值得继续研究，不是因为它听上去重要，而是因为一群具体的人在一个具体场景中反复遇到它，并已经为此付出代价。</p>
            <div className="pioneer-judgment">
              <span>PIONEER 判断</span>
              <p>先寻找真实发生的行为，再讨论解决方案。用户的过去比他对未来的承诺更可信；他已经付出的成本，比一句“我喜欢”更接近需求。</p>
            </div>
            <h3>真问题通常同时具备六个要素</h3>
            <div className="problem-anatomy">
              <div><b>01</b><strong>具体的人</strong><p>不是“所有年轻人”，而是可以找到、可以交流的一类人。</p></div>
              <div><b>02</b><strong>具体场景</strong><p>问题在什么时间、地点和任务中出现。</p></div>
              <div><b>03</b><strong>重复发生</strong><p>不是一次偶发抱怨，而是持续出现的阻力。</p></div>
              <div><b>04</b><strong>真实成本</strong><p>消耗时间、金钱、机会、信任或情绪。</p></div>
              <div><b>05</b><strong>现有替代</strong><p>即使很笨拙，用户也正在用某种方式处理。</p></div>
              <div><b>06</b><strong>改变动力</strong><p>用户愿意为更好的结果付出行动或资源。</p></div>
            </div>
          </section>

          <section className="guide-section" id="observe">
            <div className="guide-section-heading"><span>02</span><div><small>FROM IDEA TO OBSERVATION</small><h2>先把“我要做什么”，改写成“我需要确认什么”。</h2></div></div>
            <div className="guide-scenario">
              <span>合成示例 · 不代表真实公司</span>
              <h3>“我要为小型餐饮店做一款 AI 排班工具。”</h3>
              <p>这是解决方案，不是问题。创始人真正需要确认的是：10–30 人规模的门店经理是否频繁因临时请假、客流波动和信息分散而重排班次；目前如何处理；每周为此损失多少时间；谁有权更换工具。</p>
            </div>
            <div className="rewrite-grid">
              <div className="rewrite-before"><span>不要先写</span><p>小型餐饮店需要一款更智能、更高效的 AI 排班平台。</p></div>
              <div className="rewrite-after"><span>先写成可验证问题</span><p>当门店临时出现人员变动时，10–30 人规模的餐饮店经理需要在多个聊天群和表格之间重新协调，平均每周发生数次，并造成可描述的时间或营业损失。</p></div>
            </div>
            <div className="worksheet-card">
              <span>你的问题陈述</span>
              <p>当 <b>［某类人］</b> 在 <b>［具体场景］</b> 想要 <b>［完成某个任务］</b> 时，会因为 <b>［具体阻力］</b> 而付出 <b>［可观察成本］</b>。他们目前使用 <b>［现有替代］</b>，但仍然存在 <b>［未解决之处］</b>。</p>
            </div>
          </section>

          <section className="guide-section" id="interview">
            <div className="guide-section-heading"><span>03</span><div><small>EVIDENCE, NOT COMPLIMENTS</small><h2>访谈的目标不是获得认可，而是重建一次真实经历。</h2></div></div>
            <p className="guide-lead">不要展示方案后问“你会不会用”。请对方回到最近一次经历，描述当时发生了什么、怎么处理、付出了什么。</p>
            <div className="question-list">
              {interviewQuestions.map((question, index) => <div key={question}><span>{String(index + 1).padStart(2, "0")}</span><p>{question}</p></div>)}
            </div>
            <h3>证据有强弱，不要把它们放在同一层</h3>
            <div className="evidence-ladder">
              {evidenceLevels.map((item) => (
                <div key={item.title}>
                  <span>{item.level}</span>
                  <strong>{item.title}</strong>
                  <q>{item.example}</q>
                  <p>{item.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="guide-section" id="experiment">
            <div className="guide-section-heading"><span>04</span><div><small>THREE-DAY TEST</small><h2>用三天减少一个最大的不确定性。</h2></div></div>
            <div className="hypothesis-card">
              <div><span>核心假设</span><p>我们相信 <b>［某类人］</b> 在 <b>［某个场景］</b> 经常遇到 <b>［问题］</b>。</p></div>
              <div><span>验证方式</span><p>我们将通过 <b>［访谈／观察／手工服务／预售］</b> 收集证据。</p></div>
              <div><span>衡量信号</span><p>我们记录 <b>［频率、成本、替代方案、承诺行为］</b>，不记录礼貌性的喜欢。</p></div>
              <div><span>预先门槛</span><p>在开始前写下什么结果会让我们 <b>继续、调整或停止</b>。</p></div>
            </div>
            <div className="three-day-plan">
              <div><span>DAY 01</span><strong>说清假设</strong><p>写出问题陈述和最危险假设；找到 5 位不是亲友、最近经历过该场景的人。</p></div>
              <div><span>DAY 02</span><strong>重建经历</strong><p>完成 5 次短访谈或现场观察。逐字记录具体事件、现有替代和付出成本。</p></div>
              <div><span>DAY 03</span><strong>只看证据</strong><p>把记录按证据强弱分类，找共同点和反例，再决定继续、调整还是停止。</p></div>
            </div>
          </section>

          <section className="guide-section" id="decision">
            <div className="guide-section-heading"><span>05</span><div><small>DECISION GATE</small><h2>验证不是为了证明你是对的，而是为了决定下一步。</h2></div></div>
            <div className="decision-note">
              <span>PIONEER 启发式门槛</span>
              <p>对于第一次、小规模的问题访谈，可以暂时采用：5 位陌生受访者中，至少 3 位能描述近期的具体经历，至少 2 位已经使用替代方案或付出明显成本，至少 1 位愿意做出下一步承诺。</p>
              <small>这只是帮助新手避免自我说服的工作门槛，不是市场成立的统计证明。不同产品、客单价和购买周期需要不同证据。</small>
            </div>
            <div className="decision-grid">
              <div className="decision-continue"><span>继续</span><strong>问题重复、成本明确、已有替代</strong><p>下一步验证谁最痛、谁做决定，以及最小解决方式。</p></div>
              <div className="decision-adjust"><span>调整</span><strong>问题存在，但人群或场景分散</strong><p>缩小人群，重写问题陈述，再做一轮针对性验证。</p></div>
              <div className="decision-stop"><span>停止</span><strong>只有态度，没有行为和成本</strong><p>暂停做产品，保存这次认知，把时间投入新的问题。</p></div>
            </div>
            <div className="mistakes-card">
              <span>常见误区</span>
              <ul>
                <li>只采访朋友、同事和已经支持你的人。</li>
                <li>花大部分时间介绍方案，而不是听对方描述经历。</li>
                <li>不断调整问题，直到对方说出你想听的答案。</li>
                <li>把行业规模、点赞或问卷意向当成真实需求证据。</li>
                <li>没有提前设定判断门槛，访谈结束后凭感觉解释结果。</li>
              </ul>
            </div>
          </section>

          <section className="guide-sources" id="sources">
            <div className="guide-section-heading"><span>06</span><div><small>SOURCES &amp; SCOPE</small><h2>参考来源与 Pioneer 的使用方式</h2></div></div>
            <p>本文由 Pioneer 重新组织、解释并设计行动步骤，不是对任何单一来源的翻译或替代。以下链接用于核验观点和继续阅读。</p>
            <div className="source-list">
              {pioneerGuide.sources.map((source) => (
                <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                  <div><span>{source.publisher} · {source.language}</span><strong>{source.title}</strong><p>{source.use}</p></div>
                  <b aria-hidden="true">↗</b>
                </a>
              ))}
            </div>
            <div className="guide-editorial-meta">
              <div><span>作者</span><strong>Pioneer 编辑部</strong></div>
              <div><span>最近核验</span><strong>{pioneerGuide.updated}</strong></div>
              <div><span>适用范围</span><strong>早期问题发现 · 通用原则</strong></div>
              <div><span>内容边界</span><strong>不是市场成功保证</strong></div>
            </div>
          </section>
        </article>

        <aside className="guide-sidecard">
          <span>完成标准</span>
          <strong>你能够不用产品名称，清楚描述：</strong>
          <ul>
            <li>谁遇到问题</li>
            <li>问题何时发生</li>
            <li>现在如何解决</li>
            <li>已经付出什么成本</li>
            <li>下一步收集什么证据</li>
          </ul>
          <Link href="/knowledge">返回全部指南 →</Link>
        </aside>
      </div>

      <section className="guide-next">
        <span>NEXT GUIDE · 正在整理</span>
        <h2>第一次和潜在用户交流，应该问什么？</h2>
        <p>下一篇将把访谈对象筛选、开场方式、追问方法和证据记录表整理成一套可以直接使用的流程。</p>
        <Link href="/knowledge">回到创业决策路径 <span aria-hidden="true">→</span></Link>
      </section>
      <SiteFooter />
    </main>
  );
}
