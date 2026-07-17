import { AudienceCount } from "./AudienceCounter";
import { GrowthFooter } from "./GrowthFooter";

type SiteChromeProps = {
  lang?: "zh" | "en";
};

const nav = {
  zh: {
    announcement: "站内整理已上线",
    visited: "位访客来过 Pioneer",
    homeLabel: "Pioneer 首页",
    links: [
      ["/weekly", "本周机会"],
      ["/knowledge", "创业指南"],
      ["/programs", "开放计划"],
      ["/organizations", "创业机构"],
      ["/events", "创业活动"],
      ["/startups", "创业项目"],
    ],
    submit: "提交资源",
    submitHref: "/submit",
    languageHref: "/en",
    languageLabel: "EN",
    footerLine: "GLOBAL STARTUP DIRECTORY & FOUNDER GUIDE",
    copyright: "© 2026 Pioneer. 内容最近核验：2026.07.15",
  },
  en: {
    announcement: "Curated resources are live",
    visited: "visitors have explored Pioneer",
    homeLabel: "Pioneer home",
    links: [
      ["/en/programs", "Programs"],
      ["/en/organizations", "Institutions"],
      ["/en/events", "Events"],
      ["/en/startups", "Startups"],
    ],
    submit: "Submit resource",
    submitHref: "/en/submit",
    languageHref: "/",
    languageLabel: "中文",
    footerLine: "GLOBAL STARTUP DIRECTORY & FOUNDER GUIDE",
    copyright: "© 2026 Pioneer. Last reviewed: 2026.07.16",
  },
} as const;

export function SiteHeader({ lang = "zh" }: SiteChromeProps) {
  const copy = nav[lang];
  const homeHref = lang === "en" ? "/en#top" : "/#top";

  return (
    <>
      <div className="announcement">
        <span>{copy.announcement}</span>
        <p>{lang === "zh" ? "已有 " : ""}<AudienceCount /> {copy.visited}</p>
      </div>
      <header className="site-header">
        <a className="brand" href={homeHref} aria-label={copy.homeLabel}>
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>PIONEER</span>
        </a>
        <nav aria-label={lang === "zh" ? "主导航" : "Primary navigation"}>
          {copy.links.map(([href, label]) => (
            <a href={href} key={href} data-audience-event="nav:open" data-audience-target={label}>{label}</a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="language-link" href={copy.languageHref}>{copy.languageLabel}</a>
          <a
            className="submit-link"
            href={copy.submitHref}
            data-audience-event="submit-resource:intent"
            data-audience-target="header-submit"
          >
            {copy.submit} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>
    </>
  );
}

export function SiteFooter({ lang = "zh" }: SiteChromeProps) {
  const copy = nav[lang];
  return (
    <footer id="about">
      <GrowthFooter lang={lang} />
      <div className="footer-brand">
        <span className="brand-mark">P</span>
        <div>
          <strong>PIONEER</strong>
          <p>{copy.footerLine}</p>
        </div>
      </div>
      <div className="footer-links">
        {copy.links.map(([href, label]) => (
          <a href={href} key={href} data-audience-event="footer:open" data-audience-target={label}>{label}</a>
        ))}
      </div>
      <p className="copyright">{copy.copyright}</p>
    </footer>
  );
}
