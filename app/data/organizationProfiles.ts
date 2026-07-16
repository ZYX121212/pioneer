import type { ProfileStrength } from "./resourceProfiles";

export type OrganizationIntelligenceProfile = {
  thesis: string;
  dna: Array<{ label: string; value: string; note: string }>;
  resources: Array<{
    label: string;
    strength: ProfileStrength;
    provides: string;
    access: string;
    boundary: string;
  }>;
  portfolio: Array<{
    name: string;
    stage: string;
    mechanism: string;
    fit: string;
  }>;
  ecosystem: Array<{
    actor: string;
    role: string;
    founderUse: string;
  }>;
  scenarios: Array<{
    need: string;
    route: string;
    firstMove: string;
    success: string;
  }>;
  redFlags: string[];
};

export const organizationProfiles: Record<string, OrganizationIntelligenceProfile> = {
  "station-f": {
    thesis: "STATION F 的产品不是一个统一加速器，而是一座承载多种项目的创业基础设施。判断它是否适合你的关键，不是园区规模，而是能否找到一个与你的行业、阶段和法国市场目标高度匹配的具体项目。",
    dna: [
      { label: "机构原型", value: "多项目创业园区", note: "园区、计划、伙伴与服务的集合，不是单一课程。" },
      { label: "运营逻辑", value: "平台 + 合作项目", note: "STATION F 自营项目与企业、学校、行业伙伴项目并存。" },
      { label: "主要服务对象", value: "早期至增长期团队", note: "具体阶段取决于所进入的项目，而非园区统一规定。" },
      { label: "资本角色", value: "连接者，不是统一基金", note: "投资人密度高，但投资关系通常通过具体项目与网络发生。" },
      { label: "地理价值", value: "法国与欧洲入口", note: "巴黎生态、国际团队与法国行政支持是重要差异。" },
      { label: "申请单位", value: "具体项目", note: "创业者通常不是申请‘整座园区’，而是申请某一计划或入口。" },
    ],
    resources: [
      { label: "项目组合", strength: "核心", provides: "30+ 自营与合作创业计划，覆盖不同产业与公司阶段。", access: "从项目目录按阶段、行业和运营方筛选，再单独申请。", boundary: "不同项目的质量、权益、费用和录取标准不统一。" },
      { label: "企业客户", strength: "强", provides: "大型企业伙伴、产业项目与园区活动带来的业务连接。", access: "优先进入与目标客户行业一致的企业伙伴项目。", boundary: "进入园区不等于获得采购；仍需满足企业试点和销售条件。" },
      { label: "资本网络", strength: "强", provides: "基金、投资人、Demo 活动与高密度创业公司网络。", access: "通过项目负责人、投资活动和校友关系建立温暖介绍。", boundary: "STATION F 品牌不能替代增长、收入或技术壁垒。" },
      { label: "国际落地", strength: "强", provides: "巴黎创业环境、国际社区，以及部分签证、行政和公司支持。", access: "选择明确面向国际创始人的项目，并提前核对注册与驻场要求。", boundary: "法国市场仍涉及语言、合规、雇佣与本地销售成本。" },
      { label: "人才与同伴", strength: "强", provides: "高密度创始人、企业团队、活动与合作机会。", access: "通过长期驻场、主题社区和主动约见形成关系。", boundary: "被动使用办公空间，很难获得高质量网络回报。" },
      { label: "科研转化", strength: "中", provides: "部分深科技、AI、量子与学校合作项目。", access: "寻找对应学校或技术伙伴运营的专项项目。", boundary: "它不是统一的大学技术转移机构，知识产权需另行确认。" },
    ],
    portfolio: [
      { name: "STATION F 自营项目", stage: "早期 / 特定人群", mechanism: "由园区直接设计和运营，围绕创业阶段或创始人群体提供支持。", fit: "希望获得综合园区资源、且符合当期自营项目资格的团队。" },
      { name: "企业与行业伙伴项目", stage: "MVP 至增长期", mechanism: "由企业、学校或行业组织围绕特定领域运营。", fit: "需要产业客户、监管认知或垂直渠道的团队。" },
      { name: "Launch 在线课程", stage: "想法 / 创业入门", mechanism: "在线课程、模板、社区和工具权益。", fit: "尚未准备驻场、需要先建立创业基础的新手。" },
    ],
    ecosystem: [
      { actor: "企业伙伴", role: "运营专项项目、提供专家和潜在业务场景。", founderUse: "验证其是否有实际试点、采购或行业决策者参与。" },
      { actor: "投资人与基金", role: "参与活动、项目评审和后续融资网络。", founderUse: "先形成具体融资目标，再通过项目和校友获取介绍。" },
      { actor: "公共与行政服务", role: "帮助国际团队理解法国落地、签证和公司事务。", founderUse: "在申请前确认支持边界，不要把行政支持等同于代办保证。" },
      { actor: "创业公司社区", role: "提供同伴经验、人才、供应商和合作关系。", founderUse: "用固定活动和互助输出建立长期可信关系。" },
    ],
    scenarios: [
      { need: "进入法国企业市场", route: "选择与你行业一致的企业伙伴项目", firstMove: "列出目标法国客户，再反查项目合作方和往届团队。", success: "获得 3–5 次有效客户会面或一个明确试点。" },
      { need: "建立欧洲融资网络", route: "进入融资准备强、校友活跃的具体项目", firstMove: "先验证项目负责人和往届团队是否能连接目标基金。", success: "形成与轮次匹配的投资人管道，而不是只参加活动。" },
      { need: "第一次理解创业", route: "先使用 Launch 在线入口", firstMove: "完成问题、用户和商业模式验证，再评估驻场项目。", success: "得到真实用户证据，而不只是完成一份 pitch deck。" },
    ],
    redFlags: ["只能说想进入 STATION F，却说不出具体项目名称。", "把巴黎创业氛围当成目标，却没有法国客户或市场假设。", "期望园区自动提供融资、客户或签证结果。"],
  },

  block71: {
    thesis: "BLOCK71 更像一组跨城市创业节点，而不是一座全球统一运营的园区。它最有价值的场景，是团队已经选择一个亚洲目标市场，需要本地导师、伙伴和落地关系来降低进入成本。",
    dna: [
      { label: "机构原型", value: "跨城市创新网络", note: "通过不同国家节点连接项目、导师和创业社区。" },
      { label: "运营逻辑", value: "本地节点 + 全球平台", note: "资源发生在具体城市，全球网络负责跨节点连接。" },
      { label: "主要服务对象", value: "验证至国际扩张团队", note: "公开项目覆盖 MVP、融资和海外扩张等阶段。" },
      { label: "资本角色", value: "生态连接与项目支持", note: "并非所有节点都以直接投资为核心。" },
      { label: "地理价值", value: "新加坡与亚洲市场", note: "适合用一个具体国家作为区域扩张起点。" },
      { label: "申请单位", value: "节点或专项项目", note: "需要按目标市场寻找当前开放入口。" },
    ],
    resources: [
      { label: "亚洲落地", strength: "核心", provides: "新加坡及多个亚洲市场的本地认知、伙伴和创业节点。", access: "先选择国家，再进入对应节点或市场项目。", boundary: "亚洲不是一个市场；语言、监管和采购逻辑必须逐国验证。" },
      { label: "孵化与加速", strength: "强", provides: "从 MVP 验证、融资准备到国际扩张的阶段化项目。", access: "按公司阶段和当期开放项目申请。", boundary: "不同节点的周期、资源、费用和活跃度存在差异。" },
      { label: "导师网络", strength: "强", provides: "创业者、运营者和领域专家的一对一或小组支持。", access: "带着具体市场问题进入导师交流，而不是索取通用建议。", boundary: "导师经验不等于客户证据，建议仍需通过市场验证。" },
      { label: "企业伙伴", strength: "中", provides: "本地企业、生态伙伴和部分产业项目连接。", access: "选择与行业和目标国家一致的项目。", boundary: "伙伴关系不代表稳定采购渠道。" },
      { label: "资本连接", strength: "中", provides: "早期投资人、项目展示和区域基金网络。", access: "用本地增长或客户证据建立融资关系。", boundary: "跨国故事不能替代单一市场的牵引力。" },
      { label: "大学与人才", strength: "强", provides: "以新加坡大学创新生态为重要基础，并连接不同城市人才。", access: "通过节点项目、活动和合作机构寻找人才。", boundary: "人才招聘仍受签证、薪酬和当地竞争影响。" },
    ],
    portfolio: [
      { name: "Incubation", stage: "想法验证 / MVP", mechanism: "围绕早期公司建设、导师、社区与本地生态的孵化入口。", fit: "需要在新加坡验证产品和建立第一层网络的团队。" },
      { name: "Acceleration Programmes", stage: "MVP / 早期收入", mechanism: "按产业、市场或增长目标组织的阶段化项目。", fit: "已经有产品，需要客户、融资或市场推进的团队。" },
      { name: "Global Nodes", stage: "国际扩张", mechanism: "通过不同城市节点提供当地认知与伙伴关系。", fit: "已经选择具体国家、准备投入本地销售和运营的公司。" },
    ],
    ecosystem: [
      { actor: "大学与研究生态", role: "提供创新网络、人才与技术创业基础。", founderUse: "用于招聘、技术合作和理解本地创业人才供给。" },
      { actor: "本地企业", role: "提供市场场景、行业反馈和潜在合作。", founderUse: "用明确试点目标判断连接是否真正有效。" },
      { actor: "区域导师", role: "解释当地客户、渠道、文化与运营方式。", founderUse: "把建议转化为本地客户访谈和销售实验。" },
      { actor: "跨城市节点", role: "帮助团队从一个市场进入另一个市场。", founderUse: "只有在首个市场获得证据后，再使用跨节点扩张。" },
    ],
    scenarios: [
      { need: "把新加坡作为亚洲总部", route: "申请新加坡孵化或加速项目", firstMove: "验证区域客户、注册、人才和融资需求。", success: "在 90 天内形成首批本地客户与伙伴管道。" },
      { need: "进入印尼、越南或日本", route: "选择对应国家节点", firstMove: "先完成 5 次当地客户访谈并识别监管差异。", success: "得到一个国家的可复制销售假设，而不是泛亚洲计划。" },
      { need: "寻找亚洲投资人", route: "使用节点活动和项目展示", firstMove: "按行业、轮次和支票规模筛选区域基金。", success: "形成与本地牵引力挂钩的融资关系。" },
    ],
    redFlags: ["把‘进入亚洲’当作目标，却没有选择第一个国家。", "只关注全球节点数量，不研究目标节点当前团队和项目。", "期待短期访问替代长期本地销售、招聘和合规投入。"],
  },

  "entrepreneur-first": {
    thesis: "Entrepreneur First 的核心资产不是办公空间或课程，而是经过筛选的高潜力个人与公司形成机制。它服务的是‘创始人已经准备好，但团队和公司还没形成’的特殊阶段。",
    dna: [
      { label: "机构原型", value: "人才型创始人孵化机构", note: "先选择个人，再帮助形成团队和公司。" },
      { label: "运营逻辑", value: "人才筛选 + 配对 + 公司形成", note: "通过共同建设而非简单社交完成联合创始人测试。" },
      { label: "主要服务对象", value: "高潜力个人", note: "技术、研究或行业能力突出，并准备立即全职创业。" },
      { label: "资本角色", value: "早期投资与后续支持", note: "公司形成后进入投资和美国融资路径，条款需当期确认。" },
      { label: "地理价值", value: "伦敦 / 班加罗尔 / 旧金山", note: "通过枢纽城市连接美国科技市场。" },
      { label: "申请单位", value: "个人", note: "即使已有搭档，通常也需要分别展现个人能力。" },
    ],
    resources: [
      { label: "候选人密度", strength: "核心", provides: "经过技能和行为筛选的潜在联合创始人池。", access: "申请个人项目并在共同建设中测试合作。", boundary: "筛选提高起点，不保证价值观和长期关系匹配。" },
      { label: "公司形成", strength: "核心", provides: "从方向探索、配对、原型到早期公司结构的高强度环境。", access: "全职线下参与，并用真实产品与用户任务推进。", boundary: "速度可能放大错误决策，需要明确配对退出标准。" },
      { label: "早期资本", strength: "强", provides: "公司形成后的投资、补助或后续资本支持。", access: "通过进展和团队质量获得投资评估。", boundary: "不是所有参与者或形成的公司都会获得相同资金结果。" },
      { label: "美国市场", strength: "强", provides: "旧金山办公、客户开发、融资材料和投资人展示。", access: "进入后续阶段并明确美国市场验证目标。", boundary: "美国网络不适合所有商业模式，迁移成本真实存在。" },
      { label: "企业客户", strength: "中", provides: "顾问、校友和市场开发支持。", access: "由团队主动完成客户发现与销售。", boundary: "核心产品是公司形成，不是垂直企业采购渠道。" },
      { label: "成熟公司增长", strength: "有限", provides: "部分经验创始人或后续项目。", access: "核对当期专门项目，而非默认进入核心公司形成计划。", boundary: "稳定团队和收入公司通常有更合适的增长资源。" },
    ],
    portfolio: [
      { name: "核心公司形成项目", stage: "个人 / 公司形成前", mechanism: "筛选个人、密集配对、共同建设、形成公司。", fit: "能力强、准备全职创业，但缺搭档或最终方向的人。" },
      { name: "旧金山后续阶段", stage: "团队形成 / 早期产品", mechanism: "美国市场开发、办公、融资准备和 Demo Day。", fit: "已经形成团队，并明确希望建立美国高增长科技公司的创始人。" },
      { name: "活动与经验项目", stage: "探索 / 经验创始人", mechanism: "Hackathon、Build Retreat 或面向资深人才的专项入口。", fit: "希望先接触社区，或已有多年创业与公司早期经验的人。" },
    ],
    ecosystem: [
      { actor: "候选创始人", role: "机构最关键的供给与差异化资产。", founderUse: "通过共同完成产品和用户任务判断，而非只看履历。" },
      { actor: "Talent Investors", role: "评估个人潜力并帮助配对与公司形成。", founderUse: "暴露真实合作问题，获取配对与方向反馈。" },
      { actor: "旧金山合伙人与投资人", role: "连接美国市场、融资和 Demo Day。", founderUse: "在到达前完成清晰的美国客户与融资目标。" },
      { actor: "校友公司", role: "提供公司形成、招聘、融资和市场经验。", founderUse: "重点询问失败匹配与未融资案例，不只看成功故事。" },
    ],
    scenarios: [
      { need: "找到联合创始人", route: "申请核心个人项目", firstMove: "定义能力互补、价值观和不可妥协条件。", success: "通过真实共同建设形成可持续合作，而非快速配对。" },
      { need: "从技术能力找到创业方向", route: "进入公司形成环境", firstMove: "列出可接触的用户与行业问题，快速做需求验证。", success: "形成一个有用户证据、适合团队能力的问题。" },
      { need: "进入美国融资市场", route: "形成公司后进入旧金山阶段", firstMove: "先验证美国客户问题与公司设立路径。", success: "建立客户和投资人的下一步会议，而不只是 Demo Day 曝光。" },
    ],
    redFlags: ["只是想认识优秀的人，却没有立即全职创业的承诺。", "用履历判断搭档，不设计真实压力与冲突测试。", "已经有稳定团队和业务，却重新进入公司形成阶段。"],
  },

  "berkeley-skydeck": {
    thesis: "Berkeley SkyDeck 的独特性来自大学创业平台、专属基金、导师和湾区网络的组合。它不是只有一个加速器，而是针对不同阶段提供 Cohort、伙伴项目和 Pad-13 等多层入口。",
    dna: [
      { label: "机构原型", value: "大学创业平台", note: "由 UC Berkeley 创业、研究商业化和教育使命支撑。" },
      { label: "运营逻辑", value: "大学 + 基金 + 产业网络", note: "公共大学资源与独立投资基金协同。" },
      { label: "主要服务对象", value: "技术与研究驱动团队", note: "UC 相关团队与全球公司均有不同入口。" },
      { label: "资本角色", value: "专属基金投资", note: "Cohort 有明确投资机制，其他项目安排不同。" },
      { label: "地理价值", value: "伯克利与湾区", note: "连接大学人才、研究、企业和硅谷资本。" },
      { label: "申请单位", value: "具体计划", note: "Cohort、IPP、Pad-13 的阶段和资格明显不同。" },
    ],
    resources: [
      { label: "研究商业化", strength: "核心", provides: "将大学研究、科学和技术发现连接到市场。", access: "通过 UC 相关入口或以技术壁垒申请全球 Cohort。", boundary: "进入平台不等于自动获得大学知识产权。" },
      { label: "导师网络", strength: "强", provides: "大量顾问覆盖产品、客户、GTM、团队和融资。", access: "Cohort、伙伴项目和活动按计划匹配。", boundary: "建议价值取决于领域匹配和团队提出的问题质量。" },
      { label: "学生与人才", strength: "强", provides: "学生、MBA、博士后、教职顾问与校友网络。", access: "通过实习、顾问匹配和校内合作机制。", boundary: "招聘竞争、签证和知识产权仍需公司自行处理。" },
      { label: "湾区资本", strength: "强", provides: "SkyDeck Fund、Demo Day 和投资人介绍。", access: "主要通过 Cohort 和融资准备路径。", boundary: "适合接近首轮机构融资的公司，不是普遍融资保证。" },
      { label: "企业客户", strength: "强", provides: "行业伙伴、校友企业与早期采用者介绍。", access: "明确列出目标企业和试点需求后由网络协助。", boundary: "介绍不等于采购，需要独立完成销售和安全评估。" },
      { label: "消费渠道", strength: "有限", provides: "通用产品与市场建议。", access: "通过导师和校友网络。", boundary: "平台更擅长技术、B2B 和研究商业化，不是消费流量渠道。" },
    ],
    portfolio: [
      { name: "SkyDeck Cohort", stage: "技术原型 / MVP / 种子轮前", mechanism: "六个月、基金投资、Key Advisor、BAM、每周活动与 Demo Day。", fit: "技术壁垒强、准备首轮机构融资并能投入湾区项目的团队。" },
      { name: "Innovation Partners Program", stage: "MVP 至不同融资阶段", mechanism: "由政府、大学或企业伙伴推荐，进行三个月定制加速。", fit: "能够通过合作机构进入，并需要美国或国际市场桥梁的团队。" },
      { name: "Pad-13", stage: "想法 / 极早期", mechanism: "面向至少一位创始人与 University of California 相关的早期孵化入口。", fit: "尚未准备 Cohort、但拥有 UC 关联并需要成长路径的团队。" },
    ],
    ecosystem: [
      { actor: "UC Berkeley 研究与人才", role: "提供技术、学生、教职顾问和教育生态。", founderUse: "明确研究权属、人才需求和商业化问题后进入。" },
      { actor: "SkyDeck Fund", role: "为 Cohort 提供早期投资并参与后续轮次。", founderUse: "核对最新投资条款、稀释和下一轮策略。" },
      { actor: "SkyAdvisors", role: "在产品、GTM、客户、团队和融资方面辅导。", founderUse: "按关键里程碑选择少数高相关顾问。" },
      { actor: "行业与校友伙伴", role: "提供企业介绍、早期采用者与湾区关系。", founderUse: "把介绍转化为有明确成功指标的试点。" },
    ],
    scenarios: [
      { need: "商业化一项大学技术", route: "按 UC 关联与阶段选择 Pad-13 或 Cohort", firstMove: "先完成知识产权、用户问题和商业主体梳理。", success: "得到付费场景、许可路径和早期产品证据。" },
      { need: "国际团队进入湾区", route: "申请全球 Cohort 或通过国际伙伴进入 IPP", firstMove: "列出美国客户、人才与融资三个具体目标。", success: "在项目周期内建立美国试点和种子融资管道。" },
      { need: "接近首轮机构融资", route: "申请六个月 Cohort", firstMove: "准备技术壁垒、牵引力、团队和六个月融资里程碑。", success: "达到可被机构投资人验证的产品与市场证据。" },
    ],
    redFlags: ["只因为 Berkeley 品牌申请，却无法说明需要哪一类大学资源。", "忽略知识产权、签证、湾区迁移和投资稀释。", "公司过早或过成熟，却选择了错误的计划入口。"],
  },
};

export const organizationComparison = [
  { dimension: "核心原型", "station-f": "大型多项目园区", block71: "跨城市创新网络", "entrepreneur-first": "人才型公司形成机构", "berkeley-skydeck": "大学创业平台" },
  { dimension: "最佳阶段", "station-f": "MVP 至增长期", block71: "MVP 至国际扩张", "entrepreneur-first": "个人 / 公司形成前", "berkeley-skydeck": "技术原型至种子轮" },
  { dimension: "最强资源", "station-f": "欧洲园区与企业项目", block71: "亚洲落地与节点网络", "entrepreneur-first": "联合创始人和公司形成", "berkeley-skydeck": "研究商业化与湾区资本" },
  { dimension: "主要入口", "station-f": "具体创业计划", block71: "本地节点或项目", "entrepreneur-first": "个人申请", "berkeley-skydeck": "Cohort / IPP / Pad-13" },
  { dimension: "最大成本", "station-f": "巴黎运营与项目筛选", block71: "逐国本地化投入", "entrepreneur-first": "全职迁移与配对风险", "berkeley-skydeck": "湾区周期、股权与 IP" },
];

export function getOrganizationProfile(slug: string) {
  return organizationProfiles[slug];
}
