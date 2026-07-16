import type { Metadata } from "next";
import Link from "next/link";
import { ProblemWorkbook } from "../../components/FounderWorksheets";
import { GuideProgress } from "../../components/GuideProgress";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { interviewGuide, pioneerGuide } from "../../data/knowledge";

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

const worthinessChecks = [
  { title: "痛感", question: "不解决会失去什么？", strong: "损失收入、时间、机会、安全或信任", weak: "只是觉得现有方式不够优雅" },
  { title: "频率", question: "多久发生一次？", strong: "高频发生，或低频但一次损失巨大", weak: "很久才发生一次，而且可以忽略" },
  { title: "替代", question: "现在怎么处理？", strong: "已经花钱、雇人、拼凑工具或改变流程", weak: "从未尝试，也不打算解决" },
  { title: "预算", question: "谁为结果负责？", strong: "能找到拥有预算、指标或责任的人", weak: "人人都说重要，但无人负责" },
  { title: "可触达", question: "能否持续找到这类人？", strong: "人群有明确身份、渠道或聚集场所", weak: "只能用模糊人口标签描述" },
  { title: "时机", question: "为什么是现在？", strong: "技术、政策、成本或行为变化打开了窗口", weak: "没有变化，只因为你刚想到" },
];

const startupVariations = [
  { type: "B2B 软件", focus: "区分使用者、管理者、采购者和最终付款者。", evidence: "真实工作流、预算归属、切换成本、采购周期。", trap: "只采访一线使用者，却忽略谁能批准购买。" },
  { type: "消费产品", focus: "观察用户在没有提醒时是否会主动回来。", evidence: "重复使用、主动分享、放弃旧习惯、愿意付费。", trap: "把下载、点赞和“很喜欢”当成长期需求。" },
  { type: "硬件产品", focus: "先验证物理场景、频率与行为改变，再承担制造成本。", evidence: "现场观察、纸板模型、手工原型、预订或押金。", trap: "先优化技术规格，最后才发现用户不愿改变流程。" },
  { type: "双边平台", focus: "分别验证供给方和需求方为何愿意加入。", evidence: "两边现有替代、匹配频率、冷启动区域和交易密度。", trap: "只证明一边有兴趣，假设另一边会自然出现。" },
  { type: "AI 产品", focus: "确认用户愿意把哪一部分任务交给模型，以及错误的代价。", evidence: "真实任务样本、容错范围、人工复核成本、持续使用。", trap: "证明模型能做，却没有证明用户愿意信任并改变工作方式。" },
  { type: "专业服务", focus: "人工交付不是失败，往往是最早的学习工具。", evidence: "客户愿意付费、重复购买、交付过程出现可重复步骤。", trap: "急于软件化，还没有理解客户真正购买的结果。" },
];

const experiments = [
  { name: "问题访谈", best: "理解场景、频率和现有替代", cost: "低", time: "1–3 天", evidence: "中", risk: "容易得到礼貌性回答" },
  { name: "现场观察", best: "发现用户说不清或习以为常的行为", cost: "低", time: "1–5 天", evidence: "中强", risk: "被观察时行为可能改变" },
  { name: "日记研究", best: "记录跨天、低频或难以现场观察的问题", cost: "低", time: "1–3 周", evidence: "中", risk: "参与者可能中途停止记录" },
  { name: "纸面／点击原型", best: "验证流程理解与关键交互", cost: "低", time: "1–3 天", evidence: "中", risk: "能完成不等于会持续使用" },
  { name: "落地页", best: "验证信息表达和初步兴趣", cost: "低", time: "1–3 天", evidence: "弱中", risk: "留下邮箱不等于付费需求" },
  { name: "假门测试", best: "观察现有用户是否主动选择新能力", cost: "低中", time: "3–7 天", evidence: "中", risk: "必须透明处理预期，避免欺骗" },
  { name: "手工礼宾服务", best: "在不开发系统前验证结果价值", cost: "中", time: "3–14 天", evidence: "强", risk: "人工体验可能高于未来产品" },
  { name: "报价测试", best: "验证决策流程、预算和异议", cost: "低", time: "3–14 天", evidence: "强", risk: "报价对象必须拥有真实购买资格" },
  { name: "预售／押金", best: "验证用户是否愿意承担真实成本", cost: "中", time: "1–4 周", evidence: "很强", risk: "要明确交付条件、退款和风险" },
  { name: "有限试运行", best: "验证实际使用、交付和重复价值", cost: "中高", time: "2–6 周", evidence: "很强", risk: "一次成功不等于可规模化" },
];

