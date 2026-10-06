export type EventDecisionLang = "zh" | "en";
const official = "https://techcrunch.com/events/techcrunch-disrupt/";
export const disruptDecision = {
  reviewed: "2026-10-06",
  venue: "Moscone West · San Francisco, USA",
  imageSource: "https://techcrunch.com/wp-content/uploads/2025/10/Disrupt-Audience.webp",
  sources: [
    {label:"TechCrunch · 2026 / tickets / exhibit cutoff",href:official},
    {label:"Startup Battlefield · application closed",href:"https://techcrunch.com/startup-battlefield/"},
    {label:"Moscone · venue / edition dates",href:"https://moscone.com/events/techcrunch-disrupt-2026"},
    {label:"TechCrunch · attendee access",href:official+"attendee-portal/"},
  ],
  modules: {
    zh: [
      {title:"主舞台与专题讨论",value:"带着一个经营问题听创业者与投资人的讨论，筛选可用于自己团队的假设。"},
      {title:"Startup Battlefield",value:"观察入选团队的路演与评委问题，校准自己的融资叙事；2026 参赛申请已经关闭。"},
      {title:"Expo / Pitch-Showcase",value:"与展区团队交流产品、客户与伙伴需求；普通参会不自动获得展位或路演名额。"},
      {title:"投资人与创始人会面",value:"先确认所购票种可访问的会面空间，再安排目标会谈；不要把入场资格等同于投资人承诺。"},
      {title:"周边活动与 Networking",value:"按目标人群选择小型交流，核对独立报名与邀请条件，避免填满日程。"},
      {title:"媒体与故事准备",value:"准备可验证的产品进展与媒体材料，主动寻找相关记者；参会与入选均不保证报道。"},
    ],
    en: [
      {title:"Stage sessions",value:"Choose discussions that answer a specific operating question; test the ideas against your own company."},
      {title:"Startup Battlefield",value:"Study selected teams’ pitches and judges’ questions. Applications to compete in 2026 are closed."},
      {title:"Expo / Pitch-Showcase",value:"Explore products and partnership needs. A regular ticket does not grant a booth or a pitch slot."},
      {title:"Founder–investor meetings",value:"Confirm access for your pass before scheduling meetings. Access is not an investment commitment."},
      {title:"Side events and networking",value:"Pick smaller gatherings by audience fit; check separate registration or invitation requirements."},
      {title:"Media preparation",value:"Bring verifiable product progress and a press kit. Attendance or selection does not guarantee coverage."},
    ],
  },
  paths: {
    zh: [
      {title:"普通参会 / Founder Pass",status:"购票入口可见 · 票价随时变化",forWhom:"有明确会面、学习或融资准备目标的创业者。",prepare:"官方活动页按票种购票。购票前确认专属空间、退改条件与行程。回报来自会面与反馈，不是融资保证。",href:official},
      {title:"创业展示 / Expo",status:"本届展位截止已过 · 10 月 2 日",forWhom:"有稳定演示、目标客户和跟进能力的团队。",prepare:"普通票不含展位。当前不要按仍可申请安排预算；若联系主办方询问额外机会，必须收到明确确认。",href:official+"exhibit/"},
      {title:"Startup Battlefield",status:"2026 申请已关闭",forWhom:"早期团队可研究入选项目并为下一届准备。",prepare:"这是竞争性筛选，不是购票权益。2026 不再作为可申请窗口，下一届开放时间尚未核验。",href:"https://techcrunch.com/startup-battlefield/"},
      {title:"Sponsor / Partner",status:"向主办方询价 · 不保证可用",forWhom:"有品牌、渠道或生态目标的机构与企业。",prepare:"独立商务合作，核对权益、可用名额、费用和交付。只在目标受众与可衡量线索质量匹配时考虑。",href:official+"partners/"},
    ],
    en: [
      {title:"Attend / Founder Pass",status:"Ticket link visible · prices can change",forWhom:"Founders with a defined meeting, learning or fundraising-preparation goal.",prepare:"Buy via the official page. Check access and refund terms. Value comes from useful meetings and feedback, not guaranteed funding.",href:official},
      {title:"Startup showcase / Expo",status:"Published exhibit cutoff passed · October 2",forWhom:"Teams with a reliable demo and a follow-up process.",prepare:"A ticket does not include a booth. Do not budget on an open application; confirm any exception directly with the organizer.",href:official+"exhibit/"},
      {title:"Startup Battlefield",status:"2026 applications closed",forWhom:"Early-stage teams researching selected companies and preparing for a future edition.",prepare:"Competitive selection, not a ticket benefit. No current application window; next-edition dates remain unverified.",href:"https://techcrunch.com/startup-battlefield/"},
      {title:"Sponsor / Partner",status:"Ask the organizer · availability unconfirmed",forWhom:"Organizations with a defined brand, channel or ecosystem objective.",prepare:"Separate commercial terms. Confirm availability, deliverables and price; assess audience fit and measurable lead quality.",href:official+"partners/"},
    ],
  },
};
// Recommendations are editorial roles, not official eligibility or admission criteria.
export function eventRoles(lang: EventDecisionLang) {
  return lang === "zh" ? [
    {role:"早期创业者",fit:"有产品再考虑",focus:"优先客户反馈与同类产品；只有想法时，先做访谈。"},
    {role:"融资中的团队",fit:"目标匹配时优先",focus:"约见符合行业与阶段的投资人，准备简短叙事和进展证据。"},
    {role:"投资人",fit:"按投资主题筛选",focus:"研究项目与创始人，确认票种会面权限和目标企业名单。"},
    {role:"企业创新部门",fit:"带采购问题参加",focus:"寻找可试点方案，提前定义部署条件、预算与决策人。"},
    {role:"媒体 / 内容从业者",fit:"按报道主题筛选",focus:"核对采访与媒体资格，提前约好相关团队。"},
    {role:"开发者 / 学生",fit:"谨慎投入差旅",focus:"按技术主题筛选议程；仅为学习时，比较线上内容与本地活动。"},
  ] : [
    {role:"Early founders",fit:"Consider with a working product",focus:"Seek customer feedback and product comparisons; validate ideas before expensive travel."},
    {role:"Fundraising teams",fit:"Prioritize when targets match",focus:"Meet relevant investors and bring a short narrative backed by progress evidence."},
    {role:"Investors",fit:"Select by investment thesis",focus:"Research founders and companies; confirm pass access and build a target list."},
    {role:"Corporate innovation",fit:"Bring a procurement question",focus:"Identify pilots and define deployment constraints, budget and decision owners."},
    {role:"Media / creators",fit:"Select by reporting focus",focus:"Check press access and arrange relevant interviews ahead of time."},
    {role:"Developers / students",fit:"Be cautious about travel costs",focus:"Compare online material and local events if learning is the main objective."},
  ];
}
