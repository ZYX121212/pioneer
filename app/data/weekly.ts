export type WeeklyLanguage = "zh" | "en";
type Copy = { deadline: string; signal: string; description: string; whyNow: string; bestFor: string; action: string[]; sourceNote: string };
export type WeeklyOpportunity = {
  id: string; name: string; url: string; sources: { label: string; href: string }[];
  kind: "deadline" | "event"; start: string; end: string; expiresAt: string;
  // UTC precision only when the official source supplies an exact time.
  timed?: boolean; location: string; zh: Copy; en: Copy;
};

export const weeklyIssue = {
  id: "003", checkedAt: "2026-10-05", range: "2026.10.05—10.11",
  publishedAt: "2026-10-05T00:00:00+08:00",
  // A weekly verification is never an indefinite assertion of availability.
  validUntil: "2026-10-12T00:00:00+08:00",
  summary: {
    zh: "YC Winter 2027、Techstars NYC 开放申请；Slush 365 的 10 月对接与 Slush 2026 参会进入准备窗口。",
    en: "Applications: YC Winter 2027 and Techstars NYC. Prepare for October's Slush 365 sprint and Slush 2026 attendance.",
  },
} as const;

export const weeklyOpportunities: WeeklyOpportunity[] = [
  {
    id: "yc-winter-2027", name: "Y Combinator · Winter 2027", url: "https://www.ycombinator.com/apply/",
    sources: [{ label: "YC · Apply", href: "https://www.ycombinator.com/apply/" }],
    kind: "deadline", timed: true, start: "20261103T040000Z", end: "20261103T040001Z", expiresAt: "2026-11-03T04:00:00Z", location: "San Francisco",
    zh: {
      deadline: "11 月 2 日 20:00 PT（北京时间 11 月 3 日 12:00）", signal: "常规申请截止",
      description: "Winter 2027 正在接受申请，2027 年 1–3 月在旧金山线下进行。",
      whyNow: "现在准备用户证据、产品演示和创始人介绍，留出修改申请的时间。常规截止前提交可在 12 月 11 日前获知结果；晚交仍可能受理，但反馈时间不保证。",
      bestFor: "能全职推进高增长科技产品，并能安排旧金山线下参与的早期团队，包括 AI 创业公司。",
      action: ["用客户行为证明问题和进展", "录制简洁的创始人介绍与产品演示", "确认 2027 年 1–3 月线下参与安排"],
      sourceNote: "官方明确 11 月 2 日 20:00 PT；当日已进入 PST（UTC−8）。这是常规截止，不是晚申关闭时间。",
    },
    en: {
      deadline: "Nov 2, 8pm PT (Nov 3, 04:00 UTC)", signal: "ON-TIME DEADLINE",
      description: "Winter 2027 applications are open for an in-person January–March batch in San Francisco.",
      whyNow: "Prepare customer evidence, a demo and founder introductions with time to revise. On-time applicants receive a decision by Dec 11. Late applications may still be considered without a guaranteed response time.",
      bestFor: "Early technology teams, including AI startups, ready to build full time and participate in San Francisco.",
      action: ["Show customer behavior and product progress", "Record concise founder introductions and a demo", "Plan in-person participation for January–March 2027"],
      sourceNote: "Official cutoff: Nov 2 at 8pm PT, then PST (UTC−8). This is the on-time deadline, not closure of late applications.",
    },
  },
  {
    id: "techstars-nyc-spring-2027", name: "Techstars New York City Accelerator", url: "https://www.techstars.com/accelerators/nyc",
    sources: [{ label: "Techstars · NYC", href: "https://www.techstars.com/accelerators/nyc" }],
    kind: "deadline", start: "20261118", end: "20261119", expiresAt: "2026-11-18T00:00:00Z", location: "New York · Hybrid",
    zh: {
      deadline: "11 月 18 日（官方未公布具体时间或时区）", signal: "最终申请截止",
      description: "8 月 24 日开放申请，2027 年 3 月 8 日开营，6 月 3 日 Demo Day；采用线上与纽约线下结合的形式。",
      whyNow: "项目明确覆盖 AI/ML、企业 SaaS、健康、气候与金融科技。用申请准备检验客户洞察，并判断纽约的买家和资本网络是否匹配你的产品。",
      bestFor: "已有明确客户问题、能够快速执行，且能在入选后全职投入并参加纽约线下阶段的团队。",
      action: ["整理用户问题与实际验证证据", "核对投资条款及总股权成本", "确认开营、中期与 Demo Day 到场安排"],
      sourceNote: "官方列出最终截止日期，未给出具体时间或时区。日历仅作日期提醒，建议提前提交。",
    },
    en: {
      deadline: "Nov 18 (official time and timezone unspecified)", signal: "FINAL APPLICATION DEADLINE",
      description: "Applications opened Aug 24. The hybrid program starts Mar 8, 2027, with Demo Day on Jun 3.",
      whyNow: "The program explicitly covers AI/ML, enterprise SaaS, health, climate and fintech. Test whether New York's customer and capital networks match your product while preparing the application.",
      bestFor: "Teams with deep customer insight and fast execution, ready for full-time commitment and the New York in-person phases if accepted.",
      action: ["Collect customer problems and validation evidence", "Review investment terms and total equity costs", "Plan attendance at the start, midpoint and Demo Day"],
      sourceNote: "The source supplies a date only. The calendar is a date reminder, not an invented time or timezone; submit early.",
    },
  },
  {
    id: "slush365-october-2026", name: "Slush 365 · Matchmaking Sprint", url: "https://slush.org/slush365",
    sources: [{ label: "Slush 365 · Schedule & application", href: "https://slush.org/slush365" }],
    kind: "event", start: "20261014", end: "20261015", expiresAt: "2026-10-14T00:00:00Z", location: "Slush Platform",
    zh: {
      deadline: "10 月 14 日活动（非申请截止）", signal: "投资人对接",
      description: "官方 2026 年 Matchmaking Sprint 日程包含 10 月 14 日，申请从 Slush Platform 公司档案开始。",
      whyNow: "距下一场对接只有九天，先补全公司档案、等待审核，再通过平台申请。官方称审核通常少于 48 小时，但未公布本场截止、名额或精确活动时间。",
      bestFor: "能清楚呈现产品、市场与融资目标，并有明确投资人匹配需求的科技创业团队。",
      action: ["补齐公司档案、pitch deck 与 logo", "提交档案审核后查看 Apply now", "在平台确认本场资格、名额与参加方式"],
      sourceNote: "10 月 14 日是官方日程中的活动日。最终报名状态以平台为准，不保证录取或投资人会面。",
    },
    en: {
      deadline: "Oct 14 event (not an application deadline)", signal: "INVESTOR MATCHMAKING",
      description: "The official 2026 Matchmaking Sprint schedule includes Oct 14. Applications begin with a Slush Platform company profile.",
      whyNow: "Nine days remain to prepare a profile, obtain approval and apply on the platform. The source says approval usually takes under 48 hours, but supplies no session cutoff, capacity or precise event time.",
      bestFor: "Technology startups with a clear product, market and fundraising goal seeking relevant investor connections.",
      action: ["Complete the company profile, pitch deck and logo", "Seek profile approval, then check Apply now", "Confirm eligibility, capacity and participation on the platform"],
      sourceNote: "Oct 14 is an event date. Confirm registration on the platform; acceptance and investor meetings are not guaranteed.",
    },
  },
  {
    id: "slush-startup-pass-2026", name: "Slush 2026 · Startup Pass", url: "https://slush.org/",
    sources: [{ label: "Slush · Tickets & event dates", href: "https://slush.org/" }, { label: "Slush · Startup eligibility", href: "https://slush.org/faq" }, { label: "Slush · Closed booth / stage windows", href: "https://slush.org/audience/startups/startups" }],
    kind: "event", start: "20261118", end: "20261120", expiresAt: "2026-11-18T00:00:00Z", location: "Helsinki",
    zh: {
      deadline: "11 月 18–19 日活动（非购票截止）", signal: "参会与会面准备",
      description: "赫尔辛基主会场 11 月 18–19 日；Startup Pass 需先通过公司档案审核，再购买每人的门票。",
      whyNow: "官网仍有 Startup 购票入口。先确认客户或融资目标与总出行成本，再申请资格和安排会面；展位与 Startup Stage 申请已于 8 月 31 日关闭，不作为本期行动。",
      bestFor: "2016 年或之后成立、具有可扩展业务并追求快速增长的科技创业公司，尤其是需要欧洲创投连接的团队。",
      action: ["提交公司档案并确认 Startup Pass 资格", "核算门票、交通和住宿总成本", "列出目标投资人或客户并安排会面"],
      sourceNote: "参会日期、购票路径与资格来自官网和 FAQ。未公布统一购票截止；Day 0 及部分活动需另行注册，名额另核。",
    },
    en: {
      deadline: "Nov 18–19 event (not a ticket cutoff)", signal: "ATTENDANCE & MEETING PREPARATION",
      description: "The Helsinki main event runs Nov 18–19. Startup Pass purchase follows company approval; every attendee needs a ticket.",
      whyNow: "The official site still offers a Startup ticket route. Check target customers, investors and travel costs before applying and planning meetings. Booth and Startup Stage applications closed Aug 31 and are excluded.",
      bestFor: "Young, scalable technology startups founded in 2016 or later and aiming for rapid growth, especially teams seeking European venture connections.",
      action: ["Submit a company profile and confirm Startup Pass eligibility", "Budget tickets, transport and accommodation", "Identify target investors or customers and arrange meetings"],
      sourceNote: "Dates, ticket route and eligibility checked on the official site and FAQ. No universal ticket cutoff published; Day 0 and some activities require separate registration and capacity checks.",
    },
  },
];

