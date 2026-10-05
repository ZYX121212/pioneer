"use client";

import { useEffect, useMemo, useState } from "react";
import { SiteFooter, SiteHeader } from "./SiteChrome";

type AudienceStats = {
  visitorCount: number;
  pageViewCount: number;
  todayVisitors: number;
  sevenDayVisitors: number;
  sevenDayPageViews: number;
  subscriberCount: number;
  interestCount: number;
  sevenDaySubscribers: number;
  submissionCount: number;
  sevenDaySubmissions: number;
  topPaths: Array<{ path: string; views: number }>;
  topSources: Array<{ source: string; visits: number }>;
  topEvents: Array<{ eventName: string; count: number; target: string | null }>;
  topReferrals: Array<{ resourceName: string; visits: number }>;
};

const emptyStats: AudienceStats = {
  visitorCount: 0,
  pageViewCount: 0,
  todayVisitors: 0,
  sevenDayVisitors: 0,
  sevenDayPageViews: 0,
  subscriberCount: 0,
  interestCount: 0,
  sevenDaySubscribers: 0,
  submissionCount: 0,
  sevenDaySubmissions: 0,
  topPaths: [],
  topSources: [],
  topEvents: [],
  topReferrals: [],
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
    "newsletter:subscribe": "通知意向登记",
    "newsletter:intent": "查看订阅入口",
    "resource:open": "查看资源详情",
    "search:quick": "热门搜索",
    "search:submit": "主动搜索",
    "share:site": "分享网站",
    "submit-resource:intent": "推荐资源意向",
    "submission:complete": "完成资源提交",
    "submission:share": "资源方分享 Pioneer",
    "weekly:official": "打开本周机会官方页",
    "weekly:calendar": "保存机会截止日",
    "weekly:open": "查看本周机会",
    "weekly:resource": "阅读本周机会详情",
    "weekly:rss": "订阅 RSS",
    "weekly:share": "分享本周机会",
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
        const response = await fetch("/api/audience?full=1", { cache: "no-store" });
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
    if (stats.sevenDayVisitors === 0) return "等待第一批真实访问";
    if (stats.sevenDaySubscribers === 0) return "最近 7 天有访问，还没有确认通知偏好的账号";
    return `最近 7 天有 ${formatNumber(stats.sevenDaySubscribers)} 位账号确认通知偏好，目前仍开启`;
  }, [stats.sevenDaySubscribers, stats.sevenDayVisitors]);

  return (
    <main>
      <SiteHeader />
      <section className="analytics-hero">
        <span className="section-index">INTERNAL SIGNALS</span>
        <h1>创业者反馈仪表盘</h1><p><a href="/admin/reviews">资源审核</a> · <a href="/admin/mail">通知发布与投递</a></p>
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
            <div className="analytics-card">
              <span>已确认通知主题</span>
              <strong>{status === "loading" ? "—" : formatNumber(stats.subscriberCount)}</strong>
              <p>意向登记另有 {formatNumber(stats.interestCount)} 条，尚未确认主题；当前未发信</p>
            </div>
            <div className="analytics-card">
              <span>7 日浏览</span>
              <strong>{status === "loading" ? "—" : formatNumber(stats.sevenDayPageViews)}</strong>
              <p>判断内容是否被继续探索</p>
            </div>
            <div className="analytics-card">
              <span>资源提交总数</span>
              <strong>{status === "loading" ? "—" : formatNumber(stats.submissionCount)}</strong>
              <p>最近 7 天新增 {formatNumber(stats.sevenDaySubmissions)} 条</p>
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
            <span className="section-index">ACQUISITION</span>
            <h2>访问来源</h2>
          </div>
          {stats.topSources.length ? (
            stats.topSources.map((item) => (
              <div className="analytics-row" key={item.source}>
                <span>{item.source === "direct" ? "直接访问" : item.source}</span>
                <strong>{formatNumber(item.visits)} 次</strong>
              </div>
            ))
          ) : (
            <p className="analytics-empty">新的来源数据会从本次更新后开始累计。</p>
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

      <section className="analytics-referrals">
        <div>
          <span className="section-index">COMMUNITY LOOP</span>
          <h2>资源方带来的访问</h2>
          <p>统计提交完成后生成的专属分享链接，帮助判断哪些机构或社区真正带来了新访客。</p>
        </div>
        <div>
          {stats.topReferrals.length ? stats.topReferrals.map((item) => (
            <div className="analytics-row" key={item.resourceName}>
              <span>{item.resourceName}</span>
              <strong>{formatNumber(item.visits)} 次</strong>
            </div>
          )) : <p className="analytics-empty">还没有资源方分享带来的访问。</p>}
        </div>
      </section>

      <section className="analytics-note">
        <strong>当前统计口径</strong>
        <p>人数按匿名设备去重；浏览次数记录页面访问；来源优先读取推广链接参数，其次读取外部来源网站。通知人数区分未确认的意向登记与账号确认的主题，均不表示邮件已发送。邮箱不会出现在行为统计中。</p>
      </section>

      <SiteFooter />
    </main>
  );
}
