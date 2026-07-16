import type { Metadata } from "next";
import Link from "next/link";
import { MvpWorkbook } from "../../components/FounderWorksheets";
import { GuideProgress } from "../../components/GuideProgress";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { firstUsersGuide, interviewGuide, mvpGuide } from "../../data/knowledge";

export const metadata: Metadata = {
  title: "确定 MVP 边界 — Pioneer 创业指南",
  description: "从最危险的假设倒推第一版产品，只交付一个完整结果，并设计两周验证计划。",
};

const risks = [
  { type: "需求风险", question: "用户真的足够在意吗？", test: "手工交付、预售、真实任务试运行", warning: "访谈顺利不代表愿意改变行为" },
  { type: "使用风险", question: "用户能否独立获得结果？", test: "可用原型、现场观察、有限开放", warning: "创始人在场时成功可能是假象" },
  { type: "可行风险", question: "关键技术或交付能否成立？", test: "技术尖峰、人工后台、单点原型", warning: "技术可实现不代表有需求" },
  { type: "商业风险", question: "价值能否覆盖交付成本？", test: "真实报价、付费试点、成本记录", warning: "免费用户无法证明价格成立" },
];

const boundaries = [
  { type: "B2B 软件", result: "一个角色完成一次关键工作流", manual: "数据导入、报告生成、异常处理", exclude: "复杂权限、全套集成、管理后台" },
  { type: "消费产品", result: "用户在一个时刻获得可重复价值", manual: "内容策划、提醒、匹配", exclude: "社交体系、成就系统、完整个性化" },
  { type: "AI 产品", result: "在一个明确任务上节省时间或提高质量", manual: "复核、提示词调整、失败兜底", exclude: "支持所有格式、全自动代理、无限场景" },
  { type: "硬件产品", result: "证明物理行为与核心体验成立", manual: "现成零件、人工通知、3D 打印", exclude: "模具、量产外观、完整供应链优化" },
];

const twoWeekPlan = [
  ["第 1–2 天", "选择假设", "写清目标用户、关键场景、最危险假设和停止门槛。"],
  ["第 3–5 天", "搭出最短闭环", "只构建用户获得核心结果必须经过的步骤，其余尽量人工完成。"],
  ["第 6–10 天", "交给真实用户", "邀请 3–5 位符合条件的人完成真实任务，记录阻塞、求助和结果。"],
  ["第 11–12 天", "追问价值", "确认用户是否愿意再次使用、提供数据、介绍他人或付出真实成本。"],
  ["第 13–14 天", "做阶段决定", "继续增强核心闭环、缩小人群、改换实验，或者停止。"],
];

