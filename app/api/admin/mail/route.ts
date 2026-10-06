import { getD1 } from "../../../../db/d1";
import { getAppUser } from "../../../lib/appUser";
import { isSiteAdmin } from "../../../lib/admin";
import { json, sameOrigin } from "../../../lib/http";
import { buildMailEdition } from "../../../lib/mailContent";
import { campaignPreview, campaignStatus, drainCampaign, enqueueCampaign, inspectCampaign, retryFailedCampaign } from "../../../lib/mailService";
import { runtimeMailConfiguration } from "../../../lib/mailRuntime";
import { pioneerGuides } from "../../../data/knowledge";
const origin = "https://pioneer-global-resources.hiayun.chatgpt.site";
export const dynamic = "force-dynamic";
export async function GET() {
  if (!await isSiteAdmin()) return json({ error: "Administrator access required" }, 403);
  try { const config = await runtimeMailConfiguration(), db = await getD1(); const campaigns = await db.prepare("SELECT id, topic, valid_until, created_at FROM mail_campaigns ORDER BY created_at DESC LIMIT 20").all(); return json({ enabled: config.enabled, missing: config.missing, sender: config.config?.from ?? null, campaigns: campaigns.results, guides: pioneerGuides.map(row => ({ slug: row.slug, title: row.title })) }); } catch (error) { console.error("Mail dashboard unavailable", error); return json({ error: "发信后台暂时不可用" }, 503); }
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin" }, 403);
  if (!await isSiteAdmin()) return json({ error: "Administrator access required" }, 403);
  let payload;
  try { const body = await request.text(); if (body.length > 4096) throw new Error(); payload = JSON.parse(body); if (!payload || !["preview", "enqueue", "send", "inspect", "status", "retry"].includes(payload.action)) throw new Error(); } catch { return json({ error: "Invalid mail request" }, 400); }
  try {
    const db = await getD1(); const runtime = await runtimeMailConfiguration();
    if (payload.action === "preview" || payload.action === "enqueue") {
      if (!["weekly", "cases"].includes(payload.topic)) return json({ error: "请选择通知主题" }, 400);
      const edition = buildMailEdition(String(payload.topic), String(payload.guide ?? ""), runtime.config?.origin ?? origin);
      if (payload.action === "preview") return json(await campaignPreview(db, edition));
      if (!runtime.config) return json({ error: "发信尚未启用，请先配置并验证发信服务", code: "delivery_disabled" }, 503);
      if (payload.confirmed !== true || payload.editionId !== edition.id) return json({ error: "请先预览并确认接收范围" }, 400);
      const user = (await getAppUser())!;
      return json(await enqueueCampaign(db, edition, runtime.config, user.id));
    }
    if (typeof payload.id !== "string" || payload.id.length > 200) return json({ error: "Invalid campaign identifier" }, 400);
    if (payload.action === "status") return json(await campaignStatus(db, payload.id));
    if (!runtime.config) return json({ error: "发信尚未启用", code: "delivery_disabled" }, 503);
    if (["send", "retry"].includes(payload.action) && payload.confirmed !== true) return json({ error: "请明确确认发送这一批" }, 400);
    if (payload.action === "retry") return json(await retryFailedCampaign(db, payload.id));
    return json(payload.action === "inspect" ? await inspectCampaign(db, payload.id, runtime.config) : await drainCampaign(db, payload.id, runtime.config));
  } catch (error) { console.error("Mail operation failed", error); if (error instanceof Error && error.message.startsWith("本期机会已过核验期")) return json({ error: "本期机会已过核验期，先更新周刊再发送。", code: "issue_expired" }, 409); if (error instanceof Error && error.message.startsWith("请选择已发布")) return json({ error: "请选择已发布的双语创业指南" }, 400); return json({ error: error instanceof Error && ["Campaign expired", "Campaign missing"].includes(error.message) ? "本期已失效或不存在，请更新内容后重试" : "发信操作未完成，请保留选择并稍后重试" }, 503); }
}
