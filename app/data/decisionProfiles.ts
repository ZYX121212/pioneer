import { resourceProfiles, type ResourceResearchProfile } from "./resourceProfiles";
import { englishDecisionProfiles } from "./englishDecisionProfiles";

export type DecisionLanguage = "zh" | "en";
export type BilingualDecisionProfile = Record<DecisionLanguage, ResourceResearchProfile>;

// Summary copy stays in english.ts. Decision profiles include every research section.
// Ratings are shared semantic codes; the view translates their display labels.
export const decisionProfiles: Record<string, BilingualDecisionProfile> = Object.fromEntries(
  Object.entries(englishDecisionProfiles).map(([slug, en]) => {
    const zh = resourceProfiles[slug];
    if (!zh) throw new Error(`Missing Chinese decision profile: ${slug}`);
    for (const section of ["capabilities", "offers", "entryPaths", "stageFit", "costs", "diligence", "playbook"] as const) {
      if (zh[section].length !== en[section].length) {
        throw new Error(`Decision profile structure differs: ${slug}.${section}`);
      }
    }
    return [slug, { zh, en }];
  }),
);

export function hasDecisionProfile(slug: string) {
  return Object.hasOwn(englishDecisionProfiles, slug);
}

export function getDecisionProfile(slug: string, lang: DecisionLanguage = "zh") {
  const localized = decisionProfiles[slug];
  if (localized) return localized[lang];
  // Unknown resources may use summary-based fallback. An existing profile must
  // never silently become generic English copy when its translation is missing.
  if (resourceProfiles[slug]) {
    if (lang === "zh") return resourceProfiles[slug];
    throw new Error(`Missing English decision profile: ${slug}`);
  }
  return undefined;
}

// A deliberately conservative fallback for resources with no authored profile.
// It uses localized summary evidence, rather than inventing event benefits.
export function summaryDecisionProfile(copy: {
  kind: string; overview: string; whyItMatters: string; editorialNote: string;
  bestFor: string[]; considerations: string[];
}, lang: DecisionLanguage): ResourceResearchProfile {
  const t = (zh: string, en: string) => lang === "en" ? en : zh;
  return {
    identity: { model: copy.overview, primaryValue: copy.whyItMatters, valueCondition: copy.editorialNote },
    capabilities: [{ label: t("主要价值", "Primary value"), strength: "中", detail: copy.whyItMatters }],
    offers: [{ title: copy.kind, includes: copy.overview, founderValue: copy.whyItMatters }],
    entryPaths: [{ title: t("核对官方参与入口", "Check official entry paths"), forWhom: copy.bestFor.join(" / "), prepare: copy.considerations.join(" / ") }],
    stageFit: copy.bestFor.map(stage => ({ stage, fit: "可以考虑", reason: copy.editorialNote })),
    costs: [],
    diligence: copy.considerations,
    playbook: [{ phase: "01", title: t("核对条件与下一步", "Check conditions and next steps"), action: copy.editorialNote, output: t("资格、成本与行动清单", "Eligibility, cost and action checklist") }],
    comparison: { chooseWhen: copy.bestFor.join(" / "), avoidWhen: copy.considerations.join(" / "), compareWith: t("比较同类资源的能力、投入和参与条件。", "Compare similar resources on capabilities, commitment and eligibility.") },
  };
}
