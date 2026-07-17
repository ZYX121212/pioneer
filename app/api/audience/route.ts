import { getD1 } from "../../../db/d1";

const VISITOR_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EVENT_NAME_PATTERN = /^[a-z][a-z0-9:_-]{1,63}$/;
const MAX_TEXT_LENGTH = 160;

type AudienceStats = {
  visitorCount: number;
  pageViewCount: number;
  todayVisitors: number;
  sevenDayVisitors: number;
  sevenDayPageViews: number;
  subscriberCount: number;
  sevenDaySubscribers: number;
  topPaths: Array<{ path: string; views: number }>;
  topSources: Array<{ source: string; visits: number }>;
  topEvents: Array<{ eventName: string; count: number; target: string | null }>;
};

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function cleanPath(value: unknown) {
  if (typeof value !== "string") return "/";
  const trimmed = value.trim();
  if (!trimmed || !trimmed.startsWith("/")) return "/";
  return trimmed.slice(0, MAX_TEXT_LENGTH);
}

function cleanTarget(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, MAX_TEXT_LENGTH);
}

async function readAudienceStats(): Promise<AudienceStats> {
  const database = await getD1();
  const [
    visitors,
    pageViews,
    todayVisitors,
    sevenDayVisitors,
    sevenDayPageViews,
    subscriberCount,
    sevenDaySubscribers,
    topPaths,
    topSources,
    topEvents,
  ] = await Promise.all([
    database.prepare("SELECT COUNT(*) AS count FROM site_visitors").first<{ count: number }>(),
    database.prepare("SELECT COALESCE(SUM(page_views), 0) AS count FROM site_visitors").first<{ count: number }>(),
    database
      .prepare("SELECT COUNT(*) AS count FROM site_visitors WHERE last_seen_at >= datetime('now', 'start of day')")
      .first<{ count: number }>(),
    database
      .prepare("SELECT COUNT(*) AS count FROM site_visitors WHERE last_seen_at >= datetime('now', '-7 days')")
      .first<{ count: number }>(),
    database
      .prepare("SELECT COUNT(*) AS count FROM site_page_views WHERE viewed_at >= datetime('now', '-7 days')")
      .first<{ count: number }>(),
    database
      .prepare("SELECT COUNT(*) AS count FROM newsletter_subscribers WHERE status = 'active'")
      .first<{ count: number }>(),
    database
      .prepare("SELECT COUNT(*) AS count FROM newsletter_subscribers WHERE status = 'active' AND created_at >= datetime('now', '-7 days')")
      .first<{ count: number }>(),
    database
      .prepare(`
        SELECT path, COUNT(*) AS views
        FROM site_page_views
        WHERE viewed_at >= datetime('now', '-7 days')
        GROUP BY path
        ORDER BY views DESC, path ASC
        LIMIT 6
      `)
      .all<{ path: string; views: number }>(),
    database
      .prepare(`
        SELECT COALESCE(NULLIF(source, ''), 'direct') AS source, COUNT(*) AS visits
        FROM site_page_views
        WHERE viewed_at >= datetime('now', '-7 days')
        GROUP BY COALESCE(NULLIF(source, ''), 'direct')
        ORDER BY visits DESC, source ASC
        LIMIT 8
      `)
      .all<{ source: string; visits: number }>(),
    database
      .prepare(`
        SELECT event_name AS eventName, target, COUNT(*) AS count
        FROM site_events
        WHERE created_at >= datetime('now', '-7 days')
        GROUP BY event_name, target
        ORDER BY count DESC, event_name ASC
        LIMIT 8
      `)
      .all<{ eventName: string; target: string | null; count: number }>(),
  ]);

  return {
    visitorCount: Number(visitors?.count ?? 0),
    pageViewCount: Number(pageViews?.count ?? 0),
    todayVisitors: Number(todayVisitors?.count ?? 0),
    sevenDayVisitors: Number(sevenDayVisitors?.count ?? 0),
    sevenDayPageViews: Number(sevenDayPageViews?.count ?? 0),
    subscriberCount: Number(subscriberCount?.count ?? 0),
    sevenDaySubscribers: Number(sevenDaySubscribers?.count ?? 0),
    topPaths: (topPaths.results ?? []).map((row) => ({ path: row.path, views: Number(row.views ?? 0) })),
    topSources: (topSources.results ?? []).map((row) => ({
      source: row.source,
      visits: Number(row.visits ?? 0),
    })),
    topEvents: (topEvents.results ?? []).map((row) => ({
      eventName: row.eventName,
      target: row.target,
      count: Number(row.count ?? 0),
    })),
  };
}

export async function GET() {
  try {
    return json(await readAudienceStats());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to read audience count";
    return json({ error: message }, 500);
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      visitorId?: string;
      path?: string;
      eventName?: string;
      target?: string;
      referrer?: string;
      source?: string;
      medium?: string;
      campaign?: string;
    };
    const visitorId = payload.visitorId?.trim() ?? "";

    if (!VISITOR_ID_PATTERN.test(visitorId)) {
      return json({ error: "A valid anonymous visitor id is required" }, 400);
    }

    const database = await getD1();
    const path = cleanPath(payload.path);

    if (payload.eventName) {
      const eventName = payload.eventName.trim();
      if (!EVENT_NAME_PATTERN.test(eventName)) {
        return json({ error: "A valid audience event name is required" }, 400);
      }

      await database
        .prepare(`
          INSERT INTO site_events (visitor_id, event_name, path, target, created_at)
          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        `)
        .bind(visitorId, eventName, path, cleanTarget(payload.target))
        .run();

      return json(await readAudienceStats());
    }

    await database.batch([
      database
        .prepare(`
        INSERT INTO site_visitors (visitor_id, first_seen_at, last_seen_at, page_views)
        VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)
        ON CONFLICT(visitor_id) DO UPDATE SET
          last_seen_at = CURRENT_TIMESTAMP,
          page_views = page_views + 1
      `)
        .bind(visitorId),
      database
        .prepare(`
          INSERT INTO site_page_views (visitor_id, path, referrer, source, medium, campaign, viewed_at)
          VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `)
        .bind(
          visitorId,
          path,
          cleanTarget(payload.referrer),
          cleanTarget(payload.source),
          cleanTarget(payload.medium),
          cleanTarget(payload.campaign),
        ),
    ]);

    return json(await readAudienceStats());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to record audience count";
    return json({ error: message }, 500);
  }
}
