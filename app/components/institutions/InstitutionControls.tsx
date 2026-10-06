"use client";
import { useState } from "react";

export function InstitutionShare({ lang }: { lang: "zh" | "en" }) {
  const [message, setMessage] = useState("");
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: document.title, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); setMessage(lang === "en" ? "Link copied" : "链接已复制"); }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setMessage(lang === "en" ? "Copy the address from your browser" : "可复制浏览器中的页面地址");
    }
  }
  return <div className="institution-share"><button type="button" onClick={share}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M8 12 16 6M8 12l8 6"/><circle cx="5" cy="12" r="3"/><circle cx="19" cy="4" r="3"/><circle cx="19" cy="20" r="3"/></svg>{lang === "en" ? "Share" : "分享"}</button><span role="status">{message}</span></div>;
}

export type InstitutionProgram = { title: string; stage: string; detail: string; fit: string; href: string; category: "owned" | "partner" | "online"; image?: string };
export function InstitutionPrograms({ programs, lang }: { programs: InstitutionProgram[]; lang: "zh" | "en" }) {
  const [filter, setFilter] = useState("all"), [stage, setStage] = useState("all");
  const t = (zh: string, en: string) => lang === "en" ? en : zh;
  const rows = programs.filter(p => (filter === "all" || p.category === filter) && (stage === "all" || p.stage === stage));
  return <><div className="institution-filters"><div role="group" aria-label={t("项目分类", "Program category")}>{[["all",t("全部", "All")],["owned",t("机构项目", "Institution programs")],["partner",t("合作项目", "Partner programs")],["online",t("在线学习", "Online learning")]].filter(([id])=>id==="all"||programs.some(p=>p.category===id)).map(([id,label])=><button type="button" key={id} aria-pressed={filter===id} onClick={()=>setFilter(id)}>{label}</button>)}</div><label><span className="sr-only">{t("适合阶段", "Stage")}</span><select aria-label={t("按阶段筛选", "Filter by stage")} value={stage} onChange={e=>setStage(e.target.value)}><option value="all">{t("按阶段", "By stage")}</option>{[...new Set(programs.map(p=>p.stage))].map(s=><option key={s}>{s}</option>)}</select></label></div><div className="institution-program-grid">{rows.map(p=><article className="institution-program-card" key={p.title}><a href={p.href} className={`institution-program-cover institution-program-${p.category}`}>{p.image&&<img src={p.image} alt="" loading="lazy"/>}<span>{p.title}</span></a><div><span className="institution-pill">{p.stage}</span><h3><a href={p.href}>{p.title}</a></h3><p>{p.detail}</p><p className="institution-program-fit">{p.fit}</p><a className="institution-card-link" href={p.href}>{t("了解项目", "Explore program")}</a></div></article>)}</div>{rows.length===0&&<p className="institution-empty" role="status">{t("此组合暂无已整理项目，可切换分类或阶段。", "No listed programs match these filters. Try another category or stage.")}</p>}</>;
}

export type InstitutionAnalysisTab = { id: string; label: string; title: string; text?: string; points?: string[] };
export function InstitutionAnalysis({ tabs, lang }: { tabs: InstitutionAnalysisTab[]; lang: "zh" | "en" }) {
  const [active, setActive] = useState(tabs[0].id);
  const tab = tabs.find(x=>x.id===active)!;
  return <><div className="institution-analysis-tabs" role="tablist" aria-label={lang==="en"?"Institution analysis":"机构深度分析"}>{tabs.map((item,i)=><button type="button" role="tab" id={`analysis-tab-${item.id}`} aria-controls="institution-analysis-panel" aria-selected={item.id===active} tabIndex={item.id===active?0:-1} key={item.id} onClick={()=>setActive(item.id)} onKeyDown={e=>{if(e.key==="ArrowRight"||e.key==="ArrowLeft"||e.key==="Home"||e.key==="End"){e.preventDefault();const next=e.key==="Home"?0:e.key==="End"?tabs.length-1:(i+(e.key==="ArrowRight"?1:tabs.length-1))%tabs.length;setActive(tabs[next].id);document.getElementById(`analysis-tab-${tabs[next].id}`)?.focus();}}}>{item.label}</button>)}</div><div className="institution-analysis-panel" id="institution-analysis-panel" role="tabpanel" aria-labelledby={`analysis-tab-${tab.id}`} tabIndex={0}><span className="institution-insight-icon" aria-hidden="true">✦</span><div><h3>{tab.title}</h3>{tab.text&&<p>{tab.text}</p>}{tab.points&&<ul>{tab.points.map(p=><li key={p}>{p}</li>)}</ul>}</div></div></>;
}
