import type { Metadata } from "next";
import Link from "next/link";
import { FirstUsersWorkbook } from "../../components/FounderWorksheets";
import { GuideProgress } from "../../components/GuideProgress";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { firstUsersGuide, mvpGuide, pricingGuide } from "../../data/knowledge";

export const metadata: Metadata = { title: "找到最初十个用户 — Pioneer 创业指南", description: "定义窄人群、建立 30 人名单、手工触达并推进第一批真实用户。", alternates: { canonical: "/knowledge/find-your-first-ten-users", languages: { "zh-CN": "/knowledge/find-your-first-ten-users", en: "/en/knowledge/find-your-first-ten-users" } } };

const channels = [
  { order: "01", name: "二度关系", use: "专业人群、高信任 B2B", move: "请认识的人介绍最近经历过目标问题的人。", signal: "介绍人愿意说明为什么对方符合条件" },
  { order: "02", name: "问题现场", use: "零售、线下服务、物理行为", move: "在问题刚发生后询问过程，并邀请体验下一步。", signal: "用户愿意当场展示现有做法" },
  { order: "03", name: "垂直社群", use: "角色明确、有共同任务的人群", move: "用具体筛选条件招募，不泛泛发布产品广告。", signal: "符合条件的人主动描述近期事件" },
  { order: "04", name: "定向陌生触达", use: "可以通过职业、公司或行为识别", move: "每天发送少量基于对方情境的个性化邀请。", signal: "目标用户回复并愿意承担下一步" },
];

const pipeline = [
  ["名单", "符合角色、行为和时间条件", "30 人"], ["已联系", "发送了具体、个性化邀请", "20 人"], ["已回复", "不是礼貌点赞，而是实际回应", "8 人"], ["已体验", "完成一次真实任务", "3–5 人"], ["已承诺", "复用、介绍、交付资料或付费", "1–3 人"],
];

