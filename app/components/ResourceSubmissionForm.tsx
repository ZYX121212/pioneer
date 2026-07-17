"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { trackAudienceEvent } from "./AudienceCounter";

type Copy = {
  type: string;
  typeOptions: Array<[string, string]>;
  name: string;
  namePlaceholder: string;
  url: string;
  location: string;
  locationPlaceholder: string;
  deadline: string;
  deadlinePlaceholder: string;
  why: string;
  whyPlaceholder: string;
  relationship: string;
  relationshipOptions: Array<[string, string]>;
  yourName: string;
  email: string;
  privacy: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  shareHeading: string;
  shareBody: string;
  shareButton: string;
  copyButton: string;
  copied: string;
  shareText: (resourceName: string) => string;
  again: string;
  fallbackError: string;
};

const copy: Record<"zh" | "en", Copy> = {
  zh: {
    type: "资源类型", typeOptions: [["program", "开放计划"], ["organization", "创业机构 / 投资方"], ["event", "创业活动"], ["knowledge", "公开知识来源"], ["startup", "代表性创业项目"]],
    name: "资源名称", namePlaceholder: "例如：某个加速器 2026 秋季批次",
    url: "官方网站", location: "地点或覆盖区域（选填）", locationPlaceholder: "例如：上海 / 全球 / 远程",
    deadline: "截止时间或活动日期（选填）", deadlinePlaceholder: "例如：2026 年 8 月 21 日",
    why: "为什么值得创业者关注？", whyPlaceholder: "请用至少 20 个字说明适合谁、能获得什么，以及为什么现在值得看。",
    relationship: "你与这个资源的关系", relationshipOptions: [["official", "我是官方团队成员"], ["participant", "我参加或使用过"], ["community", "我来自相关社区"], ["other", "其他"]],
    yourName: "你的称呼", email: "联系邮箱",
    privacy: "邮箱只用于核验和必要沟通，不会公开。Pioneer 会独立核验信息，不承诺收录。",
    submit: "提交给 Pioneer 审核", submitting: "正在提交…",
    successTitle: "已经收到，感谢你让好资源更容易被发现。",
    successBody: "Pioneer 会先检查官方网站、适用人群与时间信息，再决定是否收录。",
    shareHeading: "现在，把 Pioneer 转给同样需要它的人。",
    shareBody: "下面是你的专属来源链接。通过它进入 Pioneer 的访问，会被单独计入资源方传播数据。",
    shareButton: "分享给社区", copyButton: "复制推荐文案", copied: "已复制",
    shareText: (resourceName) => `我刚刚向 Pioneer 推荐了「${resourceName}」。这里整理了全球创业计划、机构、活动和实用指南，分享给正在找机会的创业者。`,
    again: "继续推荐另一个资源", fallbackError: "提交没有成功，请稍后再试。",
  },
  en: {
    type: "Resource type", typeOptions: [["program", "Program"], ["organization", "Institution / investor"], ["event", "Event"], ["knowledge", "Public knowledge source"], ["startup", "Notable startup"]],
    name: "Resource name", namePlaceholder: "Example: an accelerator's Fall 2026 batch",
    url: "Official website", location: "Location or reach (optional)", locationPlaceholder: "Example: Shanghai / Global / Remote",
    deadline: "Deadline or event date (optional)", deadlinePlaceholder: "Example: August 21, 2026",
    why: "Why should founders pay attention?", whyPlaceholder: "In at least 20 characters, explain who it is for, what it offers and why it matters now.",
    relationship: "Your relationship to this resource", relationshipOptions: [["official", "I am on the official team"], ["participant", "I participated or used it"], ["community", "I am part of a related community"], ["other", "Other"]],
    yourName: "Your name", email: "Contact email",
    privacy: "Your email is only used for verification and necessary follow-up. It will not be published. Inclusion is not guaranteed.",
    submit: "Submit for Pioneer review", submitting: "Submitting…",
    successTitle: "Received. Thank you for helping founders discover a useful resource.",
    successBody: "Pioneer will verify the official source, audience and timing before deciding whether to publish it.",
    shareHeading: "Now help the right founders discover Pioneer.",
    shareBody: "This is your unique referral link. Visits through it are counted as community referrals from your submission.",
    shareButton: "Share with your community", copyButton: "Copy suggested post", copied: "Copied",
    shareText: (resourceName) => `I just recommended “${resourceName}” to Pioneer — a curated directory of global startup programs, institutions, events and practical founder guides.`,
    again: "Recommend another resource", fallbackError: "The submission did not go through. Please try again later.",
  },
};

