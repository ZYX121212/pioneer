import { runtimeMailConfiguration } from "../lib/mailRuntime";
import { getChatGPTUser } from "../chatgpt-auth";
import { NotificationPreferences } from "./NotificationPreferences";
import { SiteHeader, SiteFooter } from "./SiteChrome";
export async function NotificationsPage({ lang }: { lang: "zh" | "en" }) {
  const user = await getChatGPTUser();
  return <main><SiteHeader lang={lang} languageHref={`${lang === "en" ? "" : "/en"}/notifications`} /><div className="product-shell"><NotificationPreferences lang={lang} signedIn={!!user} deliveryEnabled={(await runtimeMailConfiguration()).enabled} /></div><SiteFooter lang={lang} /></main>;
}
