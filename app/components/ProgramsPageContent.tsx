import { getResourcesByType } from "../data/resources";
import { communityEntries } from "../lib/community";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import { ProgramsExperience } from "./ProgramsExperience";
import "./programs.css";
export async function ProgramsPageContent({ lang = "zh" }: { lang?: "zh" | "en" }) {
  const community = await communityEntries("program", lang);
  return <main className="programs-page"><SiteHeader lang={lang} languageHref={lang === "en" ? "/programs" : "/en/programs"}/><ProgramsExperience resources={[...getResourcesByType("program"), ...community.resources]} lang={lang} unavailable={community.unavailable}/><SiteFooter lang={lang}/></main>;
}
