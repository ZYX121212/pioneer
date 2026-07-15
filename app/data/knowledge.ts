export type KnowledgeStage = "start" | "validate" | "team" | "company" | "funding";

export type KnowledgeItem = {
  id: number;
  stage: KnowledgeStage;
  kind: string;
  title: string;
  source: string;
  description: string;
  tags: string[];
  duration: string;
  level: string;
  scope: string;
  url: string;
  color: string;
};

export const learningPath: Array<{
  number: string;
  title: string;
  note: string;
  stage: KnowledgeStage;
}> = [
  { number: "01", title: "理解创业", note: "它与普通生意有什么不同", stage: "start" },
  { number: "02", title: "找到问题", note: "从想法走向真实需求", stage: "validate" },
  { number: "03", title: "验证用户", note: "访谈、实验与第一批反馈", stage: "validate" },
  { number: "04", title: "做出 MVP", note: "用最小成本验证关键假设", stage: "validate" },
  { number: "05", title: "组建团队", note: "联合创始人与合作预期", stage: "team" },
  { number: "06", title: "理解股权", note: "归属期、控制权与退出机制", stage: "team" },
  { number: "07", title: "设立公司", note: "先理解地区与结构差异", stage: "company" },
  { number: "08", title: "认识融资", note: "是否要融，以及会付出什么", stage: "funding" },
];

export const knowledgeStages: Array<{ key: "all" | KnowledgeStage; label: string }> = [
  { key: "all", label: "全部精选" },
  { key: "start", label: "开始之前" },
  { key: "validate", label: "想法验证" },
  { key: "team", label: "团队与股权" },
  { key: "company", label: "公司结构" },
  { key: "funding", label: "融资基础" },
];

export const knowledgeItems: KnowledgeItem[] = [
  {
    id: 1,
    stage: "start",
    kind: "课程与文章库",
    title: "YC Startup Library",
    source: "Y Combinator",
    description: "从创业想法、产品到融资与增长，按真实创始人问题整理的公开内容入口。",
    tags: ["创业基础", "视频", "英文"],
    duration: "按主题阅读",
    level: "入门",
    scope: "全球原则",
    url: "https://www.ycombinator.com/library",
    color: "orange",
  },
  {
    id: 2,
    stage: "start",
    kind: "公开讲座",
    title: "创业成功的关键因素",
    source: "Stanford eCorner",
    description: "由创业者、投资人与学者用短视频讨论目标客户、市场、韧性和团队等基本问题。",
    tags: ["大学课程", "28 个短视频", "英文"],
    duration: "碎片化学习",
    level: "入门",
    scope: "全球原则",
    url: "https://ecorner.stanford.edu/collection/key-success-factors-for-startups/",
    color: "mint",
  },
  {
    id: 3,
    stage: "validate",
    kind: "公开视频课",
    title: "Startup School 讲座集",
    source: "Y Combinator",
    description: "覆盖用户沟通、产品推进、早期指标与技术创始人常见问题，适合边做边学。",
    tags: ["用户验证", "产品", "英文"],
    duration: "系列课程",
    level: "入门",
    scope: "科技创业",
    url: "https://www.ycombinator.com/blog/startup-school-videos",
    color: "blue",
  },
  {
    id: 4,
    stage: "team",
    kind: "专业指南",
    title: "创始人股权基础",
    source: "Stripe Atlas",
    description: "理解创始人股份、归属期、悬崖期、知识产权转让与股权池之间的关系。",
    tags: ["Vesting", "Cap table", "英文"],
    duration: "约 25 分钟",
    level: "基础",
    scope: "美国公司",
    url: "https://stripe.com/guides/atlas/equity",
    color: "violet",
  },
  {
    id: 5,
    stage: "company",
    kind: "设立指南",
    title: "美国公司设立路线图",
    source: "Stripe Docs",
    description: "梳理公司类型、设立文件、创始人股权与设立后的基本事项，便于先看全貌。",
    tags: ["C Corp", "LLC", "英文"],
    duration: "约 20 分钟",
    level: "基础",
    scope: "美国公司",
    url: "https://docs.stripe.com/atlas",
    color: "rose",
  },
  {
    id: 6,
    stage: "funding",
    kind: "融资文件",
    title: "SAFE 融资文件与说明",
    source: "Y Combinator",
    description: "查看不同 SAFE 版本、用户指南与部分非美国地区文件，理解工具而不是直接套用。",
    tags: ["SAFE", "融资文件", "英文"],
    duration: "文件与指南",
    level: "进阶",
    scope: "多地区标注",
    url: "https://www.ycombinator.com/documents",
    color: "yellow",
  },
  {
    id: 7,
    stage: "funding",
    kind: "文件工具",
    title: "种子轮融资文件集",
    source: "Cooley GO",
    description: "由创业公司律师团队维护的种子轮股权与票据文件，适合了解正式交易文件构成。",
    tags: ["Seed", "法律文件", "英文"],
    duration: "参考工具",
    level: "进阶",
    scope: "美国公司",
    url: "https://www.cooleygo.com/series-seed-equity-and-note-financing-documents-and-generators/",
    color: "mint",
  },
  {
    id: 8,
    stage: "funding",
    kind: "实战指南",
    title: "第一份融资 Pitch Deck",
    source: "Stripe Atlas",
    description: "用不同叙事结构说明融资材料如何建立信念，并配有示例结构与常见误区。",
    tags: ["Pitch Deck", "叙事", "英文"],
    duration: "约 18 分钟",
    level: "基础",
    scope: "风险投资",
    url: "https://stripe.com/guides/atlas/pitchdeck",
    color: "orange",
  },
];
