"use client";

import { useMemo, useState } from "react";
import { knowledgeItems, knowledgeStages, type KnowledgeStage } from "../data/knowledge";
import { KnowledgeCard } from "./KnowledgeCard";

export function KnowledgeExplorer() {
  const [activeStage, setActiveStage] = useState<"all" | KnowledgeStage>("all");
  const visible = useMemo(
    () => knowledgeItems.filter((item) => activeStage === "all" || item.stage === activeStage),
    [activeStage],
  );

  return (
    <div className="knowledge-library" id="knowledge-library">
      <div className="knowledge-library-topline">
        <div>
          <span className="knowledge-library-label">CURATED KNOWLEDGE</span>
          <h3>从可信的一手来源开始</h3>
        </div>
        <p>中文导读正在逐步补充。涉及公司、股权与融资的内容，请先确认适用地区，并在实际决策前咨询当地专业人士。</p>
      </div>

      <div className="knowledge-filter-row" aria-label="创业知识阶段筛选">
        <div className="knowledge-filter-buttons">
          {knowledgeStages.map((stage) => (
            <button
              type="button"
              key={stage.key}
              className={activeStage === stage.key ? "active" : ""}
              onClick={() => setActiveStage(stage.key)}
            >
              {stage.label}
            </button>
          ))}
        </div>
        <span aria-live="polite">{visible.length} 份精选内容</span>
      </div>

      <div className="knowledge-grid">
        {visible.map((item) => <KnowledgeCard item={item} key={item.id} />)}
      </div>

      <div className="knowledge-trust-note">
        <span>HOW WE CURATE</span>
        <p><strong>保留原始语境。</strong> Pioneer 提供中文导读、阶段标签和适用范围，不替代原作者，也不把单一地区经验包装成全球答案。</p>
      </div>
    </div>
  );
}
