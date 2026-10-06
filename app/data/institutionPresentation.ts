import type { Resource } from "./resources";
import { resources } from "./resources";
import { getEnglishResource } from "./english";
import { getOrganizationProfile } from "./organizationProfiles";
import { getInvestmentProfile } from "./investmentProfiles";
import { getResourceProfile } from "./resourceProfiles";
import type { InstitutionAnalysisTab, InstitutionProgram } from "../components/institutions/InstitutionControls";

export type InstitutionLang = "zh" | "en";
export const institutionImages: Record<string, { src: string; source: string; credit: string }> = {
  "station-f": { src: "/institutions/stationf-campus.jpg", source: "https://stationf.co/", credit: "Photo: STATION F" },
  "berkeley-skydeck": { src: "/institutions/skydeck-interior.jpg", source: "https://skydeck.berkeley.edu/", credit: "Photo: Marla Aufmuth / Berkeley SkyDeck" },
};

type EnglishInstitution = {
  thesis: string;
  capabilities: { label: string; detail: string; boundary: string }[];
  programs: Omit<InstitutionProgram, "image">[];
  cases: { name: string; detail: string }[];
  metrics: { label: string; value: string; note: string }[];
};
const englishInstitutions: Record<string, EnglishInstitution> = {
  "station-f": {
    thesis: "STATION F is a Paris campus hosting its own and partner programs. Choose the specific operator, stage and industry fit before committing to a French-market move.",
    capabilities: [
      { label: "Program diversity", detail: "30+ campus and partner programs cover different industries and stages.", boundary: "Eligibility, quality, fees and benefits vary by program." },
      { label: "Corporate connections", detail: "Corporate partners and sector programs create potential customer relationships.", boundary: "Campus admission does not guarantee procurement or a pilot." },
      { label: "Investor network", detail: "Investors, funds and demo activities support proactive relationship building.", boundary: "The brand does not replace traction, revenue or technical differentiation." },
      { label: "European market entry", detail: "A Paris base, international community and some administrative support can help entering France.", boundary: "Check each program's residency, company-registration and visa requirements." },
    ],
    programs: [
      { title: "STATION F programs", stage: "Early stage / specific audiences", category: "owned", detail: "Campus-operated programs for defined company stages and founder groups.", fit: "Match the current eligibility and support to your needs.", href: "https://stationf.co/programs" },
      { title: "Partner programs", stage: "MVP to growth", category: "partner", detail: "Programs operated by companies, schools and sector partners.", fit: "For industry customers, regulatory understanding or specialized channels.", href: "https://stationf.co/programs" },
      { title: "LAUNCH online learning", stage: "Idea / startup foundations", category: "online", detail: "Online courses, templates, community and tool benefits.", fit: "For first-time founders preparing before a campus commitment.", href: "/en/resources/launch-by-station-f" },
    ],
    cases: [{ name: "Hugging Face", detail: "AI company cited by the official campus ecosystem." }, { name: "Alan", detail: "A French technology and health-insurance example." }, { name: "Yuka", detail: "A consumer-product example with an international audience." }],
    metrics: [{ label: "Teams on campus", value: "1,000+", note: "Official ecosystem snapshot" }, { label: "Programs", value: "30+", note: "Separate operators and eligibility" }, { label: "Investor network", value: "700+", note: "Not a funding conversion rate" }, { label: "Startups supported", value: "9,000", note: "Cumulative ecosystem reach" }],
  },
  block71: {
    thesis: "BLOCK71 connects university, corporate and startup networks across local nodes. Choose the country and team that can support your actual market-entry goal.",
    capabilities: [
      { label: "Local market connections", detail: "Local teams connect founders with customers, investors and ecosystem partners.", boundary: "A global network does not mean identical support in every node." },
      { label: "Cross-border expansion", detail: "Nodes help bridge Asian markets and other innovation centers.", boundary: "Legal, hiring and sales localization still require founder execution." },
      { label: "Founder community", detail: "Programs, peer relationships and local events provide practical connections.", boundary: "Workspace alone does not guarantee useful business relationships." },
      { label: "University ecosystem", detail: "NUS-linked entrepreneurship resources connect research and commercial opportunities.", boundary: "Check specific program access and intellectual-property conditions." },
    ],
    programs: [
      { title: "Local node and incubation", stage: "MVP / early customers", category: "owned", detail: "Start with the node closest to your target customers.", fit: "Confirm the local operator's support, eligibility and cost.", href: "https://www.block71.co/" },
      { title: "Cross-border ecosystem", stage: "Market expansion", category: "partner", detail: "Use network relationships for introductions and market validation.", fit: "Bring a country-specific customer hypothesis and concrete requests.", href: "https://www.block71.co/" },
    ],
    cases: [], metrics: [],
  },
  "entrepreneur-first": {
    thesis: "Entrepreneur First selects individuals and helps them form teams and companies. Its value is strongest before a stable company exists, when complementary cofounders and intense joint work matter.",
    capabilities: [
      { label: "Cofounder matching", detail: "A selected candidate pool and intensive collaboration support partner testing.", boundary: "Matching creates opportunities, not guaranteed long-term compatibility." },
      { label: "Company formation", detail: "Individuals can begin without a settled company or idea.", boundary: "Potential must become rapid building and real user evidence." },
      { label: "Early capital", detail: "Formed companies may enter investment and subsequent funding pathways.", boundary: "Confirm grants, investment and equity in the current offer." },
      { label: "US-market bridge", detail: "Hub-city programs connect talent and technology markets.", boundary: "Full-time relocation and visa requirements can be substantial." },
    ],
    programs: [
      { title: "London individual program", stage: "Individual / company formation", category: "owned", detail: "Full-time in-person matching and company building, with a subsequent San Francisco phase.", fit: "For exceptional individuals ready to commit now.", href: "/en/resources/entrepreneur-first-london" },
      { title: "Other location pathways", stage: "Before a stable company", category: "owned", detail: "Research the current city-specific program rather than assuming a global uniform offer.", fit: "Compare your target market, living costs and participation conditions.", href: "https://www.joinef.com/" },
    ],
    cases: [], metrics: [],
  },
  "berkeley-skydeck": {
    thesis: "Berkeley SkyDeck combines a university ecosystem, advisors, corporate relationships and a dedicated fund. Cohort, partner and Pad-13 routes have different stages, affiliation requirements and funding arrangements.",
    capabilities: [
      { label: "Research commercialization", detail: "University and industry expertise can bridge technology and customer value.", boundary: "Admission does not transfer university intellectual property." },
      { label: "Advisors and curriculum", detail: "Key Advisors and Berkeley Acceleration Method support company building.", boundary: "Participation and advisor fit must match the company's goals." },
      { label: "Bay Area investors", detail: "Fund investment, Demo Day and introductions support early institutional fundraising.", boundary: "Check cohort-specific terms; other routes have different arrangements." },
      { label: "Berkeley talent", detail: "University and alumni networks can support recruitment and industry contacts.", boundary: "Specific research, hiring and customer access is not automatic." },
    ],
    programs: [
      { title: "Cohort accelerator", stage: "Technical product / seed", category: "owned", detail: "Six months of advising, BAM activities and investor preparation.", fit: "For technical teams approaching institutional funding.", href: "/en/resources/berkeley-skydeck-batch-23" },
      { title: "International Partner Program", stage: "International market entry", category: "partner", detail: "A partner route with separately defined support and participation conditions.", fit: "Confirm partner eligibility and the value of a Bay Area presence.", href: "https://skydeck.berkeley.edu/" },
      { title: "Pad-13", stage: "Earlier company formation", category: "owned", detail: "An earlier route within the Berkeley ecosystem.", fit: "Check current UC-affiliation and participation requirements.", href: "https://skydeck.berkeley.edu/" },
    ],
    cases: [], metrics: [],
  },
};

