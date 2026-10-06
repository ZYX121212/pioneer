import type { Metadata } from "next";
import Link from "next/link";
import { CofounderWorkbook } from "../../components/FounderWorksheets";
import { GuideProgress } from "../../components/GuideProgress";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { cofounderGuide, companyEquityGuide, salesGuide } from "../../data/knowledge";

export const metadata: Metadata = {
  title: "验证联合创始人 — Pioneer 创业指南",
  description: "判断是否需要联合创始人，用四周真实共事测试角色、投入、冲突、股权和离开机制。",
  alternates: { canonical: "/knowledge/test-your-cofounder", languages: { "zh-CN": "/knowledge/test-your-cofounder", en: "/en/knowledge/test-your-cofounder" } },
};

const alternatives = [
  ["联合创始人", "长期共同承担公司风险、核心决策和多年建设", "拥有关键互补能力，并愿意全职承担不确定性"],
  ["早期员工", "在明确岗位内长期建设，但不承担同等公司控制与最终风险", "已有方向，需要扩大执行能力"],
  ["顾问", "提供有限专业判断、介绍或定期反馈", "缺的是经验与连接，不是每日共同执行"],
  ["外包／服务商", "在范围、时间和交付物明确的任务上补充产能", "工作可以购买，且不属于长期核心能力"],
];

const trialWeeks = [
  ["第 1 周", "选一项真实任务", "定义一个会接触真实用户、产品或收入的共同结果，并明确谁最终负责。"],
  ["第 2 周", "在压力下工作", "一起处理延期、坏消息或用户否定，观察对方是否透明、主动和可靠。"],
  ["第 3 周", "制造一次分歧", "分别写下重大选择的判断依据，再面对面讨论如何形成决定。"],
  ["第 4 周", "完成困难对话", "讨论全职日期、工资底线、角色、股权原则、离开机制和个人约束。"],
];

const founderTopics = [
  ["使命与边界", "我们为什么做这家公司？哪些方向即使赚钱也不做？"],
  ["角色与决策", "每个领域谁最终负责？发生僵局时如何处理？"],
  ["投入与现金", "何时全职？能承受多久低收入？个人债务和家庭约束是什么？"],
  ["股权与归属", "股权基于什么原则？归属期、悬崖期和历史贡献如何处理？"],
  ["知识产权", "既有代码、研究、客户资料和之后产生的成果归谁？"],
  ["离开与冲突", "主动离开、无法工作、严重违约或被移除时如何交接与处理股权？"],
];

