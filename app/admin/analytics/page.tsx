"use client";

import { useEffect, useMemo, useState } from "react";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";

type AudienceStats = {
  visitorCount: number;
  pageViewCount: number;
  todayVisitors: number;
  sevenDayVisitors: number;
  sevenDayPageViews: number;
  topPaths: Array<{ path: string; views: number }>;
  topEvents: Array<{ eventName: string; count: number; target: string | null }>;
};

const emptyStats: AudienceStats = {
  visitorCount: 0,
  pageViewCount: 0,
  todayVisitors: 0,
  sevenDayVisitors: 0,
  sevenDayPageViews: 0,
  topPaths: [],
  topEvents: [],
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-CN").format(value);
}

function eventLabel(eventName: string) {
  const labels: Record<string, string> = {
    "directory:open": "打开目录",
    "ecosystem:open": "查看生态入口",
    "footer:open": "页脚导航",
    "guide:open": "阅读指南",
    "nav:open": "顶部导航",
    "resource:open": "查看资源详情",
    "search:quick": "热门搜索",
    "search:submit": "主动搜索",
    "submit-resource:intent": "推荐资源意向",
  };

  return labels[eventName] ?? eventName;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AudienceStats>(emptyStats);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;

    async function loadStats() {
      try {
        const response = await fetch("/api/audience", { cache: "no-store" });
        if (!response.ok) throw new Error("Unable to load analytics");
        const data = (await response.json()) as AudienceStats;
        if (!active) return;
        setStats(data);
        setStatus("ready");
      } catch {
        if (!active) return;
        setStatus("error");
      }
    }

    void loadStats();
    return () => {
      active = false;
    };
  }, []);

  const conversionHint = useMemo(() => {
    const intentCount = stats.topEvents
      .filter((event) => event.eventName === "submit-resource:intent")
      .reduce((sum, event) => sum + event.count, 0);

    if (stats.sevenDayVisitors === 0) return "等待第一批真实访问";
    if (intentCount === 0) return "最近 7 天有访问，还没有推荐资源意向";
    return `最近 7 天约 ${Math.round((intentCount / stats.sevenDayVisitors) * 100)}% 访客产生推荐意向`;
  }, [stats.sevenDayVisitors, stats.topEvents]);

  return (
    <main>
      <SiteHeader />
      <section className="analytics-hero">
        <span className="section-index">INTERNAL SIGNALS</span>
        <h1>创业者反馈仪表盘</h1>
        <p>这里看的是访问、兴趣和行动意图。公开页面展示热度，内部页面帮助判断下一步该优化哪里。</p>
      </section>

      <section className="analytics-panel" aria-label="统计概览">
        {status === "error" ? (
          <div className="analytics-empty">暂时无法读取统计数据，网站本身仍可正常访问。</div>
        ) : (
          <>
            <div className="analytics-card">
              <span>累计独立访客</span>
              <strong>{status === "loading" ? "—" : formatNumber(stats.visitorCount)}</strong>
              <p>按匿名浏览器/设备去重</p>
            </div>
            <div className="analytics-card">
              <span>累计浏览次数</span>
              <strong>{status === "loading" ? "—" : formatNumber(stats.pageViewCount)}</strong>
              <p>同一访客多次访问会累加</p>
            </div>
            <div className="analytics-card">
              <span>今日访客</span>
              <strong>{status === "loading" ? "—" : formatNumber(stats.todayVisitors)}</strong>
              <p>看今天是否有自然动静</p>
            </div>
            <div className="analytics-card">
              <span>7 日访客</span>
              <strong>{status === "loading" ? "—" : formatNumber(stats.sevenDayVisitors)}</strong>
              <p>{conversionHint}</p>
            </div>
          </>
        )}
      </section>

      <section className="analytics-grid">
        <article className="analytics-list">
          <div>
            <span className="section-index">LAST 7 DAYS</span>
            <h2>热门访问路径</h2>
          </div>
          {stats.topPaths.length ? (
            stats.topPaths.map((item) => (
              <div className="analytics-row" key={item.path}>
                <span>{item.path}</span>
                <strong>{formatNumber(item.views)} 次</strong>
              </div>
            ))
          ) : (
            <p className="analytics-empty">还没有足够的页面浏览数据。</p>
          )}
        </article>

        <article className="analytics-list">
          <div>
            <span className="section-index">INTENT</span>
            <h2>关键行为</h2>
          </div>
          {stats.topEvents.length ? (
            stats.topEvents.map((item) => (
              <div className="analytics-row" key={`${item.eventName}-${item.target ?? "none"}`}>
                <span>{eventLabel(item.eventName)}{item.target ? ` · ${item.target}` : ""}</span>
                <strong>{formatNumber(item.count)} 次</strong>
              </div>
            ))
          ) : (
            <p className="analytics-empty">还没有按钮、搜索或资源详情点击。</p>
          )}
        </article>
      </section>

      <section className="analytics-note">
        <strong>当前统计口径</strong>
        <p>人数按匿名设备去重；浏览次数记录页面访问；关键行为只记录事件名称、路径和目标，不记录姓名、邮箱或联系方式。</p>
      </section>

      <SiteFooter />
    </main>
  );
}
