import { GrowthFooter } from "./GrowthFooter";
import { SiteNavigation } from "./SiteNavigation";
type Props = { lang?: "zh" | "en"; languageHref?: string; home?: boolean };
export function SiteHeader({ lang = "zh", languageHref }: Props) { return <SiteNavigation lang={lang} languageHref={languageHref}/>; }
export function SiteFooter({ lang = "zh" }: Props) {
 const en=lang==="en",prefix=en?"/en":"";
 return <footer className="design-footer" id="about"><div className="design-width"><a className="design-brand" href={prefix||"/"}>PIONEER <small>GLOBAL STARTUP<br/>OPPORTUNITY NETWORK</small></a><p>More Founders. A Brighter Tomorrow.</p><nav aria-label={en?"Footer navigation":"页脚导航"}><a href={`${prefix}/knowledge`}>{en?"Founder guides":"创业指南"}</a><a href={`${prefix}/submit`}>{en?"Submit resource":"提交资源"}</a><a href={`${prefix}/community`}>{en?"Community":"社区"}</a><a href={`${prefix}/notifications`}>{en?"Notifications":"通知偏好"}</a><a href={`${prefix}/workspace`}>{en?"My workspace":"我的工作台"}</a></nav><details className="home-footer-updates"><summary>{en?"Updates & sharing":"通知与分享"}</summary><GrowthFooter lang={lang}/></details></div><div className="design-width footer-legal">© 2026 Pioneer · {en?"Check each resource’s individual review date":"每条资源显示独立核验日期"}</div></footer>;
}
