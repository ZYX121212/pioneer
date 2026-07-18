import type { Metadata } from "next";
import { ResourceSubmissionForm } from "../components/ResourceSubmissionForm";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "提交创业资源 — Pioneer",
  description: "向 Pioneer 推荐值得创业者关注的计划、机构、活动、创业项目或公开知识来源。",
  alternates: { canonical: "/submit", languages: { en: "/en/submit" } },
};

export default function SubmitResourcePage() {
  return (
    <main>
      <SiteHeader languageHref="/en/submit" />
      <section className="submission-hero">
        <div>
          <span className="section-index light">CONTRIBUTE TO PIONEER</span>
          <h1>让真正有用的机会，<br /><em>被更多创业者发现。</em></h1>
        </div>
        <aside>
          <strong>我们优先关注</strong>
          <ol>
            <li>信息来自可核验的官方页面</li>
            <li>创业者能判断是否适合自己</li>
            <li>有明确时间、入口或下一步行动</li>
          </ol>
        </aside>
      </section>
      <section className="submission-shell">
        <header>
          <span>01 / RECOMMEND A RESOURCE</span>
          <h2>告诉我们，它为什么值得被认真理解。</h2>
          <p>填写大约需要 3 分钟。资料会进入待核验清单，不会未经检查直接发布。</p>
        </header>
        <ResourceSubmissionForm />
      </section>
      <SiteFooter />
    </main>
  );
}
