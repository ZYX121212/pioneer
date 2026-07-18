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

export const mvpGuide: PioneerGuide = {
  slug: "define-your-mvp",
  stage: "产品验证",
  number: "03",
  title: "第一版到底做什么，才能验证而不是拖延？",
  description: "从最危险的假设倒推 MVP，只交付一个完整结果，不把未来产品缩小一遍。",
  duration: "约 28 分钟",
  updated: "2026.07.16",
  outcome: ["一个 MVP 学习目标", "一张功能边界表", "一份两周验证计划"],
  sources: [
    {
      title: "Practical Design: MVP Spec",
      publisher: "Y Combinator",
      use: "用于区分产品功能与产品特性，并强调 MVP 必须让真实用户理解和使用一个完整价值。",
      url: "https://www.ycombinator.com/blog/practical-design-mvp",
      language: "英文",
    },
    {
      title: "YC’s Essential Startup Advice",
      publisher: "Y Combinator",
      use: "用于尽早发布、与用户交流，并用一个足够有用的核心结果替代等待完美产品。",
      url: "https://www.ycombinator.com/blog/ycs-essential-startup-advice/",
      language: "英文",
    },
    {
      title: "Don't Build When You Build-Measure-Learn",
      publisher: "Strategyzer",
      use: "用于从学习目标而不是功能数量定义 MVP，并优先选择最低成本的实验载体。",
      url: "https://www.strategyzer.com/library/dont-build-when-you-build-measure-learn",
      language: "英文",
    },
  ],
};

export const firstUsersGuide: PioneerGuide = {
  slug: "find-your-first-ten-users",
  stage: "早期获客",
  number: "04",
  title: "最初十个用户不会自己出现，你应该去哪里找？",
  description: "从一个足够窄的人群开始，建立名单、手工触达，并用真实推进而不是曝光量判断渠道。",
  duration: "约 30 分钟",
  updated: "2026.07.16",
  outcome: ["一份 30 人目标名单", "三种手工触达脚本", "一张首批用户推进表"],
  sources: [
    {
      title: "Do Things that Don't Scale",
      publisher: "Paul Graham",
      use: "用于早期用户需要由创始人手工招募、亲自服务，而不是等待可规模化渠道出现。",
      url: "https://www.paulgraham.com/ds.html",
      language: "英文",
    },
    {
      title: "YC’s Essential Startup Advice",
      publisher: "Y Combinator",
      use: "用于先找到少量真正需要产品的用户，再讨论增长与规模化。",
      url: "https://www.ycombinator.com/blog/ycs-essential-startup-advice/",
      language: "英文",
    },
    {
      title: "Startup School Week 1 Recap",
      publisher: "Y Combinator",
      use: "用于识别更可能成为第一批客户的人，并从用户特征与问题强度建立筛选条件。",
      url: "https://www.ycombinator.com/blog/startup-school-week-1-recap-kevin-hale-and-eric-migicovsky/",
      language: "英文",
    },
  ],
};

export const cofounderGuide: PioneerGuide = {
  slug: "test-your-cofounder",
  stage: "团队与股权",
  number: "05",
  title: "先验证能不能一起创业，再讨论应该分多少股权。",
  description: "判断你是否需要联合创始人，用一次真实共事测试角色、投入、冲突与长期承诺。",
  duration: "约 32 分钟",
  updated: "2026.07.17",
  outcome: ["一份联合创始人需求说明", "一张四周共事测试卡", "一份创始人关键约定清单"],
  sources: [
    {
      title: "How to Split Equity Among Co-Founders",
      publisher: "Y Combinator",
      use: "用于理解创始人价值主要来自未来共同执行，明显不平等的股权需要非常充分的理由。",
      url: "https://www.ycombinator.com/blog/splitting-equity-among-founders",
      language: "英文",
    },
    {
      title: "Equity for Founders",
      publisher: "Stripe Atlas",
      use: "用于解释创始人股权、归属期、离开机制和知识产权转让；具体条款必须结合注册地与专业意见。",
      url: "https://stripe.com/guides/atlas/equity",
      language: "英文",
    },
    {
      title: "Founder Equity Terms",
      publisher: "Stripe Documentation",
      use: "用于说明常见的四年归属期、一年悬崖期及归属起始日，但不把平台默认值当成所有公司的法律答案。",
      url: "https://docs.stripe.com/atlas/equity-terms",
      language: "英文",
    },
    {
      title: "YC Co-Founder Matching",
      publisher: "Y Combinator",
      use: "作为寻找潜在联合创始人的公开入口之一；匹配只是认识，必须通过真实共事完成验证。",
      url: "https://www.ycombinator.com/cofounder-matching",
      language: "英文",
    },
  ],
};

