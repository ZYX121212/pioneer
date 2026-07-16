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
    <div className="knowledge-library" id="source-library">
      <div className="knowledge-library-topline">
        <div>
          <span className="knowledge-library-label">ORIGINAL SOURCES</span>
          <h3>继续查阅原始资料</h3>
        </div>
        <p>Pioneer 指南负责帮助你形成判断；这里保留公开课程和专业资料的原始入口，供你核验观点并继续深入。</p>
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
        <p><strong>观点与来源分开。</strong> Pioneer 的判断会明确标记，原作者的内容保留名称、出处和适用范围；涉及公司、股权与融资时，请在行动前咨询当地专业人士。</p>
      </div>
    </div>
  );
}
