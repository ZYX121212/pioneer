"use client";

import { useEffect, useState } from "react";
import { type PioneerGuide } from "../data/knowledge";
import { readCompletions, toggleCompletion } from "../lib/founderArchive";

export function GuideProgress({ guide, judgment, mistakes, action }: {
  guide: PioneerGuide;
  judgment: string;
  mistakes: string[];
  action: string;
}) {
  const [done, setDone] = useState(false);
  useEffect(() => setDone(readCompletions().includes(guide.slug)), [guide.slug]);

  return (
    <section className="guide-fast-track" id="quick-path">
      <div className="fast-track-heading"><span>3-MINUTE PATH</span><h2>先用三分钟，决定这篇是否值得深入。</h2></div>
      <div className="fast-track-grid">
        <article><span>核心判断</span><p>{judgment}</p></article>
        <article><span>最常见的误判</span><ul>{mistakes.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article><span>今天完成</span><p>{action}</p></article>
      </div>
      <div className="fast-track-actions">
        <a href="#deep-guide">进入深度指南 ↓</a>
        <button type="button" className={done ? "done" : ""} onClick={() => setDone(toggleCompletion(guide.slug).includes(guide.slug))}>
          {done ? "已完成这次决策 ✓" : "标记为已完成"}
        </button>
      </div>
    </section>
  );
}