const caseStudies = [
  {
    type: "B2B 软件",
    idea: "为小型餐饮店做 AI 排班工具",
    wrong: "店长需要更智能的排班系统。",
    observation: "临时请假时，店长在群聊、电话和表格之间协调；问题集中在晚班和周末，且老板关心空岗造成的营业损失。",
    test: "访谈 6 位店长、观察一次真实换班，并由创始人手工完成一周排班协调。",
    decision: "从“自动排班平台”缩小为“临时空岗协调”，先验证老板是否愿意为减少空岗付费。",
  },
  {
    type: "消费产品",
    idea: "帮助年轻人坚持阅读的社交应用",
    wrong: "年轻人需要更有趣的阅读社区。",
    observation: "用户收藏很多书单，但真正阻力是下班后缺少连续注意力；已有替代是短视频、播客和读书群打卡。",
    test: "招募 12 人参加七天人工共读，不开发应用，只观察每天是否主动回来以及什么时刻放弃。",
    decision: "没有把点赞当需求，转而验证“十分钟可完成的连续阅读任务”是否形成重复行为。",
  },
  {
    type: "硬件产品",
    idea: "提醒独居老人按时服药的智能药盒",
    wrong: "老人需要一个带提醒功能的智能药盒。",
    observation: "部分老人并非忘记，而是不确定是否已经服用；家属关心异常是否被及时发现，老人则不愿每天充电和学习新操作。",
    test: "使用纸盒、贴纸和人工短信完成一周模拟，观察打开、误触、补药和家属响应过程。",
    decision: "先验证“不确定是否服用”与家属异常通知，而不是直接投入传感器和模具。",
  },
  {
    type: "AI 产品",
    idea: "自动替律师起草合同审查意见",
    wrong: "律师需要更快的 AI 合同审查。",
    observation: "初级律师耗时最多的是定位条款和对照内部标准，但最终意见涉及责任，不愿完全交给模型；合伙人关心可追溯性。",
    test: "用 20 份脱敏合同做人工加模型的礼宾服务，记录哪些建议被采纳、复核耗时和错误类型。",
    decision: "从“替代审查”改为“定位差异并提供可追溯依据”，把人工复核设计为产品的一部分。",
  },
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

      <GuideProgress
        guide={pioneerGuide}
        judgment="先证明一群具体的人正在反复为问题付出成本，再讨论你的解决方案。过去行为、现有替代和真实承诺比口头喜欢更可信。"
        mistakes={["从功能列表反推用户问题", "只采访朋友和支持者", "把留下邮箱或口头认可当成需求"]}
        action="写出一份不包含产品名称的问题陈述，并安排一个三天内能接触真实行为的实验。"
      />

      <div className="guide-reading-layout" id="deep-guide">
        <aside className="guide-toc" aria-label="本篇目录">
          <span>本篇目录</span>
          <a href="#signal">01 · 先判断是否适合你</a>
          <a href="#principle">02 · 什么才算真问题</a>
          <a href="#worthiness">03 · 是否值得创业解决</a>
          <a href="#observe">04 · 把想法改写成观察</a>
          <a href="#interview">05 · 用访谈收集证据</a>
          <a href="#experiment">06 · 完成三天验证</a>
          <a href="#experiment-library">实验方法库</a>
          <a href="#cases">四类完整案例</a>
          <a href="#workbook">填写实践工具</a>
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

          <section className="guide-section" id="worthiness">
            <div className="guide-section-heading"><span>02</span><div><small>WORTH SOLVING</small><h2>真实存在的问题，也不一定值得成立一家公司。</h2></div></div>
            <p className="guide-lead">“有人遇到”只是起点。创业者还要判断它是否足够痛、足够频繁、有人负责、能够触达，并且此刻存在改变的窗口。</p>
            <div className="worthiness-grid">
              {worthinessChecks.map((item) => (
                <article key={item.title}>
                  <span>{item.title}</span><h3>{item.question}</h3>
                  <div><b>强信号</b><p>{item.strong}</p></div>
                  <div><b>弱信号</b><p>{item.weak}</p></div>
                </article>
              ))}
            </div>
            <div className="guide-caution"><strong>不要把六项简单相加。</strong><p>低频问题也可能因为一次损失巨大而值得解决；高频问题也可能因为没有预算和改变动力而无法形成业务。这个框架用于暴露缺失证据，不是自动计算市场分数。</p></div>
          </section>

          <section className="guide-section" id="observe">
            <div className="guide-section-heading"><span>03</span><div><small>FROM IDEA TO OBSERVATION</small><h2>先把“我要做什么”，改写成“我需要确认什么”。</h2></div></div>
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
            <div className="guide-section-heading"><span>04</span><div><small>EVIDENCE, NOT COMPLIMENTS</small><h2>访谈的目标不是获得认可，而是重建一次真实经历。</h2></div></div>
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
            <h3>不同类型的创业，需要寻找不同证据</h3>
            <div className="startup-variation-table">
              <div className="variation-head"><span>类型</span><span>首先验证</span><span>关键证据</span><span>最常见误区</span></div>
              {startupVariations.map((item) => (
                <div key={item.type}><strong>{item.type}</strong><p>{item.focus}</p><p>{item.evidence}</p><p>{item.trap}</p></div>
              ))}
            </div>
          </section>

          <section className="guide-section" id="experiment">
            <div className="guide-section-heading"><span>05</span><div><small>THREE-DAY TEST</small><h2>用三天减少一个最大的不确定性。</h2></div></div>
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

          <section className="guide-section" id="experiment-library">
            <div className="guide-section-heading"><span>06</span><div><small>EXPERIMENT LIBRARY</small><h2>不要默认选择访谈，选择离真实行为更近的实验。</h2></div></div>
            <p className="guide-lead">实验不是为了显得科学，而是用最低成本减少当前最危险的不确定性。越接近真实使用、付费和交付，证据通常越强，成本也越高。</p>
            <div className="experiment-table">
              <div className="experiment-head"><span>实验</span><span>最适合验证</span><span>成本</span><span>周期</span><span>证据</span><span>主要误判</span></div>
              {experiments.map((item) => (
                <div key={item.name}><strong>{item.name}</strong><p>{item.best}</p><span>{item.cost}</span><span>{item.time}</span><b>{item.evidence}</b><p>{item.risk}</p></div>
              ))}
            </div>
            <div className="experiment-rule"><span>选择规则</span><p>先问“我最担心哪一个假设错了”，再选择能让用户付出真实行动的最低成本实验。不要因为会做落地页，就把所有问题都变成邮箱注册率。</p></div>
          </section>

          <section className="guide-section" id="cases">
            <div className="guide-section-heading"><span>07</span><div><small>WORKED CASES</small><h2>同一个框架，在不同创业类型中如何变化。</h2></div></div>
            <p className="guide-lead">以下均为 Pioneer 为教学目的编写的合成案例，不代表真实企业，也不证明对应市场成立。重点是展示判断过程。</p>
            <div className="case-study-list">
              {caseStudies.map((item, index) => (
                <article key={item.type}>
                  <header><span>CASE {String(index + 1).padStart(2, "0")} · {item.type}</span><h3>{item.idea}</h3></header>
                  <div><span>最初错误</span><p>{item.wrong}</p></div>
                  <div><span>实际观察</span><p>{item.observation}</p></div>
                  <div><span>最低成本实验</span><p>{item.test}</p></div>
                  <div><span>阶段决定</span><p>{item.decision}</p></div>
                </article>
              ))}
            </div>
          </section>

          <section className="guide-section" id="workbook">
            <div className="guide-section-heading"><span>08</span><div><small>DO THE WORK</small><h2>现在把你的想法写成一个可以被证伪的问题。</h2></div></div>
            <p className="guide-lead">不要等到“理解得更完整”再开始。填写下面的工作表，空白处就是你下一步需要寻找的证据。</p>
            <ProblemWorkbook />
          </section>

          <section className="guide-section" id="decision">
            <div className="guide-section-heading"><span>09</span><div><small>DECISION GATE</small><h2>验证不是为了证明你是对的，而是为了决定下一步。</h2></div></div>
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
            <div className="guide-section-heading"><span>10</span><div><small>SOURCES &amp; SCOPE</small><h2>参考来源与 Pioneer 的使用方式</h2></div></div>
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
        <span>NEXT GUIDE · 已上线</span>
        <h2>{interviewGuide.title}</h2>
        <p>{interviewGuide.description}</p>
        <Link href={`/knowledge/${interviewGuide.slug}`}>进入第二篇指南 <span aria-hidden="true">→</span></Link>
      </section>
      <SiteFooter />
    </main>
  );
}
