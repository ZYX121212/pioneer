"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { pioneerGuides } from "../data/knowledge";
import { ARCHIVE_EVENT, ARCHIVE_KEY, type ArchiveEntry, readArchive, readCompletions } from "../lib/founderArchive";

const situations = [
  { signal: "我只有一个想法", title: "不知道它是不是真需求", guide: "find-the-real-problem", action: "先区分问题与解决方案" },
  { signal: "我准备找人聊聊", title: "但不知道该问什么", guide: "first-user-interview", action: "完成一场不推销的访谈" },
  { signal: "我已经知道问题", title: "但第一版越做越大", guide: "define-your-mvp", action: "从最危险的假设缩小范围" },
  { signal: "产品可以试用了", title: "但没有第一批用户", guide: "find-your-first-ten-users", action: "建立名单并手工触达" },
  { signal: "我在考虑找搭档", title: "角色、投入和股权说不清", guide: "", action: "联合创始人指南正在规划" },
  { signal: "有人建议我融资", title: "但我不知道是否真的需要", guide: "", action: "融资判断指南正在规划" },
];

export function FounderJourney() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [archive, setArchive] = useState<ArchiveEntry[]>([]);

  useEffect(() => {
    const refresh = () => {
      setCompleted(readCompletions());
      setArchive(readArchive());
    };
    refresh();
    window.addEventListener(ARCHIVE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(ARCHIVE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const progress = useMemo(() => Math.round((completed.length / pioneerGuides.length) * 100), [completed]);

  function clearArchive() {
    if (!window.confirm("确定清空这台设备上保存的创业证据吗？")) return;
    window.localStorage.removeItem(ARCHIVE_KEY);
    window.dispatchEvent(new Event(ARCHIVE_EVENT));
  }

  return (
    <>
      <section className="founder-diagnostic" aria-labelledby="diagnostic-title">
        <div className="diagnostic-heading">
          <div><span>START FROM YOUR BLOCKER</span><h2 id="diagnostic-title">你现在，最接近哪一种处境？</h2></div>
          <p>不需要从头学习。选择一个真实困境，Pioneer 会把你带到对应判断、工具和完成标准。</p>
        </div>
        <div className="diagnostic-grid">
          {situations.map((item, index) => item.guide ? (
            <Link href={`/knowledge/${item.guide}`} className="diagnostic-card active" key={item.title}>
              <span>{String(index + 1).padStart(2, "0")} · {item.signal}</span>
              <strong>{item.title}</strong>
              <p>{item.action}</p>
              <b>{completed.includes(item.guide) ? "已完成 ✓" : "开始判断 →"}</b>
            </Link>
          ) : (
            <div className="diagnostic-card planned" key={item.title}>
              <span>{String(index + 1).padStart(2, "0")} · {item.signal}</span>
              <strong>{item.title}</strong>
              <p>{item.action}</p><b>规划中</b>
            </div>
          ))}
        </div>
      </section>

      <section className="founder-workspace" id="my-founder-workspace">
        <div className="workspace-progress">
          <span>MY FOUNDER PATH · 仅保存在本设备</span>
          <strong>{completed.length} / {pioneerGuides.length} 个决策任务完成</strong>
          <div aria-label={`学习进度 ${progress}%`}><i style={{ width: `${progress}%` }} /></div>
          <p>完成状态和工作表不会上传。更换设备或清理浏览器数据后将无法恢复。</p>
        </div>
        <div className="workspace-archive">
          <div className="workspace-archive-heading">
            <div><span>创业证据档案</span><strong>{archive.length ? `${archive.length} 份已保存结果` : "还没有保存结果"}</strong></div>
            {archive.length > 0 && <button type="button" onClick={clearArchive}>清空本地档案</button>}
          </div>
          {archive.length ? (
            <div className="archive-list">
              {archive.slice(0, 4).map((entry) => (
                <article key={entry.id}><span>{entry.type} · {new Date(entry.savedAt).toLocaleDateString("zh-CN")}</span><strong>{entry.title}</strong><p>{entry.summary}</p></article>
              ))}
            </div>
          ) : <p className="archive-empty">在指南工作表中选择“保存到证据档案”，你的问题陈述、访谈记录和实验计划会汇总到这里。</p>}
        </div>
      </section>
    </>
  );
}
