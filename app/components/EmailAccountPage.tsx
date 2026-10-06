import { getAppUser, accountReturnPath } from "../lib/appUser";
import { runtimeMailConfiguration } from "../lib/mailRuntime";
import { SiteHeader, SiteFooter } from "./SiteChrome";
import { EmailAccountForm } from "./EmailAccountForm";
export async function EmailAccountPage({ lang, returnTo }: { lang: "zh" | "en"; returnTo?: string }) {
  const user = await getAppUser();
  return <main><SiteHeader lang={lang} languageHref={`${lang === "en" ? "" : "/en"}/login`} /><div className="product-shell"><EmailAccountForm lang={lang} returnTo={accountReturnPath(returnTo, `${lang === "en" ? "/en" : ""}/workspace`)} deliveryEnabled={(await runtimeMailConfiguration()).enabled} account={user ? { name: user.displayName, email: user.email, verified: user.emailVerified, provider: user.provider } : null} /></div><SiteFooter lang={lang} /></main>;
}
