import { getD1 } from "../../../../db/d1";
import { getAppUser } from "../../../lib/appUser";
import { json, sameOrigin } from "../../../lib/http";
import { loadWorkspace } from "../../../lib/workspaceService";
export const dynamic = "force-dynamic";
function failure(request: Request, error: string, code: string, status: number) {
  if (!request.headers.get("accept")?.includes("text/html")) return json({ error, code }, status);
  const en = new URL(request.url).searchParams.get("lang") === "en", prefix = en ? "/en" : "";
  const messages: Record<string, string> = en ? {
    invalid_origin: "Open the download link from your workspace.", signin_required: "Sign in with your email account to download your private workspace.", invalid_version: "Prepare a backup in your workspace before downloading.", version_conflict: "Your workspace has changed. Refresh it and prepare a new backup, or copy the complete preview you already prepared.", unavailable: "The download is temporarily unavailable. Your saved data is unchanged. Copy your prepared backup or try again.",
  } : {
    invalid_origin: "请从工作台打开备份下载链接。", signin_required: "请使用邮箱登录，再下载私密工作台备份。", invalid_version: "请先在工作台准备备份，再下载文件。", version_conflict: "工作台资料已更新。请刷新并重新准备备份，或复制此前已准备的完整预览。", unavailable: "备份暂时无法下载，已保存资料未改变。可复制已准备的完整备份，或稍后重试。",
  };
  const href = code === "signin_required" ? `${prefix}/login?return_to=${encodeURIComponent(prefix + "/workspace")}` : `${prefix}/workspace`;
  return new Response(`<!doctype html><html lang="${en ? "en" : "zh-CN"}"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${en ? "Workspace backup" : "工作台备份"} · Pioneer</title><main style="max-width:640px;margin:64px auto;padding:24px;font:18px/1.7 system-ui;color:#243d30"><h1>${en ? "Backup download" : "备份下载"}</h1><p>${messages[code]}</p><a href="${href}">${en ? "Return to your workspace" : "返回工作台"}</a></main></html>`, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer" } });
}
export async function GET(request: Request) {
  if (!sameOrigin(request) || request.headers.get("sec-fetch-site") === "cross-site") return failure(request, "Open the export from your workspace", "invalid_origin", 403);
  const user = await getAppUser();
  if (!user) return failure(request, "Sign in to download your workspace", "signin_required", 401);
  const value = new URL(request.url).searchParams.get("version");
  if (!value || !/^(0|[1-9]\d{0,15})$/.test(value) || !Number.isSafeInteger(Number(value))) return failure(request, "Prepare a backup in your workspace before downloading", "invalid_version", 400);
  try {
    const record = await loadWorkspace(await getD1(), user.id);
    if (record.version !== Number(value)) return failure(request, "Your workspace changed after the backup preview. Refresh and export again, or copy your prepared backup.", "version_conflict", 409);
    return new Response(JSON.stringify({ schemaVersion: 1, exportedAt: new Date().toISOString(), ...record }, null, 2), { headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="pioneer-workspace.json"',
      "Cache-Control": "private, no-store",
      "Vary": "Cookie, OAI-Authenticated-User-ID",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    } });
  } catch (error) {
    console.error("Workspace export unavailable", error);
    return failure(request, "Download temporarily unavailable. Your saved data is unchanged; copy your prepared backup or retry.", "unavailable", 503);
  }
}
