import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { WeeklyShareActions } from "../components/WeeklyShareActions";
import { getResourceBySlug } from "../data/resources";
import { siteOrigin } from "../lib/site";

export const metadata: Metadata = {
  title: "本周值得行动的创业机会｜2026.07.30 — Pioneer",
  description: "本周精选 4 个创业者值得行动的机会：Entrepreneur First、Berkeley SkyDeck、AWS Activate 与 TechBBQ。",
  alternates: { canonical: "/weekly", languages: { "zh-CN": "/weekly", en: "/en/weekly" } },
  openGraph: {
    title: "本周值得行动的 4 个创业机会",
    description: "不是机会堆积，而是截止时间、适合人群和下一步行动。",
    url: `${siteOrigin}/weekly`,
    images: [{
      url: `${siteOrigin}/weekly-og.png`,
      width: 1731,
      height: 909,
      alt: "Pioneer 本周值得行动的 4 个创业机会",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "本周值得行动的 4 个创业机会",
    description: "EF、Berkeley SkyDeck、AWS Activate、TechBBQ：截止时间、适合人群和下一步行动。",
    images: [`${siteOrigin}/weekly-og.png`],
  },
};

const weeklySignals = [
  {
    slug: "entrepreneur-first-london",
    order: "01",
    urgency: "剩余 5 天",
    deadline: "8 月 4 日",
    signal: "最终截止",
    whyNow: "London Fall 2026 的最终申请窗口即将关闭。项目从个人出发，先在伦敦完成 12 周公司形成阶段，再前往旧金山推进后三个月。",
    bestFor: "能力已经准备好，但联合创始人、具体方向或公司尚未完全形成，并能全职线下投入的个人。",
    action: ["写清最强能力与非共识判断", "说明为什么必须现在创业", "确认伦敦、旧金山与签证安排"],
    sourceNote: "最终截止、全职线下形式与两阶段地点已按 EF 官方申请页核验",
  },
  {
    slug: "berkeley-skydeck-batch-23",
    order: "02",
    urgency: "剩余 22 天",
    deadline: "8 月 21 日",
    signal: "全球申请",
    whyNow: "Batch 23 已向全球团队开放，六个月项目从 11 月 2 日开始；约 20 个 Cohort 团队可获得官方公布的 21 万美元投资。",
    bestFor: "准备在未来六个月达到重大产品里程碑，并能从伯克利研究与湾区网络中获得实际价值的科技团队。",
    action: ["判断湾区网络能否带来客户或资本", "核算驻场、运营与股权成本", "定义六个月可验证的产品里程碑"],
    sourceNote: "申请期、项目周期与投资金额已按 Berkeley SkyDeck 官方页面核验",
  },
  {
    slug: "aws-activate",
    order: "03",
    urgency: "持续开放",
    deadline: "无固定批次",
    signal: "云资源",
    whyNow: "AWS 当前公开的 Founders 档最高 5,000 美元，合作机构推荐的 Portfolio 档最高 20 万美元。最好在基础设施成本明显上升前申请，而不是账单已经失控后再补救。",
    bestFor: "成立十年内、尚未进入 B 轮，并准备把云额度绑定到明确产品或 AI 里程碑的创业公司。",
    action: ["测算未来 12 个月正常云成本", "确认 Founders 或 Org ID 推荐路径", "设置额度到期和正常价格提醒"],
    sourceNote: "额度、阶段限制与申请路径已按 AWS Activate 当前官方页面核验",
  },
  {
    slug: "techbbq-2026",
    order: "04",
    urgency: "剩余 27 天",
    deadline: "8 月 26–27 日",
    signal: "北欧市场",
    whyNow: "大会将在哥本哈根举行，官方仍开放购票。现在已进入需要锁定目标投资人、客户和行程的准备窗口，临近出发再约会面通常太晚。",
    bestFor: "把北欧视为真实客户、人才或融资市场，并关注 AI、气候科技、工业或 B2B 软件的早期团队。",
    action: ["列出 10 个目标机构或公司", "提前约定至少 6 场会面", "为每场会面定义一个可验证目标"],
    sourceNote: "活动日期、地点与购票状态已按 TechBBQ 官方网站核验",
  },
] as const;

export default function WeeklyPage() {
  const signals = weeklySignals.map((signal) => {
    const resource = getResourceBySlug(signal.slug);
    if (!resource) throw new Error(`Missing weekly resource: ${signal.slug}`);
    return { ...signal, resource };
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Pioneer 本周创业机会",
    dateModified: "2026-07-30",
    itemListElement: signals.map(({ resource }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: resource.name,
      url: `${siteOrigin}${resource.detailPath ?? `/resources/${resource.slug}`}`,
    })),
  };

  return (
    <main>
      <SiteHeader languageHref="/en/weekly" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <section className="weekly-hero">
        <div className="weekly-edition">
          <span>WEEKLY SIGNAL · 002</span>
          <strong>2026.07.30—08.05</strong>
        </div>
        <div className="weekly-hero-copy">
          <span className="section-index">FOUNDER OPPORTUNITY BRIEF</span>
          <h1>本周值得行动的<br /><em>4 个创业机会</em></h1>
          <p>不是把链接发给你，而是告诉你：为什么现在值得看、适合谁，以及今天应该完成什么。</p>
        </div>
        <aside className="weekly-principle">
          <span>本期判断原则</span>
          <strong>时间敏感</strong>
          <strong>创业者可行动</strong>
          <strong>官方信息可核验</strong>
          <p>编辑于 2026 年 7 月 30 日。行动前请再次查看官方页面。</p>
        </aside>
      </section>

      <section className="weekly-summary" aria-label="本周机会概览">
        <div><strong>02</strong><span>申请截止</span><p>EF · SkyDeck</p></div>
        <div><strong>01</strong><span>持续开放</span><p>AWS Activate</p></div>
        <div><strong>04</strong><span>可完成动作</span><p>每项都有行动清单</p></div>
      </section>

      <section className="weekly-share-band">
        <div>
          <span className="section-index">SAVE · SHARE · FOLLOW</span>
          <h2>别只收藏，给机会一个明确的下一步。</h2>
          <p>转给合适的人、把 3 个明确日期加入日历，或通过 RSS 跟进下一期。</p>
        </div>
        <WeeklyShareActions />
      </section>

      <section className="weekly-list">
        {signals.map(({ resource, ...signal }) => {
          const detailHref = resource.detailPath ?? `/resources/${resource.slug}`;
          return (
            <article className="weekly-signal" key={signal.slug}>
              <div className="weekly-signal-number"><span>{signal.order}</span><small>{signal.signal}</small></div>
              <div className="weekly-signal-main">
                <div className="weekly-deadline"><span>{signal.urgency}</span><strong>{signal.deadline}</strong></div>
                <span className="section-index">{resource.kind} · {resource.location}</span>
                <h2>{resource.name}</h2>
                <p className="weekly-signal-description">{resource.description}</p>
                <div className="weekly-judgment">
                  <div><span>为什么是现在</span><p>{signal.whyNow}</p></div>
                  <div><span>更适合谁</span><p>{signal.bestFor}</p></div>
                </div>
                <a
                  href={detailHref}
                  data-audience-event="weekly:resource"
                  data-audience-target={resource.slug}
                >
                  查看 Pioneer 完整判断 <span aria-hidden="true">→</span>
                </a>
              </div>
              <aside className="weekly-action-card">
                <span>TODAY&apos;S ACTION</span>
                <h3>今天完成这三步</h3>
                <ol>{signal.action.map((item) => <li key={item}>{item}</li>)}</ol>
                <p>{signal.sourceNote}</p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  data-audience-event="weekly:official"
                  data-audience-target={resource.slug}
                >
                  打开官方页面 ↗
                </a>
              </aside>
            </article>
          );
        })}
      </section>

      <section className="weekly-next">
        <span className="section-index light">NEXT ISSUE</span>
        <h2>下一期，继续帮你过滤噪声。</h2>
        <p>每周只选择真正值得创业者行动的计划、活动和机构变化。</p>
        <a href="#about" data-audience-event="newsletter:intent" data-audience-target="weekly">订阅下一期 ↓</a>
      </section>

      <SiteFooter />
    </main>
  );
}
