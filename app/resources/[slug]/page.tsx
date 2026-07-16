/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResourceCard } from "../../components/ResourceCard";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { getResourceBySlug, resources, typeConfig, type Resource } from "../../data/resources";

type PageProps = { params: Promise<{ slug: string }> };

type Capability = {
  label: string;
  level: "强" | "中等" | "有限";
  note: string;
};

const institutionPortraits: Record<string, { identity: string; capabilities: Capability[] }> = {
  "station-f": {
    identity: "大型创业园区与项目平台。它的核心能力不是单一课程，而是把多种创业计划、企业伙伴、投资人和国际团队放在同一创业基础设施中。",
    capabilities: [
      { label: "创业计划组合", level: "强", note: "拥有多个自营与合作项目，入口选择丰富。" },
      { label: "投资与资本连接", level: "中等", note: "投资人密度较高，但融资价值取决于进入的具体项目。" },
      { label: "企业客户连接", level: "中等", note: "部分合作计划能够连接企业，行业匹配比园区品牌更重要。" },
      { label: "国际市场落地", level: "强", note: "适合希望把巴黎或法国作为欧洲入口的国际团队。" },
      { label: "人才与创业社区", level: "强", note: "创业团队密度高，适合建立同伴、人才和合作网络。" },
      { label: "研究与技术转化", level: "有限", note: "并非以大学科研转化为主要定位，需要通过具体伙伴项目获得。" },
    ],
  },
  block71: {
    identity: "以新加坡为起点的跨城市创新网络。它更像一组市场节点和创业社区，价值集中在亚洲连接、大学生态与国际落地。",
    capabilities: [
      { label: "亚洲市场连接", level: "强", note: "多个城市节点能帮助团队建立区域性认知和第一批关系。" },
      { label: "国际落地支持", level: "强", note: "适合需要新加坡及亚洲市场入口的国际团队。" },
      { label: "大学与技术生态", level: "强", note: "与大学创新生态关系紧密，适合科技创业团队。" },
      { label: "投资与资本连接", level: "中等", note: "能够连接生态，但融资仍取决于项目、阶段与团队质量。" },
      { label: "企业客户连接", level: "中等", note: "不同城市节点和合作项目的产业资源差异较大。" },
      { label: "社区与办公网络", level: "强", note: "社区是核心产品之一，但需要主动参与才能产生价值。" },
    ],
  },
  "entrepreneur-first": {
    identity: "以个人人才为起点的创始人孵化机构。它在公司成立之前介入，通过人才筛选、联合创始人匹配和公司形成机制产生价值。",
    capabilities: [
      { label: "联合创始人匹配", level: "强", note: "这是机构最具差异化的核心能力。" },
      { label: "技术人才密度", level: "强", note: "重点吸引技术、科研和行业能力突出的个人。" },
      { label: "公司形成支持", level: "强", note: "适合从个人能力走向团队、方向和公司的极早期阶段。" },
      { label: "投资与融资准备", level: "中等", note: "能帮助公司形成与融资，但不应把录取等同于融资结果。" },
      { label: "企业客户连接", level: "有限", note: "核心优势不在直接提供客户，需要团队自行验证市场。" },
      { label: "国际创业网络", level: "强", note: "对愿意跨城市、全职进入全球科技生态的个人更有价值。" },
    ],
  },
  "berkeley-skydeck": {
    identity: "大学创业平台与科技加速器。它把伯克利研究、人才、产业导师与湾区资本连接起来，优势集中在技术密度和大学生态。",
    capabilities: [
      { label: "研究与技术转化", level: "强", note: "适合深科技、AI 与研究驱动型团队。" },
      { label: "湾区资本连接", level: "强", note: "能够接触湾区投资生态，但投资结果仍取决于项目质量。" },
      { label: "大学人才网络", level: "强", note: "伯克利人才与研究生态是重要差异化资源。" },
      { label: "产业导师支持", level: "强", note: "适合需要技术商业化和产业反馈的团队。" },
      { label: "国际团队入口", level: "中等", note: "面向全球团队，但地点、参与和迁移成本需要评估。" },
      { label: "消费市场渠道", level: "有限", note: "更偏技术与产业网络，不是通用消费流量平台。" },
    ],
  },
};

