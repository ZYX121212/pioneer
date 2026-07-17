"use client";

import { useMemo, useState } from "react";
import { saveArchiveEntry } from "../lib/founderArchive";

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

function SaveResultButton({ guide, type, title, summary, content }: { guide: string; type: string; title: string; summary: string; content: string }) {
  const [saved, setSaved] = useState(false);
  function save() {
    saveArchiveEntry({ guide, type, title, summary, content });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }
  return <button type="button" className="save-result" onClick={save}>{saved ? "已保存到本地档案 ✓" : "保存到证据档案"}</button>;
}

function WorkbookFeedback({ hints }: { hints: string[] }) {
  if (!hints.length) return null;
  return (
    <div className="workbook-feedback">
      <span>防错提示</span>
      <ul>{hints.map((hint) => <li key={hint}>{hint}</li>)}</ul>
    </div>
  );
}

function hasConcreteSignal(text: string) {
  return /\d|上周|昨天|今天|过去|最近|每周|每月|小时|分钟|元|美元|付费|介绍|试用|预约|数据/.test(text);
}

function tooManyTargets(text: string) {
  return /、|和|以及|全部|所有|任何|企业和个人|学生和上班族/.test(text);
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
  const hints = [
    values.person && tooManyTargets(values.person) ? "目标人群可能太宽。试着只写一种角色和一种近期行为。" : "",
    values.barrier && /平台|系统|工具|App|软件|AI|自动化/i.test(values.barrier) ? "这里像是在描述解决方案。先写用户遇到的阻力，不写产品形态。" : "",
    values.cost && !hasConcreteSignal(values.cost) ? "成本还不够可观察。加入时间、金钱、次数、风险或机会损失。" : "",
    hypothesis.signal && /喜欢|满意|感兴趣|愿意/.test(hypothesis.signal) ? "成功信号偏态度。尽量改成真实行为，例如预约、付费、复用或介绍。" : "",
  ].filter(Boolean);

  return (
    <section className="interactive-workbook" id="problem-workbook">
      <div className="workbook-heading">
        <div><span>PIONEER TOOL 01</span><h3>问题陈述生成器</h3></div>
        <p>逐项填写，不需要出现产品名称。只有主动保存时才会写入这台设备，不会上传。</p>
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
        <WorkbookFeedback hints={hints} />
        <div className="workbook-actions"><CopyButton text={statement} label="复制问题陈述" /><SaveResultButton guide="find-the-real-problem" type="问题陈述" title="我的问题陈述" summary={statement} content={hypothesisText} /></div>
      </div>
      <div className="workbook-subsection">
        <span>把问题变成一个可证伪的实验</span>
        <div className="workbook-fields compact">
          <label><span>验证方式</span><textarea rows={2} value={hypothesis.method} placeholder="你准备如何接触真实行为？" onChange={(event) => setHypothesis((current) => ({ ...current, method: event.target.value }))} /></label>
          <label><span>记录信号</span><textarea rows={2} value={hypothesis.signal} placeholder="你将记录哪些事实，而不是态度？" onChange={(event) => setHypothesis((current) => ({ ...current, signal: event.target.value }))} /></label>
          <label><span>预先门槛</span><textarea rows={2} value={hypothesis.threshold} placeholder="什么结果会让你继续、调整或停止？" onChange={(event) => setHypothesis((current) => ({ ...current, threshold: event.target.value }))} /></label>
        </div>
        <div className="workbook-actions"><CopyButton text={hypothesisText} label="复制完整假设卡" /><SaveResultButton guide="find-the-real-problem" type="假设卡" title="问题验证假设" summary={hypothesis.method || "尚未选择验证方式"} content={hypothesisText} /></div>
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
  const hints = [
    notes.recentEvent && !hasConcreteSignal(notes.recentEvent) ? "最近经历还不够具体。补上发生时间、触发事件和结果。" : "",
    !notes.workaround && (notes.hardestPart || notes.cost) ? "还缺现有替代方案。问清对方现在怎么解决。" : "",
    notes.commitment && /喜欢|不错|可以|感兴趣/.test(notes.commitment) ? "下一步承诺偏口头。尽量记录介绍、资料、试用、预约或付费。" : "",
    !notes.counterEvidence && Object.values(notes).filter(Boolean).length >= 3 ? "还没有反向证据。至少记录一条说明问题不严重或不适合的内容。" : "",
  ].filter(Boolean);

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
        <WorkbookFeedback hints={hints} />
        <div className="workbook-actions"><CopyButton text={exportText} label="复制本次访谈记录" /><SaveResultButton guide="first-user-interview" type="访谈记录" title={setup.target || "一次用户访谈"} summary={notes.recentEvent || setup.learning || "尚未填写最近事件"} content={exportText} /></div>
      </div>
    </section>
  );
}

const mvpFields = [
  ["user", "唯一目标用户", "这次 MVP 只为哪一类人服务？"],
  ["moment", "关键使用时刻", "在什么具体场景下开始使用？"],
  ["outcome", "唯一完整结果", "用户完成后必须得到什么结果？"],
  ["risk", "最危险的假设", "哪件事一旦不成立，整个方向就不成立？"],
  ["manual", "可以人工完成的部分", "哪些后台步骤暂时不需要自动化？"],
  ["exclude", "明确不做", "哪些诱人功能这次必须排除？"],
  ["signal", "成功信号", "什么真实行为会让你继续投入？"],
] as const;

