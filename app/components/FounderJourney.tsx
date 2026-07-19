"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { pioneerGuides } from "../data/knowledge";
import {
  ARCHIVE_EVENT,
  ARCHIVE_KEY,
  type ArchiveEntry,
  type FounderProject,
  type GuideDecision,
  readArchive,
  readCompletions,
  readDecisions,
  readProject,
  saveProject,
} from "../lib/founderArchive";

const situations = [
  { signal: "我只有一个想法", title: "不知道它是不是真需求", guide: "find-the-real-problem", action: "先区分问题与解决方案" },
  { signal: "我准备找人聊聊", title: "但不知道该问什么", guide: "first-user-interview", action: "完成一场不推销的访谈" },
  { signal: "我已经知道问题", title: "但第一版越做越大", guide: "define-your-mvp", action: "从最危险的假设缩小范围" },
  { signal: "产品可以试用了", title: "但没有第一批用户", guide: "find-your-first-ten-users", action: "建立名单并手工触达" },
  { signal: "有人愿意试用", title: "但第一版价格完全凭感觉", guide: "test-your-pricing", action: "测试价值、成本与真实报价" },
  { signal: "开始接触客户", title: "但机会总是停在聊得不错", guide: "close-your-first-sales", action: "建立买方关系和销售阶段" },
  { signal: "我在考虑找搭档", title: "角色、投入和股权说不清", guide: "test-your-cofounder", action: "先完成一次真实共事测试" },
  { signal: "准备签约或收款", title: "但公司主体和所有权还没理清", guide: "set-up-company-and-equity", action: "整理设立、股权与专业咨询问题" },
  { signal: "有人建议我融资", title: "但我不知道是否真的需要", guide: "decide-whether-to-fundraise", action: "从下一里程碑倒推资金需求" },
  { signal: "用户已经开始使用", title: "但我不知道他们会不会持续回来", guide: "measure-retention-and-pmf", action: "定义核心行为并观察同期群留存" },
  { signal: "数字越来越多", title: "但它们没有帮助我做决定", guide: "build-your-startup-metrics", action: "连接用户价值、单位经济与现金跑道" },
  { signal: "团队已经忙不过来", title: "但我不确定是否应该招第一个员工", guide: "hire-your-first-employee", action: "先定义持续瓶颈与角色结果" },
  { signal: "已经决定融资", title: "但故事、名单和材料还很零散", guide: "prepare-your-fundraising-process", action: "建立一次完整且有截止时间的融资过程" },
  { signal: "项目持续投入但信号变弱", title: "我不知道该坚持、调整还是停止", guide: "learn-from-startup-failures", action: "从失败案例建立预警线与止损动作" },
];

