import { getD1 } from "../../../db/d1";
import { getChatGPTUser } from "../../chatgpt-auth";
import { json, sameOrigin } from "../../lib/http";
import { clearWorkspace, loadWorkspace, writeWorkspace } from "../../lib/workspaceService";
import { validateWorkspace } from "../../lib/workspaceModel";
export const dynamic = "force-dynamic";
export async function GET() {
  const user = await getChatGPTUser(); if (!user) return json({ error: "Sign in to open your private workspace", code: "signin_required" }, 401);
  try { return json(await loadWorkspace(await getD1(), user.id)); } catch (error) { console.error("Workspace unavailable", error); return json({ error: "Workspace temporarily unavailable", code: "unavailable" }, 503); }
}
async function mutate(request: Request, clear: boolean) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin" }, 403);
  const user = await getChatGPTUser(); if (!user) return json({ error: "Sign in before saving", code: "signin_required" }, 401);
  let payload: Record<string, unknown>;
  try { const body = await request.text(); if (new TextEncoder().encode(body).length > 160_000) return json({ error: "Workspace is too large" }, 413); payload = JSON.parse(body); if (!payload || typeof payload !== "object" || !Number.isSafeInteger(payload.version) || Number(payload.version) < 0) throw new Error("Invalid workspace version"); } catch { return json({ error: "Invalid workspace request" }, 400); }
  let state;
  try { if (!clear) state = validateWorkspace(payload.state); } catch (error) { return json({ error: error instanceof Error ? error.message : "Invalid workspace" }, 400); }
  try {
    const db = await getD1();
    const result = clear ? await clearWorkspace(db, user.id, Number(payload.version)) : await writeWorkspace(db, user.id, Number(payload.version), state!);
    return result ? json(result) : json({ error: "Another page changed your workspace. Refresh before saving; your draft is retained.", code: "version_conflict" }, 409);
  } catch (error) { console.error("Workspace save failed", error); return json({ error: "Your change was not saved. Keep your draft and retry.", code: "unavailable" }, 503); }
}
export async function PUT(request: Request) { return mutate(request, false); }
export async function DELETE(request: Request) { return mutate(request, true); }