export function institutionPresentation(r: Resource, lang: InstitutionLang) {
  const en = lang === "en", copy = en ? getEnglishResource(r.slug)! : r;
  const t = (zh: string, english: string) => en ? english : zh;
  const org = getOrganizationProfile(r.slug), investor = getInvestmentProfile(r.slug), research = getResourceProfile(r.slug);
  const english = englishInstitutions[r.slug];
  const prefix = en ? "/en" : "";
  const investorKind = Boolean(investor);
  const capabilities = en ? english?.capabilities ?? copy.highlights.map(x=>({ label:x.label, detail:x.value, boundary:copy.considerations[0] })) : org?.resources.map(x=>({label:x.label,detail:x.provides,boundary:x.boundary})) ?? investor?.support.map((x,i)=>({label:t(`支持方向 ${i+1}`,`Support ${i+1}`),detail:x,boundary:"具体支持取决于投资关系、阶段和团队需求。"})) ?? research?.capabilities.map(x=>({label:x.label,detail:x.detail,boundary:r.considerations[0]})) ?? [];
  const programs: InstitutionProgram[] = en ? english?.programs ?? [] : org?.portfolio.map((p,i)=>({title:p.name,stage:p.stage,detail:p.mechanism,fit:p.fit,category:/在线|Launch/.test(p.name)?"online":/合作|伙伴|IPP/.test(p.name)?"partner":"owned",href:/Launch/i.test(p.name)?`${prefix}/resources/launch-by-station-f`:r.slug==="entrepreneur-first"&&i===0?`${prefix}/resources/entrepreneur-first-london`:r.slug==="berkeley-skydeck"&&i===0?`${prefix}/resources/berkeley-skydeck-batch-23`:r.url})) ?? (r.relatedSlugs??[]).map(slug=>resources.find(x=>x.slug===slug)).filter((x):x is Resource=>Boolean(x&&x.type==="program")).map(x=>({title:x.name,stage:x.kind,detail:x.description,fit:x.bestFor[0],category:"owned",href:`${prefix}/resources/${x.slug}`}));
  const cases = en ? english?.cases ?? investor?.portfolio.map(x=>({name:x.name,detail:resources.find(r=>r.name.includes(x.name)) ? getEnglishResource(resources.find(r=>r.name.includes(x.name))!.slug)?.kind??"Portfolio example" : "Published portfolio example"})) ?? [] : org?.dossier.cases.map(x=>({name:x.name,detail:x.signal})) ?? investor?.portfolio.map(x=>({name:x.name,detail:x.note})) ?? [];
  const metrics = en ? english?.metrics ?? copy.highlights.map(x=>({...x,note:copy.source})) : org?.dossier.evidence.filter(x=>x.verification==="官方公开").slice(0,4).map(x=>({label:x.label,value:x.value,note:x.interpretation})) ?? copy.highlights.map(x=>({...x,note:copy.source}));
  const thesis = en ? english?.thesis ?? copy.whyItMatters : org?.thesis ?? investor?.thesis ?? research?.identity.model ?? copy.overview;
  const conditions = en ? copy.considerations : org?.redFlags ?? investor?.questions ?? copy.considerations;
  const access = en ? copy.editorialNote : investor?.access.join("\n") ?? org?.dossier.selection.process.join("\n") ?? copy.editorialNote;
  const tabs: InstitutionAnalysisTab[] = [
    {id:"overview",label:t("概览","Overview"),title:t("Pioneer 的判断","Pioneer's take"),text:copy.editorialNote},
    {id:"strengths",label:t("优势","Strengths"),title:t("可以利用的资源","Resources to use"),points:capabilities.map(x=>`${x.label} · ${x.detail}`)},
    {id:"conditions",label:t("注意事项","Considerations"),title:t("先核对这些限制","Check these conditions"),points:conditions},
    {id:"fit",label:t("适合谁","Who it's for"),title:t("与你的目标是否匹配","Does it match your goals?"),points:copy.bestFor},
  ];
  const related = [...(r.relatedSlugs??[]).map(slug=>resources.find(x=>x.slug===slug)),...resources.filter(x=>x.type==="organization"&&Boolean(getInvestmentProfile(x.slug))===investorKind)].filter((x):x is Resource=>Boolean(x&&x.slug!==r.slug)).filter((x,i,arr)=>arr.findIndex(y=>y.slug===x.slug)===i).slice(0,4);
  return { copy, org, investor, research, investorKind, capabilities, programs, cases, metrics, thesis, conditions, access, tabs, related };
}
