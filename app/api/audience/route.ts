import { getD1 } from "../../../db/d1";

const VISITOR_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function readVisitorCount() {
  const database = await getD1();
  const result = await database
    .prepare("SELECT COUNT(*) AS count FROM site_visitors")
    .first<{ count: number }>();

  return Number(result?.count ?? 0);
}

export async function GET() {
  try {
    return json({ visitorCount: await readVisitorCount() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to read audience count";
    return json({ error: message }, 500);
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { visitorId?: string };
    const visitorId = payload.visitorId?.trim() ?? "";

    if (!VISITOR_ID_PATTERN.test(visitorId)) {
      return json({ error: "A valid anonymous visitor id is required" }, 400);
    }

    const database = await getD1();
    await database
      .prepare(`
        INSERT INTO site_visitors (visitor_id, first_seen_at, last_seen_at, page_views)
        VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)
        ON CONFLICT(visitor_id) DO UPDATE SET
          last_seen_at = CURRENT_TIMESTAMP,
          page_views = page_views + 1
      `)
      .bind(visitorId)
      .run();

    return json({ visitorCount: await readVisitorCount() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to record audience count";
    return json({ error: message }, 500);
  }
}
