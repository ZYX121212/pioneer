export type ProfileStrength = "核心" | "强" | "中" | "有限";
export type ProfileFit = "优先考虑" | "可以考虑" | "暂不优先";
export type CostLevel = "高" | "中" | "低";

export type ResourceResearchProfile = {
  identity: {
    model: string;
    primaryValue: string;
    valueCondition: string;
  };
  capabilities: Array<{
    label: string;
    strength: ProfileStrength;
    detail: string;
  }>;
  offers: Array<{
    title: string;
    includes: string;
    founderValue: string;
  }>;
  entryPaths: Array<{
    title: string;
    forWhom: string;
    prepare: string;
  }>;
  stageFit: Array<{
    stage: string;
    fit: ProfileFit;
    reason: string;
  }>;
  costs: Array<{
    label: string;
    level: CostLevel;
    detail: string;
  }>;
  diligence: string[];
  playbook: Array<{
    phase: string;
    title: string;
    action: string;
    output: string;
  }>;
  comparison: {
    chooseWhen: string;
    avoidWhen: string;
    compareWith: string;
  };
};

type FounderEventProfileInput = {
  event: string;
  model: string;
  primaryValue: string;
  valueCondition: string;
  audience: string;
  meetingTarget: string;
  preparation: string;
  tripCost: string;
  alternative: string;
};

function founderEventProfile(input: FounderEventProfileInput): ResourceResearchProfile {
  return {
    identity: {
      model: input.model,
      primaryValue: input.primaryValue,
      valueCondition: input.valueCondition,
    },
    capabilities: [
      { label: "目标人群密度", strength: "核心", detail: `${input.event} 的主要价值来自 ${input.audience} 在同一时间出现，而不是舞台内容本身。` },
      { label: "会面与关系建立", strength: "强", detail: `适合围绕 ${input.meetingTarget} 提前建立名单、预约会面，并在现场验证合作意愿。` },
      { label: "市场情报", strength: "强", detail: "可以快速比较同类产品、客户表述、投资主题和区域生态，但必须带着明确问题观察。" },
      { label: "直接业务转化", strength: "中", detail: "大会提供连接场景，不保证采购或融资；价值取决于会前准备与会后连续跟进。" },
    ],
    offers: [
      { title: "高密度行业现场", includes: `在有限时间内接触 ${input.audience}，并观察他们正在讨论和采购什么。`, founderValue: "用真实对话校准市场判断，减少只依赖线上信息形成的偏差。" },
      { title: "结构化会面入口", includes: `通过官方活动工具、展区、圆桌或周边活动接触 ${input.meetingTarget}。`, founderValue: "把陌生市场中的关系建立压缩到一次经过规划的行程中。" },
      { title: "产品与叙事压力测试", includes: "在短时间内重复演示产品、回答质疑并记录反复出现的问题。", founderValue: "识别客户真正关心的指标、采购障碍和团队叙事中的空白。" },
    ],
    entryPaths: [
      { title: "普通参会者", forWhom: "需要学习市场并完成少量高质量会面的创始人。", prepare: `${input.preparation}；至少提前两周完成目标名单和邀约。` },
      { title: "创业公司展示或竞赛", forWhom: "产品已经可演示，希望获得集中曝光、买家或投资人反馈的团队。", prepare: "核对独立资格和截止日，并准备稳定演示、30 秒介绍、媒体资料和会后承接流程。" },
      { title: "周边活动与闭门圆桌", forWhom: "目标非常具体、主会场噪声过高的团队。", prepare: "只选择参会者与目标高度重合的活动，不按数量填满日程。" },
    ],
    stageFit: [
      { stage: "只有想法", fit: "暂不优先", reason: "跨国参会成本通常高于通用内容价值，先完成用户访谈和最小验证。" },
      { stage: "已有可演示产品", fit: "优先考虑", reason: "可以把现场对话转化为具体产品反馈、试点和渠道验证。" },
      { stage: "已有早期客户", fit: "优先考虑", reason: "已有证据使合作、融资和市场进入讨论更可信。" },
      { stage: "成熟增长期", fit: "可以考虑", reason: "仅当活动能连接目标市场中的大客户、资本或政策角色时值得。" },
    ],
    costs: [
      { label: "差旅与门票", level: "高", detail: input.tripCost },
      { label: "准备时间", level: "高", detail: "有效参会需要研究名单、预约会面、训练演示并准备跟进材料，不能只计算现场几天。" },
      { label: "机会成本", level: "中", detail: "创始团队离开产品和客户现场可能打断经营节奏，应设置明确回报门槛。" },
      { label: "信息噪声", level: "高", detail: "大型活动的热度、舞台观点和随机社交很容易替代真正的客户证据。" },
    ],
    diligence: [
      `你能否列出在 ${input.event} 必须见到的 10 个具体组织或角色？`,
      "参会后 30 天内，什么可量化结果能够证明这次行程值得？",
      "创业展示、竞赛、闭门活动和普通门票是否使用不同申请入口？",
      `如果不参加，这笔预算用于 ${input.alternative} 是否更接近当前目标？`,
    ],
    playbook: [
      { phase: "出发前 4 周", title: "定义唯一任务", action: "从融资、客户、渠道、媒体或市场学习中只选择一个首要目标。", output: "一页参会任务书" },
      { phase: "出发前 3 周", title: "建立目标名单", action: `围绕 ${input.meetingTarget} 建立 30 人长名单，并筛成 10 个优先对象。`, output: "10 个目标会面" },
      { phase: "活动现场", title: "记录证据而非名片", action: "每次交流记录需求、决策人、阻力、下一步和承诺日期。", output: "结构化会面记录" },
      { phase: "返程后 72 小时", title: "完成第一轮跟进", action: "发送带有具体下一步的个性化跟进，并淘汰没有真实意向的线索。", output: "30 天转化看板" },
    ],
    comparison: {
      chooseWhen: input.valueCondition,
      avoidWhen: "你无法指出具体目标对象、没有可演示或可讨论的证据，或只是因为大会有名而想参加。",
      compareWith: `至少与 ${input.alternative} 比较总成本、目标人群密度和 30 天内可验证的结果。`,
    },
  };
}

