import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { WeeklyShareActions } from "../components/WeeklyShareActions";
import { getResourceBySlug } from "../data/resources";
import { siteOrigin } from "../lib/site";

export const metadata: Metadata = {
  title: "本周值得行动的创业机会｜2026.07.17 — Pioneer",
  description: "本周精选 4 个创业者值得行动的机会：WAIC 2026、Y Combinator、Entrepreneur First 与 Berkeley SkyDeck。",
  alternates: { canonical: "/weekly" },
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
    description: "WAIC、YC、EF、Berkeley SkyDeck：截止时间、适合人群和下一步行动。",
    images: [`${siteOrigin}/weekly-og.png`],
  },
};

const weeklySignals = [
  {
    slug: "waic-shanghai-2026",
    order: "01",
    urgency: "本周末",
    deadline: "7 月 17–20 日",
    signal: "正在发生",
    whyNow: "大会已经进入最后决策窗口。现在最重要的不是继续收藏议程，而是确定一天、一个场馆和三类必须见到的人。",
    bestFor: "正在寻找 AI 客户、合作方、投资人或具身智能行业信号的团队。",
    action: ["选定主会场和一天路线", "列出 5 个明确联系人", "每次交流约定一个后续动作"],
    sourceNote: "大会日期与场馆信息已按官方信息核验",
  },
  {
    slug: "y-combinator",
    order: "02",
    urgency: "剩余 10 天",
    deadline: "7 月 27 日 20:00 PT",
    signal: "申请截止",
    whyNow: "Fall 2026 正常申请窗口即将关闭。晚于截止时间仍可能被考虑，但官方不再承诺固定反馈时间。",
    bestFor: "已经全职投入、产品或技术方向明确，并希望进入全球融资网络的早期团队。",
    action: ["用一句话说清用户问题", "准备产品演示与进展证据", "明确创始团队为什么适合解决它"],
    sourceNote: "官方说明按时申请可在 8 月 28 日前获得决定",
  },
  {
    slug: "entrepreneur-first-london",
    order: "03",
    urgency: "剩余 18 天",
    deadline: "8 月 4 日",
    signal: "最终截止",
    whyNow: "EF London Fall 2026 面向个人创始人，先在伦敦完成 12 周公司形成阶段，再前往旧金山推进后三个月。",
    bestFor: "能力已经准备好，但联合创始人、具体方向或公司尚未完全形成的个人。",
    action: ["写清最强能力与非共识判断", "说明为什么必须现在创业", "提前评估全职线下与跨城安排"],
    sourceNote: "开始时间、地点与最终截止日已按官方申请页核验",
  },
  {
    slug: "berkeley-skydeck-batch-23",
    order: "04",
    urgency: "剩余 35 天",
    deadline: "8 月 21 日",
    signal: "全球申请",
    whyNow: "Batch 23 面向全球团队开放，六个月项目从 11 月 2 日开始；官方公布 Cohort 投资为 21 万美元。",
    bestFor: "准备在未来六个月达到重大产品里程碑或完成首轮机构融资的科技团队。",
    action: ["判断湾区网络是否真能带来客户或资本", "核算驻场、费用和股权成本", "准备六个月可验证的产品里程碑"],
    sourceNote: "时间、投资与参与条件已按 Berkeley SkyDeck 官方页面核验",
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
    dateModified: "2026-07-17",
    itemListElement: signals.map(({ resource }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: resource.name,
      url: `${siteOrigin}${resource.detailPath ?? `/resources/${resource.slug}`}`,
    })),
  };

  return (
    <main>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <section className="weekly-hero">
        <div className="weekly-edition">
          <span>WEEKLY SIGNAL · 001</span>
          <strong>2026.07.17—07.23</strong>
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
          <p>编辑于 2026 年 7 月 17 日。行动前请再次查看官方页面。</p>
        </aside>
      </section>

      <section className="weekly-summary" aria-label="本周机会概览">
        <div><strong>01</strong><span>正在发生</span><p>WAIC 本周末</p></div>
        <div><strong>03</strong><span>即将截止</span><p>YC · EF · SkyDeck</p></div>
        <div><strong>04</strong><span>可完成动作</span><p>每项都有行动清单</p></div>
      </section>

      <section className="weekly-share-band">
        <div>
          <span className="section-index">SAVE · SHARE · FOLLOW</span>
          <h2>别只收藏，给机会一个明确的下一步。</h2>
          <p>转给合适的人、把 4 个关键时间加入日历，或通过 RSS 跟进下一期。</p>
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
