/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { waicDays, waicFounderRoutes, waicSources, waicVenues } from "../data/waicGuide";

export const metadata: Metadata = {
  title: "WAIC 2026 上海创业者完整参会指南 — Pioneer",
  description: "WAIC 2026 四馆选择、创业者参会路线、7 月 16–20 日周边活动与行动清单。",
};

const quickNav = [
  ["01", "大会总览", "waic-overview"],
  ["02", "四馆怎么选", "waic-venues"],
  ["03", "创业者路线", "waic-routes"],
  ["04", "看什么", "waic-focus"],
  ["05", "周边活动", "waic-side-events"],
  ["06", "行动清单", "waic-action"],
] as const;

const focusAreas = [
  {
    title: "产品是否真的进入工作流",
    question: "用户为什么今天就要换掉原来的做法？",
    watch: "不只看 Demo，追问客户、频次、部署周期、复购与失败案例。",
  },
  {
    title: "Agent 从能力走向交付",
    question: "谁为准确率、权限、数据和结果负责？",
    watch: "关注企业采购、系统集成、人机分工和可计算的 ROI。",
  },
  {
    title: "模型之外的新基础设施",
    question: "推理、上下文、记忆与数据层还有什么瓶颈？",
    watch: "比较延迟、成本、稳定性、迁移难度和开发者采用门槛。",
  },
  {
    title: "具身智能的交付现实",
    question: "从实验演示到连续工作的距离有多远？",
    watch: "观察数据闭环、本体成本、可靠性、运维和具体付费场景。",
  },
  {
    title: "AI 硬件的新交互入口",
    question: "它是新设备，还是手机功能的昂贵替代？",
    watch: "重点看留存、使用频次、功耗、供应链与售后，而不是发布热度。",
  },
  {
    title: "中国 AI 产品如何出海",
    question: "优势来自技术、供应链、速度，还是渠道？",
    watch: "按市场拆解合规、支付、定价、渠道、本地化和服务成本。",
  },
];

const actionList = [
  ["会前 24 小时", "只定 1 个主目标、3 场必去内容、5 位希望见的人；为每位联系人写清楚为什么要见。"],
  ["进入场馆后", "先完成目标路线，再处理临时邀请。每次交流记录：对方是谁、关键事实、下一步、截止时间。"],
  ["参加周边活动", "一天最多选一个晚间主活动。审核制活动没有确认通知，就不要直接到场。"],
  ["离场当晚", "用 15 分钟删除无效名片，把有效连接分成客户、合作、资本、人才四类。"],
  ["48 小时内", "发送带上下文的跟进，不写“保持联系”；明确下一次通话、资料或介绍动作。"],
  ["一周后", "复盘是否产生访谈、试用、合作或融资下一步。若没有，说明参会方式需要调整。"],
];

