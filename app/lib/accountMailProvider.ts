import { mailConfiguration, MailProviderError, sendResend, type MailConfig, type MailPayload } from "./mailProvider";

export type AccountMailConfig = MailConfig & { provider?: "resend" | "brevo" };

// Keep account recovery independent of the existing newsletter provider.
export function accountMailConfiguration(env: Record<string, unknown>) {
  const provider = String(env.ACCOUNT_MAIL_PROVIDER ?? "resend").trim();
  if (provider === "resend") return mailConfiguration(env);
  if (provider !== "brevo") return { enabled: false, missing: ["ACCOUNT_MAIL_PROVIDER=resend|brevo"], config: null };
  const mail = mailConfiguration({ RESEND_API_KEY: env.BREVO_API_KEY, MAIL_FROM: env.ACCOUNT_MAIL_FROM, MAIL_SITE_ORIGIN: env.MAIL_SITE_ORIGIN, MAIL_DELIVERY_ENABLED: env.ACCOUNT_MAIL_DELIVERY_ENABLED });
  return {
    enabled: mail.enabled,
    missing: mail.missing.map(key => key === "RESEND_API_KEY" ? "BREVO_API_KEY" : key === "MAIL_FROM" ? "ACCOUNT_MAIL_FROM" : key === "MAIL_DELIVERY_ENABLED=true" ? "ACCOUNT_MAIL_DELIVERY_ENABLED=true" : key),
    config: mail.config ? { ...mail.config, provider: "brevo" as const } : null,
  };
}

export async function sendAccountMail(config: AccountMailConfig, id: string, payload: MailPayload, fetcher: typeof fetch = fetch) {
  if (config.provider !== "brevo") return sendResend(config, id, payload, fetcher);
  const idempotencyKey = id.slice(-36);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencyKey)) throw new Error("Invalid account mail identifier");
  const escaped = payload.text.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]!));
  let response;
  try {
    response = await fetcher("https://api.brevo.com/v3/smtp/email", {
      method: "POST", headers: { "api-key": config.key, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ sender: { name: "Pioneer", email: payload.from }, to: payload.to.map(email => ({ email })), subject: payload.subject, textContent: payload.text, htmlContent: `<pre style="white-space:pre-wrap;font-family:system-ui">${escaped}</pre>`, headers: { ...payload.headers, idempotencyKey } }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch { throw new MailProviderError("provider_connection_uncertain", true); }
  if (!response.ok) {
    const retryAfter = Math.max(60_000, Math.min(1_800_000, (Number(response.headers.get("retry-after")) || 60) * 1000));
    throw new MailProviderError(`provider_http_${response.status}`, response.status === 429 || response.status >= 500, retryAfter);
  }
  const body = await response.json().catch(() => null);
  if (!body || typeof body.messageId !== "string" || !body.messageId || body.messageId.length > 512 || /[\r\n]/.test(body.messageId)) throw new MailProviderError("provider_response_uncertain", true);
  // Provider acceptance does not prove recipient delivery.
  return body.messageId;
}