export const fundingDecisionGuide: PioneerGuide = {
  slug: "decide-whether-to-fundraise",
  stage: "融资基础",
  number: "06",
  title: "融资不是创业进度条：你的公司现在真的需要钱吗？",
  description: "先定义资金要跨越的里程碑，再比较收入、补助、债务、天使和风险投资。",
  duration: "约 34 分钟",
  updated: "2026.07.17",
  outcome: ["一张融资必要性判断卡", "一份下一轮里程碑预算", "一份融资前证据清单"],
  sources: [
    {
      title: "A Guide to Seed Fundraising",
      publisher: "Y Combinator",
      use: "用于融资时机、融资规模、投资人沟通和融资过程的基础框架。",
      url: "https://www.ycombinator.com/blog/how-to-raise-a-seed-round/",
      language: "英文",
    },
    {
      title: "Aaron Harris on Fundraising and Meeting with Investors",
      publisher: "Y Combinator",
      use: "用于理解融资是一段集中过程，需要并行接触、清晰计划和尽快回到公司建设。",
      url: "https://www.ycombinator.com/blog/aaron-harris-on-fundraising-and-meeting-with-investors",
      language: "英文",
    },
    {
      title: "Writing a Business Plan",
      publisher: "Sequoia Capital",
      use: "用于组织公司目的、问题、解决方案、为什么是现在、市场、团队和财务逻辑，而不是照抄一套幻灯片。",
      url: "https://sequoiacap.com/article/writing-a-business-plan/",
      language: "英文",
    },
    {
      title: "SAFE Financing Documents",
      publisher: "Y Combinator",
      use: "用于查看 SAFE 原始文件和使用指南；签署前必须理解稀释、估值上限和所在地法律影响。",
      url: "https://www.ycombinator.com/documents",
      language: "英文",
    },
  ],
};

export const pioneerGuides = [pioneerGuide, interviewGuide, mvpGuide, firstUsersGuide, cofounderGuide, fundingDecisionGuide];

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
  { number: "03", title: "确定 MVP 边界", note: "只验证当前最危险的假设", stage: "validate", href: `/knowledge/${mvpGuide.slug}`, status: "available" },
  { number: "04", title: "找到最初十个用户", note: "从名单到第一轮真实触达", stage: "validate", href: `/knowledge/${firstUsersGuide.slug}`, status: "available" },
  { number: "05", title: "验证联合创始人", note: "先真实共事，再谈角色与股权", stage: "team", href: `/knowledge/${cofounderGuide.slug}`, status: "available" },
  { number: "06", title: "判断是否需要融资", note: "从里程碑倒推资金需求", stage: "funding", href: `/knowledge/${fundingDecisionGuide.slug}`, status: "available" },
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
  {
    id: 9,
    stage: "start",
    kind: "创意方法",
    title: "如何找到值得做的创业想法",
    source: "Y Combinator",
    description: "从个人经验、正在发生的变化和真实问题出发，区分有机形成的洞察与为了创业而拼凑的点子。",
    tags: ["创业想法", "创始人优势", "英文"],
    duration: "约 20 分钟",
    level: "入门",
    scope: "科技创业",
    url: "https://www.ycombinator.com/library/8g-how-to-get-startup-ideas",
    color: "orange",
  },
  {
    id: 10,
    stage: "validate",
    kind: "市场判断",
    title: "真正的产品市场匹配是什么",
    source: "Y Combinator",
    description: "用用户拉力、增长和市场反应理解 PMF，避免把主观满意、少量赞美或短期数据误认为匹配。",
    tags: ["PMF", "用户拉力", "英文"],
    duration: "约 18 分钟",
    level: "基础",
    scope: "早期产品",
    url: "https://www.ycombinator.com/library/5z-the-real-product-market-fit",
    color: "blue",
  },
  {
    id: 11,
    stage: "company",
    kind: "法律基础",
    title: "公司为什么必须拥有核心知识产权",
    source: "Stripe Atlas",
    description: "理解创始人和员工的知识产权转让、文件留存，以及权属不清对融资、尽调和收购的长期风险。",
    tags: ["知识产权", "IP Assignment", "英文"],
    duration: "约 20 分钟",
    level: "基础",
    scope: "美国公司",
    url: "https://stripe.com/guides/atlas/equity",
    color: "rose",
  },
  {
    id: 12,
    stage: "team",
    kind: "股权管理",
    title: "从第一天开始维护股权与 Cap Table",
    source: "Carta",
    description: "梳理创始人股份、归属安排、期权池、融资工具和重大变化的记录方式，避免后期修复所有权数据。",
    tags: ["Cap Table", "股权管理", "英文"],
    duration: "约 8 分钟",
    level: "基础",
    scope: "美国公司",
    url: "https://carta.com/learn/startups/equity-management/",
    color: "violet",
  },
];
