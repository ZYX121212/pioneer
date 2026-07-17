import { getD1 } from "../../../db/d1";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_TYPES = new Set(["program", "organization", "event", "knowledge", "startup"]);
const ALLOWED_RELATIONSHIPS = new Set(["official", "participant", "community", "other"]);

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    if (cleanText(payload.website, 120)) return json({ ok: true });

    const resourceType = cleanText(payload.resourceType, 32);
    const resourceName = cleanText(payload.resourceName, 120);
    const resourceUrl = cleanText(payload.resourceUrl, 500);
    const location = cleanText(payload.location, 100);
    const deadline = cleanText(payload.deadline, 100);
    const whyUseful = cleanText(payload.whyUseful, 1200);
    const submitterName = cleanText(payload.submitterName, 100);
    const submitterEmail = cleanText(payload.submitterEmail, 254).toLowerCase();
    const relationship = cleanText(payload.relationship, 32);
    const language = payload.language === "en" ? "en" : "zh";
    const sourcePath = cleanText(payload.sourcePath, 160);

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(resourceUrl);
    } catch {
      return json({ error: language === "en" ? "Enter a valid official URL" : "请输入有效的官方网站" }, 400);
    }

    if (
      !ALLOWED_TYPES.has(resourceType) ||
      !ALLOWED_RELATIONSHIPS.has(relationship) ||
      resourceName.length < 2 ||
      whyUseful.length < 20 ||
      !submitterName ||
      !EMAIL_PATTERN.test(submitterEmail) ||
      !["http:", "https:"].includes(parsedUrl.protocol)
    ) {
      return json({ error: language === "en" ? "Complete all required fields" : "请完整填写必填信息" }, 400);
    }

    const database = await getD1();
    const shareToken = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
    await database
      .prepare(`
        INSERT INTO resource_submissions (
          resource_type, resource_name, resource_url, location, deadline, why_useful,
          submitter_name, submitter_email, relationship, language, source_path, status, share_token, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, CURRENT_TIMESTAMP)
      `)
      .bind(
        resourceType,
        resourceName,
        parsedUrl.href.slice(0, 500),
        location || null,
        deadline || null,
        whyUseful,
        submitterName,
        submitterEmail,
        relationship,
        language,
        sourcePath.startsWith("/") ? sourcePath : language === "en" ? "/en/submit" : "/submit",
        shareToken,
      )
      .run();

    return json({ ok: true, shareToken });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit resource";
    return json({ error: message }, 500);
  }
}
