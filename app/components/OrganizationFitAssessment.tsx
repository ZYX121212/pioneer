"use client";

import { useMemo, useState } from "react";

type Question = { question: string; passSignal: string };

export function OrganizationFitAssessment({ questions }: { questions: Question[] }) {
  const [checked, setChecked] = useState<boolean[]>(() => questions.map(() => false));
  const score = useMemo(() => checked.filter(Boolean).length, [checked]);
  const verdict = score >= 4
    ? "匹配度较高：可以进入申请准备"
    : score >= 2
      ? "部分匹配：先核实未通过的问题"
      : "匹配度较低：优先比较替代路径";

  return (
    <div className="organization-fit-assessment">
      <div className="organization-fit-score" aria-live="polite">
        <span>当前自测</span>
        <strong>{score}<small> / {questions.length}</small></strong>
        <p>{verdict}</p>
      </div>
      <div className="organization-fit-questions">
        {questions.map((item, index) => (
          <label key={item.question} className={checked[index] ? "is-checked" : ""}>
            <input
              type="checkbox"
              checked={checked[index]}
              onChange={() => setChecked((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))}
            />
            <span>{index + 1}</span>
            <div><strong>{item.question}</strong><p>通过标准：{item.passSignal}</p></div>
          </label>
        ))}
      </div>
      <p className="organization-fit-disclaimer">这是决策辅助，不是录取概率预测。未勾选的问题比总分更值得处理。</p>
    </div>
  );
}