function buildModelCards(resource: Resource) {
  const tags = resource.tags.join("、");
  const cards = {
    program: [
      { title: "推进机制", text: `以明确的申请和参与周期推动团队集中行动；当前时间线为“${resource.timing}”。` },
      { title: "资源杠杆", text: `主要价值围绕 ${tags} 展开，真正收益取决于团队能否主动使用导师、同伴和市场连接。` },
      { title: "结果目标", text: "帮助团队缩短验证、增长或融资准备周期，但计划本身不能替代真实用户与产品执行。" },
    ],
    organization: [
      { title: "生态位置", text: `${resource.name} 位于 ${resource.location}，通过机构品牌、合作伙伴和本地网络形成资源入口。` },
      { title: "资源组织方式", text: `资源重点包括 ${tags}；创业者通常要通过具体计划、社区或合作项目才能真正获得。` },
      { title: "价值发生条件", text: "机构规模不等于个人收益，只有目标、阶段和具体入口匹配时，网络才能转化为客户、人才或资本。" },
    ],
    event: [
      { title: "人群密度", text: `${resource.name} 把创始人、投资人、科技公司和生态伙伴集中在有限时间内。` },
      { title: "机会类型", text: `主要机会围绕 ${tags} 展开，舞台内容之外的会面、展示与合作通常更重要。` },
      { title: "回报前提", text: "活动不会自动产生融资或客户；明确目标、提前约见和会后跟进决定实际回报。" },
    ],
    startup: [
      { title: "问题切口", text: resource.description },
      { title: "产品路径", text: `项目从 ${tags} 的交叉位置切入，试图把分散、低效或依赖人工的工作变成可复用产品。` },
      { title: "验证重点", text: "需要持续验证目标用户是否高频遇到这一问题、是否愿意迁移，以及产品能否形成可持续付费。" },
    ],
  };
  return cards[resource.type];
}

function buildAccessSteps(resource: Resource) {
  const steps = {
    program: [
      ["01", "确认阶段匹配", `先用“${resource.bestFor[0]}”检查自己是否处于计划真正服务的阶段。`],
      ["02", "准备真实证据", "整理用户访谈、产品进展、团队承诺与最关键的学习，而不是只写宏大愿景。"],
      ["03", "核对参与条件", `确认地点、全职要求、时间线和当期安排；目前公开状态为“${resource.status}”。`],
      ["04", "从官方入口行动", `通过 ${resource.source} 再次核验条款并提交，记录截止时间与后续沟通节点。`],
    ],
    organization: [
      ["01", "先定义资源目标", "明确当前最需要资本、客户、人才、研究资源、办公空间还是国际落地。"],
      ["02", "找到具体入口", "优先寻找机构旗下计划、驻场项目、公开活动或合作伙伴入口，而不是泛泛联系机构。"],
      ["03", "验证本地价值", `判断 ${resource.location} 是否真的是未来十二个月需要进入的市场或生态。`],
      ["04", "建立使用计划", "在进入前写清楚希望连接的人、要验证的市场问题，以及三个月内可衡量的结果。"],
    ],
    event: [
      ["01", "设定单一目标", "融资、客户、媒体、招聘或学习只能有一个首要目标。"],
      ["02", "筛选目标对象", "提前建立希望见到的投资人、客户和合作伙伴清单，并说明双方为什么值得会面。"],
      ["03", "准备现场材料", "准备三十秒介绍、短版产品演示、可转发资料和明确的下一步请求。"],
      ["04", "设计会后跟进", `在 ${resource.timing} 前后预留跟进时间，把现场交流转化为下一次会议和真实行动。`],
    ],
    startup: [
      ["01", "拆解用户问题", "判断问题发生频率、现有替代方案和用户真正无法忍受的成本。"],
      ["02", "理解产品假设", "区分已经公开验证的能力与仍需验证的产品、技术和使用习惯假设。"],
      ["03", "寻找付费路径", "分析最终使用者、购买决策者和预算来源是否是同一群人。"],
      ["04", "提炼创业启发", "学习它选择问题和进入市场的方法，而不是简单复制产品表面功能。"],
    ],
  };
  return steps[resource.type];
}