export default function DefineMvpGuide() {
  return (
    <main>
      <SiteHeader />
      <header className="guide-hero guide-hero-mint">
        <div className="guide-breadcrumbs"><Link href="/">首页</Link><span>/</span><Link href="/knowledge">创业指南</Link><span>/</span><b>确定 MVP 边界</b></div>
        <div className="guide-hero-grid">
          <div><span className="guide-kicker">PIONEER GUIDE 03 · {mvpGuide.stage}</span><h1>{mvpGuide.title}</h1><p>{mvpGuide.description}</p></div>
          <aside className="guide-output-card"><span>完成这篇指南后</span><strong>不是得到功能列表，<br />而是一条学习闭环。</strong><ol>{mvpGuide.outcome.map((item) => <li key={item}>{item}</li>)}</ol><small>{mvpGuide.duration} · 更新于 {mvpGuide.updated}</small></aside>
        </div>
      </header>

      <GuideProgress guide={mvpGuide} judgment="MVP 不是未来产品的廉价缩小版，而是让真实用户完成一个结果、让团队验证一个最危险假设的最低成本载体。" mistakes={["按功能数量定义最小", "同时验证需求、技术、定价和渠道", "用演示成功代替真实用户独立使用"]} action="写下这轮唯一学习目标，并删除所有不能帮助验证它的功能。" />

      <div className="guide-reading-layout" id="deep-guide">
        <aside className="guide-toc" aria-label="本篇目录"><span>本篇目录</span><a href="#signal">01 · 先判断是否该做 MVP</a><a href="#risk">02 · 找到最危险的假设</a><a href="#boundary">03 · 定义完整结果</a><a href="#types">04 · 不同类型怎么缩小</a><a href="#sprint">05 · 两周验证计划</a><a href="#workbook">06 · 填写 MVP 边界卡</a><a href="#decision">07 · 继续或停止</a><a href="#sources">参考来源</a></aside>
        <article className="guide-article">
          <section className="guide-entry" id="signal"><div><span className="guide-label">进入信号</span><h2>如果第一版不断增加功能，先停止排期。</h2></div><ul><li>每个人对 MVP 的目标理解不同</li><li>每个访谈都会增加一个新功能</li><li>团队说不清什么结果算验证成功</li><li>你需要数月才能让第一个用户体验</li></ul><p>这通常不是执行速度问题，而是<strong>没有确定本轮究竟要学习什么</strong>。在问题是否存在仍不清楚时，优先回到前两篇指南。</p></section>

          <section className="guide-section" id="risk"><div className="guide-section-heading"><span>01</span><div><small>RISK BEFORE FEATURES</small><h2>第一版的边界，应该由最大的不确定性决定。</h2></div></div><p className="guide-lead">列出需求、使用、技术和商业风险，然后问：哪一项一旦不成立，其余工作都会失去意义？一次 MVP 最好只承担一个主要学习目标。</p><div className="mvp-risk-grid">{risks.map((item) => <article key={item.type}><span>{item.type}</span><h3>{item.question}</h3><p><b>优先实验：</b>{item.test}</p><small>{item.warning}</small></article>)}</div><div className="pioneer-judgment"><span>PIONEER 判断</span><p>如果风险可以用一次报价、手工服务或点击原型回答，就不必先开发产品。Build 的对象是实验，不一定是软件。</p></div></section>

          <section className="guide-section" id="boundary"><div className="guide-section-heading"><span>02</span><div><small>ONE COMPLETE OUTCOME</small><h2>不要交付十个残缺功能，要交付一个完整结果。</h2></div></div><div className="mvp-story"><div><span>用户带来</span><strong>一个真实任务</strong><p>真实数据、真实场景和真实时间压力。</p></div><div><span>最短过程</span><strong>完成关键步骤</strong><p>前台可以简单，后台可以人工，但不能伪造结果。</p></div><div><span>用户带走</span><strong>一个可判断结果</strong><p>省下时间、完成工作、减少风险或获得新能力。</p></div></div><h3>判断一个功能是否进入第一版</h3><div className="decision-checklist"><div><strong>必须有</strong><p>没有它，目标用户无法获得核心结果。</p></div><div><strong>可以人工</strong><p>用户需要结果，但后台暂时不必自动化。</p></div><div><strong>只是想要</strong><p>让体验更完整，却不影响本轮学习。</p></div><div><strong>明确不做</strong><p>属于下一类用户、下一场景或规模化阶段。</p></div></div></section>

          <section className="guide-section" id="types"><div className="guide-section-heading"><span>03</span><div><small>DIFFERENT MVP SHAPES</small><h2>不同创业类型，“最小”的位置不同。</h2></div></div><div className="mvp-boundary-table"><div><span>类型</span><span>必须交付的结果</span><span>可以先人工</span><span>通常先排除</span></div>{boundaries.map((item) => <div key={item.type}><strong>{item.type}</strong><p>{item.result}</p><p>{item.manual}</p><p>{item.exclude}</p></div>)}</div><div className="guide-caution"><strong>人工并不等于欺骗。</strong><p>只要向用户清楚说明服务边界、隐私和交付方式，人工后台可以帮助团队先理解流程。涉及医疗、金融、安全和高风险自动化时，必须提高验证与合规标准。</p></div></section>

          <section className="guide-section" id="sprint"><div className="guide-section-heading"><span>04</span><div><small>TWO-WEEK LEARNING SPRINT</small><h2>两周不是开发期限，而是一次判断期限。</h2></div></div><div className="mvp-sprint">{twoWeekPlan.map(([time, title, action]) => <div key={time}><span>{time}</span><strong>{title}</strong><p>{action}</p></div>)}</div></section>

          <section className="guide-section" id="workbook"><div className="guide-section-heading"><span>05</span><div><small>DO THE WORK</small><h2>把功能争论变成一张边界卡。</h2></div></div><MvpWorkbook /></section>

          <section className="guide-section" id="decision"><div className="guide-section-heading"><span>06</span><div><small>MAKE THE DECISION</small><h2>发布不是完成，得到下一步判断才是完成。</h2></div></div><div className="three-way-decision"><div><span>继续</span><p>目标用户能独立获得核心结果，并愿意再次使用或承担真实成本。</p></div><div><span>缩小／调整</span><p>只有某个更窄人群成功，或价值成立但关键步骤仍需重做。</p></div><div><span>停止</span><p>用户不在意结果、没有改变动力，或者交付成本长期高于价值。</p></div></div><p className="guide-lead">不要因为“已经做了很多”继续。下一轮投入取决于新证据，而不是过去投入。</p></section>

          <section className="guide-sources" id="sources"><div className="guide-section-heading"><span>07</span><div><small>SOURCES &amp; SCOPE</small><h2>参考来源与 Pioneer 的使用方式</h2></div></div><p>本文适用于早期产品验证的一般判断，不替代工程安全、行业监管或专业合规审查。</p><div className="source-list">{mvpGuide.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><div><span>{source.publisher} · {source.language}</span><strong>{source.title}</strong><p>{source.use}</p></div><b aria-hidden="true">↗</b></a>)}</div></section>
        </article>
        <aside className="guide-sidecard"><span>MVP 完成标准</span><strong>第一版必须回答：</strong><ul><li>只为哪一类用户</li><li>只解决哪个时刻</li><li>交付什么完整结果</li><li>验证哪个危险假设</li><li>什么信号决定继续</li></ul><Link href="#workbook">打开边界工具 →</Link></aside>
      </div>
      <section className="guide-next"><span>NEXT GUIDE · 早期获客</span><h2>{firstUsersGuide.title}</h2><p>{firstUsersGuide.description}</p><Link href={`/knowledge/${firstUsersGuide.slug}`}>进入下一篇指南 <span aria-hidden="true">→</span></Link><small>上一阶段：<Link href={`/knowledge/${interviewGuide.slug}`}>第一次用户访谈</Link></small></section>
      <SiteFooter />
    </main>
  );
}
