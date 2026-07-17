"use client";

import { useMemo, useState } from "react";

type RadarCategory = "基础设施" | "模型与 Agent" | "企业应用" | "具身智能" | "创业项目";

type RadarItem = {
  name: string;
  category: RadarCategory;
  signal: string;
  founderQuestion: string;
  officialHighlight?: string;
};

const categories = ["全部", "基础设施", "模型与 Agent", "企业应用", "具身智能", "创业项目"] as const;

const radarItems: RadarItem[] = [
  { name: "华为", category: "基础设施", signal: "观察算力底座、集群交付与开发生态。", founderQuestion: "部署与扩容的真实成本、周期和迁移门槛是什么？", officialHighlight: "Atlas 950 超节点系统" },
  { name: "中科曙光", category: "基础设施", signal: "比较国产智算基础设施与行业交付路径。", founderQuestion: "早期团队能以什么方式获得可用算力与技术支持？" },
  { name: "摩尔线程 / 沐曦", category: "基础设施", signal: "关注 GPU、推理适配与软件栈成熟度。", founderQuestion: "主流模型与框架的适配范围、稳定性和迁移工作量如何？" },
  { name: "中国移动", category: "基础设施", signal: "观察云网算一体化和大型行业入口。", founderQuestion: "创业公司进入运营商生态需要哪些产品、合规和交付条件？" },
  { name: "MiniMax", category: "模型与 Agent", signal: "观察多模态模型如何进入真实产品。", founderQuestion: "模型能力怎样转化为留存、收入或可重复的客户工作流？", officialHighlight: "MiniMax M3 多模态模型" },
  { name: "阶跃星辰", category: "模型与 Agent", signal: "关注 Agent 从能力展示走向系统级交付。", founderQuestion: "权限、工具调用、失败恢复和结果责任由谁承担？", officialHighlight: "Agent 操作系统" },
  { name: "阿里巴巴", category: "模型与 Agent", signal: "比较模型、云和开发者生态的组合能力。", founderQuestion: "中小团队最短的集成路径与长期锁定成本分别是什么？" },
  { name: "百度", category: "模型与 Agent", signal: "观察模型、搜索和行业应用的连接。", founderQuestion: "哪些行业场景已经形成持续采购，而非一次性试点？" },
  { name: "腾讯", category: "模型与 Agent", signal: "关注内容、社交、企业服务与开发工具入口。", founderQuestion: "创业产品可以嵌入哪个既有工作流，而不是另建孤岛？" },
  { name: "商汤科技", category: "模型与 Agent", signal: "比较视觉、多模态与行业落地的产品化程度。", founderQuestion: "从演示到稳定部署还需要哪些数据和工程条件？" },
  { name: "科大讯飞", category: "企业应用", signal: "观察语音、办公、教育和智能终端的规模采用。", founderQuestion: "高频使用来自模型能力，还是渠道、硬件与场景整合？" },
  { name: "蚂蚁集团", category: "企业应用", signal: "关注金融、支付、可信 AI 与服务闭环。", founderQuestion: "进入高监管场景需要怎样的可解释、审计和风控证据？" },
  { name: "京东", category: "企业应用", signal: "观察零售、供应链和物流场景的 AI 交付。", founderQuestion: "哪些环节有清晰的成本基线与可计算 ROI？" },
  { name: "西门子 / 施耐德电气", category: "企业应用", signal: "比较工业 AI 与能源管理的采购逻辑。", founderQuestion: "试点如何接入既有设备、数据和决策流程？" },
  { name: "智元机器人", category: "具身智能", signal: "关注本体、数据闭环与批量交付。", founderQuestion: "连续工作时的可靠性、维护频率和单位经济性如何？" },
  { name: "宇树科技", category: "具身智能", signal: "观察机器人产品化、成本下降与开发生态。", founderQuestion: "客户购买的是本体、解决方案，还是持续服务能力？" },
  { name: "傅利叶智能", category: "具身智能", signal: "关注康复场景与通用人形平台之间的能力迁移。", founderQuestion: "哪类真实客户已经愿意为当前能力付费？" },
  { name: "WAIC Future Tech", category: "创业项目", signal: "近 180 个项目与 80+ 投资机构形成创投观察样本。", founderQuestion: "资本关注的方向背后，有哪些收入、增长或技术证据？" },
  { name: "OPC 独立先锋项目", category: "创业项目", signal: "22 个入选项目展示个人与小团队的 AI 原生路径。", founderQuestion: "哪些能力可以由小团队独立完成，哪些仍依赖平台和渠道？" },
];

export function WaicExhibitorRadar() {
  const [category, setCategory] = useState<(typeof categories)[number]>("全部");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return radarItems.filter((item) => {
      const matchesCategory = category === "全部" || item.category === category;
      const haystack = `${item.name} ${item.category} ${item.signal} ${item.officialHighlight ?? ""}`.toLowerCase();
      return matchesCategory && (!keyword || haystack.includes(keyword));
    });
  }, [category, query]);

  const visibleItems = expanded ? filteredItems : filteredItems.slice(0, 9);

  return (
    <div className="waic-exhibitor-radar">
      <div className="waic-radar-toolbar">
        <label>
          <span>搜索重点展商或方向</span>
          <input value={query} onChange={(event) => { setQuery(event.target.value); setExpanded(false); }} placeholder="例如：Agent、机器人、华为" />
        </label>
        <div className="waic-radar-filters" aria-label="按创业关注方向筛选">
          {categories.map((item) => (
            <button className={category === item ? "is-active" : ""} type="button" onClick={() => { setCategory(item); setExpanded(false); }} key={item}>{item}</button>
          ))}
        </div>
      </div>

      <div className="waic-radar-result-line">
        <span>当前匹配 {filteredItems.length} 个重点观察对象{visibleItems.length < filteredItems.length ? ` · 先显示 ${visibleItems.length} 个` : ""}</span>
        <a href="https://www.worldaic.com.cn/exhibitors" target="_blank" rel="noreferrer">打开官方完整展商目录 ↗</a>
      </div>

      {visibleItems.length ? (
        <>
        <div className="waic-radar-grid">
          {visibleItems.map((item, index) => (
            <article key={item.name}>
              <div><span>{String(index + 1).padStart(2, "0")}</span><small>{item.category}</small></div>
              <h4>{item.name}</h4>
              {item.officialHighlight ? <p className="waic-radar-highlight"><b>官方重点展品</b>{item.officialHighlight}</p> : null}
              <p>{item.signal}</p>
              <p className="waic-radar-question"><b>现场追问</b>{item.founderQuestion}</p>
            </article>
          ))}
        </div>
        {visibleItems.length < filteredItems.length ? <button className="waic-radar-more" type="button" onClick={() => setExpanded(true)}>展开全部 {filteredItems.length} 个观察对象 ↓</button> : null}
        </>
      ) : <p className="waic-radar-empty">没有匹配结果，换一个关键词或选择“全部”。</p>}

      <p className="waic-radar-note">这是 Pioneer 面向创业者整理的重点观察样本，不等于完整参展名单或展位承诺。企业、展品与展位可能临时调整，请以 Hi WAIC 和官方展商目录现场信息为准。</p>
    </div>
  );
}
