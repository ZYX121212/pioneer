export type MailConfig = { key: string; from: string; origin: string };
export type MailPayload = { from: string; to: string[]; subject: string; text: string; headers: Record<string, string> };
export function mailConfiguration(env: Record<string, unknown>) {
  const key = String(env.RESEND_API_KEY ?? "").trim(), from = String(env.MAIL_FROM ?? "").trim(), rawOrigin = String(env.MAIL_SITE_ORIGIN ?? "").trim();
  let origin = "";
  try { const url = new URL(rawOrigin); if (url.protocol === "https:" && !url.username && !url.password && url.pathname === "/" && !url.search && !url.hash && url.origin === "https://pioneer-global-resources.hiayun.chatgpt.site") origin = url.origin; } catch {}
  const missing = [...(!key ? ["RESEND_API_KEY"] : []), ...(!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(from) ? ["MAIL_FROM"] : []), ...(!origin ? ["MAIL_SITE_ORIGIN"] : []), ...(env.MAIL_DELIVERY_ENABLED !== "true" ? ["MAIL_DELIVERY_ENABLED=true"] : [])];
  return { enabled: missing.length === 0, missing, config: missing.length === 0 ? { key, from, origin } as MailConfig : null };
}
export class MailProviderError extends Error {
  constructor(public code: string, public retryable: boolean, public retryAfter = 60_000) { super(code); }
}
export async function sendResend(config: MailConfig, id: string, payload: MailPayload, fetcher: typeof fetch = fetch) {
  let response;
  try { response = await fetcher("https://api.resend.com/emails", { method: "POST", headers: { authorization: `Bearer ${config.key}`, "content-type": "application/json", "Idempotency-Key": id }, body: JSON.stringify(payload), signal: AbortSignal.timeout(10_000) }); } catch { throw new MailProviderError("provider_connection_uncertain", true); }
  if (!response.ok) {
    let code = ""; try { const data = await response.json(); code = typeof data?.name === "string" ? data.name : ""; } catch {}
    const retryable = response.status === 429 || response.status >= 500 || code === "concurrent_idempotent_requests";
    const retryAfter = Math.max(60_000, Math.min(1_800_000, (Number(response.headers.get("retry-after")) || 60) * 1000));
    throw new MailProviderError(code === "invalid_idempotent_request" ? "provider_payload_conflict" : `provider_http_${response.status}`, retryable, retryAfter);
  }
  const body = await response.json().catch(() => null);
  if (!body || typeof body.id !== "string" || !/^[a-zA-Z0-9-]{1,100}$/.test(body.id)) throw new MailProviderError("provider_response_uncertain", true);
  return body.id;
}
export async function inspectResend(config: MailConfig, id: string, fetcher: typeof fetch = fetch) {
  if (!/^[a-zA-Z0-9-]{1,100}$/.test(id)) throw new Error("Invalid provider identifier");
  const response = await fetcher(`https://api.resend.com/emails/${id}`, { headers: { authorization: `Bearer ${config.key}` }, signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error("Provider status unavailable");
  const body = await response.json(); if (body.id !== id) throw new Error("Provider identity mismatch");
  const event = String(body.last_event ?? "");
  return ["delivered", "opened", "clicked"].includes(event) ? "delivered" : ["bounced", "complained", "failed", "suppressed"].includes(event) ? "undeliverable" : "accepted";
}