function buildActionChecklist(resource: Resource) {
  const items = {
    program: ["写出当前阶段最重要的一个验证目标", "准备三项能够证明团队执行力的事实", "确认全职、地点、资金和股权条件", "在官方页面复核当期申请时间"],
    organization: ["明确希望从机构获得的首要资源", "找到最匹配的具体计划或进入方式", "确认国际团队、注册地和驻场要求", "准备一份进入该生态后的九十天计划"],
    event: ["确定一个可衡量的参会目标", "提前安排至少五个高价值会面", "计算门票、差旅和时间成本", "准备会后三天内的跟进节奏"],
    startup: ["验证它所解决的问题是否真实高频", "识别目标用户与付费决策者", "列出三个仍未被公开证明的假设", "记录一个可以迁移到自己项目的方法"],
  };
  return items[resource.type];
}

export function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) return {};
  return {
    title: `${resource.name} — Pioneer 整理详情`,
    description: resource.description,
  };
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) notFound();

  const config = typeConfig[resource.type];
  const directlyRelated = (resource.relatedSlugs ?? [])
    .map((relatedSlug) => getResourceBySlug(relatedSlug))
    .filter((entry) => Boolean(entry));
  const fallbackRelated = resources.filter(
    (entry) => entry.type === resource.type && entry.id !== resource.id,
  );
  const related = [...directlyRelated, ...fallbackRelated]
    .filter((entry, index, entries) => entries.findIndex((candidate) => candidate?.id === entry?.id) === index)
    .slice(0, 3);

  const fitTitle = {
    program: "这项计划适合谁",
    organization: "谁值得关注这个机构",
    event: "谁适合参加",
    startup: "谁值得研究这个项目",
  }[resource.type];

  const matterTitle = {
    program: "为什么值得申请",
    organization: "它在创业生态中的价值",
    event: "怎样获得真实参会价值",
    startup: "项目为什么值得关注",
  }[resource.type];

  const portrait = institutionPortraits[resource.slug];
  const modelCards = buildModelCards(resource);
  const accessSteps = buildAccessSteps(resource);
  const actionChecklist = buildActionChecklist(resource);
  const profileTitle = {
    program: "这个计划如何产生价值",
    organization: "机构画像与资源能力",
    event: "活动价值从哪里产生",
    startup: "问题、产品与验证逻辑",
  }[resource.type];
  const accessTitle = {
    program: "从判断到申请的路径",
    organization: "如何真正进入这个机构",
    event: "把参会变成结果的路径",
    startup: "如何研究这个创业项目",
  }[resource.type];
  const actionTitle = {
    program: "申请前行动清单",
    organization: "接触机构前的准备清单",
    event: "参会前行动清单",
    startup: "创业者研究清单",
  }[resource.type];

  return (
    <main>
      <SiteHeader />
      <section className={`detail-hero detail-${resource.type}`}>
        <div className="detail-breadcrumbs">
          <a href="/">首页</a><span>/</span>
          <a href={config.path}>{config.title}</a><span>/</span>
          <b>{resource.name}</b>
        </div>
        <div className="detail-identity">
          <span className={`resource-logo detail-logo logo-${resource.color}`}>{resource.monogram}</span>
          <span className="resource-status"><i />{resource.status}</span>
        </div>
        <span className="section-index">{resource.kind} · PIONEER PROFILE</span>
        <h1>{resource.name}</h1>
        <p>{resource.description}</p>
        <div className="detail-tags">
          {resource.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </section>

      <section className="detail-layout">
        <article className="detail-main">
          <section className="detail-section detail-overview">
            <span className="detail-index">01</span>
            <div>
              <span className="section-index">OVERVIEW</span>
              <h2>先用一分钟理解它</h2>
              <p>{resource.overview}</p>
            </div>
          </section>

          <section className="detail-section">
            <span className="detail-index">02</span>
            <div>
              <span className="section-index">PROFILE &amp; VALUE MODEL</span>
              <h2>{profileTitle}</h2>
              {portrait ? (
                <>
                  <p>{portrait.identity}</p>
                  <div className="capability-grid" aria-label={`${resource.name} 机构能力画像`}>
                    {portrait.capabilities.map((capability) => (
                      <div className="capability-row" key={capability.label}>
                        <strong>{capability.label}</strong>
                        <span className={`capability-level level-${capability.level}`}>{capability.level}</span>
                        <p>{capability.note}</p>
                      </div>
                    ))}
                  </div>
                  <p className="analysis-caption">以上为 Pioneer 基于公开信息做出的定性画像，不是机构排名，也不代表每个参与者都能获得相同资源。</p>
                </>
              ) : (
                <div className="analysis-card-grid">
                  {modelCards.map((card) => (
                    <div className="analysis-card" key={card.title}>
                      <span>{card.title}</span>
                      <p>{card.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="detail-section">
            <span className="detail-index">03</span>
            <div>
              <span className="section-index">FIT CHECK</span>
              <h2>{fitTitle}</h2>
              <div className="fit-columns">
                <div>
                  <h3>更适合</h3>
                  <ul className="fit-list positive">
                    {resource.bestFor.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h3>需要谨慎判断</h3>
                  <ul className="fit-list caution">
                    {resource.considerations.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <span className="detail-index">04</span>
            <div>
              <span className="section-index">ACCESS PATH</span>
              <h2>{accessTitle}</h2>
              <div className="access-steps">
                {accessSteps.map(([number, title, description]) => (
                  <div className="access-step" key={number}>
                    <span>{number}</span>
                    <div><strong>{title}</strong><p>{description}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="detail-section">
            <span className="detail-index">05</span>
            <div>
              <span className="section-index">COST &amp; BOUNDARIES</span>
              <h2>收益之外，还要计算成本</h2>
              <p>时间、地点、现金、股权、注意力和替代机会都是真实成本。行动前至少确认以下边界：</p>
              <ul className="boundary-list">
                {resource.considerations.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="evidence-note">
                <div><span>官方确认</span><p>时间、地点、状态和公开条件来自右侧所列官方来源。</p></div>
                <div><span>Pioneer 分析</span><p>适合度、能力强弱与行动建议是帮助决策的定性判断。</p></div>
                <div><span>仍需复核</span><p>价格、投资条款、资格与具体安排可能随批次或项目变化。</p></div>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <span className="detail-index">06</span>
            <div>
              <span className="section-index">ACTION CHECKLIST</span>
              <h2>{actionTitle}</h2>
              <div className="action-checklist">
                {actionChecklist.map((item, index) => (
                  <div key={item}><span>0{index + 1}</span><p>{item}</p></div>
                ))}
              </div>
            </div>
          </section>

          <section className="detail-section">
            <span className="detail-index">07</span>
            <div>
              <span className="section-index">WHY IT MATTERS</span>
              <h2>{matterTitle}</h2>
              <p>{resource.whyItMatters}</p>
            </div>
          </section>

          <section className="detail-section detail-verdict">
            <span className="detail-index">08</span>
            <div>
              <span className="section-index">FINAL VERDICT</span>
              <h2>Pioneer 最终判断</h2>
              <div className="editorial-callout">
                <span>最大价值 · 适合人群 · 主要限制</span>
                <p>{resource.editorialNote}</p>
              </div>
            </div>
          </section>
        </article>

        <aside className="detail-sidebar">
          <div className="fact-card">
            <span className="section-index">KEY FACTS</span>
            {resource.highlights.map((fact) => (
              <div key={fact.label}><span>{fact.label}</span><strong>{fact.value}</strong></div>
            ))}
            <div><span>地点</span><strong>{resource.location}</strong></div>
          </div>
          <div className="source-card">
            <span className="section-index">SOURCE & ACTION</span>
            <strong>{resource.source}</strong>
            <p>{resource.verified}。申请条件、价格与时间可能变化，行动前请在官方页面再次确认。</p>
            <a href={resource.url} target="_blank" rel="noreferrer">
              前往官方页面 <span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="editorial-disclaimer">Pioneer 的判断用于帮助你缩小选择范围，不构成投资、录取或商业结果保证。</p>
        </aside>
      </section>

      <section className="section related-section">
        <div className="section-heading">
          <div>
            <span className="section-index">KEEP EXPLORING</span>
            <h2>{directlyRelated.length ? "相关机构与开放计划" : `继续比较同类${config.singular}`}</h2>
          </div>
          <a className="text-link" href={config.path}>查看全部{config.title} →</a>
        </div>
        <div className="resource-grid">
          {related.map((entry) => entry && <ResourceCard resource={entry} key={entry.id} />)}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