export const resourceProfiles: Record<string, ResourceResearchProfile> = {
  "y-combinator": {
    identity: {
      model: "以批次为单位的早期科技公司加速与投资体系，核心产品是高密度创始人环境、合伙人辅导和长期校友网络。",
      primaryValue: "把产品迭代、公司建设和融资准备压缩进一个高强度周期，并显著降低接触全球创业者与投资人的连接成本。",
      valueCondition: "团队必须已经决定全职创业，并能在短周期内持续推出产品、接触用户和根据证据改变方向。",
    },
    capabilities: [
      { label: "产品与增长节奏", strength: "核心", detail: "通过定期交流、同组公司压力和合伙人反馈推动团队把注意力放在用户与增长上。" },
      { label: "融资与投资人连接", strength: "核心", detail: "批次后期提供融资准备和投资人网络入口，但能否融资仍取决于进展、市场和团队。" },
      { label: "创始人同伴网络", strength: "核心", detail: "同批次小组与长期校友社区能够提供招聘、产品、客户和后续融资方面的经验连接。" },
      { label: "行业专项资源", strength: "中", detail: "覆盖行业广，优势是通用创业与网络，不一定拥有每个垂直行业最深的监管或渠道资源。" },
    ],
    offers: [
      { title: "专属合伙人支持", includes: "公司会与 YC 合伙人持续交流，并围绕产品、用户、团队和融资获得直接反馈。", founderValue: "减少在关键决策上的信息差，但前提是创始人愿意暴露真实问题并快速执行。" },
      { title: "小组与批次环境", includes: "以小组方式与同批公司共同推进，并参与线下启动、定期聚会和创始人交流。", founderValue: "形成高强度节奏和可信同伴网络，适合需要外部压力保持聚焦的团队。" },
      { title: "长期校友与融资网络", includes: "批次结束后仍可使用校友网络，并在融资阶段获得投资人介绍与生态支持。", founderValue: "价值不是一次 Demo Day，而是公司全生命周期的关系基础设施。" },
    ],
    entryPaths: [
      { title: "当期批次申请", forWhom: "已经准备在未来一个批次全职投入、并能展示真实进展的团队。", prepare: "一段清楚的产品说明、创始人分工、用户证据、增长或学习速度，以及为什么是你们。" },
      { title: "未来批次 Early Decision", forWhom: "时间尚未完全匹配，但希望提前进入评审流程的团队。", prepare: "说明未来进入批次前会完成什么里程碑，而不是把提前申请当作占位。" },
      { title: "晚于截止日申请", forWhom: "错过常规截止时间、但已经出现重要新进展的团队。", prepare: "明确解释最近发生了什么变化，以及为什么现在值得被重新评估。" },
    ],
    stageFit: [
      { stage: "只有想法", fit: "可以考虑", reason: "并非必须有收入，但需要强创始人能力、明确问题和很快做出产品的能力。" },
      { stage: "已有 MVP", fit: "优先考虑", reason: "最容易用用户行为、迭代速度和团队执行力证明申请价值。" },
      { stage: "已有早期收入", fit: "优先考虑", reason: "若仍处高增长早期，批次网络和融资准备可能显著放大进展。" },
      { stage: "成熟增长期", fit: "暂不优先", reason: "通用加速节奏可能不如行业渠道、增长资本或高级人才更有价值。" },
    ],
    costs: [
      { label: "全职与注意力", level: "高", detail: "批次要求公司成为创始人的绝对优先事项，兼职探索状态很难获得同等价值。" },
      { label: "地点与迁移", level: "中", detail: "当期批次包含旧金山线下环节和定期聚会，国际团队需要评估签证与生活安排。" },
      { label: "股权与融资条款", level: "高", detail: "接受投资会改变股权结构，必须在官方文件中重新核对当期标准条款。" },
      { label: "战略趋同风险", level: "中", detail: "高密度建议有价值，但团队仍需保护对行业、用户和长期产品的独立判断。" },
    ],
    diligence: ["当期投资结构会如何影响下一轮融资与创始人持股？", "公司是否真的需要旧金山网络，还是更需要本地行业客户？", "三个月内最重要的可量化目标是什么？", "如果未被录取，团队是否仍会以相同速度继续创业？"],
    playbook: [
      { phase: "申请前 14 天", title: "收缩叙事", action: "用一句话说明用户、问题、产品和差异，把抽象市场故事替换为具体行为。", output: "一段 50 字公司说明" },
      { phase: "申请前 7 天", title: "整理证据", action: "列出最近八周的发布、用户反馈、增长和关键失败。", output: "一页进展时间线" },
      { phase: "提交前", title: "创始人对齐", action: "明确全职承诺、角色、股权和最难回答的问题。", output: "共同确认的申请底稿" },
      { phase: "提交后", title: "继续推进", action: "不要等待结果；继续发布产品并记录重要进展，必要时更新申请。", output: "下一次可验证里程碑" },
    ],
    comparison: {
      chooseWhen: "你需要的是高强度产品节奏、全球科技创业网络和融资放大器。",
      avoidWhen: "你仍在判断是否创业，或真正瓶颈是强监管、本地渠道和长期行业认证。",
      compareWith: "与 Techstars 比较具体行业资源；与 Antler、EF 比较是否仍需寻找联合创始人；与 SkyDeck 比较大学技术转化价值。",
    },
  },

  "techstars-accelerators": {
    identity: {
      model: "由不同城市、行业主题与合作伙伴共同构成的全球加速器组合，而不是一个完全同质化的单一项目。",
      primaryValue: "利用三个月项目把团队连接到特定城市、行业导师、企业伙伴和资本网络。",
      valueCondition: "选对具体项目比选中 Techstars 品牌更重要；团队的目标客户必须与项目主题和合作网络真正重合。",
    },
    capabilities: [
      { label: "导师网络", strength: "核心", detail: "以密集导师反馈著称，适合需要多角度校准市场、产品和融资叙事的团队。" },
      { label: "行业与企业连接", strength: "强", detail: "医疗、金融、能源、航天等项目可能借助合作伙伴提供垂直入口，但各项目差异很大。" },
      { label: "全球城市网络", strength: "强", detail: "多个城市项目便于围绕目标市场选择地点，也意味着需要逐个核对资源密度。" },
      { label: "统一体验", strength: "有限", detail: "品牌相同不代表导师质量、企业合作深度和校友活跃度完全相同。" },
    ],
    offers: [
      { title: "三个月集中加速", includes: "围绕产品市场匹配、牵引力、资本和导师支持推进。", founderValue: "适合已有方向、希望快速补齐市场与融资准备的团队。" },
      { title: "垂直行业项目", includes: "部分项目由医疗、金融、能源或大型企业伙伴共同支持。", founderValue: "可能缩短接触行业决策者的路径，但不等于自动获得采购。" },
      { title: "终身网络入口", includes: "进入校友、导师、投资人与合作伙伴构成的全球网络。", founderValue: "长期价值取决于团队是否主动维护关系，而不是项目结束时获得一份名单。" },
    ],
    entryPaths: [
      { title: "按行业筛选", forWhom: "客户和监管高度垂直的 B2B、医疗、金融、能源或航天团队。", prepare: "先列出最需要接触的十类行业角色，再反查项目导师与合作方。" },
      { title: "按市场筛选", forWhom: "需要进入某个城市或地区寻找客户、人才与投资人的团队。", prepare: "说明该城市为什么是未来 12 个月的业务市场，而不只是创业氛围好。" },
      { title: "Anywhere 或远程形式", forWhom: "地理迁移成本高，但仍需要结构化加速和网络支持的团队。", prepare: "确认远程形式能否提供同等关键连接，并设计主动约见计划。" },
    ],
    stageFit: [
      { stage: "只有想法", fit: "暂不优先", reason: "大多数项目更适合已有方向、能够使用导师和客户资源的团队。" },
      { stage: "已有 MVP", fit: "优先考虑", reason: "可以在三个月内把导师反馈快速转化为客户实验和产品迭代。" },
      { stage: "已有早期收入", fit: "优先考虑", reason: "更容易判断哪些企业与资本连接能够真正放大业务。" },
      { stage: "成熟增长期", fit: "可以考虑", reason: "仅当某一垂直项目能提供明确市场或企业客户入口时值得。" },
    ],
    costs: [
      { label: "项目选择成本", level: "高", detail: "需要研究每个项目的城市、主题、负责人、往届团队和合作伙伴，不能一键判断。" },
      { label: "导师噪声", level: "中", detail: "大量建议可能彼此冲突，团队必须有明确问题和决策原则。" },
      { label: "地点与周期", level: "中", detail: "各项目参与形式不同，迁移、时区和三个月集中投入都会影响经营节奏。" },
      { label: "投资条款", level: "高", detail: "资金与股权安排可能更新，应以目标项目的当期文件为准。" },
    ],
    diligence: ["目标项目过去两批最常见的公司阶段是什么？", "合作企业是否真的采购过项目公司产品？", "项目负责人和核心导师是否与你的行业相关？", "毕业后六个月，往届团队仍在使用哪些资源？"],
    playbook: [
      { phase: "第 1 周", title: "建立长名单", action: "从全部项目中按行业、市场和参与形式筛出 5 个。", output: "5 个项目候选表" },
      { phase: "第 2 周", title: "验证项目质量", action: "查看往届团队并联系 3 位校友询问真实资源使用情况。", output: "校友访谈记录" },
      { phase: "第 3 周", title: "选择唯一主申请", action: "按客户连接、导师质量和成本排序，确定一个主项目。", output: "项目选择评分卡" },
      { phase: "申请期", title: "证明主题匹配", action: "用客户、试点和行业洞察说明为什么该项目对你有杠杆。", output: "行业匹配申请叙事" },
    ],
    comparison: {
      chooseWhen: "你已有产品方向，且某个具体 Techstars 项目与行业客户或目标城市高度匹配。",
      avoidWhen: "你只是追求品牌，无法指出希望从该项目获得的三项具体资源。",
      compareWith: "与 YC 比较通用科技网络；与 SkyDeck 比较研究与大学资源；与本地行业加速器比较客户深度。",
    },
  },

  "antler-residency": {
    identity: {
      model: "从创始人个人和公司形成阶段介入的全球 Residency 与早期投资体系。",
      primaryValue: "在想法、团队和公司尚未完全形成时，提供全职环境、潜在联合创始人、当地投资团队与后续资本网络。",
      valueCondition: "参与者需要真正全职投入，并选择与未来公司市场和个人生活可持续性匹配的城市。",
    },
    capabilities: [
      { label: "创始人筛选与同伴", strength: "核心", detail: "以个人潜力为重要起点，适合需要在高质量同伴中寻找合作关系的人。" },
      { label: "公司形成", strength: "核心", detail: "允许从早期想法甚至尚未确定方向开始，但要求快速形成真实产品和市场证据。" },
      { label: "本地早期资本", strength: "强", detail: "各地基金和投资团队能够在公司形成后评估投资，具体条件因地区而异。" },
      { label: "全球一致性", strength: "有限", detail: "城市、团队、批次、投资条款与签证条件差异明显，必须按地点研究。" },
    ],
    offers: [
      { title: "Residency 创业环境", includes: "一段全职集中建设公司、认识潜在联合创始人并验证方向的周期。", founderValue: "给尚未形成公司的个人一个明确起跑线，但不会替你完成长期匹配。" },
      { title: "当地合伙人与投资评估", includes: "申请和参与过程中与当地团队、合伙人及基金建立关系。", founderValue: "可能连接首笔机构资本，但需要用真实进展赢得投资。" },
      { title: "跨地区平台", includes: "投资后可以继续使用 Antler 的全球网络与后续融资体系。", founderValue: "适合未来业务本身跨国，而不是只想短期体验海外创业的人。" },
    ],
    entryPaths: [
      { title: "个人申请", forWhom: "能力强、愿意全职创业，但尚缺联合创始人或最终方向的人。", prepare: "用过去的异常成果、判断力和建设能力证明‘为什么是你’，而不只是解释点子。" },
      { title: "已有想法申请", forWhom: "已经研究问题、但仍愿意调整团队与方向的创始人。", prepare: "展示用户证据和最危险假设，并说明你愿意改变什么。" },
      { title: "已有团队申请", forWhom: "团队刚形成，希望获得当地资本和市场网络的公司。", prepare: "重点核对当地项目是否仍提供足够增量，而不是重复已有能力。" },
    ],
    stageFit: [
      { stage: "尚无想法", fit: "可以考虑", reason: "可以从个人起步，但优秀履历不能替代很快发现真实问题的能力。" },
      { stage: "只有想法", fit: "优先考虑", reason: "适合在高强度环境中验证方向并寻找互补合作者。" },
      { stage: "已有 MVP", fit: "优先考虑", reason: "若仍处公司形成期，可用早期证据加速团队与融资判断。" },
      { stage: "已有稳定收入", fit: "暂不优先", reason: "重新进入 Residency 的机会成本可能高于当地投资和增长资源。" },
    ],
    costs: [
      { label: "全职承诺", level: "高", detail: "官方明确要求 100% 时间与专注，不能与全职工作、学业或其他公司并行。" },
      { label: "联合创始人风险", level: "高", detail: "短期匹配只能创造合作机会，无法替代价值观、压力与长期决策测试。" },
      { label: "签证与城市", level: "高", detail: "参与者需要自行满足所在国家的签证要求，地点应与未来市场一致。" },
      { label: "地区条款差异", level: "中", detail: "投资、周期和参与方式必须在具体地区 offer 中确认。" },
    ],
    diligence: ["为什么选择这个城市，而不是离目标客户更近的地点？", "若 6 周内没有找到合适搭档，你是否能独立继续？", "当地基金投资后的股权与治理安排是什么？", "你准备如何测试联合创始人的冲突处理和长期承诺？"],
    playbook: [
      { phase: "申请前", title: "建立个人证据", action: "整理三个能证明速度、韧性、判断力或技术能力的异常成果。", output: "创始人能力档案" },
      { phase: "进入前", title: "定义匹配标准", action: "写清联合创始人的能力、价值观、风险承受与工作方式。", output: "合作伙伴评分卡" },
      { phase: "前 30 天", title: "并行测试人和问题", action: "用小项目测试合作，同时每周完成真实用户验证。", output: "合作与市场双周复盘" },
      { phase: "形成公司前", title: "完成困难对话", action: "讨论股权、角色、退出、生活安排与最坏情境。", output: "创始人备忘录" },
    ],
    comparison: {
      chooseWhen: "你已经准备全职创业，但公司、方向或联合创始人还没有稳定形成。",
      avoidWhen: "你只想兼职探索，或已有高效团队和清晰增长路径。",
      compareWith: "与 EF 比较人才画像和公司形成方式；与 YC、Techstars 比较你是否已经拥有可加速的公司。",
    },
  },

  "berkeley-skydeck-batch-23": {
    identity: {
      model: "UC Berkeley 创业平台中的六个月全球科技加速批次，由大学生态、SkyDeck Fund、导师与湾区网络共同支持。",
      primaryValue: "帮助接近首轮机构融资的科技公司完善产品、团队、客户与融资准备，并连接伯克利人才和硅谷投资生态。",
      valueCondition: "团队需要有明确技术产品、能够参加规定活动，并能从伯克利研究、人才或产业网络获得真实增量。",
    },
    capabilities: [
      { label: "技术商业化", strength: "核心", detail: "对深科技、AI 和研究驱动公司尤其有价值，重点是把技术优势转化为产品和市场。" },
      { label: "导师与 BAM 课程", strength: "强", detail: "Key Advisor、每周活动和 Berkeley Acceleration Method 提供持续公司建设支持。" },
      { label: "湾区资本连接", strength: "强", detail: "帮助团队准备第一张机构种子轮支票，并通过 Demo Day 与投资人建立关系。" },
      { label: "伯克利人才与客户", strength: "强", detail: "大学人才、校友和企业关系可用于招聘、顾问与早期客户介绍。" },
    ],
    offers: [
      { title: "六个月 Cohort", includes: "约二十家公司、Key Advisor、BAM 项目、每周必需活动和社区支持。", founderValue: "时间足够深入推进技术商业化，但对到场与经营节奏要求更高。" },
      { title: "公布投资", includes: "官方批次页说明每家入选公司由 SkyDeck Fund 投资 21 万美元。", founderValue: "为六个月计划提供早期资本，但必须核对具体股权与文件。" },
      { title: "Demo Day 与介绍", includes: "面向投资人、导师和生态参与者展示，并通过校友网络进行客户与人才连接。", founderValue: "适合将技术可信度转化为湾区市场和融资关系。" },
    ],
    entryPaths: [
      { title: "全球 Cohort 申请", forWhom: "接近首轮机构融资、拥有明确技术壁垒的全球团队。", prepare: "技术差异、可验证产品、早期市场证据、团队能力和六个月里程碑。" },
      { title: "UC 关联团队申请", forWhom: "希望商业化学校研究或利用伯克利人才网络的学生、校友和教职员工团队。", prepare: "说明研究成果的权属、商业化路径和市场验证进展。" },
      { title: "国际团队申请", forWhom: "需要进入美国市场并愿意处理地点、签证和公司结构的团队。", prepare: "准备美国客户假设、迁移计划和进入湾区后的具体使用方案。" },
    ],
    stageFit: [
      { stage: "只有想法", fit: "暂不优先", reason: "Cohort 更偏已有产品和机构融资准备，过早团队可比较 Pad-13 等入口。" },
      { stage: "技术原型", fit: "优先考虑", reason: "若技术壁垒清晰、市场仍需验证，大学与产业导师可产生较大增量。" },
      { stage: "已有 MVP/试点", fit: "优先考虑", reason: "最适合把产品、客户和种子轮融资在六个月内并行推进。" },
      { stage: "已完成 A 轮", fit: "暂不优先", reason: "项目重点是首轮机构资本前后，更成熟公司可能需要增长资源。" },
    ],
    costs: [
      { label: "六个月周期", level: "高", detail: "从 2026 年 11 月到 2027 年 4 月，包含每周必需活动，需要真实管理时间。" },
      { label: "迁移与地点", level: "高", detail: "国际团队应提前核对签证、住宿、公司设立和关键成员参与方式。" },
      { label: "股权与投资", level: "高", detail: "21 万美元不是免费补助，条款、稀释和下一轮影响需要法律核对。" },
      { label: "大学资源边界", level: "中", detail: "进入 SkyDeck 不等于获得学校知识产权或无限制使用研究资源。" },
    ],
    diligence: ["21 万美元对应的最新股权、SAFE 或其他投资条款是什么？", "哪些活动必须线下参加，哪些团队成员必须到场？", "你的公司最需要伯克利哪一类人才、客户或研究连接？", "六个月结束时，融资与客户两个目标如何排序？"],
    playbook: [
      { phase: "申请前 3 周", title: "建立技术—市场桥梁", action: "用非学术语言解释技术壁垒解决了哪个昂贵问题。", output: "技术商业化一页纸" },
      { phase: "申请前 2 周", title: "规划湾区价值", action: "列出需要的 10 位客户、顾问、人才或投资人类型。", output: "生态使用清单" },
      { phase: "申请前 1 周", title: "核算六个月成本", action: "把迁移、股权、时间与替代融资方案放在同一表中比较。", output: "总成本模型" },
      { phase: "面试阶段", title: "证明执行速度", action: "展示最近六周的产品、用户和技术里程碑，而不只是未来路线图。", output: "六周进展证据" },
    ],
    comparison: {
      chooseWhen: "技术壁垒、伯克利生态和湾区首轮融资同时是你的关键需求。",
      avoidWhen: "产品仍无原型，或团队无法承担六个月和湾区参与成本。",
      compareWith: "与 YC 比较更通用的创业网络；与 Techstars 比较垂直企业客户；与 Pad-13 比较公司是否过早。",
    },
  },

  "entrepreneur-first-london": {
    identity: {
      model: "以个人为申请主体的全职线下公司形成计划，2026 秋季路径从伦敦 12 周延伸到旧金山后续阶段。",
      primaryValue: "把高潜力个人放进同一环境，帮助寻找联合创始人、形成公司、获得早期支持并连接美国市场。",
      valueCondition: "申请者要有可证明的异常能力，愿意全职、线下、跨城市投入，并把寻找搭档当作严肃的共同创业测试。",
    },
    capabilities: [
      { label: "联合创始人匹配", strength: "核心", detail: "候选人池经过技能与行为筛选，并通过密集合作与建议加速匹配。" },
      { label: "公司从零形成", strength: "核心", detail: "不要求已有公司或想法，更重视个人潜力和短期建设速度。" },
      { label: "伦敦—旧金山桥梁", strength: "强", detail: "前 12 周伦敦公司形成，后续阶段进入旧金山，适合目标是美国科技市场的人。" },
      { label: "成熟公司加速", strength: "有限", detail: "核心设计服务个人和公司形成期；已有稳定团队的公司需要判断是否过早回到匹配阶段。" },
    ],
    offers: [
      { title: "筛选后的候选人池", includes: "与技术、科研和行业能力突出的个人共同工作，并获得配对测试建议。", founderValue: "扩大高质量潜在合作者范围，但长期适配仍需自己验证。" },
      { title: "伦敦形成阶段", includes: "12 周全职线下合作、方向探索、原型与早期用户验证。", founderValue: "强迫参与者快速从履历和想法走向真实共同建设。" },
      { title: "旧金山阶段", includes: "后续三个月进入旧金山，准备美国市场、融资材料和 Demo Day。", founderValue: "适合明确想建立美国高增长科技公司的团队。" },
    ],
    entryPaths: [
      { title: "无想法个人申请", forWhom: "个人能力突出、准备现在创业但尚未确定问题的人。", prepare: "证明过去如何快速学习、建设和产生超出同龄人的结果。" },
      { title: "已有早期想法", forWhom: "有研究方向或原型，但愿意根据搭档与用户证据调整的人。", prepare: "展示问题洞察，不要把现有方案写成不可改变的前提。" },
      { title: "正在测试搭档", forWhom: "已经认识潜在联合创始人，希望在高强度环境中验证合作的人。", prepare: "双方分别申请，并准备解释角色、冲突和仍未解决的问题。" },
    ],
    stageFit: [
      { stage: "尚无想法", fit: "优先考虑", reason: "计划本身从个人潜力出发，允许在进入后形成方向。" },
      { stage: "只有想法", fit: "优先考虑", reason: "适合寻找互补搭档并用早期用户证据淘汰错误方向。" },
      { stage: "已有 MVP", fit: "可以考虑", reason: "如果团队未稳定形成仍有价值；若团队完整则需要比较机会成本。" },
      { stage: "已有收入团队", fit: "暂不优先", reason: "成熟团队更需要客户、资本和增长支持，而不是重新从个人匹配开始。" },
    ],
    costs: [
      { label: "全职线下", level: "高", detail: "官方项目明确为全职、线下，无法与工作或其他主要承诺并行。" },
      { label: "跨城市迁移", level: "高", detail: "伦敦后转旧金山，需要提前处理生活、签证、公司与团队安排。" },
      { label: "关系决策压力", level: "高", detail: "短期内决定是否共同创业容易受环境推动，必须设置独立的合作测试标准。" },
      { label: "融资与股权", level: "中", detail: "补助、投资和后续支持应在当期 offer 与法律文件中核对。" },
    ],
    diligence: ["你希望搭档补足什么能力，而不是与你拥有相同履历？", "伦敦和旧金山是否真是目标市场，而不是项目要求？", "如果配对失败，你是否会独立继续建设？", "形成公司前，如何测试冲突、速度、诚信和风险承受？"],
    playbook: [
      { phase: "申请前", title: "证明异常轨迹", action: "选择三段经历，说明你如何在资源不足时创造超预期结果。", output: "个人能力证据卡" },
      { phase: "录取后", title: "准备匹配原则", action: "定义不可妥协的价值观、角色和创业强度。", output: "联合创始人筛选表" },
      { phase: "伦敦前 4 周", title: "用工作代替社交", action: "与候选人一起完成小型产品和用户任务。", output: "合作行为记录" },
      { phase: "进入 SF 前", title: "锁定公司假设", action: "确定用户、问题、团队分工和美国市场验证目标。", output: "三个月公司计划" },
    ],
    comparison: {
      chooseWhen: "你是高潜力个人，准备现在全职创业，并需要搭档与美国科技市场桥梁。",
      avoidWhen: "你无法全职迁移，或已经拥有稳定团队和明确增长业务。",
      compareWith: "与 Antler 比较城市、基金和创始人画像；与 YC 比较公司是否已经形成。",
    },
  },

  "launch-by-station-f": {
    identity: {
      model: "STATION F 提供的完全在线创业基础学习产品，含免费入口和按月付费的完整内容与社区服务。",
      primaryValue: "用课程、模板和同伴反馈帮助第一次创业者建立基础框架，并逐步完成第一版 pitch deck。",
      valueCondition: "学习者必须把每个模块转化为用户访谈、实验和真实产出，否则课程只会增加概念而不会降低风险。",
    },
    capabilities: [
      { label: "创业基础课程", strength: "核心", detail: "40+ 视频覆盖市场验证、商业模式、品牌、获客、路线图与 pitch。" },
      { label: "结构化产出", strength: "强", detail: "围绕 pitch deck 模板逐步完成项目表达，适合不知道从哪里开始的人。" },
      { label: "在线社区与同伴反馈", strength: "中", detail: "付费方案提供目录、Slack 和同伴评审，质量取决于参与度。" },
      { label: "真实客户与融资连接", strength: "有限", detail: "它是学习项目，不是加速器录取、客户获取或融资承诺。" },
    ],
    offers: [
      { title: "免费起步内容", includes: "创业介绍内容与 STATION F 活动推荐。", founderValue: "适合零成本判断自己是否愿意继续系统学习。" },
      { title: "Premium 内容与社区", includes: "完整视频和文章、社区目录、Slack、pitch deck 模板与互评。", founderValue: "以较低月费获得结构与同伴，但需要主动提交和反馈。" },
      { title: "工具优惠库", includes: "随课程主题逐步解锁部分创业工具折扣或额度。", founderValue: "可以降低早期工具成本，但不应为了优惠过早建立复杂技术栈。" },
    ],
    entryPaths: [
      { title: "免费方案", forWhom: "第一次接触创业、尚未确定是否深入投入的人。", prepare: "先选择一个真实问题作为贯穿课程的练习对象。" },
      { title: "Premium 月度方案", forWhom: "希望完成完整课程、获得社区和 pitch 反馈的人。", prepare: "预留每周固定学习和真实验证时间，并在一个月后复盘是否继续。" },
      { title: "完成后申请园区项目", forWhom: "已经形成方向、希望进一步进入 STATION F 具体计划的团队。", prepare: "课程完成不是快速通道；仍需按目标项目资格准备独立申请。" },
    ],
    stageFit: [
      { stage: "尚无想法", fit: "优先考虑", reason: "可以用熟悉公司完成练习，先理解创业工作由哪些问题组成。" },
      { stage: "只有想法", fit: "优先考虑", reason: "课程结构可以暴露市场、商业模式和获客方面的空白。" },
      { stage: "已有 MVP", fit: "可以考虑", reason: "适合补基础，但应优先把时间放在真实用户而非继续完善材料。" },
      { stage: "已有收入", fit: "暂不优先", reason: "通用基础内容的边际价值较低，更需要针对性增长与行业支持。" },
    ],
    costs: [
      { label: "现金成本", level: "低", detail: "提供免费方案；官网列出的 Premium 为月度付费，价格可能调整。" },
      { label: "自驱要求", level: "高", detail: "完全在线意味着没有批次压力，最常见失败是观看很多、行动很少。" },
      { label: "同伴反馈质量", level: "中", detail: "互评来自社区成员，不等同于行业专家、客户或投资人意见。" },
      { label: "课程完成幻觉", level: "中", detail: "完成 deck 和课程不代表需求、渠道或付费已经验证。" },
    ],
    diligence: ["免费与 Premium 的当前内容边界是什么？", "每周能否完成至少两次真实用户交流？", "你缺的是知识，还是不愿意面对用户？", "完成课程后，哪一个指标会证明项目更接近成立？"],
    playbook: [
      { phase: "第 1 周", title: "选定真实问题", action: "用一个具体人群和场景贯穿所有练习。", output: "问题陈述" },
      { phase: "第 2 周", title: "课程配对实验", action: "每学一个模块，都安排一个外部访谈或小实验。", output: "证据记录表" },
      { phase: "第 3 周", title: "完成第一版 deck", action: "只写已知事实和待验证假设，不用宏大预测填空。", output: "10 页以内 deck" },
      { phase: "第 4 周", title: "决定下一步", action: "根据证据选择继续验证、做 MVP 或停止。", output: "30 天行动决定" },
    ],
    comparison: {
      chooseWhen: "你需要低成本、在线、结构化的创业基础和第一版材料。",
      avoidWhen: "你已经有产品和真实客户，当前瓶颈是销售、招聘或融资。",
      compareWith: "与 Startup School 等免费课程比较内容风格；与真正加速器比较是否需要导师、资本和客户连接。",
    },
  },

  "station-f": {
    identity: {
      model: "位于巴黎、承载 30+ 创业计划与 1,000+ 团队的大型创业园区；它是多入口创业基础设施，不是一项统一加速课程。",
      primaryValue: "把创业公司、企业伙伴、投资人、公共服务、办公与生活支持集中在同一生态中，降低进入法国和欧洲网络的连接成本。",
      valueCondition: "团队必须找到与自身行业、阶段和国际落地目标匹配的具体计划；只进入园区而没有资源使用计划，价值会迅速下降。",
    },
    capabilities: [
      { label: "计划组合", strength: "核心", detail: "由 STATION F 与企业、学校和机构伙伴运营 30+ 项目，覆盖不同阶段与行业。" },
      { label: "企业与投资网络", strength: "强", detail: "园区聚集企业伙伴、基金和投资人，适合主动建立合作与融资关系。" },
      { label: "国际团队落地", strength: "强", detail: "提供国际社区、签证与行政相关支持，并以巴黎作为欧洲市场入口。" },
      { label: "单一申请入口", strength: "有限", detail: "不同项目资格、服务、费用和时间不同，机构品牌不能替代逐项筛选。" },
    ],
    offers: [
      { title: "30+ 具体创业计划", includes: "自营项目与企业、学校、行业伙伴项目。", founderValue: "能按行业和阶段寻找入口，但必须研究具体运营方和往届团队。" },
      { title: "集中式创业服务", includes: "办公、活动、专家、工具优惠，以及部分签证、融资和行政支持。", founderValue: "降低法国初创公司在运营和关系建立上的摩擦。" },
      { title: "高密度国际社区", includes: "与大量创业公司、企业与投资人共享空间和活动。", founderValue: "适合主动型团队；被动驻场不会自动产生客户或资本。" },
    ],
    entryPaths: [
      { title: "STATION F 自营项目", forWhom: "需要综合创业支持或符合其特定主题的团队。", prepare: "按项目要求准备阶段、产品、团队与法国/欧洲市场计划。" },
      { title: "合作伙伴项目", forWhom: "与企业、学校或行业主题高度匹配的创业公司。", prepare: "验证合作方是否能提供真实客户、技术、渠道或监管资源。" },
      { title: "活动与社区入口", forWhom: "尚未准备长期驻场、希望先理解生态的团队。", prepare: "带着具体关系目标参加公开活动，再决定是否申请项目。" },
    ],
    stageFit: [
      { stage: "只有想法", fit: "可以考虑", reason: "部分教育或早期项目适合，但主园区价值通常需要更明确的公司方向。" },
      { stage: "已有 MVP", fit: "优先考虑", reason: "最容易利用计划、企业伙伴和社区验证欧洲市场。" },
      { stage: "已有早期收入", fit: "优先考虑", reason: "能够更清楚地把网络转化为客户、招聘和融资目标。" },
      { stage: "成熟扩张期", fit: "可以考虑", reason: "仅当法国或欧洲落地是明确战略，且具体项目提供增量时。" },
    ],
    costs: [
      { label: "项目筛选", level: "高", detail: "30+ 项目带来选择丰富，也增加比较资格、运营方和资源质量的研究成本。" },
      { label: "巴黎运营", level: "高", detail: "办公、住宿、签证、雇佣和生活成本需要纳入欧洲落地预算。" },
      { label: "社区使用", level: "中", detail: "大量连接只有在团队主动约见、输出价值和持续跟进时才会发生。" },
      { label: "品牌错觉", level: "中", detail: "进入园区不等于获得所有伙伴、投资人或企业客户的直接支持。" },
    ],
    diligence: ["最匹配的三个项目分别由谁运营？", "具体项目过去一年为团队带来了哪些客户或融资结果？", "驻场、费用、股权与注册地要求是什么？", "如果不去巴黎，哪些资源仍可通过其他方式获得？"],
    playbook: [
      { phase: "第 1 周", title: "定义欧洲目标", action: "确定客户、招聘、融资或设立公司中的唯一首要目标。", output: "欧洲落地目标卡" },
      { phase: "第 2 周", title: "筛选项目", action: "从 30+ 项目中按行业、阶段、运营方和成本筛出 3 个。", output: "项目对照表" },
      { phase: "第 3 周", title: "访问与访谈", action: "联系项目校友或参加公开活动，验证日常体验。", output: "三份一手反馈" },
      { phase: "第 4 周", title: "制定 90 天使用计划", action: "列出进入后要见的人、验证的市场问题和结果指标。", output: "园区使用计划" },
    ],
    comparison: { chooseWhen: "巴黎或法国确实是目标市场，且某个具体项目与你高度匹配。", avoidWhen: "你只是被园区规模吸引，无法说出具体入口和欧洲业务目标。", compareWith: "与 BLOCK71 比较亚洲和欧洲落地；与单一加速器比较资源深度与项目确定性。" },
  },

  "block71": {
    identity: {
      model: "从新加坡发展出的跨城市创新与孵化网络，通过本地节点、项目、导师和伙伴支持公司从验证到国际扩张。",
      primaryValue: "为希望进入新加坡及亚洲市场的团队提供本地认知、社区、项目和跨城市关系入口。",
      valueCondition: "必须围绕具体国家、客户和项目选择节点；全球网络规模本身不会自动转化为销售或融资。",
    },
    capabilities: [
      { label: "亚洲市场落地", strength: "核心", detail: "新加坡、印尼、越南、日本、中国等节点提供本地生态与伙伴连接。" },
      { label: "阶段化创业项目", strength: "强", detail: "公开项目覆盖 MVP 验证、首轮融资与国际扩张等不同阶段。" },
      { label: "导师与大学生态", strength: "强", detail: "结合创业者、运营者、领域专家及大学创新网络提供建议。" },
      { label: "跨节点一致性", strength: "有限", detail: "不同城市的项目、行业资源与活跃度不同，需要逐个核验。" },
    ],
    offers: [
      { title: "孵化与加速项目", includes: "按阶段与市场提供项目、导师、社区和部分资本连接。", founderValue: "适合有明确亚洲扩张问题的团队，而非泛泛了解市场。" },
      { title: "本地节点网络", includes: "在多个亚洲城市及美国建立落地点与伙伴关系。", founderValue: "降低进入陌生市场的第一层关系成本。" },
      { title: "创业社区", includes: "连接创始人、导师、企业、大学与生态伙伴。", founderValue: "能够快速获取当地反馈，但需要持续参与和贡献。" },
    ],
    entryPaths: [
      { title: "新加坡孵化申请", forWhom: "准备以新加坡作为区域总部或东南亚入口的团队。", prepare: "明确目标客户、区域扩张顺序、公司阶段和未来 12 个月里程碑。" },
      { title: "城市专项项目", forWhom: "已经确定印尼、越南、日本、中国或美国等具体市场的公司。", prepare: "选择与客户和监管最相关的节点，而不是一次覆盖所有国家。" },
      { title: "活动与伙伴入口", forWhom: "尚在调研市场、希望先建立本地认知的团队。", prepare: "准备具体行业问题和潜在合作价值，避免只做名片交换。" },
    ],
    stageFit: [
      { stage: "只有想法", fit: "可以考虑", reason: "可通过早期项目和导师验证，但跨国落地通常还太早。" },
      { stage: "已有 MVP", fit: "优先考虑", reason: "适合用本地网络验证产品在亚洲市场的适配。" },
      { stage: "已有早期收入", fit: "优先考虑", reason: "已有商业证据更容易获得伙伴、客户和区域扩张支持。" },
      { stage: "成熟增长期", fit: "可以考虑", reason: "若需要特定城市的伙伴和人才，节点网络仍可能有价值。" },
    ],
    costs: [
      { label: "市场复杂度", level: "高", detail: "亚洲不是单一市场，语言、监管、采购和渠道必须逐国验证。" },
      { label: "节点选择", level: "高", detail: "错误节点会带来大量社交但很少业务结果。" },
      { label: "本地投入", level: "中", detail: "真正落地通常需要创始人长期在场、建立团队或伙伴，而非短期访问。" },
      { label: "项目差异", level: "中", detail: "不同项目的费用、权益、时间和资本支持需以当期说明为准。" },
    ],
    diligence: ["哪个城市节点离目标客户和决策者最近？", "该项目是否有与你同类公司的真实案例？", "进入后谁会负责客户、监管和本地招聘连接？", "你的公司是否已准备为一个国家做产品和销售本地化？"],
    playbook: [
      { phase: "第 1 周", title: "选择一个国家", action: "用客户密度、监管、付款能力和竞争确定首个市场。", output: "国家选择评分卡" },
      { phase: "第 2 周", title: "匹配节点", action: "找到该节点当前项目、团队和行业伙伴。", output: "节点资源地图" },
      { phase: "第 3 周", title: "验证本地问题", action: "完成 5 次本地客户或伙伴访谈。", output: "本地化假设清单" },
      { phase: "第 4 周", title: "决定进入方式", action: "比较申请项目、找渠道伙伴或直接设立团队。", output: "90 天落地方案" },
    ],
    comparison: { chooseWhen: "你已有产品证据，并准备进入一个明确的亚洲市场。", avoidWhen: "你把‘亚洲’视为一个市场，尚未选择国家和客户。", compareWith: "与 STATION F 比较欧洲落地；与本地独立加速器比较单点资源深度。" },
  },

  "entrepreneur-first": {
    identity: {
      model: "先选择个人、再帮助形成联合创始团队和公司，并通过伦敦、班加罗尔与旧金山等枢纽连接资本和市场。",
      primaryValue: "服务‘人已经准备好、公司还没有形成’的阶段，把人才密度、共同建设和早期融资连接组合成公司形成机制。",
      valueCondition: "参与者必须能证明异常潜力、愿意全职进入高增长科技创业，并接受共同创始关系的快速但严肃测试。",
    },
    capabilities: [
      { label: "人才选择", strength: "核心", detail: "申请评估重点在个人过往成果、建设能力、判断与潜力，而非只看商业计划。" },
      { label: "联合创始人形成", strength: "核心", detail: "通过筛选后候选池、合作测试与建议帮助个人找到互补搭档。" },
      { label: "美国市场与融资桥梁", strength: "强", detail: "提供旧金山办公、美国客户开发、融资材料和投资人展示等支持。" },
      { label: "已有公司增长", strength: "有限", detail: "核心优势不在成熟公司的规模化销售或运营优化。" },
    ],
    offers: [
      { title: "公司形成环境", includes: "候选人池、共同建设、配对建议和线下同伴环境。", founderValue: "帮助个人用真实合作替代‘找一个简历互补的人’。" },
      { title: "早期支持与投资", includes: "官方公开介绍包含公司形成后的投资与后续支持，具体以当期条款为准。", founderValue: "让团队能从形成公司快速进入产品和融资阶段。" },
      { title: "跨大西洋网络", includes: "从当地枢纽连接旧金山市场、投资人和 Demo Day。", founderValue: "适合从一开始就希望建立美国科技公司的创始人。" },
    ],
    entryPaths: [
      { title: "核心个人项目", forWhom: "职业早期但成果异常、希望现在创业的技术与行业人才。", prepare: "证明能力轨迹、建设速度和美国高增长公司的野心。" },
      { title: "短期活动与 Hackathon", forWhom: "尚未准备全职、希望先接触社区和潜在搭档的人。", prepare: "以真实共同建设为目标，而不是把活动当成招聘会。" },
      { title: "经验创始人项目", forWhom: "拥有多年经验、曾创办或深度参与早期公司的个人。", prepare: "核对当期 XF2 等项目是否开放并与你的经验阶段匹配。" },
    ],
    stageFit: [
      { stage: "个人无想法", fit: "优先考虑", reason: "这正是 EF 与传统加速器最不同的服务阶段。" },
      { stage: "个人有想法", fit: "优先考虑", reason: "可以寻找互补搭档，并在结构化环境中快速验证。" },
      { stage: "已有完整团队", fit: "可以考虑", reason: "仅当团队仍极早期且美国网络带来明显增量。" },
      { stage: "已有稳定公司", fit: "暂不优先", reason: "成熟公司通常不需要重新经历人才配对和公司形成。" },
    ],
    costs: [
      { label: "全职与迁移", level: "高", detail: "核心项目要求线下全职，并可能跨伦敦、班加罗尔或旧金山。" },
      { label: "关系形成压力", level: "高", detail: "高速度环境可能放大错误匹配，需保留独立判断和退出机制。" },
      { label: "高增长路径", level: "中", detail: "EF 面向高增长科技公司，不适合更稳健的现金流业务目标。" },
      { label: "条款核验", level: "中", detail: "补助、投资、后续资本与公司设立安排应逐批确认。" },
    ],
    diligence: ["你真正缺的是联合创始人，还是缺少清晰问题？", "为什么必须建立美国高增长公司？", "什么行为会让你终止一次搭档测试？", "如果没有 EF 的投资，你们是否仍会继续？"],
    playbook: [
      { phase: "申请前", title: "整理异常成果", action: "用事实证明你在技术、研究、产品或组织方面持续超出同龄人。", output: "个人轨迹叙事" },
      { phase: "进入前", title: "定义公司类型", action: "明确愿意投入十年的问题、市场和风险类型。", output: "创业边界清单" },
      { phase: "匹配期", title: "测试共同建设", action: "用短周期产品、用户和压力任务观察合作行为。", output: "配对实验日志" },
      { phase: "公司形成", title: "签署前对齐", action: "讨论股权、角色、决策、退出与生活承诺。", output: "创始人协议底稿" },
    ],
    comparison: { chooseWhen: "你是准备全职创业的高潜力个人，最主要缺口是搭档和公司形成环境。", avoidWhen: "你只想学习创业，或已有稳定团队与业务。", compareWith: "与 Antler 比较地区与投资模式；与 YC 比较是否已经形成公司和产品。" },
  },

  "berkeley-skydeck": {
    identity: {
      model: "UC Berkeley 的全球创业平台，包含 Cohort 加速器、创新伙伴项目、Pad-13 孵化器及人才、导师和基金网络。",
      primaryValue: "把大学研究、校友、学生人才、企业客户与湾区资本组织成多层创业入口。",
      valueCondition: "团队需要先判断自己属于哪一种计划，再明确希望从大学生态获得技术商业化、人才、客户还是融资价值。",
    },
    capabilities: [
      { label: "大学技术商业化", strength: "核心", detail: "支持 UC Berkeley 相关研究走向市场，同时接受并鼓励全球团队申请。" },
      { label: "导师与人才", strength: "强", detail: "连接大量顾问、学生、MBA、博士后与教职顾问。" },
      { label: "资本与客户", strength: "强", detail: "SkyDeck Fund、Demo Day、校友和企业伙伴提供融资与客户介绍。" },
      { label: "计划导航", strength: "中", detail: "Cohort、IPP 与 Pad-13 服务阶段不同，选错入口会降低价值。" },
    ],
    offers: [
      { title: "Cohort Accelerator", includes: "六个月、投资、Key Advisor、BAM 与 Demo Day。", founderValue: "适合接近首轮机构资本的技术公司。" },
      { title: "Innovation Partners", includes: "为国际机构、大学与企业伙伴推荐的团队提供三个月加速。", founderValue: "适合通过合作机构进入湾区的团队。" },
      { title: "Pad-13 Incubator", includes: "面向更早期且至少一位创始人与 UC 相关的公司。", founderValue: "为过早进入 Cohort 的团队建立成长路径。" },
    ],
    entryPaths: [
      { title: "全球 Cohort", forWhom: "有明确技术产品、接近机构种子轮的国际与 UC 相关团队。", prepare: "产品、技术壁垒、市场证据和湾区资源使用计划。" },
      { title: "伙伴推荐项目", forWhom: "来自 SkyDeck 合作大学、政府或企业伙伴的团队。", prepare: "先确认本地机构是否是有效推荐方及其筛选流程。" },
      { title: "Pad-13", forWhom: "更早期且具有 UC 关联的创始团队。", prepare: "说明早期成长目标和进入 Cohort 前需要补齐的证据。" },
    ],
    stageFit: [
      { stage: "只有想法", fit: "可以考虑", reason: "若满足 UC 关联，可关注 Pad-13；全球 Cohort 通常过早。" },
      { stage: "技术原型", fit: "优先考虑", reason: "可利用研究、导师和人才完成商业化验证。" },
      { stage: "已有 MVP/试点", fit: "优先考虑", reason: "最适合 Cohort 的客户与融资支持。" },
      { stage: "成熟增长期", fit: "暂不优先", reason: "平台重点仍在早期商业化和种子融资。" },
    ],
    costs: [
      { label: "入口研究", level: "中", detail: "三个主要计划资格不同，需先确定阶段与关联要求。" },
      { label: "地点与参与", level: "高", detail: "湾区线下活动和长期项目会带来迁移、签证和经营成本。" },
      { label: "投资稀释", level: "高", detail: "Cohort 投资需要核对最新条款；其他项目可能有不同安排。" },
      { label: "知识产权边界", level: "高", detail: "大学关联不等于自动获得研究或知识产权使用权。" },
    ],
    diligence: ["你的公司应申请 Cohort、IPP 还是 Pad-13？", "UC 关联和知识产权关系是否清晰？", "需要的三位顾问、三类人才和三类客户是谁？", "湾区参与的成本是否优于其他融资路径？"],
    playbook: [
      { phase: "第 1 周", title: "选择计划", action: "按阶段、UC 关联、投资需求和地点选择唯一入口。", output: "计划适配表" },
      { phase: "第 2 周", title: "拆分资源目标", action: "把大学资源拆成研究、人才、客户和资本四类。", output: "资源需求地图" },
      { phase: "第 3 周", title: "建立商业化证据", action: "用客户问题和试点说明技术为什么现在值得市场化。", output: "商业化证据包" },
      { phase: "申请期", title: "设计六个月结果", action: "设置产品、客户、团队和融资里程碑。", output: "六个月目标表" },
    ],
    comparison: { chooseWhen: "你是技术或研究驱动公司，需要大学人才、商业化与湾区资本的组合。", avoidWhen: "你只需要通用课程，或无法从伯克利生态获得明确增量。", compareWith: "与 YC 比较通用网络；与 Techstars 比较行业企业伙伴；与其他大学孵化器比较 IP 与人才资源。" },
  },

  "techcrunch-disrupt-2026": {
    identity: {
      model: "旧金山大型科技创业大会，组合主舞台、Startup Battlefield、展览、投资人、媒体与大量边会。",
      primaryValue: "在三天内集中获得湾区科技行业曝光、融资关系、媒体接触和跨生态会面机会。",
      valueCondition: "必须在会前完成目标名单和约见；如果只听演讲，跨国差旅的回报通常不足。",
    },
    capabilities: [
      { label: "媒体与行业曝光", strength: "核心", detail: "TechCrunch 品牌、报道生态和大会展示适合需要科技媒体关注的团队。" },
      { label: "湾区融资连接", strength: "强", detail: "投资人密度高，但高质量会面需要提前筛选与明确融资阶段。" },
      { label: "创业展示", strength: "强", detail: "Startup Battlefield、展位和专项申请可能提供更强曝光，需独立申请。" },
      { label: "深度行业学习", strength: "中", detail: "覆盖面广，若问题高度垂直，专业会议可能更深入。" },
    ],
    offers: [
      { title: "主大会与议程", includes: "创业、投资、产品和技术趋势内容。", founderValue: "用于快速理解湾区议题，但不应成为参会唯一理由。" },
      { title: "创业公司展示", includes: "Founder Pass、展览与 Startup Battlefield 等不同入口。", founderValue: "将公司放到投资人和媒体面前，前提是符合资格并提前申请。" },
      { title: "会面与边会网络", includes: "大会参会者、伙伴与旧金山同期边会。", founderValue: "最容易产生真实后续会议，也是最需要提前规划的部分。" },
    ],
    entryPaths: [
      { title: "普通创始人参会", forWhom: "需要融资、合作或理解湾区网络的团队。", prepare: "提前建立 20 人名单并完成至少 5 个确认会面。" },
      { title: "展览与创业项目", forWhom: "产品可演示、需要曝光与客户反馈的公司。", prepare: "单独确认申请资格、费用、展位资源和获客目标。" },
      { title: "Startup Battlefield", forWhom: "具备强故事、产品与全球媒体潜力的早期公司。", prepare: "把它视为独立选拔项目，准备演示、叙事和高压问答。" },
    ],
    stageFit: [
      { stage: "只有想法", fit: "暂不优先", reason: "缺少产品和明确请求时，很难把高密度关系转化为结果。" },
      { stage: "已有 MVP", fit: "可以考虑", reason: "可用于反馈、媒体和早期投资人关系，但需控制成本。" },
      { stage: "正在融资", fit: "优先考虑", reason: "若投资人名单清晰并已有会议安排，三天可集中推进融资。" },
      { stage: "国际扩张", fit: "优先考虑", reason: "适合把大会作为一段完整湾区客户、人才和资本行程的中心。" },
    ],
    costs: [
      { label: "现金与差旅", level: "高", detail: "门票、旧金山住宿、机票和团队时间构成显著成本。" },
      { label: "信息噪声", level: "高", detail: "万人规模意味着随机社交效率低，必须主动筛选。" },
      { label: "展示附加成本", level: "中", detail: "展位、材料和专项项目可能有独立费用或申请。" },
      { label: "会后执行", level: "中", detail: "没有三天内跟进，现场关系很快失去价值。" },
    ],
    diligence: ["参会唯一首要目标是什么？", "目前确认了多少位值得会面的人？", "是否符合创业展示或 Battlefield 资格？", "把大会放入更长湾区行程后，能否提升总回报？"],
    playbook: [
      { phase: "会前 6 周", title: "确定目标与名单", action: "确定融资、媒体或客户中的唯一主目标。", output: "20 人目标名单" },
      { phase: "会前 3 周", title: "完成约见", action: "发送有共同背景和明确请求的短消息。", output: "至少 5 个确认会面" },
      { phase: "现场", title: "记录下一步", action: "每次交流结束前确认下一次会议、材料或介绍。", output: "行动化会议记录" },
      { phase: "会后 72 小时", title: "完成跟进", action: "发送个性化总结与单一下一步。", output: "跟进完成表" },
    ],
    comparison: { chooseWhen: "你需要湾区媒体、投资人和科技生态的综合曝光。", avoidWhen: "你没有产品、名单或明确参会目标。", compareWith: "与 Slush 比较投资人密度和欧洲网络；与 Web Summit 比较规模、媒体与跨行业覆盖。" },
  },

  "web-summit-lisbon-2026": {
    identity: {
      model: "里斯本超大型综合科技大会，连接创业公司、投资人、企业、媒体、公共机构与多个内容赛道。",
      primaryValue: "以大规模国际人群和跨行业覆盖提供欧洲曝光、媒体关系、合作伙伴和投资人网络。",
      valueCondition: "团队需要用非常具体的行业、人群和会议目标对抗规模带来的噪声。",
    },
    capabilities: [
      { label: "国际跨行业曝光", strength: "核心", detail: "参与者来源广，适合需要跨国家、跨行业品牌和伙伴连接的团队。" },
      { label: "媒体与公共生态", strength: "强", detail: "媒体、政府和大型企业参与度高，适合公共议题和国际传播。" },
      { label: "创业公司项目", strength: "强", detail: "创业项目、展示和投资人入口需单独申请，可放大普通门票价值。" },
      { label: "高相关性会面", strength: "中", detail: "规模巨大，垂直团队可能在更专业的会议中获得更高命中率。" },
    ],
    offers: [
      { title: "多赛道内容与大会网络", includes: "科技、商业、政策与行业内容，以及大规模国际参会者。", founderValue: "适合建立广度认知和跨界关系。" },
      { title: "Startup Programme", includes: "面向创业公司的专项申请、展示和投资人互动。", founderValue: "通常比只买普通票更有结构，但需核对当期权益。" },
      { title: "媒体与伙伴机会", includes: "媒体、企业展商、国际组织与同期 Night Summit。", founderValue: "可用于品牌和渠道探索，但需要不同话术和负责人。" },
    ],
    entryPaths: [
      { title: "创业项目申请", forWhom: "希望展示、获得投资人和媒体入口的早期公司。", prepare: "准备公司阶段、产品演示、牵引力和国际化故事。" },
      { title: "普通门票", forWhom: "已经安排明确会议、无需展位权益的创始人。", prepare: "先从参会名单和赛道中筛选目标，再决定购票。" },
      { title: "媒体/演讲/伙伴", forWhom: "拥有行业观点、品牌预算或传播目标的团队。", prepare: "分别核对申请和商业合作流程，不要混用一个入口。" },
    ],
    stageFit: [
      { stage: "只有想法", fit: "暂不优先", reason: "大会规模不会替代问题验证，且难以提出有价值的合作请求。" },
      { stage: "已有 MVP", fit: "可以考虑", reason: "适合国际反馈和早期曝光，前提是成本可控。" },
      { stage: "正在融资", fit: "优先考虑", reason: "若目标投资人来自欧洲和国际市场，可集中建立关系。" },
      { stage: "国际扩张", fit: "优先考虑", reason: "跨国企业、媒体和公共机构的广度具有独特价值。" },
    ],
    costs: [
      { label: "大会噪声", level: "高", detail: "超大规模让随机遇见正确对象的概率低，必须主动筛选。" },
      { label: "差旅与团队", level: "高", detail: "里斯本住宿、机票、门票和多人参会会快速提高预算。" },
      { label: "目标分散", level: "高", detail: "融资、媒体、销售和学习若同时进行，通常每项都不深入。" },
      { label: "专项申请", level: "中", detail: "创业项目、媒体、演讲和展示有各自资格与时间线。" },
    ],
    diligence: ["你的目标对象是否真的会参加里斯本主会？", "Startup Programme 比普通门票多出的权益是什么？", "如果只选择一个行业赛道，会是哪一个？", "是否有更垂直的欧洲会议能以更低成本达到目标？"],
    playbook: [
      { phase: "会前 8 周", title: "选择唯一目标", action: "在融资、媒体、伙伴和客户中确定一个主目标。", output: "参会成功定义" },
      { phase: "会前 5 周", title: "申请专项入口", action: "完成创业项目、媒体或展示申请。", output: "入口申请清单" },
      { phase: "会前 3 周", title: "按赛道建名单", action: "筛选 15 个目标并安排会议。", output: "确认日程" },
      { phase: "会后 1 周", title: "转换关系", action: "把交流推进为试点、采访、融资会或伙伴讨论。", output: "机会管道" },
    ],
    comparison: { chooseWhen: "你需要大范围国际曝光、媒体和跨行业连接。", avoidWhen: "你的目标极其垂直，且尚未找到明确参会对象。", compareWith: "与 Slush 比较早期融资相关性；与 Disrupt 比较湾区媒体与美国资本。" },
  },

  "slush-2026": {
    identity: {
      model: "赫尔辛基以早期创始人和风险投资人为中心的两日大会，并通过 Meeting Tool、Investor Day 和 600+ 边会延伸为 Slush Week。",
      primaryValue: "在欧洲创业与风险投资生态中集中安排高相关性一对一会议，特别适合早期科技公司融资。",
      valueCondition: "需要提前通过平台建立投资人名单和会议节奏，把大会作为融资流程的一部分。",
    },
    capabilities: [
      { label: "早期投资人密度", strength: "核心", detail: "大会强调创始人与 VC 相关性，官方称 2026 参会者中创业公司或投资人占 76%。" },
      { label: "结构化会议", strength: "核心", detail: "Meeting Tool、会议区、Office Hours 和日历同步让约见比随机社交更可控。" },
      { label: "欧洲创业网络", strength: "强", detail: "核心人群来自北欧、英国、DACH、法国、Benelux、中东欧和南欧。" },
      { label: "非融资目标", strength: "中", detail: "媒体、客户和人才仍有价值，但大会设计最突出的优势是创始人与资本。" },
    ],
    offers: [
      { title: "Startup Ticket", includes: "两日大会、Meeting Tool、会议区、导师与投资人 Office Hours，以及创始人活动。", founderValue: "把门票转化为结构化融资会议的工具。" },
      { title: "Slush Platform", includes: "参会者浏览、约见、日历同步、团队协作和场地信息。", founderValue: "真正的准备工作在开门前数周开始。" },
      { title: "Slush Week", includes: "Investor Day、Side Events、Slush 100 与大量社区活动。", founderValue: "可以把两日大会扩展为完整欧洲融资行程。" },
    ],
    entryPaths: [
      { title: "Startup 资格门票", forWhom: "年轻、科技驱动并追求快速增长的公司，申请会经过审核。", prepare: "准确说明阶段、融资轮次、牵引力和希望遇到的投资人类型。" },
      { title: "Slush 100 等项目", forWhom: "希望获得更强展示、竞争和融资曝光的公司。", prepare: "单独核对开放时间、资格、路演和筛选要求。" },
      { title: "边会与会议平台", forWhom: "即使不参加所有舞台内容，也希望高效见到欧洲生态的人。", prepare: "提前建立优先级，并保留主会前后时间参加相关边会。" },
    ],
    stageFit: [
      { stage: "只有想法", fit: "暂不优先", reason: "没有产品或融资目标时，投资人密度不会自动产生价值。" },
      { stage: "已有 MVP", fit: "可以考虑", reason: "若开始建立种子投资人关系，可用于早期反馈和网络。" },
      { stage: "种子轮融资", fit: "优先考虑", reason: "这是大会人群、会议工具和欧洲资本密度最匹配的阶段。" },
      { stage: "后期增长", fit: "可以考虑", reason: "可利用投资人和 LP 网络，但需确认目标基金是否参会。" },
    ],
    costs: [
      { label: "差旅与住宿", level: "高", detail: "赫尔辛基 Slush Week 期间需求集中，应尽早预订并核算团队成本。" },
      { label: "会议准备", level: "高", detail: "高回报依赖数周筛选、约见和材料准备，不是两天现场投入。" },
      { label: "票种与资格", level: "中", detail: "创业公司、投资人和生态票价格及权益不同，需核对资格。" },
      { label: "融资叙事疲劳", level: "中", detail: "连续会议需要团队分工、休息和一致的材料版本。" },
    ],
    diligence: ["目标融资轮次与参会基金阶段是否一致？", "能否在购票前列出 20 家目标基金？", "Side Events 中哪些比主舞台更重要？", "大会后两周内希望推进到什么融资动作？"],
    playbook: [
      { phase: "会前 8 周", title: "建立融资长名单", action: "按阶段、地区、支票和行业筛选 30 家基金。", output: "基金长名单" },
      { phase: "会前 5 周", title: "启动温暖介绍", action: "利用共同联系人和平台发起约见。", output: "10 个意向会面" },
      { phase: "会前 2 周", title: "统一融资材料", action: "准备 30 秒、3 分钟和完整 deck 三个版本。", output: "会议材料包" },
      { phase: "会后 72 小时", title: "推进下一关", action: "发送数据室、安排合伙人会议或明确拒绝原因。", output: "融资管道更新" },
    ],
    comparison: { chooseWhen: "你是早期科技公司，正在建立或推进欧洲种子融资。", avoidWhen: "你没有融资计划，或目标投资人主要不在欧洲。", compareWith: "与 Disrupt 比较美国资本与媒体；与 Web Summit 比较人群广度和投资相关性。" },
  },

  "waic-shanghai-2026": {
    identity: {
      model: "上海城市级人工智能大会，由论坛会议、展览展示、评奖赛事、应用体验、创新孵化与招才引智六个板块组成，并延伸到三地四馆和全城 City Walk。",
      primaryValue: "把中国 AI 的政策、科研、算力与模型、硬件、行业场景、创业项目和资本集中在同一时间窗口，帮助创业者快速建立产业地图并推进关键关系。",
      valueCondition: "必须带着一个明确的创业问题、目标名单和会后动作参会；否则 140 余场论坛、1100 余家企业和 3000 余项展品只会形成信息过载。",
    },
    capabilities: [
      { label: "中国 AI 产业全景", strength: "核心", detail: "从模型、语料、智算和芯片，到具身智能、智能终端与行业应用，适合快速建立供应链、竞争和合作地图。" },
      { label: "技术与产品首发", strength: "核心", detail: "官方公布 300 余款产品全球首发，智算和具身智能赛道各有 200 余家企业，可用于同场比较产品成熟度。" },
      { label: "创投与创业连接", strength: "强", detail: "WAIC Future Tech、资本对接专区与 OPC 展区连接早期项目和投资机构，但高质量会面仍需要主动预约和筛选。" },
      { label: "全球治理与政策理解", strength: "强", detail: "高级别会议、治理议题与上海产业政策能帮助团队判断合规、开放合作和国内落地环境。" },
      { label: "深度单一赛道研究", strength: "中", detail: "覆盖面极广，若只研究一个非常窄的技术问题，WAIC Academic 或垂直闭门会可能比综合展区更有效。" },
    ],
    offers: [
      { title: "四个场馆的差异化入口", includes: "世博中心偏主论坛与行业论坛；世博展览馆偏产品展示；张江科学会堂偏 AI 芯片和硬核产品；西岸偏智能终端、具身体验与 AI+文娱。", founderValue: "可以按问题选择一个主场馆，避免把时间浪费在跨区域赶场。" },
      { title: "WAIC Future Tech 创投生态", includes: "官方披露汇集 80 余家投资机构，并从全球 1200 多个项目中筛选近 180 个项目进入创投生态。", founderValue: "适合观察资本正在关注的 AI 方向，并争取投资、合作与项目曝光。" },
      { title: "WAIC Academic 与前沿议题", includes: "首次设立高水平学术会议，议题延伸到科学多模态智能体、AI4S、量子计算、空间智能与具身交互。", founderValue: "帮助技术创始人区分短期产品热点与更长期的研究变量。" },
      { title: "Hi WAIC 与城市体验", includes: "官方应用整合论坛预约、活动报名、智能推荐和电子凭证；City Walk 将体验延伸到上海 24 个特色场景。", founderValue: "既能完成馆内行程，也能实地观察 AI 在消费、制造、文娱和城市空间中的采用方式。" },
    ],
    entryPaths: [
      { title: "展览观众", forWhom: "希望比较产品、发现供应商、观察竞争格局或体验应用的创始人。", prepare: "先选择一个主赛道，列出 10 家必看企业和 5 个需要当场验证的问题。" },
      { title: "论坛与 WAIC Academic", forWhom: "需要理解技术路线、产业趋势、治理政策或研究前沿的人。", prepare: "按问题预约少量高相关场次，提前阅读嘉宾或论文背景，避免被主题标题牵着走。" },
      { title: "创投与项目展示", forWhom: "正在融资、寻找产业合作或希望进入上海 AI 生态的早期团队。", prepare: "准备 30 秒项目介绍、一页材料、清晰融资阶段和一个可执行的合作请求。" },
      { title: "City Walk 与产业路线", forWhom: "需要理解上海本地创新载体、行业场景和城市级应用的团队。", prepare: "通过 Hi WAIC 实名注册并提前预约，把路线与潜在落地地区或目标客户对应起来。" },
    ],
    stageFit: [
      { stage: "仍在找方向", fit: "可以考虑", reason: "适合观察问题空间和产业结构，但必须把参会结果转化为用户访谈，不能用趋势热度替代需求证据。" },
      { stage: "已有原型", fit: "优先考虑", reason: "可集中比较技术方案、寻找试点场景、验证竞争差异并接触早期资本。" },
      { stage: "正在融资", fit: "优先考虑", reason: "资本与项目高度集中，但应提前锁定匹配阶段、行业和支票范围的机构。" },
      { stage: "规模化落地", fit: "优先考虑", reason: "适合寻找大型企业、地方场景、供应链与上海落地资源，重点应从展示转向采购和部署条件。" },
    ],
    costs: [
      { label: "场馆与时间复杂度", level: "高", detail: "世博、张江和西岸分布在不同区域，跨馆赶场会吞噬有效交流时间，应每天只设一个主场馆。" },
      { label: "信息噪声", level: "高", detail: "热门概念、首发产品和舞台观点密度极高，需要用客户价值、部署成本和真实采用证据进行过滤。" },
      { label: "预约与票证", level: "中", detail: "展览、论坛、学术会议和产业路线的资格与入口不同，应以 Hi WAIC 和对应官方页面为准。" },
      { label: "现场转化成本", level: "中", detail: "展台交流容易停留在宣传层，必须追问客户案例、采购流程、定价、部署周期和下一位联系人。" },
    ],
    diligence: [
      "这次参会唯一需要回答的创业问题是什么？",
      "哪个场馆与这个问题最匹配，哪些场馆可以主动放弃？",
      "希望带走的是客户试点、技术伙伴、投资会面，还是市场判断？",
      "看到热门产品时，能否区分现场演示、可部署产品和已规模采购？",
      "每个关键交流能否在现场确认下一次会议、材料或引荐？",
    ],
    playbook: [
      { phase: "入场前", title: "建立一页参会任务书", action: "写下一个核心问题、一个主场馆、10 家目标企业、5 位目标联系人和三项成功指标。", output: "WAIC 任务书" },
      { phase: "现场上午", title: "先验证市场与产品", action: "用相同五个问题访问目标展台，记录客户、成本、部署和差异化证据。", output: "竞品与场景证据表" },
      { phase: "现场下午", title: "完成关键会面", action: "将观察转化为具体请求：试点、技术对接、投资复谈或上海落地咨询。", output: "下一步承诺清单" },
      { phase: "每日结束", title: "做去热度复盘", action: "把信息分为事实、宣传、假设和反向证据，并删掉不能改变决策的笔记。", output: "每日决策备忘录" },
      { phase: "会后 72 小时", title: "推进三个结果", action: "只优先跟进价值最高的三条关系，发送个性化总结并约定明确日期。", output: "客户 / 资本 / 合作管道" },
    ],
    comparison: {
      chooseWhen: "你正在建设 AI 公司，且需要同时理解中国技术、产业场景、资本和上海生态，或能在现场推进具体合作。",
      avoidWhen: "你只是想泛泛了解 AI 新闻、没有明确问题，或无法安排任何会后验证与跟进。",
      compareWith: "与垂直技术会议比较研究深度；与 Slush 比较早期融资密度；与 Disrupt 比较美国媒体与湾区资本；与上海本地产业活动比较持续落地能力。",
    },
  },

  "shepherd": {
    identity: {
      model: "YC S26 企业 AI 基础设施项目，把团队使用的工具内容自动汇入统一记忆，供检索和智能代理行动。",
      primaryValue: "解决企业信息分散导致人和 AI Agent 缺少持续上下文的问题，让代理从单次回答走向跨工具执行。",
      valueCondition: "必须在数据权限、同步新鲜度、检索准确性与实际代理任务上明显优于企业现有搜索和集成方案。",
    },
    capabilities: [
      { label: "统一信息摄取", strength: "核心", detail: "公开描述强调自动摄取团队使用的各类工具并形成统一记忆。" },
      { label: "Agent 可行动上下文", strength: "核心", detail: "不仅供人搜索，也让智能代理在组织知识上执行任务。" },
      { label: "企业搜索", strength: "强", detail: "能够成为跨工具检索层，但需证明排序、权限和引用可信。" },
      { label: "成熟商业证据", strength: "有限", detail: "公司成立于 2026 年，公开客户、定价和规模化数据仍有限。" },
    ],
    offers: [
      { title: "统一记忆层", includes: "把分散工具内容汇入可索引的组织知识层。", founderValue: "代表 Agent 时代新的基础设施切口：上下文而非单一模型。" },
      { title: "代理执行接口", includes: "让智能代理在统一记忆上读取信息并采取行动。", founderValue: "产品价值可从搜索席位扩展到自动化工作流。" },
      { title: "跨工具企业入口", includes: "服务已经使用大量 SaaS 与 AI Agent 的团队。", founderValue: "越多系统带来越高价值，也带来越高集成与安全成本。" },
    ],
    entryPaths: [
      { title: "早期客户/试用", forWhom: "工具分散、正在部署内部 Agent 的技术型企业团队。", prepare: "选择一个可衡量任务验证，而不是一次接入所有系统。" },
      { title: "生态与集成伙伴", forWhom: "Agent 平台、企业工具或数据基础设施公司。", prepare: "明确权限、同步和联合价值，避免成为一次性连接器。" },
      { title: "创业研究对象", forWhom: "研究企业知识、Agent memory 和上下文工程的创始人。", prepare: "重点拆解产品层次和验证难点，不要只复制‘统一记忆’表述。" },
    ],
    stageFit: [
      { stage: "概念研究", fit: "优先考虑", reason: "值得用于理解 Agent 基础设施正在形成的新价值层。" },
      { stage: "产品采购", fit: "可以考虑", reason: "适合技术团队早期测试，但需单任务验证安全和准确性。" },
      { stage: "大规模部署", fit: "暂不优先", reason: "公开成熟度有限，企业应完成严格安全、权限和可靠性评估。" },
      { stage: "投资研究", fit: "可以考虑", reason: "赛道重要，但需等待客户使用、留存和集成壁垒证据。" },
    ],
    costs: [
      { label: "数据权限", level: "高", detail: "统一摄取会接触高敏感企业信息，最小权限和审计能力是前提。" },
      { label: "集成维护", level: "高", detail: "多工具 API、字段与权限变化会持续制造维护成本。" },
      { label: "错误传播", level: "高", detail: "错误或过期上下文若被 Agent 用于行动，风险高于普通搜索错误。" },
      { label: "替代竞争", level: "中", detail: "企业搜索、数据平台和原生 SaaS Agent 都可能扩展到相似层。" },
    ],
    diligence: ["统一记忆如何继承源系统的行级权限？", "内容更新、删除与版本冲突如何处理？", "最先产生可量化 ROI 的三个 Agent 任务是什么？", "竞争壁垒来自数据、集成、工作流还是模型？"],
    playbook: [
      { phase: "第 1 周", title: "选择任务", action: "挑选一个高频、可逆、可人工复核的企业 Agent 任务。", output: "单任务试点定义" },
      { phase: "第 2 周", title: "建立安全边界", action: "限定数据源、用户、权限和日志要求。", output: "试点权限矩阵" },
      { phase: "第 3 周", title: "测量质量", action: "记录答案准确率、过期率、人工纠正和任务完成。", output: "质量基线" },
      { phase: "第 4 周", title: "决定扩展", action: "只有 ROI 与安全达标后再增加工具和任务。", output: "扩展或停止决定" },
    ],
    comparison: { chooseWhen: "你在研究企业 Agent 的记忆、上下文和跨工具执行层。", avoidWhen: "你只需要简单文档搜索，或无法承担敏感数据整合风险。", compareWith: "与 Cerenovus 比较统一记忆和组织系统图；与企业搜索和数据平台比较权限与行动能力。" },
  },

  "cerenovus": {
    identity: {
      model: "YC S26 企业知识与运营分析项目，将文档、邮件、Slack、表格和会议记录转成面向人和 Agent 的 Markdown 知识图谱。",
      primaryValue: "在统一知识层之上绘制人员、流程和工具关系，尝试把咨询式组织诊断变成持续、证据化的软件能力。",
      valueCondition: "必须长期保持知识图谱新鲜、权限正确和因果判断可信，并证明高层决策建议优于普通搜索。",
    },
    capabilities: [
      { label: "多格式知识整合", strength: "核心", detail: "公开产品描述覆盖文档、PDF、邮件、Slack、表格和会议记录。" },
      { label: "组织系统图", strength: "核心", detail: "重点不只找信息，还连接人、流程和工具以理解真实工作流。" },
      { label: "决策分析", strength: "强", detail: "目标是回答组织重组、供应商和交接效率等管理问题。" },
      { label: "市场成熟度", strength: "有限", detail: "2026 年成立，公开客户、准确率和商业数据仍然有限。" },
    ],
    offers: [
      { title: "公司知识图谱", includes: "把异构文件转成统一、可连接、对人和 AI 可读的知识层。", founderValue: "展示知识管理从文档检索走向组织建模的趋势。" },
      { title: "流程关系映射", includes: "连接人员、流程和工具，识别工作流交接与低效。", founderValue: "将价值主张推向运营改进，而非只卖更好搜索。" },
      { title: "证据化管理回答", includes: "为重组、供应商与流程问题提供持续更新的分析。", founderValue: "若可信，可替代部分慢速、一次性的内部分析和咨询工作。" },
    ],
    entryPaths: [
      { title: "管理问题试点", forWhom: "信息分散、流程复杂且愿意开放数据的中小型企业。", prepare: "选择一个有明确当前答案和决策后果的问题。" },
      { title: "运营团队试用", forWhom: "需要持续理解跨团队交接、工具和流程的 COO/运营团队。", prepare: "先定义可验证流程指标，避免只评价回答是否‘听起来合理’。" },
      { title: "创业研究", forWhom: "研究企业知识图谱、AIOps 和 AI 决策支持的创始人。", prepare: "分析数据模型、维护成本和决策责任，而不只关注生成式界面。" },
    ],
    stageFit: [
      { stage: "概念研究", fit: "优先考虑", reason: "适合观察企业 AI 从检索走向组织决策的新产品方向。" },
      { stage: "小规模试点", fit: "可以考虑", reason: "应从单一管理问题和有限数据范围开始。" },
      { stage: "关键决策依赖", fit: "暂不优先", reason: "早期产品需先证明来源、权限、准确和反例处理。" },
      { stage: "投资研究", fit: "可以考虑", reason: "价值空间大，但图谱维护与责任边界是关键风险。" },
    ],
    costs: [
      { label: "知识维护", level: "高", detail: "组织结构、人员和流程持续变化，图谱很容易过期。" },
      { label: "权限与隐私", level: "高", detail: "邮件、聊天和管理信息需要严格访问控制与用途限制。" },
      { label: "决策责任", level: "高", detail: "错误组织建议的后果远高于错误文档搜索，必须可追溯和人工复核。" },
      { label: "价值证明", level: "中", detail: "需要证明节省的分析时间或改善的业务指标，而不只是生成更完整报告。" },
    ],
    diligence: ["每个结论能否追溯到原始证据和时间？", "组织变化后知识图谱如何自动更新？", "员工聊天和邮件的隐私边界是什么？", "如何区分相关性、流程症状和真正原因？"],
    playbook: [
      { phase: "第 1 周", title: "选定决策问题", action: "选择一个结果可验证、影响有限的运营问题。", output: "决策试点说明" },
      { phase: "第 2 周", title: "限定数据范围", action: "只接入回答该问题所需的系统与人员。", output: "数据最小化清单" },
      { phase: "第 3 周", title: "双轨分析", action: "让系统与人工分析员独立给出答案。", output: "答案与证据对照" },
      { phase: "第 4 周", title: "评估可信度", action: "检查准确、遗漏、偏差、可解释和节省时间。", output: "试点评估报告" },
    ],
    comparison: { chooseWhen: "你关心企业知识如何进一步支持组织运营与高层决策。", avoidWhen: "你只需要基础搜索，或无法合法、安全地整合内部数据。", compareWith: "与 Shepherd 比较 Agent 记忆和组织决策；与传统知识图谱和咨询分析比较持续更新能力。" },
  },

  "pally": {
    identity: {
      model: "YC S25 智能统一收件箱与个人 CRM，把消息、联系人背景、关系状态和行动事项集中到一个工作空间。",
      primaryValue: "帮助创始人、投资人和关系密集型工作者减少多平台沟通造成的遗漏，并把关系上下文转化为跟进动作。",
      valueCondition: "必须在隐私可信、跨平台集成稳定和自动建议真正节省时间三方面同时成立。",
    },
    capabilities: [
      { label: "跨平台关系整合", strength: "核心", detail: "公开描述包含消息、社交、邮件、日历与联系人关系的统一视图。" },
      { label: "关系上下文与搜索", strength: "核心", detail: "通过公开信息和互动记录帮助准备会议、找人和理解关系变化。" },
      { label: "行动与提醒", strength: "强", detail: "识别待办、维系联系和管道管理是从信息聚合走向工作流的关键。" },
      { label: "企业级管理", strength: "有限", detail: "核心切口更接近个人关系工作流，而非复杂销售组织 CRM。" },
    ],
    offers: [
      { title: "统一收件箱", includes: "聚合多个消息与沟通渠道，降低逐个平台检查的成本。", founderValue: "若集成可靠，可成为关系工作的每日入口。" },
      { title: "AI 关系助手", includes: "会议准备、保持联系、关系搜索和行动项提示。", founderValue: "把个人 CRM 从手工录入转向自动上下文。" },
      { title: "关系管道与分析", includes: "将联系人放入管道，并观察互动频率和关系变化。", founderValue: "适合融资、招聘、销售和社区等长期关系过程。" },
    ],
    entryPaths: [
      { title: "个人早期试用", forWhom: "每天跨多个平台沟通、已有明显遗漏成本的创始人和投资人。", prepare: "选择一个关系场景，先验证是否减少漏回和准备时间。" },
      { title: "特定工作流试点", forWhom: "正在融资、招聘或做高关系密度销售的人。", prepare: "导入有限名单并定义跟进及时率和会议转化指标。" },
      { title: "创业研究", forWhom: "研究个人 CRM、统一收件箱与 AI 人际界面的产品团队。", prepare: "重点研究信任、授权和习惯迁移，而不只是功能列表。" },
    ],
    stageFit: [
      { stage: "个人轻度联系人", fit: "暂不优先", reason: "现有通讯录和日历可能已经足够，新增系统会增加维护。" },
      { stage: "高关系密度工作", fit: "优先考虑", reason: "漏回、准备和跨平台切换已经形成真实时间与机会成本。" },
      { stage: "小团队协作", fit: "可以考虑", reason: "需确认团队共享、权限和 CRM 边界是否满足需求。" },
      { stage: "大型销售组织", fit: "暂不优先", reason: "通常更需要成熟 CRM 的治理、流程和集成能力。" },
    ],
    costs: [
      { label: "隐私授权", level: "高", detail: "产品需要访问敏感消息、联系人和日历，信任与数据控制是核心门槛。" },
      { label: "平台稳定性", level: "高", detail: "消息与社交平台 API 政策变化会直接影响统一体验。" },
      { label: "习惯迁移", level: "中", detail: "用户只有在新入口明显更快时才会放弃原有收件箱习惯。" },
      { label: "维护负担", level: "中", detail: "如果自动整理不准确，个人 CRM 会变成另一个需要手工清理的系统。" },
    ],
    diligence: ["哪些消息平台是真正稳定的官方集成？", "用户能否细粒度控制哪些对话被读取和保留？", "自动行动项的准确率和撤销机制如何？", "产品的每日留存来自真实效率还是初期新鲜感？"],
    playbook: [
      { phase: "第 1 周", title: "选择关系场景", action: "只用于融资、招聘或客户中的一个流程。", output: "试用范围" },
      { phase: "第 2 周", title: "建立基线", action: "记录漏回、会议准备时间和跟进完成率。", output: "当前效率基线" },
      { phase: "第 3 周", title: "审计 AI 建议", action: "逐项检查联系人背景、提醒和行动项。", output: "准确性记录" },
      { phase: "第 4 周", title: "判断替代价值", action: "比较节省时间、机会转化和隐私成本。", output: "保留或停止决定" },
    ],
    comparison: { chooseWhen: "你的工作价值高度依赖关系，且多平台沟通已经造成可量化遗漏。", avoidWhen: "联系人数量少，或你无法接受敏感消息被集中处理。", compareWith: "与传统个人 CRM 比较自动化；与销售 CRM 比较团队流程；与统一收件箱比较关系智能。" },
  },

  "techbbq-2026": {
    ...founderEventProfile({
    event: "TechBBQ 2026",
    model: "北欧创始人、早期投资人与科技社区构成的两日创业大会，并设独立 Investor Day。",
    primaryValue: "以较高的北欧创投密度建立第一层关系，并理解当地资本、客户与创业文化。",
    valueCondition: "北欧是未来 12 个月的真实客户、融资或人才市场，且团队能提前安排具体会面。",
    audience: "北欧创始人、种子与 A 轮投资人、社区建设者和 B2B 科技公司",
    meetingTarget: "丹麦及北欧投资人、行业创始人和潜在客户",
    preparation: "准备北欧市场假设、简洁融资叙事与本地客户名单",
    tripCost: "哥本哈根住宿和跨国差旅成本较高；Investor Day 也不是所有创始人都可进入。",
    alternative: "对北欧客户做远程访谈、参加 Slush，或安排一周定向市场拜访",
    }),
  },
  "ifa-berlin-2026": {
    ...founderEventProfile({
    event: "IFA Berlin 2026",
    model: "消费电子与家电行业展会，IFA Next 为创业公司提供展示、路演、媒体和投资人入口。",
    primaryValue: "一次性验证欧洲渠道、品类定位、媒体叙事和产品现场吸引力。",
    valueCondition: "团队已有稳定可演示产品、清晰量产计划，并需要欧洲买家、品牌或媒体。",
    audience: "消费科技品牌、渠道买家、经销商、媒体、投资人与硬件创业公司",
    meetingTarget: "欧洲渠道买家、品牌合作方、专业媒体和 IFA Next 投资人",
    preparation: "准备稳定样机、英文销售资料、批发价格、交付周期、认证与售后答案",
    tripCost: "除门票差旅外，样机运输、展位搭建、保险与现场团队会显著增加总成本。",
    alternative: "直接拜访欧洲经销商、参加垂直硬件展，或做小范围媒体发布",
    }),
  },
  "bits-and-pretzels-2026": {
    ...founderEventProfile({
    event: "Bits & Pretzels 2026",
    model: "面向欧洲创始人、投资人和企业伙伴的三日大会，强调匹配、跨境扩张与创始人经验。",
    primaryValue: "进入德国和中欧创业网络，建立资本、企业客户与跨境伙伴关系。",
    valueCondition: "公司已有产品或客户证据，并把德语区或欧洲融资视为明确下一步。",
    audience: "欧洲创始人、天使与风险投资人、企业创新团队和创业生态机构",
    meetingTarget: "德国及欧洲投资人、企业客户和市场进入伙伴",
    preparation: "准备欧洲市场数据、融资进度、目标行业名单和清晰的合作请求",
    tripCost: "大会与慕尼黑啤酒节同期，住宿与交通成本高，需提前预订。",
    alternative: "在德国安排定向客户拜访、参加更垂直的行业会，或选择 TechBBQ / Sifted Summit",
    }),
  },
  "sifted-summit-2026": {
    ...founderEventProfile({
    event: "Sifted Summit 2026",
    model: "聚焦欧洲 Series A+ 科技公司的创始人、运营者和投资人的两日峰会。",
    primaryValue: "获得与成长阶段更匹配的组织、增长、资本效率和国际扩张经验。",
    valueCondition: "公司已经进入 Series A 左右或之后，并面临规模化而非从零验证问题。",
    audience: "欧洲成长型公司创始人、高管、运营者、成长轮投资人与 LP",
    meetingTarget: "Series A+ 同阶段创始人、成长投资人和欧洲扩张负责人",
    preparation: "带着一个真实规模化难题和可交换的运营数据参加闭门圆桌",
    tripCost: "伦敦差旅和票价较高，极早期团队还会承担明显的阶段错配成本。",
    alternative: "聘请专项顾问、组织同阶段创始人小组，或参加面向早期公司的活动",
    }),
  },
  "switch-singapore-2026": {
    ...founderEventProfile({
    event: "SWITCH 2026",
    model: "由新加坡创新体系连接深科技、国际市场、产业伙伴和创业生态的三日大会。",
    primaryValue: "把新加坡作为东南亚落地节点，验证企业试点、资本和区域市场进入路径。",
    valueCondition: "团队属于深科技或 B2B 技术，并能说明为什么新加坡是区域战略中的必要节点。",
    audience: "深科技创业公司、企业创新团队、早期投资人、政府与国际市场机构",
    meetingTarget: "新加坡企业试点方、早期基金、科研转化与市场进入机构",
    preparation: "准备东南亚市场优先级、技术验证证据和新加坡落地的具体请求",
    tripCost: "观众票可免费注册，但国际差旅、住宿和三天创始团队时间仍是主要成本。",
    alternative: "申请新加坡具体加速或落地项目、定向拜访 BLOCK71，或远程验证区域客户",
    }),
  },
  "hong-kong-fintech-week-2026": {
    ...founderEventProfile({
    event: "Hong Kong FinTech Week × StartmeupHK 2026",
    model: "金融科技大会与创业生态周联合形成的五日城市级活动，覆盖监管、机构、资本与创业公司。",
    primaryValue: "在同一窗口理解香港金融监管、机构采购、跨境业务和亚洲资本网络。",
    valueCondition: "团队服务金融行业或跨境市场，并已有合规、产品与机构合作的初步证据。",
    audience: "银行、保险、监管机构、金融科技公司、投资人与国际创业团队",
    meetingTarget: "香港金融机构、监管与合规伙伴、投资人及中国内地连接方",
    preparation: "准备合规路径、数据安全、集成方式、目标金融机构和试点方案",
    tripCost: "五天活动分散在不同地点和形式，时间成本高，闭门活动可能需要独立资格。",
    alternative: "对香港金融机构做定向拜访、进入监管沙盒，或参加 Singapore FinTech Festival",
    }),
  },
  "singapore-fintech-festival-2026": {
    ...founderEventProfile({
    event: "Singapore FinTech Festival 2026",
    model: "政策、监管、金融机构、技术供应商与资本共同参与的大型金融科技大会。",
    primaryValue: "同时接触东南亚金融监管、银行买方、合作伙伴和专业资本。",
    valueCondition: "公司解决的是金融机构可采购的问题，并准备好解释合规、集成与商业回报。",
    audience: "中央银行、监管机构、金融机构、金融科技公司、投资人与企业技术团队",
    meetingTarget: "东南亚银行、监管与政策角色、金融科技投资人与渠道伙伴",
    preparation: "准备监管地图、机构销售材料、集成架构、客户案例与明确试点范围",
    tripCost: "创业票、国际差旅和新加坡住宿构成较高成本，大会规模也增加筛选负担。",
    alternative: "安排区域银行销售行程、参加垂直金融科技活动，或进入具体监管与创新计划",
    }),
  },
  "gitex-global-2026": {
    ...founderEventProfile({
    event: "GITEX GLOBAL × Expand North Star 2026",
    model: "由 Scale Summit、全球科技展和创业投资平台共同组成的五日超大型科技活动。",
    primaryValue: "连接海湾政府、企业买方、主权与风险资本，以及区域市场进入伙伴。",
    valueCondition: "中东是清晰目标市场，且团队能围绕国家、行业和买方准备具体名单。",
    audience: "政府科技负责人、企业决策者、国际科技公司、投资人与成长型创业团队",
    meetingTarget: "海湾政府项目方、大型企业买方、区域渠道与中东资本",
    preparation: "按国家和行业馆拆分名单，准备本地化案例、采购周期与落地合作模式",
    tripCost: "迪拜旺季的住宿、展位和差旅成本高，五日活动也会占用核心团队大量时间。",
    alternative: "通过本地合作伙伴定向进入海湾市场，或参加更垂直的中东行业展",
    }),
  },
  "ces-2027-eureka-park": {
    ...founderEventProfile({
    event: "CES 2027 · Eureka Park",
    model: "全球科技贸易活动中的创业展示入口，为符合资格的早期团队提供产品发布与连接场景。",
    primaryValue: "把已准备好的产品同时展示给全球媒体、渠道、品牌、投资人与企业伙伴。",
    valueCondition: "产品可稳定演示、团队符合 Eureka Park 资格，并拥有承接曝光与订单的交付能力。",
    audience: "消费科技买家、媒体、品牌、投资人、国际展团和早期科技创业公司",
    meetingTarget: "目标渠道、专业媒体、品牌合作方、企业买家和硬件投资人",
    preparation: "准备稳定样机、英文媒体包、渠道价格、认证、交付计划和现场故障预案",
    tripCost: "拉斯维加斯旺季住宿、展位、物流、样机保险和多人现场支持会形成很高总成本。",
    alternative: "做独立产品发布、直接拜访渠道，或先参加 IFA Next 等更聚焦展区",
    }),
  },
  "google-for-startups-accelerator": {
    identity: { model: "按地区和主题运营的小批次无股权加速体系，以技术专家配对、冲刺项目和领导力训练解决成长阶段的具体瓶颈。", primaryValue: "让已有产品和进展的团队直接与 Google 及行业专家合作，缩短解决技术、产品和增长问题的时间。", valueCondition: "团队必须先定义一个足够具体的技术或业务挑战，并让 CTO 或核心技术负责人完整参与。" },
    capabilities: [
      { label: "技术专家配对", strength: "核心", detail: "围绕团队提出的技术难题匹配 Google 与行业专家，适合需要架构、AI、数据或产品深挖的公司。" },
      { label: "产品与增长训练", strength: "强", detail: "设计冲刺、获客、领导力和 OKR 等内容帮助团队把技术问题连接到公司增长。" },
      { label: "全球与区域网络", strength: "强", detail: "地区项目能连接本地生态，但价值取决于该批次主题与目标市场是否重合。" },
      { label: "直接融资", strength: "有限", detail: "项目提供网络和 Demo 场景，但不是统一投资工具，也不保证后续融资。" },
    ],
    offers: [
      { title: "专家技术冲刺", includes: "一对一辅导、专题深挖和围绕关键挑战的冲刺项目。", founderValue: "把一个会长期拖慢团队的问题压缩成有目标、有负责人和有产出的解决周期。" },
      { title: "产品与领导力训练", includes: "产品设计、客户获取、领导力与公司对齐等主题。", founderValue: "避免只优化技术而忽略用户、组织和商业约束。" },
      { title: "产品生态权益", includes: "符合资格时可获得 AI 产品早期访问、Cloud credits 或 TPU 资源。", founderValue: "降低实验成本，但所有权益都应按当期资格复核。" },
    ],
    entryPaths: [
      { title: "地区加速器", forWhom: "符合国家、地区、阶段和行业要求的成长型技术公司。", prepare: "从官方目录选择唯一匹配项目，按该项目截止日与资格提交。" },
      { title: "主题项目", forWhom: "能源、AI 或其他特定行业拥有明确产品和客户进展的团队。", prepare: "用客户证据说明为什么该技术挑战会阻碍增长。" },
      { title: "Startup School 与其他入口", forWhom: "暂时不符合加速器阶段，但希望使用公开学习资源的团队。", prepare: "先完成基础验证，再关注新的地区项目。" },
    ],
    stageFit: [
      { stage: "只有想法", fit: "暂不优先", reason: "项目通常要求产品、技术和早期进展，先完成问题与 MVP 验证。" },
      { stage: "Pre-seed / Seed", fit: "优先考虑", reason: "如果已经出现客户证据并有明确技术瓶颈，专家协作价值最高。" },
      { stage: "Series A", fit: "优先考虑", reason: "增长和组织问题开始具体，能够充分使用产品、领导力与技术支持。" },
      { stage: "成熟增长期", fit: "可以考虑", reason: "只在地区项目明确接收后期公司且挑战高度匹配时值得。" },
    ],
    costs: [
      { label: "股权", level: "低", detail: "官方说明计划期支持不收取股权。" },
      { label: "核心团队时间", level: "高", detail: "CTO 与关键技术人员需要持续参加会议、冲刺和项目工作。" },
      { label: "地区参与", level: "中", detail: "部分环节可能线下进行，应确认差旅与所在地区要求。" },
      { label: "平台依赖", level: "中", detail: "产品权益可能提高 Google 技术采用，需要避免为了 credits 改变最合适架构。" },
    ],
    diligence: ["当前有哪些项目仍开放，地域和行业是否完全符合？", "项目期间唯一要解决的技术或增长挑战是什么？", "CTO 与关键成员能否保证完整参与？", "Cloud、AI 产品和专家权益中哪些已写入当期说明？"],
    playbook: [
      { phase: "申请前 3 周", title: "选择唯一项目", action: "按地区、行业、阶段和日期淘汰不匹配入口。", output: "一页项目匹配表" },
      { phase: "申请前 2 周", title: "定义核心挑战", action: "把问题写成当前指标、根因假设与计划期目标。", output: "技术挑战说明" },
      { phase: "入选后", title: "建立冲刺基线", action: "明确负责人、成功指标和专家需要提供的具体帮助。", output: "项目冲刺看板" },
      { phase: "结项前", title: "固化能力", action: "将专家建议转化为文档、流程和团队可重复的方法。", output: "内部复盘与后续计划" },
    ],
    comparison: { chooseWhen: "公司已有产品和进展，且一个明确技术或增长瓶颈值得借助 Google 专家集中解决。", avoidWhen: "还没有用户问题、技术负责人无法投入，或只是为了品牌和云额度申请。", compareWith: "需要投资和融资节奏时比较 YC、Techstars；需要长期 AI 技术权益时比较 NVIDIA Inception。" },
  },
  "nvidia-inception": {
    identity: { model: "面向已注册 AI 创业公司的免费持续会员计划，不按固定批次结束，以技术学习、开发资源、合作权益和生态连接支持公司成长。", primaryValue: "降低 AI 与加速计算团队获取技术知识、工具优惠、伙伴资源和特定生态机会的门槛。", valueCondition: "团队必须已经成立、至少有一名开发者，并真实需要 NVIDIA 技术或相关合作生态。" },
    capabilities: [
      { label: "AI 技术资源", strength: "核心", detail: "提供开发工具、培训建议、论坛和部分课程权益，适合技术团队自助使用。" },
      { label: "软硬件与伙伴优惠", strength: "强", detail: "成员可申请特定硬件、软件、云额度和合作伙伴优惠，但供应与资格并不保证。" },
      { label: "资本与市场连接", strength: "中", detail: "符合条件的公司可能进入 VC Alliance、活动与展示机会，不能视为标准交付。" },
      { label: "公司建设辅导", strength: "有限", detail: "计划偏技术生态，不等同于密集产品、销售或联合创始人辅导。" },
    ],
    offers: [
      { title: "技术培训与开发入口", includes: "自学课程、折扣培训、论坛与按工作负载推荐的技术内容。", founderValue: "让团队更快理解哪些 NVIDIA 工具真正适合自己的产品。" },
      { title: "产品与合作优惠", includes: "部分硬件软件优惠、合作伙伴云额度和成员专属资源。", founderValue: "降低原型和早期部署成本，但应计算优惠结束后的真实单位经济。" },
      { title: "生态曝光", includes: "符合条件时获得投资人连接、展示、活动和市场合作机会。", founderValue: "为技术公司增加可信入口，但需要主动经营而非等待分配。" },
    ],
    entryPaths: [
      { title: "在线会员申请", forWhom: "成立少于十年、拥有官网和至少一名开发者的技术创业公司。", prepare: "准备公司资料、产品网站、融资状态和 pitch deck。" },
      { title: "成员专项权益", forWhom: "已入会并具有明确工作负载或商业里程碑的团队。", prepare: "持续更新公司资料，并在门户中申请具体权益。" },
      { title: "活动与资本入口", forWhom: "已有产品、进展且符合筛选标准的成员。", prepare: "建立可演示产品、融资材料和明确合作目标。" },
    ],
    stageFit: [
      { stage: "未注册 / 只有想法", fit: "暂不优先", reason: "官方要求公司正式注册且至少有一名开发者。" },
      { stage: "原型 / Pre-seed", fit: "优先考虑", reason: "免费技术学习和开发权益可降低早期试错成本。" },
      { stage: "Seed–Series A", fit: "优先考虑", reason: "产品、融资和市场需求更具体，能使用更高价值的生态入口。" },
      { stage: "成长阶段", fit: "可以考虑", reason: "适合仍高度依赖 AI 基础设施或需要国际生态连接的公司。" },
    ],
    costs: [
      { label: "费用与股权", level: "低", detail: "官方说明无申请费、会员费和股权要求。" },
      { label: "资料维护", level: "低", detail: "需要持续更新公司和产品资料以保持资格与获得匹配权益。" },
      { label: "技术锁定", level: "中", detail: "优惠可能推动团队采用特定技术栈，应比较长期成本与替代方案。" },
      { label: "机会不确定性", level: "中", detail: "投资人、市场活动和特定资源取决于资格，不是每个成员都获得。" },
    ],
    diligence: ["公司是否符合注册、年限、开发者和业务类型要求？", "最需要的具体权益是课程、算力优惠还是市场连接？", "优惠结束后产品单位经济是否成立？", "门户资料由谁负责持续更新和申请权益？"],
    playbook: [
      { phase: "申请前", title: "完成资格自检", action: "逐项核对公司类型、注册状态、开发者与网站要求。", output: "资格核对表" },
      { phase: "加入后 1 周", title: "选择三项权益", action: "只选择能解决当前里程碑的技术、成本和连接入口。", output: "90 天权益计划" },
      { phase: "使用中", title: "测量真实节省", action: "记录培训、credits 和技术优化带来的时间与成本变化。", output: "权益回报表" },
      { phase: "每季度", title: "更新公司资料", action: "同步产品、融资和市场进展，重新匹配专项机会。", output: "最新成员档案" },
    ],
    comparison: { chooseWhen: "公司已经注册并构建 AI 产品，需要长期技术生态资源而不希望交出股权。", avoidWhen: "尚未成立公司、没有开发团队，或期望加入后自动获得 GPU、融资和客户。", compareWith: "需要密集公司辅导时比较 YC、Techstars；需要围绕具体技术难题的短期专家冲刺时比较 Google Accelerator。" },
  },
  "inbound-2026": {
    ...founderEventProfile({ event: "INBOUND 2026", model: "由 HubSpot 主办、围绕营销、销售、客户成功、收入运营与 AI 的三日商业增长大会。", primaryValue: "集中接触 B2B 增长负责人、营销与销售买家，以及 HubSpot 生态中的工具与服务伙伴。", valueCondition: "团队已有可演示的 B2B 产品、明确买家画像，并能在会前预约目标客户和合作伙伴。", audience: "营销、销售、客户成功、收入运营负责人、企业创始人与增长工具提供商", meetingTarget: "目标企业增长负责人、HubSpot 生态伙伴、渠道与 B2B 投资人", preparation: "准备按买家角色拆分的演示、客户结果、集成说明和 30 天试点方案", tripCost: "现场门票、波士顿住宿和三天团队时间构成较高成本；免费内容不能替代目标会面。", alternative: "安排波士顿与纽约的定向客户拜访，或参加更垂直的 SaaS 与收入运营活动" }),
  },
  "dreamforce-2026": {
    ...founderEventProfile({ event: "Dreamforce 2026", model: "Salesforce 面向客户、开发者、合作伙伴与企业管理者的全球平台生态大会，包含线下内容与 Salesforce+ 直播。", primaryValue: "验证企业 AI、CRM 和数据产品如何进入 Salesforce 生态、采购流程和大型客户工作流。", valueCondition: "目标客户明确使用 Salesforce，产品已有可演示集成，并能提前锁定买家、伙伴或平台团队会面。", audience: "企业 CIO、CRM 与数据负责人、销售和服务团队、开发者、系统集成商与 Salesforce 合作伙伴", meetingTarget: "目标行业买家、AppExchange 与平台伙伴、系统集成商和企业软件投资人", preparation: "准备 Salesforce 集成演示、客户结果、平台重叠分析和合作伙伴方案", tripCost: "现场通票、旧金山旺季住宿和多日活动成本很高；线上直播适合只获取内容的团队。", alternative: "观看 Salesforce+ 免费直播，并用预算直接拜访三个目标客户或参加垂直企业软件活动" }),
  },
};

export function getResourceProfile(slug: string) {
  return resourceProfiles[slug];
}
