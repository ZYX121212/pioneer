import type { EnglishGuide } from "./knowledgeEnglish";
import { expandedChineseGuides, expandedEnglishGuides } from "./expandedGuides";

export type ChineseAdditionalGuide = Omit<EnglishGuide, "decision"> & {
  decision: { continue: string; adjust: string; stop: string };
};

export const additionalChineseGuides: ChineseAdditionalGuide[] = [
  {
    slug: "test-your-pricing", number: "05", stage: "商业模式", title: "第一版价格应该怎么定？",
    description: "从客户获得的价值、交付成本和购买方式出发，设计一个可以被真实测试的价格。", duration: "约 30 分钟", updated: "2026.07.18",
    outcome: ["一张客户价值地图", "一个价格与套餐假设", "一次真实报价实验"],
    sections: [
      { id: "signal", eyebrow: "WHEN TO PRICE", title: "价格不是产品做完后的最后一步", lead: "当你需要判断谁真正重视结果、客户如何购买以及业务能否持续时，就应该开始测试价格。", points: [
        { title: "免费反馈已经失真", body: "用户愿意试用，不代表愿意改变预算、流程或采购关系。" }, { title: "交付成本开始出现", body: "人工服务、算力、硬件、实施与支持必须进入商业判断。" }, { title: "客户类型差异明显", body: "不同客户获得的价值和购买权限不同，统一低价可能掩盖真正的细分市场。" },
      ]},
      { id: "value", eyebrow: "VALUE BEFORE PRICE", title: "先量化客户得到什么", lead: "价值可能来自增加收入、节省时间、降低风险、减少人员投入或提升体验。不要只问愿意支付多少。", points: [
        { title: "当前成本", body: "记录客户现在为同一结果支付的钱、时间、人力和失败损失。" }, { title: "结果增量", body: "估算产品让哪一个指标发生变化，并注明证据强弱。" }, { title: "价值所有者", body: "使用者、受益者、预算拥有者和签字人可能不是同一个人。" },
      ]},
      { id: "floor", eyebrow: "FLOOR · CEILING · MARKET", title: "同时看成本底线、价值上限和替代方案", lead: "成本决定长期底线，客户价值形成可能的上限，替代方案帮助判断你的定位。", points: [
        { title: "成本底线", body: "计算单位交付、实施、支持、退款、渠道和支付成本。" }, { title: "价值上限", body: "客户必须保留足够收益，价格不能等同于创造的全部价值。" }, { title: "替代参照", body: "比较客户真正会选择的人工、内部开发、竞品或不处理，而不是只复制竞品价目表。" },
      ]},
      { id: "model", eyebrow: "PRICING MODEL", title: "让收费单位接近价值增长方式", lead: "按席位、使用量、项目、结果、订阅或软硬件组合，都在塑造客户行为和你的成本风险。", points: [
        { title: "按席位", body: "易理解，但可能惩罚内部扩散；适合价值随使用人数增加的工具。" }, { title: "按使用量", body: "进入门槛低，但账单不确定；必须控制成本与客户预算焦虑。" }, { title: "分层套餐", body: "用客户复杂度、服务强度或结果范围区分，不要人为堆砌功能。" },
      ]},
      { id: "test", eyebrow: "REAL PRICE TEST", title: "用真实报价替代问卷", lead: "最强信号不是用户说‘可以’，而是愿意签署、预付、进入采购或接受明确的付费试点。", points: [
        { title: "准备三种报价", body: "为相同核心结果设计清晰的范围、价格和承诺差异。" }, { title: "记录异议", body: "区分价格过高、价值不清、权限不足、时机不对和产品风险。" }, { title: "预先定义门槛", body: "例如 10 次合格报价中至少 3 个进入正式商务下一步。" },
      ]},
      { id: "review", eyebrow: "PRICING REVIEW", title: "价格不是永久答案", lead: "每次改变价格、套餐或收费单位，都要观察成交、使用、留存、毛利和支持负担。", points: [
        { title: "不要只看转化", body: "低价提高注册但可能吸引错误客户并制造高支持成本。" }, { title: "保留版本记录", body: "标记每位客户看到的报价和原因，避免把不同实验混在一起。" }, { title: "明确涨价规则", body: "处理老客户、合同周期、通知方式和数据迁移，维护长期信任。" },
      ]},
    ],
    worksheet: ["目标客户与付费时刻", "当前替代方案与完整成本", "客户可量化价值", "成本底线与价值上限", "收费单位与套餐", "报价实验与成功门槛"],
    decision: { continue: "客户能够复述价值，并愿意进入真实付费或采购动作。", adjust: "价值存在，但客户、收费单位、套餐或购买时机需要改变。", stop: "价格只能依靠补贴成立，或客户不愿为结果做任何预算承诺。" },
    sources: [
      { publisher: "Stripe", title: "Cost-based and value-based pricing", use: "用于区分成本底线与客户价值，并建立价格区间。", url: "https://stripe.com/resources/more/cost-based-and-value-based-pricing" },
      { publisher: "Stripe", title: "Strategy of pricing", use: "用于价格结构、市场比较、测试和持续调整。", url: "https://stripe.com/resources/more/strategy-of-pricing" },
    ],
  },
  {
    slug: "close-your-first-sales", number: "06", stage: "早期销售", title: "怎样完成第一批真实销售？",
    description: "由创始人亲自识别买方、推进一次完整销售过程，并把成功与失败变成可重复的销售剧本。", duration: "约 35 分钟", updated: "2026.07.18",
    outcome: ["一张买方关系图", "一条首单销售流程", "一份赢单与丢单记录"],
    sections: [
      { id: "founder-led", eyebrow: "FOUNDER-LED SALES", title: "第一批销售不能过早外包", lead: "早期销售同时验证客户、问题、产品、价格和采购流程。创始人需要直接听到拒绝发生在哪里。", points: [
        { title: "你还没有剧本", body: "销售人员无法规模化一个尚未被创始人跑通的过程。" }, { title: "客户购买的是信任", body: "早期产品不完整，创始人对产品边界和未来承诺最有判断力。" }, { title: "每次拒绝都是产品输入", body: "记录不成交原因，而不是用更多陌生触达掩盖问题。" },
      ]},
      { id: "buyer", eyebrow: "BUYING SYSTEM", title: "找到使用者之外的购买系统", lead: "尤其在 B2B 中，痛点拥有者、使用者、技术审核、预算负责人和最终签字人可能分别存在。", points: [
        { title: "业务负责人", body: "谁对不解决问题的结果负责？" }, { title: "预算与签字", body: "预算来自哪里，谁可以承诺，采购窗口何时打开？" }, { title: "阻止者", body: "安全、法务、IT、财务或实施团队可能拥有否决权。" },
      ]},
      { id: "qualify", eyebrow: "QUALIFY EARLY", title: "尽早排除不会成交的机会", lead: "合格机会同时具备真实问题、明确影响、负责人、时机和可执行下一步。", points: [
        { title: "问题与影响", body: "要求对方描述最近事件、损失和当前处理方式。" }, { title: "优先级与时机", body: "如果未来六个月什么都不做，会发生什么？" }, { title: "下一步承诺", body: "愿意邀请决策者、提供数据、安排试点或讨论合同，才说明机会向前移动。" },
      ]},
      { id: "process", eyebrow: "ONE SALES PATH", title: "定义从第一次交流到成交的阶段", lead: "每个阶段都必须以客户行为结束，而不是以你发出一份材料结束。", points: [
        { title: "发现", body: "确认问题、影响、现有替代和购买角色。" }, { title: "验证", body: "用演示、样本、技术评估或小范围试点证明关键结果。" }, { title: "商务", body: "明确范围、成功标准、价格、数据责任、实施和签字流程。" },
      ]},
      { id: "pilot", eyebrow: "PAID PILOT", title: "试点也必须有决策出口", lead: "没有成功标准、负责人和结束日期的免费试用，往往只是礼貌性拖延。", points: [
        { title: "范围", body: "限定用户、场景、数据、支持与不包含内容。" }, { title: "成功指标", body: "在开始前由双方确认怎样算有效。" }, { title: "转正式条件", body: "约定何时复盘、谁决定以及成功后进入什么合同。" },
      ]},
      { id: "playbook", eyebrow: "LEARN FROM EVERY DEAL", title: "把赢单和丢单写成第一份销售剧本", lead: "记录来源、角色、问题、异议、证明方式、周期、价格和最终原因，直到你能预测下一步。", points: [
        { title: "赢单原因", body: "是什么证据、关系或时机推动了成交？" }, { title: "丢单原因", body: "区分无需求、无权限、无预算、无信任、产品缺口与时机。" }, { title: "何时招聘销售", body: "当创始人已经重复成交、阶段可描述、目标客户稳定且线索超过处理能力时再考虑。" },
      ]},
    ],
    worksheet: ["目标账户与触发事件", "使用者、负责人、预算与签字人", "销售阶段与退出标准", "试点范围和成功指标", "异议与回答证据", "赢单 / 丢单原因"],
    decision: { continue: "相似客户能沿同一流程推进，并产生付费、合同或明确采购动作。", adjust: "问题成立，但买方、证明方式、销售阶段或试点结构需要改变。", stop: "大量合格客户仍不把问题列为优先事项，或成交依赖不可重复的关系与承诺。" },
    sources: [
      { publisher: "Y Combinator", title: "Sales Advice for Technical Founders", use: "用于创始人主导销售、理解客户需求与定向触达。", url: "https://www.ycombinator.com/blog/sales-advice-for-technical-founders" },
      { publisher: "Paul Graham", title: "Do Things That Don’t Scale", use: "用于第一批客户的手工招募、交付与学习。", url: "https://paulgraham.com/ds.html" },
    ],
  },
  {
    slug: "set-up-company-and-equity", number: "08", stage: "公司与股权", title: "什么时候设立公司，股权又该怎样开始？",
    description: "从经营与融资需求判断设立时机，梳理主体、创始人股份、归属、知识产权与持续合规。", duration: "约 40 分钟", updated: "2026.07.18",
    outcome: ["一张设立需求清单", "一份创始人股权问题表", "一次专业咨询准备包"],
    sections: [
      { id: "timing", eyebrow: "WHEN TO FORM", title: "不要为获得仪式感而注册，也不要拖到风险出现", lead: "需要签约、收款、雇佣、承担责任、持有知识产权或融资时，通常应认真评估正式主体。", points: [
        { title: "真实经营", body: "客户合同、付款、雇佣和供应商关系需要明确由谁承担。" }, { title: "资产与责任", body: "产品数据、代码、商标、设备、债务和潜在责任需要归属。" }, { title: "融资与股权", body: "投资、员工期权和多位创始人共同持股通常要求清晰主体与记录。" },
      ]},
      { id: "jurisdiction", eyebrow: "JURISDICTION FIRST", title: "先选经营与融资路径，再选注册地", lead: "主体形式会影响责任、税务、融资能力、文件、维护成本和个人身份。不存在全球通用的最佳公司。", points: [
        { title: "经营所在地", body: "客户、团队、管理和实际业务可能触发当地登记、税务与雇佣义务。" }, { title: "融资预期", body: "不同投资人与工具对主体形式和法域有不同偏好。" }, { title: "创始人情况", body: "国籍、居住地、签证、婚姻财产和既有雇佣关系都可能影响安排。" },
      ]},
      { id: "equity", eyebrow: "FOUNDER EQUITY", title: "股权是长期责任与控制安排", lead: "不要只按最初想法或短期工作量分配。讨论未来角色、全职日期、现金投入、决策权与离开情形。", points: [
        { title: "贡献与责任", body: "写清未来数年的关键职责，而不是只回顾过去。" }, { title: "归属机制", body: "归属让所有权随持续贡献形成；具体期限必须结合所在地与协议。" }, { title: "离开机制", body: "主动离开、被解除、长期无法投入和公司出售时分别如何处理？" },
      ]},
      { id: "records", eyebrow: "CAP TABLE & DOCUMENTS", title: "从第一天维护可解释的所有权记录", lead: "股权承诺、口头期权和未完成签署会在融资、离职或出售时放大。", points: [
        { title: "股权表", body: "记录每位持有人、数量、类别、归属和授予文件。" }, { title: "知识产权", body: "确认创始人、员工和承包商产生的相关成果是否正确归属于公司。" }, { title: "批准与签署", body: "股份、期权、重大合同和董事决定需要相应批准与文件。" },
      ]},
      { id: "after", eyebrow: "AFTER FORMATION", title: "注册完成不是结束", lead: "银行、会计、税务、牌照、隐私、雇佣、保险和年度申报会随业务与所在地变化。", points: [
        { title: "资金分离", body: "建立公司账户和费用记录，不混用个人与公司资金。" }, { title: "持续申报", body: "维护注册地址、年度文件、税务和地方许可。" }, { title: "变化复核", body: "融资、跨境经营、雇佣、产品监管和创始人离开都应触发专业复核。" },
      ]},
      { id: "counsel", eyebrow: "PREPARE FOR ADVICE", title: "把专业咨询用在具体决定上", lead: "本文不能替代法律、税务或会计意见。提前整理事实，能让专业人士更快发现风险。", points: [
        { title: "准备事实", body: "创始人所在地、业务、客户、收入、团队、资产、融资计划和已有承诺。" }, { title: "准备文件", body: "合作约定、代码和 IP 来源、客户合同、付款与任何股权承诺。" }, { title: "要求情景比较", body: "让顾问解释不同方案的责任、税务、成本、可逆性和下一步。" },
      ]},
    ],
    worksheet: ["为什么现在需要主体", "经营地、团队地与目标市场", "融资和股权计划", "创始人角色、投入与离开情形", "IP、合同与已有承诺", "需要律师 / 税务 / 会计回答的问题"],
    decision: { continue: "经营、责任或融资需求明确，且已获得适用法域的专业建议。", adjust: "需要正式安排，但主体、注册地、股权或设立时机仍需比较。", stop: "当前仍是低风险探索且无合同、资产、雇佣或融资需求；先保留记录并设定复核触发点。" },
    sources: [
      { publisher: "U.S. Small Business Administration", title: "Choose a business structure", use: "用于说明主体选择影响责任、税务、融资与日常维护；仅代表美国一般信息。", url: "https://www.sba.gov/business-guide/launch-your-business/choose-business-structure" },
      { publisher: "Stripe Atlas", title: "Equity for founders", use: "用于创始人股份、归属、股权表、IP 转让与美国税务提醒。", url: "https://stripe.com/guides/atlas/equity" },
      { publisher: "Cooley GO", title: "Founder’s Stock, Vesting and Founder Departures", use: "用于理解美国创业公司常见的创始人股份与离开机制。", url: "https://www.cooleygo.com/founder-basics-founders-stock/" },
    ],
  },
  ...expandedChineseGuides,
];