export function FounderJourney() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [archive, setArchive] = useState<ArchiveEntry[]>([]);
  const [decisions, setDecisions] = useState<GuideDecision[]>([]);
  const [project, setProject] = useState<FounderProject | null>(null);
  const [draft, setDraft] = useState({ name: "", oneLine: "", targetUser: "", currentRisk: "", nextAction: "" });
  const [projectSaved, setProjectSaved] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setCompleted(readCompletions());
      setArchive(readArchive());
      setDecisions(readDecisions());
      const savedProject = readProject();
      setProject(savedProject);
      if (savedProject) {
        setDraft({
          name: savedProject.name,
          oneLine: savedProject.oneLine,
          targetUser: savedProject.targetUser,
          currentRisk: savedProject.currentRisk,
          nextAction: savedProject.nextAction,
        });
      }
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
  const latestDecision = decisions[0];
  const nextGuide = pioneerGuides.find((guide) => !completed.includes(guide.slug)) || pioneerGuides[pioneerGuides.length - 1];
  const archiveByGuide = pioneerGuides.map((guide) => ({
    guide,
    latest: archive.find((entry) => entry.guide === guide.slug),
    decision: decisions.find((entry) => entry.guide === guide.slug),
  }));

  function submitProject() {
    saveProject(draft);
    setProjectSaved(true);
    window.setTimeout(() => setProjectSaved(false), 1800);
  }

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
          <span>MY PROJECT · 仅保存在本设备</span>
          <strong>{project?.name || "建立你的创业项目档案"}</strong>
          <div aria-label={`学习进度 ${progress}%`}><i style={{ width: `${progress}%` }} /></div>
          <p>{project?.oneLine || `${completed.length} / ${pioneerGuides.length} 个决策任务完成。填写项目后，Pioneer 会把证据、判断和下一步聚合在一起。`}</p>
          <div className="project-snapshot">
            <div><span>目标用户</span><b>{project?.targetUser || "尚未定义"}</b></div>
            <div><span>当前风险</span><b>{project?.currentRisk || "尚未选择"}</b></div>
            <div><span>下一步</span><b>{project?.nextAction || `建议先完成：${nextGuide.title}`}</b></div>
          </div>
        </div>
        <div className="workspace-archive">
          <div className="workspace-archive-heading">
            <div><span>创业项目档案</span><strong>{archive.length ? `${archive.length} 份证据 · ${decisions.length} 个阶段判断` : "先建立项目，再沉淀证据"}</strong></div>
            {archive.length > 0 && <button type="button" onClick={clearArchive}>清空本地档案</button>}
          </div>
          <div className="project-form">
            <label><span>项目名称</span><input value={draft.name} placeholder="例如：餐饮门店临时换班助手" onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} /></label>
            <label><span>一句话方向</span><textarea rows={2} value={draft.oneLine} placeholder="为谁，在什么场景下，交付什么结果？" onChange={(event) => setDraft((current) => ({ ...current, oneLine: event.target.value }))} /></label>
            <label><span>目标用户</span><input value={draft.targetUser} placeholder="尽量写角色、近期行为和触发时机" onChange={(event) => setDraft((current) => ({ ...current, targetUser: event.target.value }))} /></label>
            <label><span>当前最危险假设</span><input value={draft.currentRisk} placeholder="例如：店长愿意为减少临时协调付费" onChange={(event) => setDraft((current) => ({ ...current, currentRisk: event.target.value }))} /></label>
            <label><span>本周下一步</span><input value={draft.nextAction} placeholder={`例如：完成 ${nextGuide.title}`} onChange={(event) => setDraft((current) => ({ ...current, nextAction: event.target.value }))} /></label>
            <button type="button" onClick={submitProject}>{projectSaved ? "项目档案已保存 ✓" : "保存项目档案"}</button>
          </div>
          <div className="decision-strip">
            <div><span>最近阶段判断</span><strong>{latestDecision ? decisionLabels[latestDecision.decision] : "还没有判断"}</strong><p>{latestDecision?.reason || "每篇指南完成后，选择继续、缩小、调整或停止，并写下理由。"}</p></div>
            <Link href={`/knowledge/${nextGuide.slug}`}>继续下一步：{nextGuide.number}</Link>
          </div>
          {archive.length ? (
            <div className="archive-list">
              {archiveByGuide.map(({ guide, latest, decision }) => (
                <article key={guide.slug}>
                  <span>{guide.number} · {guide.stage}</span>
                  <strong>{latest?.title || guide.title}</strong>
                  <p>{latest?.summary || "还没有保存这一步的证据。"}</p>
                  <small>{decision ? `判断：${decisionLabels[decision.decision]}` : "等待阶段判断"}</small>
                </article>
              ))}
            </div>
          ) : <p className="archive-empty">在指南工作表中选择“保存到证据档案”，你的问题陈述、访谈记录和实验计划会汇总到这个项目里。</p>}
        </div>
      </section>
    </>
  );
}

const decisionLabels: Record<GuideDecision["decision"], string> = {
  continue: "继续推进",
  narrow: "缩小人群",
  change: "调整假设",
  stop: "停止这一方向",
};