export function ResourceSubmissionForm({ lang = "zh" }: { lang?: "zh" | "en" }) {
  const text = copy[lang];
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [shareCopy, setShareCopy] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, language: lang, sourcePath: window.location.pathname }),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string; shareToken?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || text.fallbackError);
      const resourceName = String(values.resourceName ?? "Pioneer");
      const referralUrl = result.shareToken
        ? `${window.location.origin}/?ref=${encodeURIComponent(result.shareToken)}`
        : window.location.origin;
      setShareUrl(referralUrl);
      setShareCopy(text.shareText(resourceName));
      form.reset();
      setStatus("success");
      trackAudienceEvent("submission:complete", String(values.resourceType ?? "unknown"));
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : text.fallbackError);
    }
  }

  async function shareReferral() {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Pioneer", text: shareCopy, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(`${shareCopy}\n${shareUrl}`);
        setCopyStatus("copied");
      }
      trackAudienceEvent("submission:share", "native");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage(text.fallbackError);
    }
  }

  async function copyReferral() {
    try {
      await navigator.clipboard.writeText(`${shareCopy}\n${shareUrl}`);
      setCopyStatus("copied");
      trackAudienceEvent("submission:share", "copy");
    } catch {
      setMessage(text.fallbackError);
    }
  }

  if (status === "success") {
    return (
      <section className="submission-success" aria-live="polite">
        <span aria-hidden="true">✓</span>
        <h2>{text.successTitle}</h2>
        <p>{text.successBody}</p>
        <div className="submission-referral-kit">
          <span>SHARE · REFER · GROW</span>
          <h3>{text.shareHeading}</h3>
          <p>{text.shareBody}</p>
          <input value={shareUrl} readOnly aria-label={lang === "en" ? "Unique referral link" : "专属来源链接"} />
          <div>
            <button type="button" onClick={shareReferral}>{text.shareButton} ↗</button>
            <button type="button" className="secondary" onClick={copyReferral}>
              {copyStatus === "copied" ? text.copied : text.copyButton}
            </button>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
              data-audience-event="submission:share"
              data-audience-target="linkedin"
            >LinkedIn</a>
          </div>
        </div>
        <button type="button" className="submission-again" onClick={() => {
          setStatus("idle");
          setCopyStatus("idle");
        }}>{text.again}</button>
      </section>
    );
  }

  return (
    <form className="resource-submission-form" onSubmit={submit}>
      <div className="submission-field wide">
        <label htmlFor="resource-type">{text.type}</label>
        <select id="resource-type" name="resourceType" defaultValue="program" required>
          {text.typeOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select>
      </div>
      <div className="submission-field wide">
        <label htmlFor="resource-name">{text.name}</label>
        <input id="resource-name" name="resourceName" placeholder={text.namePlaceholder} maxLength={120} required />
      </div>
      <div className="submission-field wide">
        <label htmlFor="resource-url">{text.url}</label>
        <input id="resource-url" name="resourceUrl" type="url" placeholder="https://" maxLength={500} required />
      </div>
      <div className="submission-field">
        <label htmlFor="resource-location">{text.location}</label>
        <input id="resource-location" name="location" placeholder={text.locationPlaceholder} maxLength={100} />
      </div>
      <div className="submission-field">
        <label htmlFor="resource-deadline">{text.deadline}</label>
        <input id="resource-deadline" name="deadline" placeholder={text.deadlinePlaceholder} maxLength={100} />
      </div>
      <div className="submission-field wide">
        <label htmlFor="resource-why">{text.why}</label>
        <textarea id="resource-why" name="whyUseful" placeholder={text.whyPlaceholder} minLength={20} maxLength={1200} rows={6} required />
      </div>
      <div className="submission-field wide">
        <label htmlFor="resource-relationship">{text.relationship}</label>
        <select id="resource-relationship" name="relationship" defaultValue="official" required>
          {text.relationshipOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select>
      </div>
      <div className="submission-field">
        <label htmlFor="submitter-name">{text.yourName}</label>
        <input id="submitter-name" name="submitterName" maxLength={100} required />
      </div>
      <div className="submission-field">
        <label htmlFor="submitter-email">{text.email}</label>
        <input id="submitter-email" name="submitterEmail" type="email" maxLength={254} required />
      </div>
      <div className="submission-honeypot" aria-hidden="true">
        <label htmlFor="submission-website">Website</label>
        <input id="submission-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="submission-submit wide">
        <p>{text.privacy}</p>
        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? text.submitting : text.submit} <span aria-hidden="true">→</span>
        </button>
        {status === "error" ? <span role="alert">{message}</span> : null}
      </div>
    </form>
  );
}
