export function json(data: unknown, status = 200) { return Response.json(data, { status, headers: { "Cache-Control": "no-store" } }); }
export function cleanText(value: unknown, limit: number): string { return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, limit) : ""; }
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
export async function requestHash(request: Request): Promise<string> {
  const value = `${request.headers.get("cf-connecting-ip") ?? "local"}|${request.headers.get("user-agent") ?? ""}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}
