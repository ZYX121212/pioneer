import type { Metadata } from "next";
import Link from "next/link";
import { FundingDecisionWorkbook } from "../../components/FounderWorksheets";
import { GuideProgress } from "../../components/GuideProgress";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { cofounderGuide, fundingDecisionGuide } from "../../data/knowledge";

export const metadata: Metadata = {
  title: "判断是否需要融资 — Pioneer 创业指南",
  description: "从下一里程碑倒推资金需求，比较收入、补助、债务、天使和风险投资。",
};

const capitalRoutes = [
  ["客户收入／预付款", "需求已经足够明确，客户愿意为交付承担成本", "速度受销售与交付限制，但不稀释股权"],
  ["补助／竞赛／科研资金", "深科技、科研转化或公共目标与项目资格匹配", "申请周期、用途限制和验收要求可能很高"],
  ["债务／贷款", "收入和还款能力较可预测，资金用于可回收投入", "需要还本付息，不适合高度不确定的探索"],
  ["天使／SAFE 等早期工具", "需要小额资金完成下一阶段验证，投资人理解早期风险", "会产生稀释与未来转换影响，文件必须专业复核"],
  ["风险投资", "市场足够大、速度重要，并需要先投入资本再形成规模", "目标、增长节奏、治理与退出预期会发生长期变化"],
];

const readiness = [
  ["公司命题", "能用一句话说清为谁解决什么问题，以及为什么现在成立。"],
  ["证据", "拥有与阶段匹配的用户、收入、留存、技术、审批或异常增长信号。"],
  ["资金用途", "每一大笔预算都对应一个可验证里程碑，而不是笼统地扩大团队。"],
  ["市场与回报", "目标市场和商业模型能够解释为什么外部股权资本可能获得足够回报。"],
  ["融资过程", "目标投资人、材料、数据、法律文件、负责人和集中时间窗口已经准备。"],
  ["失败计划", "融资未完成时，公司仍知道如何缩减范围、增加收入或延长生存时间。"],
];

const milestoneExamples = [
  ["B2B 软件", "从 3 个创始人主导试点走到可重复获取 15 个付费客户", "销售周期、留存、毛利和实施时间"],
  ["消费产品", "证明一类用户在自然周期内持续回来，并出现可重复获客入口", "留存、频率、单位经济与渠道重复性"],
  ["AI 产品", "证明模型能力可以稳定转化为高价值工作流与可接受毛利", "任务成功率、人工兜底、推理成本和付费"],
  ["硬件／深科技", "完成关键技术、认证、试产或首批订单中的一个明确跨越", "技术指标、良率、供应链、认证与交付现金"],
];