export default function TestYourCofounderGuide() {
  return (
    <main>
      <SiteHeader languageHref="/en/knowledge/test-your-cofounder" />
      <header className="guide-hero guide-hero-violet"><div className="guide-breadcrumbs"><Link href="/">首页</Link><span>/</span><Link href="/knowledge">创业指南</Link><span>/</span><b>验证联合创始人</b></div><div className="guide-hero-grid"><div><span className="guide-kicker">PIONEER GUIDE 05 · {cofounderGuide.stage}</span><h1>{cofounderGuide.title}</h1><p>{cofounderGuide.description}</p></div><aside className="guide-output-card"><span>完成这篇指南后</span><strong>本篇练习与记录</strong><ol>{cofounderGuide.outcome.map((item) => <li key={item}>{item}</li>)}</ol><small>{cofounderGuide.duration} · 更新于 {cofounderGuide.updated}</small></aside></div></header>

      <GuideProgress guide={cofounderGuide} judgment="联合创始人不是免费的高级员工，也不是为简历补齐标签的人；他需要在多年不确定性中共同承担核心决策、风险与结果。" mistakes={["因为一个人太忙就急着找联合创始人", "先按想法和过去投入分股，再测试合作", "只讨论能力互补，不讨论价值观、现金和退出"]} action="写下你真正缺少的长期核心能力，并设计一项四周内可以共同完成的真实任务。" />

      <div className="guide-reading-layout" id="deep-guide">
        <aside className="guide-toc" aria-label="本篇目录"><span>本篇目录</span><a href="#need">01 · 先判断是否需要</a><a href="#fit">02 · 验证四种匹配</a><a href="#trial">03 · 四周真实共事</a><a href="#equity">04 · 再讨论股权</a><a href="#agreement">05 · 写下关键约定</a><a href="#workbook">06 · 填写验证卡</a><a href="#decision">07 · 做团队决定</a><a href="#sources">参考来源</a></aside>
        <article className="guide-article">
          <section className="guide-entry" id="need"><div><span className="guide-label">先定义缺口</span><h2>你缺的是共同创业者，还是一种可以买到的能力？</h2></div><div className="mvp-boundary-table"><div><span>角色</span><span>承担什么</span><span>什么时候更合适</span><span>不要误用</span></div>{alternatives.map(([role, responsibility, fit]) => <div key={role}><strong>{role}</strong><p>{responsibility}</p><p>{fit}</p><p>{role === "联合创始人" ? "不要用股权解决短期人手" : "不要用头衔替代清晰合同"}</p></div>)}</div><p>如果缺口可以通过三个月顾问、外包或招聘解决，先不要永久改变公司的所有权和控制结构。</p></section>

          <section className="guide-section" id="fit"><div className="guide-section-heading"><span>01</span><div><small>FOUR TYPES OF FIT</small><h2>能力互补只是开始，还要验证四种长期匹配。</h2></div></div><div className="decision-checklist"><div><strong>能力匹配</strong><p>双方能覆盖最关键的产品、技术、市场或行业能力，而不是重复同一种强项。</p></div><div><strong>节奏匹配</strong><p>对速度、质量、工作强度和信息透明拥有接近的默认标准。</p></div><div><strong>风险匹配</strong><p>对现金、职业机会、家庭影响和失败概率的承受方式可以共存。</p></div><div><strong>价值观匹配</strong><p>对诚信、用户责任、员工、公平和长期目标的底线一致。</p></div></div><div className="pioneer-judgment"><span>PIONEER 判断</span><p>不要问“我们会不会吵架”，而要问“发生分歧和坏消息时，我们是否能更快接近事实并继续合作”。</p></div></section>

          <section className="guide-section" id="trial"><div className="guide-section-heading"><span>02</span><div><small>WORK BEFORE COMMITMENT</small><h2>用四周真实共事，替代几十次咖啡聊天。</h2></div></div><div className="mvp-sprint">{trialWeeks.map(([time, title, action]) => <div key={time}><span>{time}</span><strong>{title}</strong><p>{action}</p></div>)}</div><div className="guide-caution"><strong>测试必须接触真实后果。</strong><p>一起做虚构案例只能看到表达能力。真实用户、发布时间、销售承诺或技术失败，才会暴露责任感和决策方式。</p></div></section>

          <section className="guide-section" id="equity"><div className="guide-section-heading"><span>03</span><div><small>EQUITY FOLLOWS COMMITMENT</small><h2>股权、角色与长期投入</h2></div></div><p className="guide-lead">讨论股权时，先把角色、全职日期、未来贡献、现金薪酬、归属机制和离开情形放在同一张桌上。明显不平等的分配需要能够解释未来责任上的真实差异。</p><div className="three-way-decision"><div><span>接近均分</span><p>双方投入、未来责任和风险接近时，简单、对称的结构更容易维持长期信任。</p></div><div><span>不均等分配</span><p>只有在全职程度、关键资产、现金投入或长期责任存在实质差异时才合理。</p></div><div><span>暂不成为创始人</span><p>无法全职、只提供有限服务或尚未通过共事测试的人，更适合其他合作形式。</p></div></div><p className="guide-lead">四年归属期与一年悬崖期是美国科技创业中常见做法，不是全球通用法律答案。注册地、税务、劳动、证券与知识产权影响必须由当地专业人士确认。</p></section>

          <section className="guide-section" id="agreement"><div className="guide-section-heading"><span>04</span><div><small>HARD CONVERSATIONS FIRST</small><h2>把最难谈的六件事，在关系良好时写下来。</h2></div></div><div className="entry-path-list">{founderTopics.map(([title, question], index) => <div className="entry-path" key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{question}</p></div></div>)}</div><div className="guide-caution"><strong>备忘录不能替代正式法律文件。</strong><p>它的作用是让创始人先形成真实共识，再由适合公司注册地的律师转化为公司、股权、知识产权和治理文件。</p></div></section>

          <section className="guide-section" id="workbook"><div className="guide-section-heading"><span>05</span><div><small>DO THE WORK</small><h2>设计一次合作测试，并记录关键约定。</h2></div></div><CofounderWorkbook /></section>

          <section className="guide-section" id="decision"><div className="guide-section-heading"><span>06</span><div><small>MAKE THE TEAM DECISION</small><h2>四周后，不要因为不好意思而模糊决定。</h2></div></div><div className="three-way-decision"><div><span>成为联合创始人</span><p>真实任务中持续可靠，能够处理分歧，长期承诺和关键约定已经对齐。</p></div><div><span>延长测试</span><p>能力成立，但全职时间、角色或压力下的合作仍缺少证据；明确再测试什么。</p></div><div><span>换一种关系</span><p>适合作为员工、顾问或服务伙伴，但不适合共同拥有和控制公司。</p></div></div></section>

          <section className="guide-sources" id="sources"><div className="guide-section-heading"><span>07</span><div><small>SOURCES &amp; SCOPE</small><h2>参考来源与适用边界</h2></div></div><p>本文提供团队判断框架，不构成公司、证券、税务、劳动、婚姻财产或知识产权法律建议。任何股权安排和正式协议都应根据注册地与创始人所在地获得专业意见。</p><div className="source-list">{cofounderGuide.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><div><span>{source.publisher} · {source.language}</span><strong>{source.title}</strong><p>{source.use}</p></div><b aria-hidden="true">↗</b></a>)}</div></section>
        </article>
        <aside className="guide-sidecard"><span>成为创始人之前</span><strong>至少确认：</strong><ul><li>为什么必须共同创业</li><li>完成过一次真实任务</li><li>压力下仍然透明可靠</li><li>全职、角色与现金已对齐</li><li>股权和离开机制可书面化</li></ul><Link href="#workbook">打开验证工具 →</Link></aside>
      </div>
      <section className="guide-next"><span>NEXT GUIDE · 公司与股权</span><h2>{companyEquityGuide.title}</h2><p>{companyEquityGuide.description}</p><Link href={`/knowledge/${companyEquityGuide.slug}`}>进入下一篇指南 <span aria-hidden="true">→</span></Link><small>上一阶段：<Link href={`/knowledge/${salesGuide.slug}`}>完成第一批销售</Link></small></section>
      <SiteFooter />
    </main>
  );
}