export function isWeeklyCurrent(now = new Date()): boolean {
  return now.getTime() >= Date.parse(weeklyIssue.publishedAt) && now.getTime() < Date.parse(weeklyIssue.validUntil);
}

export function getActionableWeekly(now = new Date()): WeeklyOpportunity[] {
  return isWeeklyCurrent(now) ? weeklyOpportunities.filter(item => now.getTime() < Date.parse(item.expiresAt)) : [];
}

export function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[char]!));
}

export function buildWeeklyFeed(lang: WeeklyLanguage, origin: string): string {
  const prefix = lang === "en" ? "/en" : "";
  const title = lang === "en" ? "Pioneer Weekly Founder Opportunities" : "Pioneer 本周创业机会";
  const item = (id: string, path: string, date: string, heading: string, description: string) => `<item><title>${escapeXml(heading)}</title><link>${origin}${path}</link><guid isPermaLink="false">pioneer-weekly-${id}</guid><pubDate>${new Date(date).toUTCString()}</pubDate><description>${escapeXml(description)}</description></item>`;
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${title}</title><link>${origin}${prefix}/weekly</link><description>${title}</description><language>${lang === "en" ? "en" : "zh-CN"}</language><atom:link href="${origin}${prefix}/feed.xml" rel="self" type="application/rss+xml" />${item(weeklyIssue.id, `${prefix}/weekly/archive/003`, weeklyIssue.publishedAt, lang === "en" ? "4 startup opportunities worth acting on | 2026.10.05" : "本周值得行动的 4 个创业机会｜2026.10.05", weeklyIssue.summary[lang])}${item("002", `${prefix}/weekly/archive/002`, "2026-07-30T00:00:00Z", lang === "en" ? "Archive · Issue 002 | 2026.07.30" : "历史归档 · 第二期｜2026.07.30", lang === "en" ? "Historical issue: EF, SkyDeck and TechBBQ windows have ended. AWS was ongoing at publication." : "历史期刊：EF、SkyDeck 与 TechBBQ 窗口已结束；AWS 为当期持续开放项目。")}</channel></rss>`;
}

export function escapeCalendar(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

// RFC 5545: fold at 75 UTF-8 octets, never inside a multibyte code point.
export function foldCalendarLine(line: string): string {
  const lines: string[] = [];
  let segment = "", size = 0;
  for (const char of line) {
    const bytes = new TextEncoder().encode(char).length;
    if (size + bytes > 75) { lines.push(segment); segment = " "; size = 1; }
    segment += char; size += bytes;
  }
  lines.push(segment);
  return lines.join("\r\n");
}

export function buildWeeklyCalendar(lang: WeeklyLanguage, now = new Date()): string {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", `PRODID:-//Pioneer//Founder Opportunity Brief//${lang.toUpperCase()}`, "CALSCALE:GREGORIAN", "METHOD:PUBLISH", `X-WR-CALNAME:${lang === "en" ? "Pioneer deadlines and events" : "Pioneer 截止日与活动"}`];
  for (const entry of getActionableWeekly(now)) {
    const copy = entry[lang];
    lines.push("BEGIN:VEVENT", `UID:${entry.id}@pioneer`, "DTSTAMP:20261004T160000Z", "SEQUENCE:0", `DTSTART${entry.timed ? "" : ";VALUE=DATE"}:${entry.start}`, `DTEND${entry.timed ? "" : ";VALUE=DATE"}:${entry.end}`, `SUMMARY:${escapeCalendar(`${entry.name} · ${copy.signal}`)}`, `DESCRIPTION:${escapeCalendar(`${copy.deadline}\n${copy.sourceNote}`)}`, `LOCATION:${escapeCalendar(entry.location)}`, `URL:${entry.url}`, "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.map(foldCalendarLine).join("\r\n") + "\r\n";
}