export default function DecideWhetherToFundraiseGuide() {
  return (
    <main>
      <SiteHeader />
      <header className="guide-hero guide-hero-orange"><div className="guide-breadcrumbs"><Link href="/">首页</Link><span>/</span><Link href="/knowledge">创业指南</Link><span>/</span><b>判断是否需要融资</b></div><div className="guide-hero-grid"><div><span className="guide-kicker">PIONEER GUIDE 06 · {fundingDecisionGuide.stage}</span><h1>{fundingDecisionGuide.title}</h1><p>{fundingDecisionGuide.description}</p></div><aside className="guide-output-card"><span>完成这篇指南后</span><strong>不是得到融资金额，<br />而是知道钱要买什么。</strong><ol>{fundingDecisionGuide.outcome.map((item) => <li key={item}>{item}</li>)}</ol><small>{fundingDecisionGuide.duration} · 更新于 {fundingDecisionGuide.updated}</small></aside></div></header>

      <GuideProgress guide={fundingDecisionGuide} judgment="融资是一种用所有权、治理变化和未来回报预期换取速度与生存时间的工具。先问公司需要跨越什么资本密集型里程碑，再问向谁融资。" mistakes={["把拿到融资当成产品市场匹配", "先决定融资金额，再寻找资金用途", "只比较估值，不比较投资人、条款、治理与失败成本"]} action="写下资金用完前必须完成的唯一里程碑，并列出不出售股权的两个替代方案。" />

      <div className="guide-reading-layout" id="deep-guide">
        <aside className="guide-toc" aria-label="本篇目录"><span>本篇目录</span><a href="#need">01 · 是否真的需要钱</a><a href="#milestone">02 · 定义资金里程碑</a><a href="#amount">03 · 倒推金额与时间</a><a href="#routes">04 · 比较资金来源</a><a href="#ready">05 · 融资准备度</a><a href="#workbook">06 · 填写判断卡</a><a href="#decision">07 · 现在融或不融</a><a href="#sources">参考来源</a></aside>
        <article className="guide-article">
          <section className="guide-entry" id="need"><div><span className="guide-label">先判断资本逻辑</span><h2>不是所有好生意，都应该成为风险投资支持的创业公司。</h2></div><ul><li>是否必须先投入大量资金，才能证明关键技术、网络效应或市场速度？</li><li>市场是否足够大，能够支持投资人承担高失败率后的回报要求？</li><li>如果以客户收入慢一点发展，公司是否仍然成立？</li><li>融资会加速已经有效的机制，还是只是推迟面对需求问题？</li></ul><p>外部资本最有价值的时刻，是它能帮助公司<strong>比自然现金流更快跨越一个重要且可验证的瓶颈</strong>。</p></section>

          <section className="guide-section" id="milestone"><div className="guide-section-heading"><span>01</span><div><small>MONEY BUYS A MILESTONE</small><h2>一轮融资应该购买一次风险下降，而不是一段模糊时间。</h2></div></div><div className="mvp-boundary-table"><div><span>公司类型</span><span>示例里程碑</span><span>核心证据</span><span>常见误判</span></div>{milestoneExamples.map(([type, milestone, evidence]) => <div key={type}><strong>{type}</strong><p>{milestone}</p><p>{evidence}</p><p>用招聘和功能数量代替风险下降</p></div>)}</div><div className="pioneer-judgment"><span>PIONEER 判断</span><p>“招 10 个人、做市场、扩大规模”是资金用途，不是里程碑。里程碑必须描述资金用完时公司新增了什么可信证据。</p></div></section>

          <section className="guide-section" id="amount"><div className="guide-section-heading"><span>02</span><div><small>BUILD FROM THE BUDGET</small><h2>金额来自里程碑预算，不来自新闻里的轮次大小。</h2></div></div><div className="mvp-story"><div><span>当前状态</span><strong>现金与月度净消耗</strong><p>先算清现有资金还能支持多久，并区分一次性与持续成本。</p></div><div><span>目标状态</span><strong>完成下一里程碑</strong><p>拆出人员、产品、设备、销售、合规、营运资金和不可避免的缓冲。</p></div><div><span>融资窗口</span><strong>在失去选择前开始</strong><p>融资需要准备、接触、尽调、文件和到账时间，不能以现金归零日倒排。</p></div></div><div className="guide-caution"><strong>运行时间不是承诺，预算也不是现实。</strong><p>把销售延迟、招聘失败、设备交付、监管和融资周期纳入情景分析。任何具体税务、证券和融资文件问题都应由专业人士确认。</p></div></section>

          <section className="guide-section" id="routes"><div className="guide-section-heading"><span>03</span><div><small>CAPITAL IS NOT ONE THING</small><h2>先比较资金性质，再比较谁愿意给钱。</h2></div></div><div className="entry-path-list">{capitalRoutes.map(([route, fit, tradeoff], index) => <div className="entry-path" key={route}><span>0{index + 1}</span><div><h3>{route}</h3><p><b>适合：</b>{fit}</p><p><b>主要代价：</b>{tradeoff}</p></div></div>)}</div><p className="guide-lead">不同资金可以组合，但每种资金都有用途、时间、控制、还款或稀释约束。不要因为某种工具文件简单，就忽略其经济后果。</p></section>

          <section className="guide-section" id="ready"><div className="guide-section-heading"><span>04</span><div><small>FUNDRAISING READINESS</small><h2>融资前，至少让六个问题有可核验的答案。</h2></div></div><div className="decision-checklist">{readiness.map(([title, detail]) => <div key={title}><strong>{title}</strong><p>{detail}</p></div>)}</div><div className="pioneer-judgment"><span>流程纪律</span><p>融资会吞噬创始人的注意力。确定开始后，应建立集中时间窗口、并行接触目标投资人、记录状态，并保护产品与客户节奏。</p></div></section>

          <section className="guide-section" id="workbook"><div className="guide-section-heading"><span>05</span><div><small>DO THE WORK</small><h2>从下一里程碑，倒推融资命题。</h2></div></div><FundingDecisionWorkbook /></section>

          <section className="guide-section" id="decision"><div className="guide-section-heading"><span>06</span><div><small>MAKE THE CAPITAL DECISION</small><h2>决定“现在融资”，也要同时写下“不融资怎么办”。</h2></div></div><div className="three-way-decision"><div><span>现在融资</span><p>资本能够跨越明确里程碑，证据和市场足以支持投资回报逻辑，团队也准备好承担过程。</p></div><div><span>先获得更多证据</span><p>资金用途清楚，但需求、留存、技术或商业模型仍可以用更低成本进一步验证。</p></div><div><span>选择其他资本</span><p>业务可以通过收入、补助或债务稳健发展，不需要风险投资要求的速度和退出路径。</p></div></div><div className="decision-note"><span>完成标准</span><p>你能说清为什么需要钱、资金购买哪个里程碑、预算如何形成、有哪些替代资金、可以接受什么稀释与治理变化，以及融资失败时如何生存。</p><small>能融资不代表应该融资；没有融资也不代表公司没有价值。</small></div></section>

          <section className="guide-sources" id="sources"><div className="guide-section-heading"><span>07</span><div><small>SOURCES &amp; SCOPE</small><h2>参考来源与适用边界</h2></div></div><p>本文提供早期融资判断框架，不构成证券、投资、法律、税务、会计或公司治理建议。融资工具、股权、董事会与文件应结合公司注册地、投资人所在地和创始人情况获得专业意见。</p><div className="source-list">{fundingDecisionGuide.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><div><span>{source.publisher} · {source.language}</span><strong>{source.title}</strong><p>{source.use}</p></div><b aria-hidden="true">↗</b></a>)}</div></section>
        </article>
        <aside className="guide-sidecard"><span>融资前必须说清</span><strong>不是“我们需要钱”，而是：</strong><ul><li>钱将跨越哪个里程碑</li><li>当前证据是否足够</li><li>金额如何逐项形成</li><li>还比较过哪些资金</li><li>融资失败如何继续</li></ul><Link href="#workbook">打开融资判断工具 →</Link></aside>
      </div>
      <section className="guide-next"><span>PREVIOUS GUIDE · 团队与股权</span><h2>{cofounderGuide.title}</h2><p>{cofounderGuide.description}</p><Link href={`/knowledge/${cofounderGuide.slug}`}>回到联合创始人指南 <span aria-hidden="true">←</span></Link></section>
      <SiteFooter />
    </main>
  );
}
