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
  dossier: {
    evidence: Array<{
      label: string;
      value: string;
      interpretation: string;
      verification: "官方公开" | "Pioneer 判断" | "申请前复核";
      sourceLabel: string;
      sourceUrl: string;
    }>;
    cases: Array<{ name: string; signal: string; caveat: string }>;
    selection: {
      applicationUnit: string;
      process: string[];
      signals: string[];
      commitment: string;
      rejectionRisks: string[];
    };
    economics: Array<{ label: string; known: string; implication: string; verification: string }>;
    alternatives: Array<{ need: string; option: string; why: string }>;
    selfCheck: Array<{ question: string; passSignal: string }>;
  };
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
    dossier: {
      evidence: [
        { label: "生态规模", value: "1,000+ 家在园团队 / 30+ 项目", interpretation: "选择空间大，但服务并非统一交付。", verification: "官方公开", sourceLabel: "STATION F 首页", sourceUrl: "https://stationf.co/" },
        { label: "累计覆盖", value: "9,000 家创业公司", interpretation: "证明长期生态广度，不等于每家都接受同等强度辅导。", verification: "官方公开", sourceLabel: "STATION F 首页", sourceUrl: "https://stationf.co/" },
        { label: "资本密度", value: "700+ 投资人 / 基金网络", interpretation: "适合主动建立关系；数字本身不代表融资转化率。", verification: "官方公开", sourceLabel: "STATION F 首页", sourceUrl: "https://stationf.co/" },
        { label: "顶层筛选", value: "Future 40 约为园区前 4%", interpretation: "额外曝光和投资更集中在少数高表现团队。", verification: "官方公开", sourceLabel: "STATION F Startups", sourceUrl: "https://stationf.co/startups" },
      ],
      cases: [
        { name: "Hugging Face", signal: "官方列为在园成长的代表性 AI 公司。", caveat: "可证明园区能承载全球化公司，不能单独证明园区造成其成功。" },
        { name: "Alan", signal: "官方列为法国科技与保险领域代表案例。", caveat: "更适合验证法国生态与融资网络，不代表所有项目都具备同等资源。" },
        { name: "Yuka", signal: "官方披露其全球用户规模，体现消费产品也能在生态中成长。", caveat: "成功案例跨越多年，需再核对其进入项目与当时阶段。" },
      ],
      selection: {
        applicationUnit: "申请的是某一个具体项目，不是 STATION F 整体。",
        process: ["从 30+ 项目中按行业、阶段与运营方筛选", "进入项目自己的申请页面", "按项目要求提交材料与面试", "录取后获得园区与该项目对应权益"],
        signals: ["有清晰产品与团队", "能够说明为什么需要法国或欧洲", "与目标项目的行业资源高度匹配", "进入后 90 天有具体客户或融资目标"],
        commitment: "驻场周期、费用、股权和活动要求由各项目决定，必须逐项确认。",
        rejectionRisks: ["只表达对园区品牌的兴趣", "没有选出具体项目", "法国市场不是实际战略", "把合作企业名单当成确定客户"],
      },
      economics: [
        { label: "项目费用", known: "各项目独立决定是否收费、提供免费空间或要求其他条件。", implication: "无法用一个统一价格判断 STATION F。", verification: "向项目运营方索取当期条款" },
        { label: "股权与投资", known: "园区不是统一基金，部分项目或 Future 40 可能提供投资机会。", implication: "先分清‘进入园区’与‘获得投资’。", verification: "核对具体项目及投资主体" },
        { label: "地理成本", known: "巴黎驻场会产生住宿、签证、雇佣和生活成本。", implication: "只有法国业务目标足够明确，迁移才可能划算。", verification: "按团队人数制作 6 个月预算" },
        { label: "时间成本", known: "项目、活动和高密度社区会占用创始人时间。", implication: "提前设定只参加与客户、融资或招聘目标相关的活动。", verification: "询问往届团队每周实际投入" },
      ],
      alternatives: [
        { need: "只想学习创业基础", option: "Launch 或其他在线创业课程", why: "不需要先承担巴黎驻场成本。" },
        { need: "已有团队，重点是通用融资", option: "YC / Techstars 等单一加速器", why: "投资条款与项目路径通常更统一。" },
        { need: "进入亚洲市场", option: "BLOCK71", why: "其节点网络更贴近具体亚洲国家。" },
      ],
      selfCheck: [
        { question: "我能说出最匹配的一个具体项目吗？", passSignal: "能说出项目名称、运营方与选择理由" },
        { question: "法国是未来 12 个月的真实市场吗？", passSignal: "已有客户名单、访谈或落地假设" },
        { question: "我知道需要园区提供哪三项资源吗？", passSignal: "资源能对应客户、融资或招聘结果" },
        { question: "团队能承担巴黎驻场的总成本吗？", passSignal: "已有时间、现金与签证预算" },
        { question: "即使没有融资，项目仍值得吗？", passSignal: "至少一个非融资里程碑足以覆盖成本" },
      ],
    },
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
    dossier: {
      evidence: [
        { label: "累计孵化", value: "1,600+ 家创业公司", interpretation: "说明网络广度；应继续追问目标节点与行业的有效案例。", verification: "官方公开", sourceLabel: "BLOCK71 Programme", sourceUrl: "https://block71.co/programmes/supercharge/" },
        { label: "网络形态", value: "多个国家和城市节点", interpretation: "价值在本地节点，不能把全球覆盖理解为统一服务。", verification: "官方公开", sourceLabel: "NUS Enterprise", sourceUrl: "https://enterprise.nus.edu.sg/supporting-entrepreneurs/block71-global-incubation/" },
        { label: "服务阶段", value: "Pre-seed 至 Series A", interpretation: "不同阶段需要进入不同项目，成熟度不是统一门槛。", verification: "官方公开", sourceLabel: "BLOCK71 Singapore", sourceUrl: "https://block71.co/singapore/" },
        { label: "当前节奏", value: "按季度或专项计划开放", interpretation: "申请窗口、行业和权益可能快速变化。", verification: "申请前复核", sourceLabel: "BLOCK71 Programmes", sourceUrl: "https://enterprise.nus.edu.sg/supporting-entrepreneurs/block71-global-incubation/block71-programmes/" },
      ],
      cases: [
        { name: "ShopBack", signal: "官方将其列入 BLOCK71 孵化网络代表公司。", caveat: "能证明社区与东南亚创业生态相关，不能归因全部增长。" },
        { name: "Carousell", signal: "官方列为代表性孵化公司，创始人也参与部分导师项目。", caveat: "今天的项目结构可能与其早期阶段不同。" },
        { name: "Coda Payments", signal: "官方列为从网络成长的全球化支付公司。", caveat: "更能说明区域扩张潜力，仍需核对当前项目可复制资源。" },
      ],
      selection: {
        applicationUnit: "申请某个城市节点的通用孵化或专项计划。",
        process: ["先选目标国家和节点", "判断通用轨道或行业专项", "提交公司、牵引力与扩张材料", "短名单面试并核对本地落地承诺"],
        signals: ["已有产品或原型", "能证明一个具体亚洲市场需求", "创始人愿意长期本地投入", "拥有可衡量的 6–12 个月扩张目标"],
        commitment: "不同节点与专项计划可能要求当地注册、驻场、费用或全职参与。",
        rejectionRisks: ["只说进入亚洲而未选国家", "没有本地客户证据", "项目阶段与公司不匹配", "无法承担本地化执行"],
      },
      economics: [
        { label: "项目费用", known: "不同节点和计划并不统一；部分历史项目为 equity-free，但仍可能有孵化费用。", implication: "不能用某一项目条款推断整个 BLOCK71。", verification: "向目标节点确认当期费用" },
        { label: "资金支持", known: "部分专项计划连接投资或政府补助，但不是普遍投资承诺。", implication: "把资本视为附加结果，而非申请的唯一理由。", verification: "区分补助、投资和融资介绍" },
        { label: "本地化成本", known: "注册、驻场、雇佣、合规和销售需要逐国投入。", implication: "一次只验证一个国家。", verification: "制作首个市场 12 个月预算" },
        { label: "网络时间", known: "社区活动与跨节点关系需要创始人主动经营。", implication: "用客户会面和试点数量衡量网络回报。", verification: "向校友询问真实转化" },
      ],
      alternatives: [
        { need: "只进入一个国家", option: "当地垂直加速器或政府项目", why: "单点客户与监管资源可能更深。" },
        { need: "寻找联合创始人", option: "Entrepreneur First", why: "其核心机制是个人筛选与公司形成。" },
        { need: "进入欧洲", option: "STATION F", why: "巴黎与欧洲企业网络更集中。" },
      ],
      selfCheck: [
        { question: "我已经选择第一个亚洲国家了吗？", passSignal: "能解释为什么先进入这个国家" },
        { question: "这个节点有我的目标客户或伙伴吗？", passSignal: "已有至少 10 个目标名单" },
        { question: "产品需要做哪些本地化？", passSignal: "已识别语言、合规、定价与渠道差异" },
        { question: "创始人能否长期在场？", passSignal: "有人负责至少 6 个月本地执行" },
        { question: "没有补助，市场进入仍成立吗？", passSignal: "单位经济与客户需求独立成立" },
      ],
    },
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
    dossier: {
      evidence: [
        { label: "公司组合价值", value: "官方称超过 160 亿美元", interpretation: "证明人才投资模式产生过大型公司，但不代表单个参与者成功概率。", verification: "官方公开", sourceLabel: "EF About", sourceUrl: "https://www.joinef.com/about/" },
        { label: "联合创始人形成", value: "官方称 8 周内约 80% 找到搭档", interpretation: "说明配对速度；质量仍需用真实共同建设判断。", verification: "官方公开", sourceLabel: "EF FAQ", sourceUrl: "https://www.joinef.com/faqs/" },
        { label: "公司投资路径", value: "最高 25 万美元", interpretation: "需要通过投资委员会，且第二部分资金附带地点与公司结构条件。", verification: "官方公开", sourceLabel: "EF FAQ", sourceUrl: "https://www.joinef.com/faqs/" },
        { label: "参与方式", value: "全职、线下", interpretation: "不是兼职课程，而是职业与地点层面的高承诺选择。", verification: "官方公开", sourceLabel: "EF Apply", sourceUrl: "https://apply.joinef.com/" },
      ],
      cases: [
        { name: "Tractable", signal: "EF 官方列出的计算机视觉与保险科技代表公司。", caveat: "证明人才型公司形成能产生深科技公司，不代表每次配对都成功。" },
        { name: "Cleo", signal: "EF 官方列出的金融科技代表公司。", caveat: "后续资本与执行来自长期团队建设，不能只归因于项目。" },
        { name: "Accurx", signal: "官方投资组合中的医疗软件公司。", caveat: "应重点研究创始人形成和早期验证过程，而不只看最终规模。" },
      ],
      selection: {
        applicationUnit: "以个人身份申请；不要求已有想法或联合创始人。",
        process: ["提交个人经历与异常成果", "EF 评估个人潜力与创业承诺", "进入全职线下 FORM 阶段", "形成团队后参加投资委员会", "获投团队进入旧金山 LAUNCH"],
        signals: ["相对同龄人的异常成果", "强建设能力或技术深度", "智识好奇与高增长野心", "愿意现在全职创业", "能够吸引并与高能力者合作"],
        commitment: "核心项目为全职线下；部分路径包含伦敦或班加罗尔后迁往旧金山。",
        rejectionRisks: ["只有创业兴趣，没有立即行动承诺", "履历优秀但缺乏主动建设证据", "目标是小型现金流业务", "无法迁移或投入完整周期"],
      },
      economics: [
        { label: "个人支持", known: "项目初期提供 equity-free Talent Investment，地区金额不同。", implication: "用于支持全职参与，但需考虑税务与实际生活成本。", verification: "核对所在地 FAQ" },
        { label: "首笔投资", known: "官方公开为 12.5 万美元 post-money SAFE，对应 8%。", implication: "在产品和估值证据很早时即产生明确稀释。", verification: "签署前请专业人士复核" },
        { label: "第二笔投资", known: "可选 12.5 万美元 uncapped MFN SAFE，通常关联旧金山迁移与 Delaware C-Corp。", implication: "需要同时评估公司结构、迁移与未来融资。", verification: "以当期当地条款为准" },
        { label: "机会成本", known: "全职公司形成期可能没有形成公司或未通过投资委员会。", implication: "即使未获投，也要判断人才网络与学习是否覆盖职业成本。", verification: "访谈未形成公司或未获投参与者" },
      ],
      alternatives: [
        { need: "已有稳定团队与产品", option: "YC 或其他公司型加速器", why: "不需要重新经历联合创始人形成。" },
        { need: "只想认识潜在搭档", option: "Hackathon、创业社区与定向合作实验", why: "承诺与迁移成本更低。" },
        { need: "进入亚洲市场", option: "BLOCK71", why: "其价值更偏公司落地，而非个人配对。" },
      ],
      selfCheck: [
        { question: "如果明天开始，我愿意全职创业吗？", passSignal: "已处理工作、现金与家庭承诺" },
        { question: "我有可证明的异常成果吗？", passSignal: "能用结果而非头衔说明能力" },
        { question: "我真正缺的是联合创始人吗？", passSignal: "已明确需要的互补能力和价值观" },
        { question: "我愿意为配对设置退出标准吗？", passSignal: "已设计真实任务、冲突与决策测试" },
        { question: "我接受高增长融资路径吗？", passSignal: "理解稀释、迁移和机构资本要求" },
      ],
    },
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
    dossier: {
      evidence: [
        { label: "校友融资", value: "官方披露累计 27 亿美元以上", interpretation: "说明后续资本连接能力，但统计覆盖多批次与不同项目。", verification: "官方公开", sourceLabel: "SkyDeck 首页", sourceUrl: "https://skydeck.berkeley.edu/" },
        { label: "Cohort 规模", value: "约 20 家 / 每 6 个月", interpretation: "比总体社区更能反映高强度加速器资源密度。", verification: "官方公开", sourceLabel: "SkyDeck Program", sourceUrl: "https://skydeck.berkeley.edu/program/" },
        { label: "项目结果", value: "官方披露多轮融资与并购案例", interpretation: "适合验证首轮机构融资能力，不能作为录取后保证。", verification: "官方公开", sourceLabel: "SkyDeck 首页", sourceUrl: "https://skydeck.berkeley.edu/" },
        { label: "全球团队", value: "历史上约 2/3 来自美国以外", interpretation: "国际团队是核心服务对象之一，但迁移与签证成本仍真实存在。", verification: "官方公开", sourceLabel: "SkyDeck Program", sourceUrl: "https://skydeck.berkeley.edu/program/" },
      ],
      cases: [
        { name: "Krisp", signal: "官方案例称 SkyDeck 帮助其招聘、GTM 与种子融资。", caveat: "可作为网络使用方式的具体案例，不代表每个团队都获得相同介绍。" },
        { name: "Prophecy", signal: "官方案例强调投资网络、Berkeley 校友早期客户和后续融资。", caveat: "最适合已有企业产品、能把介绍转成交易的团队参考。" },
        { name: "ThinkCyte", signal: "官方案例强调大学机械工程研究资源和后续融资。", caveat: "体现深科技匹配；非研究型公司未必能复制。" },
      ],
      selection: {
        applicationUnit: "按 Cohort、IPP 或 Pad-13 等具体计划申请。",
        process: ["先判断计划和资格", "提交团队、产品、技术与市场材料", "进入多轮筛选或面试", "Cohort 录取后另有基金投资审查", "按项目周期参加活动与 Demo Day"],
        signals: ["技术或研究有明确壁垒", "六个月内能形成显著收入或产品里程碑", "接近首轮机构融资", "能够明确使用 Berkeley 人才、客户或资本", "国际团队有美国市场计划"],
        commitment: "Cohort 包含每周必需活动、顾问机制和湾区参与；其他计划要求不同。",
        rejectionRisks: ["公司阶段与计划不匹配", "只借 Berkeley 品牌", "技术强但没有商业化问题", "无法说明六个月融资或产品里程碑"],
      },
      economics: [
        { label: "Cohort 投资", known: "官方当前页面披露约 21 万美元换取 7.5%，页面间数字可能存在更新差异。", implication: "适合确实准备机构融资的公司。", verification: "以录取时正式文件为准" },
        { label: "项目费用", known: "官方 Program 页面披露 Cohort 项目费 7,500 美元。", implication: "应与投资稀释、湾区成本合并计算。", verification: "确认当期是否仍适用" },
        { label: "Pad-13", known: "官方披露 500 美元或向 UC Berkeley 配置 1% 股权的选择。", implication: "极早期团队需比较现金与长期稀释。", verification: "签署前核对选择条件" },
        { label: "湾区成本", known: "线下参与涉及签证、住宿、公司设立与团队迁移。", implication: "只有客户、人才和融资目标具体时才值得。", verification: "制作完整六个月预算" },
      ],
      alternatives: [
        { need: "通用高增长融资", option: "YC", why: "网络更通用，大学关联不是核心。" },
        { need: "公司形成前寻找搭档", option: "Entrepreneur First", why: "EF 直接服务个人与联合创始人形成。" },
        { need: "只做大学技术孵化", option: "所在大学技术转移办公室或本地实验室孵化器", why: "知识产权和研究资源可能更直接。" },
      ],
      selfCheck: [
        { question: "我申请的是正确计划吗？", passSignal: "能解释 Cohort、IPP 与 Pad-13 的差异" },
        { question: "六个月内能完成什么关键里程碑？", passSignal: "有量化产品、客户或融资目标" },
        { question: "我需要哪些 Berkeley 独特资源？", passSignal: "已列出具体人才、研究、客户或投资人类型" },
        { question: "知识产权关系是否清晰？", passSignal: "创始人、大学与公司的权利已被确认" },
        { question: "投资与湾区总成本可接受吗？", passSignal: "已计算股权、费用、迁移和机会成本" },
      ],
    },
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
