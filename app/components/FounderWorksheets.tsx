"use client";

import { useMemo, useState } from "react";

function CopyButton({ text, label = "复制结果" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return <button type="button" onClick={copy}>{copied ? "已复制 ✓" : label}</button>;
}

const problemFields = [
  ["person", "谁遇到问题", "例如：管理 10–30 名兼职员工的餐饮店经理"],
  ["scene", "问题发生的场景", "例如：员工临时请假，需要在两小时内重新排班"],
  ["job", "他想完成什么", "例如：在不影响营业的情况下补齐班次"],
  ["barrier", "具体阻力", "例如：信息散落在多个群聊和表格中"],
  ["cost", "已经付出的成本", "例如：每周额外协调 3 小时，并出现空岗"],
  ["alternative", "目前的替代方法", "例如：群聊、电话和共享表格"],
  ["gap", "替代方法仍未解决什么", "例如：无法及时确认所有人的可用时间"],
] as const;

export function ProblemWorkbook() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [hypothesis, setHypothesis] = useState({ method: "", signal: "", threshold: "" });

  const statement = useMemo(() => {
    const value = (key: string, fallback: string) => values[key]?.trim() || `［${fallback}］`;
    return `当${value("person", "某类人")}在${value("scene", "具体场景")}想要${value("job", "完成某个任务")}时，会因为${value("barrier", "具体阻力")}而付出${value("cost", "可观察成本")}。他们目前使用${value("alternative", "现有替代方法")}，但仍然无法${value("gap", "解决剩余问题")}。`;
  }, [values]);

  const hypothesisText = `核心假设：${statement}\n验证方式：${hypothesis.method || "［访谈、观察、手工服务或其他实验］"}\n记录信号：${hypothesis.signal || "［频率、成本、替代行为与真实承诺］"}\n判断门槛：${hypothesis.threshold || "［什么结果会让你继续、调整或停止］"}`;

  return (
    <section className="interactive-workbook" id="problem-workbook">
      <div className="workbook-heading">
        <div><span>PIONEER TOOL 01</span><h3>问题陈述生成器</h3></div>
        <p>逐项填写，不需要出现产品名称。内容只保留在当前页面，不会上传或保存。</p>
      </div>
      <div className="workbook-fields">
        {problemFields.map(([key, label, placeholder]) => (
          <label key={key}>
            <span>{label}</span>
            <textarea
              value={values[key] ?? ""}
              placeholder={placeholder}
              rows={2}
              onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))}
            />
          </label>
        ))}
      </div>
      <div className="workbook-output">
        <span>实时问题陈述</span>
        <p>{statement}</p>
        <CopyButton text={statement} label="复制问题陈述" />
      </div>
      <div className="workbook-subsection">
        <span>把问题变成一个可证伪的实验</span>
        <div className="workbook-fields compact">
          <label><span>验证方式</span><textarea rows={2} value={hypothesis.method} placeholder="你准备如何接触真实行为？" onChange={(event) => setHypothesis((current) => ({ ...current, method: event.target.value }))} /></label>
          <label><span>记录信号</span><textarea rows={2} value={hypothesis.signal} placeholder="你将记录哪些事实，而不是态度？" onChange={(event) => setHypothesis((current) => ({ ...current, signal: event.target.value }))} /></label>
          <label><span>预先门槛</span><textarea rows={2} value={hypothesis.threshold} placeholder="什么结果会让你继续、调整或停止？" onChange={(event) => setHypothesis((current) => ({ ...current, threshold: event.target.value }))} /></label>
        </div>
        <CopyButton text={hypothesisText} label="复制完整假设卡" />
      </div>
    </section>
  );
}

const noteFields = [
  ["recentEvent", "最近一次具体经历", "发生在什么时候？当时的触发、过程和结果是什么？"],
  ["hardestPart", "最困难的部分", "对方认为最麻烦的环节是什么？为什么？"],
  ["workaround", "现在如何解决", "使用了什么工具、人工流程或替代方法？"],
  ["cost", "已经付出的成本", "时间、金钱、机会、风险或情绪成本是什么？"],
  ["people", "角色与决策关系", "谁使用、谁受影响、谁决定、谁付钱？"],
  ["commitment", "下一步承诺", "对方是否愿意介绍他人、提供资料、试用或继续交流？"],
  ["counterEvidence", "反向证据", "哪些内容说明问题没有想象中严重？"],
] as const;

export function InterviewWorkbook() {
  const [setup, setSetup] = useState({ target: "", learning: "", recruitment: "" });
  const [notes, setNotes] = useState<Record<string, string>>({});

  const exportText = [
    "Pioneer 用户访谈记录",
    `目标受访者：${setup.target || "［未填写］"}`,
    `本次要学习：${setup.learning || "［未填写］"}`,
    `招募方式：${setup.recruitment || "［未填写］"}`,
    "",
    ...noteFields.map(([key, label]) => `${label}：${notes[key] || "［未填写］"}`),
  ].join("\n");

  return (
    <section className="interactive-workbook interview-workbook" id="interview-workbook">
      <div className="workbook-heading">
        <div><span>PIONEER TOOL 02</span><h3>单次访谈记录表</h3></div>
        <p>一次访谈只记录一个人的真实经历。不要把多位受访者的回答合并在同一张表里。</p>
      </div>
      <div className="workbook-fields compact interview-setup">
        <label><span>目标受访者</span><textarea rows={2} value={setup.target} placeholder="为什么这个人符合筛选条件？" onChange={(event) => setSetup((current) => ({ ...current, target: event.target.value }))} /></label>
        <label><span>本次要学习</span><textarea rows={2} value={setup.learning} placeholder="今天只减少哪一个不确定性？" onChange={(event) => setSetup((current) => ({ ...current, learning: event.target.value }))} /></label>
        <label><span>招募方式</span><textarea rows={2} value={setup.recruitment} placeholder="从哪里找到、如何发出邀请？" onChange={(event) => setSetup((current) => ({ ...current, recruitment: event.target.value }))} /></label>
      </div>
      <div className="workbook-fields interview-notes">
        {noteFields.map(([key, label, placeholder]) => (
          <label key={key}>
            <span>{label}</span>
            <textarea rows={3} value={notes[key] ?? ""} placeholder={placeholder} onChange={(event) => setNotes((current) => ({ ...current, [key]: event.target.value }))} />
          </label>
        ))}
      </div>
      <div className="workbook-output">
        <span>访谈结束前自检</span>
        <p>我是否获得了一个近期事件、一个现有替代、一个真实成本和至少一条反向证据？如果没有，先追问，不要急着总结。</p>
        <CopyButton text={exportText} label="复制本次访谈记录" />
      </div>
    </section>
  );
}