export function MvpWorkbook() {
  const [values, setValues] = useState<Record<string, string>>({});
  const value = (key: string, fallback: string) => values[key]?.trim() || `［${fallback}］`;
  const output = [
    "Pioneer MVP 边界卡",
    `目标用户：${value("user", "一类具体用户")}`,
    `使用时刻：${value("moment", "一个具体场景")}`,
    `完整结果：${value("outcome", "用户必须得到的结果")}`,
    `最危险假设：${value("risk", "本轮只验证一个假设")}`,
    `人工完成：${value("manual", "暂不自动化的后台工作")}`,
    `明确不做：${value("exclude", "排除的功能")}`,
    `继续门槛：${value("signal", "真实使用或付费信号")}`,
  ].join("\n");
  const hints = [
    values.user && tooManyTargets(values.user) ? "目标用户可能不止一类。MVP 先服务一个最窄人群。" : "",
    values.outcome && /功能|页面|模块|系统|平台/.test(values.outcome) ? "完整结果不等于功能。改写成用户完成后得到的业务或生活结果。" : "",
    values.risk && /需求.*技术|技术.*渠道|定价.*产品/.test(values.risk) ? "一次 MVP 最好只验证一个主要风险，先拆开。" : "",
    values.signal && /喜欢|满意|好用|感兴趣/.test(values.signal) ? "继续门槛偏态度。改成独立使用、复用、付费、转介绍或交付资料。" : "",
  ].filter(Boolean);

  return (
    <section className="interactive-workbook" id="mvp-workbook">
      <div className="workbook-heading"><div><span>PIONEER TOOL 03</span><h3>MVP 边界卡</h3></div><p>用一个完整结果约束第一版，而不是把所有功能都做得简单一点。</p></div>
      <div className="workbook-fields">
        {mvpFields.map(([key, label, placeholder]) => <label key={key}><span>{label}</span><textarea rows={2} value={values[key] || ""} placeholder={placeholder} onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))} /></label>)}
      </div>
      <div className="workbook-output"><span>你的 MVP 边界</span><p>为 {value("user", "目标用户")} 在 {value("moment", "关键时刻")} 交付 {value("outcome", "一个完整结果")}；本轮只验证 {value("risk", "最危险的假设")}。</p><WorkbookFeedback hints={hints} /><div className="workbook-actions"><CopyButton text={output} label="复制 MVP 边界卡" /><SaveResultButton guide="define-your-mvp" type="MVP 边界" title="我的 MVP 边界卡" summary={values.outcome || "尚未填写完整结果"} content={output} /></div></div>
    </section>
  );
}

const firstUserFields = [
  ["segment", "足够窄的人群", "例如：过去 30 天处理过临时换班的独立餐厅店长"],
  ["place", "他们在哪里出现", "社群、名录、线下地点、现有关系或工作现场"],
  ["reason", "为什么现在愿意行动", "最近发生了什么，让问题优先级上升？"],
  ["offer", "第一次提供什么", "不是功能列表，而是一个可以亲自交付的结果"],
  ["ask", "希望对方承担什么", "20 分钟交流、提供资料、试用、付押金或付费"],
  ["threshold", "七天推进门槛", "联系多少人、获得多少回复、多少次真实体验？"],
] as const;

export function FirstUsersWorkbook() {
  const [values, setValues] = useState<Record<string, string>>({});
  const output = ["Pioneer 首批用户行动卡", ...firstUserFields.map(([key, label]) => `${label}：${values[key] || "［未填写］"}`)].join("\n");
  const hints = [
    values.segment && tooManyTargets(values.segment) ? "第一批用户仍然偏宽。加入角色、近期行为和触发时机。" : "",
    values.place && /社交媒体|朋友圈|小红书|公众号|广告/.test(values.place) ? "渠道还偏泛。先写出能找到具体名字的地点、社群、名录或介绍路径。" : "",
    values.ask && !/分钟|资料|试用|押金|付费|预约|介绍/.test(values.ask) ? "请求动作还不够具体。写清希望对方承担哪一种成本。" : "",
    values.threshold && !hasConcreteSignal(values.threshold) ? "七天门槛需要数字，例如联系人数、回复数、体验数或承诺数。" : "",
  ].filter(Boolean);
  return (
    <section className="interactive-workbook" id="first-users-workbook">
      <div className="workbook-heading"><div><span>PIONEER TOOL 04</span><h3>首批用户行动卡</h3></div><p>先建立 30 人名单，再判断渠道。最初十个用户通常来自一对一触达，而不是大规模曝光。</p></div>
      <div className="workbook-fields compact">
        {firstUserFields.map(([key, label, placeholder]) => <label key={key}><span>{label}</span><textarea rows={2} value={values[key] || ""} placeholder={placeholder} onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))} /></label>)}
      </div>
      <div className="workbook-output"><span>七天行动计划</span><p>为 {values.segment || "［目标人群］"} 建立 30 人名单，从 {values.place || "［三个具体渠道］"} 开始逐一触达，并用 {values.threshold || "［回复、体验与承诺］"} 判断是否继续。</p><WorkbookFeedback hints={hints} /><div className="workbook-actions"><CopyButton text={output} label="复制首批用户计划" /><SaveResultButton guide="find-your-first-ten-users" type="首批用户计划" title="我的首批用户行动卡" summary={values.segment || "尚未定义目标人群"} content={output} /></div></div>
    </section>
  );
}