export default function FirstTenUsersGuide() {
  return (
    <main>
      <SiteHeader languageHref="/en/knowledge/find-your-first-ten-users" />
      <header className="guide-hero guide-hero-yellow"><div className="guide-breadcrumbs"><Link href="/">首页</Link><span>/</span><Link href="/knowledge">创业指南</Link><span>/</span><b>找到最初十个用户</b></div><div className="guide-hero-grid"><div><span className="guide-kicker">PIONEER GUIDE 04 · {firstUsersGuide.stage}</span><h1>{firstUsersGuide.title}</h1><p>{firstUsersGuide.description}</p></div><aside className="guide-output-card"><span>完成这篇指南后</span><strong>本篇练习与记录</strong><ol>{firstUsersGuide.outcome.map((item) => <li key={item}>{item}</li>)}</ol><small>{firstUsersGuide.duration} · 更新于 {firstUsersGuide.updated}</small></aside></div></header>

      <GuideProgress guide={firstUsersGuide} judgment="最初十个用户不是增长问题，而是学习问题。创始人需要亲自找到、招募和服务一个足够窄的人群，观察谁真正推进。" mistakes={["先做大规模投放再判断人群", "把曝光、点赞和注册当成用户", "复制同一段推销话术发送给所有人"]} action="写出一个包含角色、近期行为和触发时机的筛选条件，并建立第一批 30 人名单。" />

      <div className="guide-reading-layout" id="deep-guide">
        <aside className="guide-toc" aria-label="本篇目录"><span>本篇目录</span><a href="#signal">01 · 先判断卡在哪里</a><a href="#segment">02 · 定义第一批人</a><a href="#list">03 · 建立 30 人名单</a><a href="#outreach">04 · 写触达信息</a><a href="#pipeline">05 · 推进而不是曝光</a><a href="#concierge">06 · 做不能规模化的事</a><a href="#workbook">07 · 填写行动卡</a><a href="#decision">08 · 七天后怎么判断</a><a href="#sources">参考来源</a></aside>
        <article className="guide-article">
          <section className="guide-entry" id="signal"><div><span className="guide-label">进入信号</span><h2>“没有用户”可能是四个不同的问题。</h2></div><ul><li>你说不清最先服务哪一类人</li><li>知道是谁，但不知道他们在哪里</li><li>找到人了，却没有人愿意回复</li><li>有人体验，却没有人再次使用</li></ul><p>不要统一归因于“营销不够”。它们分别指向<strong>人群、渠道、表达和价值</strong>，需要不同动作。</p></section>

          <section className="guide-section" id="segment"><div className="guide-section-heading"><span>01</span><div><small>NARROW FIRST</small><h2>第一批用户的筛选条件</h2></div></div><p className="guide-lead">“中小企业”“年轻人”“内容创作者”都太宽。第一批用户必须能用角色、近期行为和触发时机识别。</p><div className="segment-formula"><span>第一批用户 =</span><strong>具体角色</strong><b>＋</b><strong>近期发生的行为</strong><b>＋</b><strong>问题突然变重要的时机</strong></div><div className="rewrite-grid"><div className="rewrite-before"><span>太宽</span><p>需要提高效率的餐饮店。</p></div><div className="rewrite-after"><span>可找到</span><p>过去 30 天至少处理过两次临时换班、目前依靠群聊协调的独立餐厅店长。</p></div></div><div className="pioneer-judgment"><span>PIONEER 判断</span><p>人群越窄，越容易找到共同语言、重复场景和有效介绍。第一批用户代表学习起点，不等于永久市场边界。</p></div></section>

          <section className="guide-section" id="list"><div className="guide-section-heading"><span>02</span><div><small>BUILD A REAL LIST</small><h2>先写出 30 个具体名字，不要先写“做社交媒体”。</h2></div></div><div className="channel-ladder">{channels.map((item) => <article key={item.name}><span>{item.order} · {item.use}</span><h3>{item.name}</h3><p>{item.move}</p><small>强信号：{item.signal}</small></article>)}</div><p className="guide-lead">每个人至少记录：姓名或组织、为什么符合条件、从哪里找到、谁可以介绍、下一步和最后联系时间。没有具体名单，就没有可执行渠道。</p></section>

          <section className="guide-section" id="outreach"><div className="guide-section-heading"><span>03</span><div><small>ASK FOR ONE NEXT STEP</small><h2>一条有效触达，只解释相关性并请求一个动作。</h2></div></div><div className="outreach-anatomy"><div><span>为什么是你</span><p>提到对方的角色、近期行为或工作场景。</p></div><div><span>我在理解什么</span><p>描述问题，不堆产品功能和宏大愿景。</p></div><div><span>只请求一步</span><p>一次 20 分钟交流、真实任务体验或提供一份材料。</p></div><div><span>降低压力</span><p>说明不是群发推销、可以拒绝，以及资料如何使用。</p></div></div><div className="opening-script"><span>问题访谈邀请</span><p>“看到你负责［具体职责］。我正在理解［目标场景］中处理［具体问题］的真实过程，不推销产品。你过去 30 天是否遇到过这件事？如果有，是否愿意用 20 分钟讲一次最近经历？”</p></div><div className="opening-script"><span>已有 MVP 的体验邀请</span><p>“我们正在为［非常具体的人群］手工解决［具体结果］，目前只开放给少量真实任务。你如果本周刚好要处理［场景］，我可以和你一起完成一次；希望你提供真实材料，并允许我们观察过程。”</p></div></section>

          <section className="guide-section" id="pipeline"><div className="guide-section-heading"><span>04</span><div><small>TRACK MOVEMENT</small><h2>不要看有多少人看见，要看多少人向前走了一步。</h2></div></div><div className="user-pipeline">{pipeline.map(([name, meaning, target]) => <div key={name}><span>{name}</span><p>{meaning}</p><strong>{target}</strong></div>)}</div><div className="guide-caution"><strong>数字是行动基准，不是成功公式。</strong><p>高客单价 B2B、硬件、医疗或双边平台的周期会更长。关键是预先定义每一步的真实推进，而不是追求统一转化率。</p></div></section>

          <section className="guide-section" id="concierge"><div className="guide-section-heading"><span>05</span><div><small>DO THINGS THAT DON&apos;T SCALE</small><h2>招募、服务与反馈记录</h2></div></div><div className="concierge-grid"><div><strong>亲自招募</strong><p>听见用户如何描述问题，知道哪些表达会被忽略。</p></div><div><strong>亲自入门</strong><p>观察用户在哪一步犹豫、误解和需要帮助。</p></div><div><strong>人工交付</strong><p>在自动化之前理解真正影响结果的工作。</p></div><div><strong>主动复盘</strong><p>体验后 24 小时内追问价值、失败和下一次使用。</p></div></div><p className="guide-lead">记录人工步骤的时间和重复模式。它们将来可能成为产品能力，也可能证明这项业务永远无法经济地交付。</p></section>

          <section className="guide-section" id="workbook"><div className="guide-section-heading"><span>06</span><div><small>DO THE WORK</small><h2>把“做推广”改写成七天可以完成的动作。</h2></div></div><FirstUsersWorkbook /></section>

          <section className="guide-section" id="decision"><div className="guide-section-heading"><span>07</span><div><small>READ THE SIGNALS</small><h2>七天后，区分人群、触达和产品问题。</h2></div></div><div className="three-way-decision"><div><span>没人回复</span><p>先检查名单是否真的符合条件、信息是否具体、请求是否过大，不要立刻重做产品。</p></div><div><span>回复但不体验</span><p>问题可能存在，但优先级、信任、时机或交付承诺不足。</p></div><div><span>体验但不回来</span><p>渠道已经工作，核心结果、使用频率或体验成本需要重新判断。</p></div></div><div className="decision-note"><span>完成标准</span><p>你能明确说出谁最愿意推进、他们为何现在行动、哪个触达方式带来真实体验，以及下一周应该继续什么。</p><small>十个不是神奇数字。目标是从零跨到一组可观察、可反复交流的真实用户。</small></div></section>

          <section className="guide-sources" id="sources"><div className="guide-section-heading"><span>08</span><div><small>SOURCES &amp; SCOPE</small><h2>参考来源与 Pioneer 的使用方式</h2></div></div><p>本文讨论创始人主导的早期招募，不代表成熟公司的规模化获客策略。陌生联系应尊重平台规则、隐私和拒绝。</p><div className="source-list">{firstUsersGuide.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><div><span>{source.publisher} · {source.language}</span><strong>{source.title}</strong><p>{source.use}</p></div><b aria-hidden="true">↗</b></a>)}</div></section>
        </article>
        <aside className="guide-sidecard"><span>七天完成标准</span><strong>不要只留下曝光量：</strong><ul><li>30 个具体目标名字</li><li>20 次个性化触达</li><li>明确记录回复原因</li><li>3–5 次真实体验</li><li>至少一个真实承诺</li></ul><Link href="#workbook">打开行动工具 →</Link></aside>
      </div>
      <section className="guide-next"><span>NEXT GUIDE · 商业模式</span><h2>{pricingGuide.title}</h2><p>{pricingGuide.description}</p><Link href={`/knowledge/${pricingGuide.slug}`}>进入定价指南 <span aria-hidden="true">→</span></Link><small>上一阶段：<Link href={`/knowledge/${mvpGuide.slug}`}>确定 MVP 边界</Link></small></section>
      <SiteFooter />
    </main>
  );
}