export default function Waic2026Page() {
  const eventCount = waicDays.reduce((total, day) => total + day.events.length, 0);

  return (
    <main className="waic-page">
      <SiteHeader />

      <section className="waic-hero">
        <div className="waic-breadcrumbs">
          <a href="/">首页</a><span>/</span><a href="/events">创业活动</a><span>/</span><b>WAIC 2026</b>
        </div>
        <div className="waic-hero-grid">
          <div>
            <span className="section-index">PIONEER FIELD GUIDE · SHANGHAI</span>
            <p className="waic-kicker">世界人工智能大会 · 创业者现场指南</p>
            <h1>WAIC 2026<br /><em>不只是逛展，带着任务去。</em></h1>
            <p className="waic-lead">7 月 17–20 日，上海三地四馆。这里把官方大会、创业者判断框架与 7 月 16–20 日周边活动放进同一份可执行路线。</p>
            <div className="waic-hero-actions">
              <a className="waic-primary-link" href="#waic-side-events">查看周边活动 ↓</a>
              <a className="waic-secondary-link" href="https://www.worldaic.com.cn/register" target="_blank" rel="noreferrer">官方报名 ↗</a>
            </div>
          </div>
          <aside className="waic-fact-panel">
            <span>WAIC 2026</span>
            <div><small>大会日期</small><strong>07.17—07.20</strong></div>
            <div><small>主题</small><strong>智能伙伴 · 共创未来</strong></div>
            <div><small>规模</small><strong>140+ 论坛 · 1100+ 企业</strong></div>
            <div><small>本页整理</small><strong>{eventCount} 场周边活动</strong></div>
            <p>官方数据与活动安排可能继续变化，出发前务必点击原始链接复核。</p>
          </aside>
        </div>
      </section>

      <nav className="waic-quick-nav" aria-label="WAIC 专题快速导航">
        {quickNav.map(([number, label, id]) => (
          <a href={`#${id}`} key={id}><span>{number}</span><b>{label}</b></a>
        ))}
      </nav>

      <div className="detail-layout waic-detail-layout">
        <div className="detail-main waic-detail-main">
      <section className="waic-section waic-overview" id="waic-overview">
        <div className="waic-section-heading">
          <span>01</span>
          <div><small>START HERE</small><h2>先判断：WAIC 对你有没有价值</h2></div>
        </div>
        <div className="waic-decision-grid">
          <article className="waic-decision-yes">
            <span>值得去，如果你要</span>
            <ul>
              <li>在两天内扫描 AI 产品、技术和产业趋势</li>
              <li>验证一个具体赛道、客户或合作假设</li>
              <li>集中约见平时分散在各地的人</li>
              <li>寻找技术伙伴、早期客户、资本或出海入口</li>
            </ul>
          </article>
          <article>
            <span>不值得去，如果你只是</span>
            <ul>
              <li>没有目标地追逐热门演讲与明星嘉宾</li>
              <li>用加微信数量代替有下一步的关系</li>
              <li>在四个场馆之间频繁移动、每场只听十分钟</li>
              <li>期待大会直接替你找到产品方向或融资</li>
            </ul>
          </article>
        </div>
        <div className="waic-scale-strip" aria-label="WAIC 官方规模数据">
          <div><strong>140+</strong><span>主题论坛</span></div>
          <div><strong>1,400+</strong><span>演讲嘉宾</span></div>
          <div><strong>1,100+</strong><span>参展企业</span></div>
          <div><strong>3,000+</strong><span>前沿展品</span></div>
          <div><strong>300+</strong><span>全球首发</span></div>
        </div>
        <p className="waic-source-note">以上规模数据来自 WAIC 官方与上海市政府公开信息；现场安排以官方最新公告为准。</p>
      </section>

      <section className="waic-section" id="waic-venues">
        <div className="waic-section-heading">
          <span>02</span>
          <div><small>THREE AREAS · FOUR VENUES</small><h2>四馆不是都要去，先选主场</h2></div>
        </div>
        <p className="waic-section-intro">世博中心与世博展览馆可以组成一条路线；张江和西岸应各自按半天或一天安排。跨区赶场通常会牺牲真正的交流时间。</p>
        <div className="waic-venue-grid">
          {waicVenues.map((venue, index) => (
            <article key={venue.name}>
              <span>0{index + 1}</span>
              <small>{venue.role}</small>
              <h3>{venue.name}</h3>
              <p><b>更适合：</b>{venue.fit}</p>
              <p className="waic-editorial"><b>Pioneer 建议：</b>{venue.advice}</p>
            </article>
          ))}
        </div>
        <div className="waic-logistics-grid">
          <article><span>票证</span><h3>先完成官方注册</h3><p>论坛、展览和部分专业活动可能使用不同资格。以官方报名页显示的票种、审核结果和入场说明为准，不要只凭周边活动凭证进入大会。</p><a href="https://www.worldaic.com.cn/register" target="_blank" rel="noreferrer">官方报名 ↗</a></article>
          <article><span>移动</span><h3>一天只选一个区域</h3><p>世博两馆可连排；张江与西岸分别成线。为安检、步行、临时交流留出至少 30–45 分钟，不把日程排到无缝衔接。</p></article>
          <article><span>随身</span><h3>带任务，不带厚资料</h3><p>准备 20 秒自我介绍、可手机打开的一页材料、充电设备和会面清单。需要展示产品时，准备离线视频以应对网络拥堵。</p></article>
          <article><span>核验</span><h3>每天早晨再看一次</h3><p>论坛场次、周边活动地址与审核结果都可能临时变化。以官方指南、主办方通知和报名成功消息为最后依据。</p><a href="https://waica2026.worldaic.com.cn/participant-guide/" target="_blank" rel="noreferrer">官方参会指南 ↗</a></article>
        </div>
      </section>

      <section className="waic-section waic-dark-section" id="waic-routes">
        <div className="waic-section-heading">
          <span>03</span>
          <div><small>FOUNDER ROUTES</small><h2>不要按日程走，按创业任务走</h2></div>
        </div>
        <div className="waic-route-list">
          {waicFounderRoutes.map((route) => (
            <article key={route.number}>
              <span>{route.number}</span>
              <div><small>{route.target}</small><h3>{route.title}</h3><p>{route.route}</p></div>
              <strong>离场产出<br />{route.output}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="waic-section" id="waic-focus">
        <div className="waic-section-heading">
          <span>04</span>
          <div><small>WHAT FOUNDERS SHOULD WATCH</small><h2>创业者真正应该看的六件事</h2></div>
        </div>
        <p className="waic-section-intro">大会的价值不是告诉你“什么最热”，而是让你看到技术、产品、客户与资本之间哪些连接已经发生，哪些仍停留在叙事。</p>
        <div className="waic-focus-grid">
          {focusAreas.map((focus, index) => (
            <article key={focus.title}>
              <span>0{index + 1}</span>
              <h3>{focus.title}</h3>
              <p><b>第一性问题：</b>{focus.question}</p>
              <p><b>现场看什么：</b>{focus.watch}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="waic-section waic-events-section" id="waic-side-events">
        <div className="waic-section-heading">
          <span>05</span>
          <div><small>SIDE EVENTS · JUL 16—20</small><h2>WAIC 周边活动日历</h2></div>
        </div>
        <div className="waic-event-notice">
          <strong>先看清楚再出发</strong>
          <p>本页共整理 {eventCount} 场。周边活动不属于 WAIC 官方统一日程，很多采用限额、审核或入群通知；地点和名额随时可能变化。这里提供选择依据，不代表报名成功或主办方背书。</p>
        </div>
        <nav className="waic-date-nav" aria-label="按日期跳转周边活动">
          {waicDays.map((day) => <a href={`#${day.id}`} key={day.id}><b>{day.date}</b><span>{day.label}</span></a>)}
        </nav>

        <div className="waic-days">
          {waicDays.map((day) => (
            <section className="waic-day" id={day.id} key={day.id}>
              <header>
                <div><span>{day.date}</span><h3>{day.label}</h3></div>
                <p>{day.note}</p>
                <strong>{day.events.length} 场已整理</strong>
              </header>
              <div className="waic-event-grid">
                {day.events.map((event) => (
                  <article className="waic-event-card" key={`${day.id}-${event.title}`}>
                    <div className="waic-event-topline"><span>{event.category}</span><time>{event.time}</time></div>
                    <h4>{event.title}</h4>
                    <p className="waic-event-place">{event.place}</p>
                    <dl>
                      <div><dt>适合谁</dt><dd>{event.forWhom}</dd></div>
                      <div><dt>为什么去</dt><dd>{event.value}</dd></div>
                      <div><dt>发起方</dt><dd>{event.organizer}</dd></div>
                      {event.access ? <div><dt>进入方式</dt><dd>{event.access}</dd></div> : null}
                    </dl>
                    <a href={event.sourceUrl} target="_blank" rel="noreferrer">查看原始信息 / 报名 ↗</a>
                  </article>
                ))}
              </div>
              <a className="waic-back-link" href="#waic-side-events">返回日期导航 ↑</a>
            </section>
          ))}
        </div>
      </section>

      <section className="waic-section" id="waic-action">
        <div className="waic-section-heading">
          <span>06</span>
          <div><small>WAIC TASK SHEET</small><h2>把参会变成可检查的行动</h2></div>
        </div>
        <div className="waic-action-list">
          {actionList.map(([phase, action], index) => (
            <article key={phase}><span>0{index + 1}</span><strong>{phase}</strong><p>{action}</p></article>
          ))}
        </div>
        <div className="waic-one-page-plan">
          <div><span>我的唯一目标</span><p>这次大会结束时，我必须验证 / 找到 / 推进：__________</p></div>
          <div><span>我的三个问题</span><p>1. __________　2. __________　3. __________</p></div>
          <div><span>我必须见的人</span><p>姓名 / 组织 / 为什么见 / 希望下一步：__________</p></div>
          <div><span>判断成功的证据</span><p>一次访谈、一次试用、一次正式引荐，或一场已约定时间的后续会议。</p></div>
        </div>
      </section>

      <section className="waic-section waic-sources" id="waic-sources">
        <div className="waic-section-heading">
          <span>07</span>
          <div><small>SOURCES &amp; VERIFICATION</small><h2>原始参考来源</h2></div>
        </div>
        <p>大会事实优先采用官方来源；周边活动以主办方页面、报名页和公开合集交叉整理。微信文章用于发现线索，不自动视为官方确认。</p>
        <div className="waic-source-list">
          {waicSources.map((source, index) => (
            <a href={source.href} target="_blank" rel="noreferrer" key={source.href}><span>0{index + 1}</span><b>{source.label}</b><i>↗</i></a>
          ))}
        </div>
        <div className="waic-verification-note">
          <strong>信息最后核验：2026.07.17</strong>
          <p>活动临时变更很常见。出发前请再次核对日期、时间、地址、费用、审核结果与入场凭证；没有收到确认通知的审核制活动，请勿直接前往。</p>
        </div>
      </section>
        </div>

        <aside className="detail-sidebar waic-detail-sidebar" aria-label="WAIC 关键信息与官方入口">
          <div className="fact-card">
            <span className="section-index">KEY FACTS</span>
            <div><span>活动日期</span><strong>2026.07.17–07.20</strong></div>
            <div><span>举办城市</span><strong>Shanghai</strong></div>
            <div><span>活动特点</span><strong>世界人工智能大会</strong></div>
            <div><span>当前状态</span><strong>正在举行</strong></div>
            <div><span>地点</span><strong>中国 · 上海 · 三地四馆</strong></div>
            <div><span>本页整理</span><strong>{eventCount} 场周边活动</strong></div>
          </div>
          <div className="source-card">
            <span className="section-index">SOURCE &amp; ACTION</span>
            <strong>WAIC 官方网站</strong>
            <p>2026.07.17 核验。论坛、展览、票证和活动时间可能变化，行动前请在官方页面再次确认。</p>
            <a href="https://www.worldaic.com.cn/" target="_blank" rel="noreferrer">前往官方页面 <span aria-hidden="true">↗</span></a>
            <div className="waic-source-shortcuts">
              <a href="https://www.worldaic.com.cn/register" target="_blank" rel="noreferrer">官方注册 / 购票 <span aria-hidden="true">↗</span></a>
              <a href="https://waica2026.worldaic.com.cn/participant-guide/" target="_blank" rel="noreferrer">官方参会指南 <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <p className="editorial-disclaimer">Pioneer 的判断用于帮助你缩小选择范围，不构成投资、录取或商业结果保证。</p>
        </aside>
      </div>

      <SiteFooter />
    </main>
  );
}
