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

export type GuideSource = {
  title: string;
  publisher: string;
  use: string;
  url: string;
  language: string;
};

export type PioneerGuide = {
  slug: string;
  stage: string;
  number: string;
  title: string;
  description: string;
  duration: string;
  updated: string;
  outcome: string[];
  sources: GuideSource[];
};

export const pioneerGuide: PioneerGuide = {
  slug: "find-the-real-problem",
  stage: "想法验证",
  number: "01",
  title: "你的想法是真问题，还是一个你喜欢的解决方案？",
  description: "先暂停做产品，用真实行为判断一个问题是否值得继续投入。",
  duration: "约 35 分钟",
  updated: "2026.07.16",
  outcome: ["一份问题陈述", "一张核心假设卡", "一个三天验证计划"],
  sources: [
    {
      title: "How to Talk to Users",
      publisher: "Y Combinator",
      use: "用于用户访谈部分：少谈假设，多追问已经发生的具体经历。",
      url: "https://www.ycombinator.com/library/6g-how-to-talk-to-users",
      language: "英文",
    },
    {
      title: "Validate Your Ideas with the Test Card",
      publisher: "Strategyzer",
      use: "用于假设卡结构：明确假设、实验、衡量方式与成功门槛。",
      url: "https://www.strategyzer.com/library/validate-your-ideas-with-the-test-card",
      language: "英文",
    },
    {
      title: "Know Your Customers’ ‘Jobs to Be Done’",
      publisher: "Harvard Business Review",
      use: "用于理解用户为什么在特定情境下选择或放弃一种解决方式。",
      url: "https://hbr.org/2016/09/know-your-customers-jobs-to-be-done",
      language: "英文",
    },
    {
      title: "第一篇：发现真问题",
      publisher: "AI Spacewalk",
      use: "页面组织参考：进入信号、行动步骤和阶段判断；Pioneer 已重新编排为通用创业场景。",
      url: "https://www.aispacewalk.cn/marketing/%E4%BB%8E0%E5%88%B01%E5%81%9A%E7%A1%AC%E4%BB%B6%E4%BA%A7%E5%93%81/%E5%8F%91%E7%8E%B0%E7%9C%9F%E9%97%AE%E9%A2%98/",
      language: "中文",
    },
  ],
};

export const interviewGuide: PioneerGuide = {
  slug: "first-user-interview",
  stage: "用户验证",
  number: "02",
  title: "第一次和潜在用户交流，应该问什么？",
  description: "从招募、开场、追问到整理证据，完成一次不推销方案的用户访谈。",
  duration: "约 25 分钟",
  updated: "2026.07.16",
  outcome: ["一份访谈招募计划", "一套 30 分钟提纲", "一张证据记录表"],
  sources: [
    {
      title: "How to Talk to Users",
      publisher: "Y Combinator",
      use: "用于访谈原则：询问已经发生的具体经历，而不是未来的假设和功能偏好。",
      url: "https://www.ycombinator.com/library/6g-how-to-talk-to-users",
      language: "英文",
    },
    {
      title: "User Interviews: How, When, and Why to Conduct Them",
      publisher: "Nielsen Norman Group",
      use: "用于访谈方法边界、开放式提问和定性研究的基本结构。",
      url: "https://www.nngroup.com/articles/user-interviews/",
      language: "英文",
    },
    {
      title: "The Mom Test",
      publisher: "Rob Fitzpatrick",
      use: "用于避免礼貌性反馈、追问过去行为和识别无效恭维。",
      url: "https://www.momtestbook.com/",
      language: "英文",
    },
  ],
};

export const pioneerGuides = [pioneerGuide, interviewGuide];

export const learningPath: Array<{
  number: string;
  title: string;
  note: string;
  stage: KnowledgeStage;
  href?: string;
  status: "available" | "next" | "planned";
}> = [
  { number: "01", title: "发现真问题", note: "想法是真需求，还是自我感动？", stage: "validate", href: `/knowledge/${pioneerGuide.slug}`, status: "available" },
  { number: "02", title: "第一次用户访谈", note: "不推销方案，收集真实经历", stage: "validate", href: `/knowledge/${interviewGuide.slug}`, status: "available" },
  { number: "03", title: "确定 MVP 边界", note: "只验证当前最危险的假设", stage: "validate", status: "planned" },
  { number: "04", title: "找到最初十个用户", note: "从名单到第一轮真实触达", stage: "validate", status: "planned" },
  { number: "05", title: "谈联合创始人", note: "角色、投入、股权与退出", stage: "team", status: "planned" },
  { number: "06", title: "判断是否需要融资", note: "从里程碑倒推资金需求", stage: "funding", status: "planned" },
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