export const additionalEnglishGuides: EnglishGuide[] = [
  {
    slug: "test-your-pricing", number: "05", stage: "Business model", title: "How should you set the first real price?", description: "Use customer value, delivery cost and buying behavior to design a price you can test in a real transaction.", duration: "About 30 minutes", updated: "2026.07.18", outcome: ["A customer-value map", "A pricing and packaging hypothesis", "A real quote experiment"],
    sections: [
      { id: "signal", eyebrow: "WHEN TO PRICE", title: "Pricing is not the last step after product", lead: "Start testing when you need to learn who values the outcome, how they buy and whether delivery can become sustainable.", points: [{ title: "Free feedback is weak", body: "Trial interest does not prove a willingness to move budget or process." }, { title: "Delivery cost is visible", body: "Labor, compute, hardware, implementation and support now belong in the decision." }, { title: "Customer value differs", body: "One low price can hide the segment receiving the most value." }]},
      { id: "value", eyebrow: "VALUE BEFORE PRICE", title: "Quantify what changes for the customer", lead: "Value may mean revenue, time, risk, labor or experience. Identify the user, beneficiary, budget owner and signer.", points: [{ title: "Current cost", body: "Record money, time, people and failure cost in the existing alternative." }, { title: "Outcome delta", body: "Estimate which customer metric changes and label the strength of evidence." }, { title: "Value owner", body: "The user and the person who controls budget may be different." }]},
      { id: "floor", eyebrow: "FLOOR · CEILING · MARKET", title: "Use cost, value and alternatives together", lead: "Cost sets a sustainable floor, customer value creates a possible ceiling and alternatives help locate your position.", points: [{ title: "Cost floor", body: "Include delivery, support, refunds, channels and payment costs." }, { title: "Value ceiling", body: "The customer must retain a meaningful share of the value created." }, { title: "Real alternative", body: "Compare manual work, internal development, competitors and doing nothing." }]},
      { id: "model", eyebrow: "PRICING MODEL", title: "Align the billing unit with how value grows", lead: "Per-seat, usage, project, outcome, subscription and hardware-service models shape behavior and risk.", points: [{ title: "Per seat", body: "Simple, but can penalize internal adoption." }, { title: "Usage", body: "Low entry friction, with cost and budget uncertainty to manage." }, { title: "Tiered", body: "Separate meaningful complexity, service or outcome—not artificial feature gates." }]},
      { id: "test", eyebrow: "REAL PRICE TEST", title: "Use a quote, not a survey", lead: "The strongest signal is a signed, prepaid, procurement or paid-pilot step.", points: [{ title: "Create three offers", body: "Keep the core result clear while changing scope, price and commitment." }, { title: "Classify objections", body: "Separate price, unclear value, missing authority, bad timing and product risk." }, { title: "Set a threshold", body: "Define the minimum number of qualified quotes that must advance." }]},
      { id: "review", eyebrow: "PRICING REVIEW", title: "Treat pricing as a versioned hypothesis", lead: "Track conversion, use, retention, gross margin and support load after each change.", points: [{ title: "Do not optimize conversion alone", body: "A low price can attract the wrong users and create unsustainable support." }, { title: "Keep offer history", body: "Record which customer saw which version and why." }, { title: "Plan price changes", body: "Handle existing customers, contracts and notice with care." }]},
    ], worksheet: ["Target customer and buying moment", "Current alternative and full cost", "Quantified customer value", "Cost floor and value ceiling", "Billing unit and packages", "Quote test and threshold"], decision: { continue: "Customers can restate the value and take a real paid or procurement step.", adjust: "Value exists, but segment, unit, package or buying moment needs changing.", stop: "The price only works through subsidy or no customer makes a budget commitment." },
    sources: [{ publisher: "Stripe", title: "Cost-based and value-based pricing", use: "Cost floors, customer value and a defensible price range.", url: "https://stripe.com/resources/more/cost-based-and-value-based-pricing" }, { publisher: "Stripe", title: "Strategy of pricing", use: "Packaging, market comparison, testing and iteration.", url: "https://stripe.com/resources/more/strategy-of-pricing" }],
  },
  {
    slug: "close-your-first-sales", number: "06", stage: "Early sales", title: "How do you close the first real sales?", description: "Run founder-led sales, map the buying system and turn wins and losses into a repeatable playbook.", duration: "About 35 minutes", updated: "2026.07.18", outcome: ["A buying-system map", "A first-deal sales path", "A win/loss record"],
    sections: [
      { id: "founder-led", eyebrow: "FOUNDER-LED SALES", title: "Do not outsource the first sales motion", lead: "Early sales validates customer, problem, product, price and procurement at the same time.", points: [{ title: "No playbook yet", body: "A salesperson cannot scale a process the founders have not repeated." }, { title: "Customers buy trust", body: "Founders can make the most responsible product and roadmap commitments." }, { title: "Rejection is product input", body: "Record where the deal stopped instead of hiding the problem with more outreach." }]},
      { id: "buyer", eyebrow: "BUYING SYSTEM", title: "Map more than the end user", lead: "Pain owner, user, technical reviewer, budget owner and signer may all be different people.", points: [{ title: "Business owner", body: "Who is accountable if nothing changes?" }, { title: "Budget and signature", body: "Where does money come from and when can it be committed?" }, { title: "Blockers", body: "Security, legal, IT, finance and implementation may have veto power." }]},
      { id: "qualify", eyebrow: "QUALIFY EARLY", title: "Disqualify deals that will not move", lead: "A qualified opportunity combines a real problem, impact, owner, timing and an executable next step.", points: [{ title: "Problem and impact", body: "Reconstruct the latest event, loss and current workaround." }, { title: "Priority and timing", body: "Ask what happens if nothing changes for six months." }, { title: "Next commitment", body: "A decision-maker meeting, data, pilot or contract step moves the deal." }]},
      { id: "process", eyebrow: "ONE SALES PATH", title: "Define stages by customer action", lead: "A stage ends when the customer acts—not when you send a document.", points: [{ title: "Discovery", body: "Confirm problem, impact, alternatives and buying roles." }, { title: "Validation", body: "Use a demo, sample, technical review or bounded pilot." }, { title: "Commercial", body: "Align scope, success, price, data, implementation and signature." }]},
      { id: "pilot", eyebrow: "PAID PILOT", title: "Every pilot needs a decision exit", lead: "A free trial without success criteria, owner and end date is often polite delay.", points: [{ title: "Scope", body: "Limit users, use case, data, support and exclusions." }, { title: "Success", body: "Agree the evidence before the pilot begins." }, { title: "Conversion", body: "Name the review date, decision owner and full-contract path." }]},
      { id: "playbook", eyebrow: "LEARN FROM EVERY DEAL", title: "Write the first sales playbook", lead: "Track source, roles, problem, objections, proof, cycle, price and final reason until the next step becomes predictable.", points: [{ title: "Why won", body: "Which evidence, relationship or timing moved the purchase?" }, { title: "Why lost", body: "Separate need, authority, budget, trust, product and timing." }, { title: "When to hire sales", body: "After founders repeat deals and the motion is describable." }]},
    ], worksheet: ["Target account and trigger", "User, owner, budget and signer", "Stages and exit criteria", "Pilot scope and success", "Objections and evidence", "Win / loss reason"], decision: { continue: "Similar customers advance through the same path to payment or procurement.", adjust: "The problem is real, but the buyer, proof, stage or pilot design needs changing.", stop: "Qualified customers do not prioritize the problem or every deal depends on an unrepeatable promise." },
    sources: [{ publisher: "Y Combinator", title: "Sales Advice for Technical Founders", use: "Founder-led sales, customer needs and targeted outreach.", url: "https://www.ycombinator.com/blog/sales-advice-for-technical-founders" }, { publisher: "Paul Graham", title: "Do Things That Don’t Scale", use: "Manual recruitment, delivery and learning with first customers.", url: "https://paulgraham.com/ds.html" }],
  },
  {
    slug: "set-up-company-and-equity", number: "08", stage: "Company & equity", title: "When should you form a company—and how should founder equity begin?", description: "Use operating and financing needs to choose timing, then prepare entity, founder stock, vesting, IP and compliance decisions.", duration: "About 40 minutes", updated: "2026.07.18", outcome: ["A formation trigger list", "A founder-equity question sheet", "A professional-advice brief"],
    sections: [
      { id: "timing", eyebrow: "WHEN TO FORM", title: "Do not incorporate for ceremony—or wait until risk appears", lead: "Contracts, payments, hiring, liability, IP ownership or fundraising usually trigger a serious formation review.", points: [{ title: "Real operations", body: "Clarify who signs customer, payment, employment and supplier relationships." }, { title: "Assets and liability", body: "Data, code, trademarks, equipment, debt and risk need an owner." }, { title: "Funding and equity", body: "Investment, employee equity and multiple founders require clean records." }]},
      { id: "jurisdiction", eyebrow: "JURISDICTION FIRST", title: "Choose the operating and funding path before the entity", lead: "Structure affects liability, tax, fundraising, paperwork, maintenance and the founders personally. There is no universal best jurisdiction.", points: [{ title: "Where work happens", body: "Customers, team and management can create local registration, tax and employment duties." }, { title: "Funding path", body: "Investors and instruments may prefer specific entities and jurisdictions." }, { title: "Founder facts", body: "Residence, citizenship, visa, marital property and prior employment can matter." }]},
      { id: "equity", eyebrow: "FOUNDER EQUITY", title: "Equity allocates long-term responsibility and control", lead: "Discuss future roles, full-time dates, cash, decisions and departure—not only the original idea.", points: [{ title: "Contribution", body: "Write the critical responsibilities over the coming years." }, { title: "Vesting", body: "Ownership can follow continued contribution; terms must fit local law and agreements." }, { title: "Departure", body: "Plan voluntary exit, termination, reduced commitment and company sale." }]},
      { id: "records", eyebrow: "CAP TABLE & DOCUMENTS", title: "Keep explainable ownership records from day one", lead: "Verbal equity promises and incomplete signatures become expensive during fundraising or departure.", points: [{ title: "Cap table", body: "Record holder, amount, class, vesting and grant documents." }, { title: "Intellectual property", body: "Confirm company ownership of relevant founder, employee and contractor work." }, { title: "Approvals", body: "Equity, options, material contracts and board decisions require documentation." }]},
      { id: "after", eyebrow: "AFTER FORMATION", title: "Registration is the beginning", lead: "Banking, accounting, tax, licenses, privacy, employment, insurance and annual filings evolve with the business.", points: [{ title: "Separate funds", body: "Use company accounts and records rather than mixing personal spending." }, { title: "Ongoing filings", body: "Maintain addresses, annual reports, tax and local permits." }, { title: "Review triggers", body: "Funding, cross-border activity, hiring, regulation and founder exits require review." }]},
      { id: "counsel", eyebrow: "PREPARE FOR ADVICE", title: "Use professional time on concrete decisions", lead: "This guide is not legal, tax or accounting advice. Organized facts help professionals identify risk faster.", points: [{ title: "Facts", body: "Founder locations, business, customers, revenue, team, assets and funding plan." }, { title: "Documents", body: "Agreements, IP origin, contracts, payments and equity promises." }, { title: "Scenarios", body: "Ask for liability, tax, cost, reversibility and next steps under each option." }]},
    ], worksheet: ["Why an entity is needed now", "Operating, team and target markets", "Funding and equity plan", "Founder roles and departure cases", "IP, contracts and promises", "Questions for legal / tax / accounting advisers"], decision: { continue: "Operating, liability or financing triggers are clear and jurisdiction-specific advice is available.", adjust: "Formal structure is needed, but entity, jurisdiction, equity or timing must be compared.", stop: "The project remains low-risk exploration with no contracts, assets, hiring or funding; keep records and define a review trigger." },
    sources: [{ publisher: "U.S. Small Business Administration", title: "Choose a business structure", use: "How entity choice affects liability, tax, fundraising and maintenance; US context only.", url: "https://www.sba.gov/business-guide/launch-your-business/choose-business-structure" }, { publisher: "Stripe Atlas", title: "Equity for founders", use: "Founder stock, vesting, cap tables, IP assignment and US tax prompts.", url: "https://stripe.com/guides/atlas/equity" }, { publisher: "Cooley GO", title: "Founder’s Stock, Vesting and Founder Departures", use: "Common US founder-stock and departure mechanics.", url: "https://www.cooleygo.com/founder-basics-founders-stock/" }],
  },
  ...expandedEnglishGuides,
];

export const getAdditionalChineseGuide = (slug: string) => additionalChineseGuides.find((guide) => guide.slug === slug);
