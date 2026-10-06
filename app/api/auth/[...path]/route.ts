import { getEmailAuth } from "../../../lib/emailAuth";
import { json } from "../../../lib/http";
export const dynamic = "force-dynamic";
const allowed = new Set(["sign-up/email", "sign-in/email", "sign-out", "get-session", "request-password-reset", "reset-password", "change-password", "send-verification-email", "verify-email"]);
async function handle(request: Request) {
  const path = new URL(request.url).pathname.slice("/api/auth/".length);
  const resetCallback = /^reset-password\/[a-zA-Z0-9_-]{1,256}$/.test(path);
  if (!allowed.has(path) && !resetCallback) return json({ error: "Unknown account action" }, 404);
  if (request.method === "GET" && !["get-session", "verify-email"].includes(path) && !resetCallback) return json({ error: "Use POST for this account action" }, 405);
  if (request.method === "POST") {
    if (resetCallback) return json({ error: "Use GET for this link" }, 405);
    if (!request.headers.get("origin") || request.headers.get("origin") !== new URL(request.url).origin) return json({ error: "Invalid request origin" }, 403);
    if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "Use JSON" }, 415);
    if (Number(request.headers.get("content-length")) > 8192) return json({ error: "Account request too large" }, 413);
    const text = await request.clone().text();
    if (new TextEncoder().encode(text).length > 8192) return json({ error: "Account request too large" }, 413);
  }
  try {
    const response = await (await getEmailAuth()).handler(request);
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return json({ error: "Email account service temporarily unavailable", code: "account_unavailable" }, 503);
  }
}
export const GET = handle;
export const POST = handle;
