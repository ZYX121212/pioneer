import { getD1 } from "../../../db/d1";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      email?: string;
      language?: string;
      sourcePath?: string;
      website?: string;
    };

    if (payload.website) return json({ ok: true });

    const email = payload.email?.trim().toLowerCase() ?? "";
    if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
      return json({ error: "请输入有效邮箱" }, 400);
    }

    const language = payload.language === "en" ? "en" : "zh";
    const sourcePath = payload.sourcePath?.startsWith("/")
      ? payload.sourcePath.slice(0, 160)
      : "/";
    const database = await getD1();

    await database
      .prepare(`
        INSERT INTO newsletter_subscribers (email, language, source_path, status, created_at)
        VALUES (?, ?, ?, 'active', CURRENT_TIMESTAMP)
        ON CONFLICT(email) DO UPDATE SET
          language = excluded.language,
          source_path = excluded.source_path,
          status = 'active'
      `)
      .bind(email, language, sourcePath)
      .run();

    return json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to subscribe";
    return json({ error: message }, 500);
  }
}
