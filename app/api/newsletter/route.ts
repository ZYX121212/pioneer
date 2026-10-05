import { getD1 } from "../../../db/d1";
import { getChatGPTUser } from "../../chatgpt-auth";
import { json, requestHash, sameOrigin } from "../../lib/http";
import { loadNewsletter, registerNewsletterInterest, saveNewsletter, unsubscribeNewsletter, validatePreferences, validEmail } from "../../lib/newsletterService";
export const dynamic = "force-dynamic";
async function readBody(request: Request) {
  const text = await request.text();
  if (new TextEncoder().encode(text).length > 4096) throw new Error("Request too large");
  const data = JSON.parse(text);
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid request");
  return data as Record<string, unknown>;
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin" }, 403);
  let payload;
  try { payload = await readBody(request); } catch { return json({ error: "Invalid registration request" }, 400); }
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  if (payload.website || !validEmail(email)) return json({ error: "Enter a valid email address" }, 400);
  const path = typeof payload.sourcePath === "string" && payload.sourcePath.startsWith("/") ? payload.sourcePath.slice(0, 160) : "/";
  try {
    const result = await registerNewsletterInterest(await getD1(), email, payload.language === "en" ? "en" : "zh", path, await requestHash(request));
    return result === "limited" ? json({ error: "Too many registrations. Try again later.", code: "rate_limited" }, 429) : json({ ok: true, deliveryEnabled: false, message: "Registration received. Existing preferences and opt-outs are preserved." });
  } catch (error) { console.error("Notification registration failed", error); return json({ error: "Notification registration unavailable" }, 503); }
}
export async function GET() {
  const user = await getChatGPTUser(); if (!user) return json({ error: "Sign in to manage your notifications", code: "signin_required" }, 401);
  try { return json({ ...await loadNewsletter(await getD1(), user), deliveryEnabled: false }); } catch (error) { console.error("Notifications unavailable", error); return json({ error: "Notifications temporarily unavailable" }, 503); }
}
async function mutate(request: Request, unsubscribe: boolean) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin" }, 403);
  const user = await getChatGPTUser(); if (!user) return json({ error: "Sign in to manage your notifications", code: "signin_required" }, 401);
  let payload, preferences;
  try { payload = await readBody(request); if (!Number.isSafeInteger(payload.version) || Number(payload.version) < 0) throw new Error("Invalid version"); if (!unsubscribe) preferences = validatePreferences(payload); } catch { return json({ error: "Invalid notification preferences" }, 400); }
  try {
    const db = await getD1(); const result = unsubscribe ? await unsubscribeNewsletter(db, user, Number(payload.version)) : await saveNewsletter(db, user, Number(payload.version), preferences!);
    return result ? json({ ...result, deliveryEnabled: false }) : json({ error: "Your preferences changed on another page. Refresh before saving; your draft is retained.", code: "version_conflict" }, 409);
  } catch (error) { console.error("Notification update failed", error); return json({ error: "Your changes were not saved. Keep your draft and retry." }, 503); }
}
export async function PUT(request: Request) { return mutate(request, false); }
export async function DELETE(request: Request) { return mutate(request, true); }
