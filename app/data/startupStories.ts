export type StartupStoryProfile = {
  founded?: string;
  origin: string;
  founders: Array<{ name: string; role: string; background: string }>;
  founderThesis: string;
  founderSource: { label: string; href: string };
  funding: Array<{
    date: string;
    round: string;
    amount: string;
    detail: string;
    source: { label: string; href: string };
  }>;
  coverage?: Array<{
    type: "创始人访谈" | "官方公告" | "融资披露" | "公司历程";
    date: string;
    title: string;
    summary: string;
    href: string;
  }>;
};

export const startupStories: Record<string, StartupStoryProfile> = {
  anthropic: {
    founded: "2021",
    origin: "由一批长期研究大模型、安全与可解释性的研究者共同创立，从一开始就把可靠性研究与可用产品放在同一条路线中。",
    founders: [
      { name: "Dario Amodei", role: "联合创始人、CEO", background: "长期从事大模型、扩展规律与 AI 安全研究，负责公司技术与战略方向。" },
      { name: "Daniela Amodei", role: "联合创始人、President", background: "负责组织、运营与治理建设，将研究使命转化为可持续公司。" },
    ],
    founderThesis: "不是先追求能力再补安全，而是在模型扩展过程中同步研究可靠、可解释和可控的方法。",
    founderSource: { label: "Anthropic 公司与团队", href: "https://www.anthropic.com/company" },
    funding: [
      { date: "2021.05", round: "A 轮", amount: "$124M", detail: "资金用于计算密集型研究，以及可靠、可引导的大规模 AI 系统原型。", source: { label: "Anthropic A 轮公告", href: "https://www.anthropic.com/news/anthropic-raises-124-million-to-build-more-reliable-general-ai-systems" } },
      { date: "2023.05", round: "C 轮", amount: "$450M", detail: "从研究组织向 Claude 产品和企业采用扩张，继续投入安全研究。", source: { label: "Anthropic C 轮公告", href: "https://www.anthropic.com/news/anthropic-series-c" } },
    ],
    coverage: [
      { type: "公司历程", date: "持续更新", title: "公司使命、团队与治理结构", summary: "理解 Anthropic 为什么把可靠性研究、产品和公共利益公司治理放在一起。", href: "https://www.anthropic.com/company" },
      { type: "融资披露", date: "2021.05", title: "从研究路线开始的 A 轮", summary: "早期融资公告同时说明了创始人分工、研究背景和资金使用方向。", href: "https://www.anthropic.com/news/anthropic-raises-124-million-to-build-more-reliable-general-ai-systems" },
      { type: "融资披露", date: "2023.05", title: "C 轮与 Claude 产品化", summary: "观察资金如何从基础研究进一步连接产品、企业客户和市场扩张。", href: "https://www.anthropic.com/news/anthropic-series-c" },
    ],
  },
  vercel: {
    founded: "2015",
    origin: "从让个人开发者更轻松地部署网站开始，通过开源框架和云平台形成开发、预览、发布的一体化工作流。",
    founders: [{ name: "Guillermo Rauch", role: "创始人、CEO", background: "开发者与开源工具创业者，长期围绕实时应用、前端框架和开发体验构建产品。" }],
    founderThesis: "世界级公司的内部开发基础设施，应该被做成每一位开发者都能直接使用的产品。",
    founderSource: { label: "Vercel 创立与品牌历程", href: "https://vercel.com/blog/zeit-is-now-vercel" },
    funding: [
      { date: "2020.04", round: "A 轮", amount: "$21M", detail: "ZEIT 更名为 Vercel，资金继续投入部署体验与 Next.js 等开源项目。", source: { label: "Vercel A 轮与更名公告", href: "https://vercel.com/blog/zeit-is-now-vercel" } },
      { date: "2025.09", round: "F 轮", amount: "$300M", detail: "公司将定位从前端云扩展为 AI Cloud，并披露 93 亿美元估值。", source: { label: "Vercel F 轮公告", href: "https://vercel.com/blog/series-f" } },
    ],
    coverage: [
      { type: "公司历程", date: "2020.04", title: "从 ZEIT 到 Vercel", summary: "一篇能够同时看懂公司起点、产品定位和开源分发策略的创始人文章。", href: "https://vercel.com/blog/zeit-is-now-vercel" },
      { type: "融资披露", date: "2025.09", title: "走向 AI Cloud 的 F 轮", summary: "解释新一轮资金、估值以及公司为什么从 Web 基础设施进入 Agent 时代。", href: "https://vercel.com/blog/series-f" },
    ],
  },
  stripe: {
    origin: "从降低互联网支付接入复杂度切入，逐步扩展为覆盖支付、财务与全球商业运营的经济基础设施。",
    founders: [
      { name: "Patrick Collison", role: "联合创始人、CEO", background: "负责 Stripe 的长期产品、技术与公司战略。" },
      { name: "John Collison", role: "联合创始人、President", background: "负责公司经营、全球扩张与重要业务方向。" },
    ],
    founderThesis: "互联网企业不应该把大量时间消耗在支付和金融基础设施上，复杂能力应当通过简单接口获得。",
    founderSource: { label: "Stripe 官方领导团队", href: "https://stripe.com/newsroom/information" },
    funding: [],
    coverage: [
      { type: "公司历程", date: "持续更新", title: "Stripe 公司资料与领导团队", summary: "官方介绍两位联合创始人的角色、公司使命、全球覆盖与关键经营数据。", href: "https://stripe.com/newsroom/information" },
      { type: "创始人访谈", date: "2024", title: "Patrick 与 John Collison 创始人问答", summary: "从创始人视角理解 Stripe 如何判断反常识机会、长期建设和互联网经济。", href: "https://stripe.com/en-mx/sessions/2024/ama-with-patrick-and-john-collison" },
    ],
  },
  "redwood-materials": {
    founded: "2017",
    origin: "从电池回收出发，逐步连接关键材料精炼、电池材料生产与储能系统，试图建立更完整的本土电池供应链。",
    founders: [{ name: "JB Straubel", role: "创始人、CEO", background: "长期从事电动车、电池系统与能源基础设施建设，将整车产业经验迁移到电池全生命周期。" }],
    founderThesis: "电池产业真正的瓶颈不只在制造，还在关键材料的循环、供应安全和第二生命周期价值。",
    founderSource: { label: "Redwood 公司历史与领导团队", href: "https://www.redwoodmaterials.com/about/" },
    funding: [
      { date: "2021", round: "成长融资", amount: "$700M", detail: "扩大电池材料回收、精炼与制造能力。", source: { label: "Redwood 公司历史", href: "https://www.redwoodmaterials.com/about/" } },
      { date: "2023", round: "成长融资", amount: "$1B+", detail: "继续扩张美国本土关键材料和电池供应链基础设施。", source: { label: "Redwood 公司历史", href: "https://www.redwoodmaterials.com/about/" } },
      { date: "2026.01", round: "E 轮最终关闭", amount: "$425M", detail: "支持材料产能、合作项目与储能业务扩张。", source: { label: "Redwood E 轮公告", href: "https://www.redwoodmaterials.com/news/redwood-materials-announces-final-close-of-425m-series-e/" } },
    ],
    coverage: [
      { type: "公司历程", date: "2017–2026", title: "Redwood 公司发展时间线", summary: "把创立、产业合作、融资、欧洲扩张和储能业务放进一条连续路线。", href: "https://www.redwoodmaterials.com/about/" },
      { type: "融资披露", date: "2026.01", title: "4.25 亿美元 E 轮最终关闭", summary: "观察资本如何支持材料产能与储能业务，而不只停留在回收概念。", href: "https://www.redwoodmaterials.com/news/redwood-materials-announces-final-close-of-425m-series-e/" },
    ],
  },
};

export function getStartupStory(slug: string) {
  return startupStories[slug];
}
