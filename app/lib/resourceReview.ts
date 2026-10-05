export type ReviewInput = { resourceName: string; resourceType: string; resourceUrl: string; deadline: string; whyUseful: string };
export type SourceEvidence = { checkedAt: string; finalUrl?: string; title?: string; excerpt?: string; checks: string[]; httpStatus?: number };
export type ReviewResult = { status: "approved" | "pending" | "rejected"; reason: string; evidence: SourceEvidence };

export function normalizePublicUrl(value: string): string {
  const url = new URL(value);
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (url.protocol !== "https:" || url.username || url.password || (url.port && url.port !== "443") || !host.includes(".") || /(^|\.)(localhost|local|internal|test|invalid|example|onion)$/.test(host) || /^[\d.]+$/.test(host) || host.includes(":") || /^0x[\da-f]+$/i.test(host) || /[\[\]]/.test(host)) throw new Error("public_https_required");
  url.hostname = host; url.hash = "";
  for (const key of [...url.searchParams.keys()]) if (/^(utm_|fbclid$|gclid$)/i.test(key)) url.searchParams.delete(key);
  url.searchParams.sort();
  // A trailing slash is not meaningful for duplicate detection.
  return url.href.replace(/\/$/, "");
}

export function validDeadline(value: string): boolean {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + "T00:00:00Z");
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function officialHosts(urls: string[]): Set<string> {
  // An existing directory link on a shared publishing platform does not verify every publisher.
  const shared = /(^|\.)(github\.com|github\.io|gitlab\.com|linkedin\.com|medium\.com|substack\.com|notion\.site|notion\.so|youtube\.com|youtu\.be|x\.com|twitter\.com|lu\.ma|luma\.com|eventbrite\.com)$/;
  return new Set(urls.flatMap(value => { try { const host = new URL(normalizePublicUrl(value)).hostname; return shared.test(host) ? [] : [host]; } catch { return []; } }));
}

function visibleText(html: string): string {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&(?:amp|nbsp|quot|apos|lt|gt);/g, " ").replace(/\s+/g, " ").trim();
}
function nameConfirmed(name: string, text: string): boolean {
  const normalized = text.toLowerCase().normalize("NFKC");
  const tokens = name.toLowerCase().normalize("NFKC").split(/[^\p{L}\p{N}]+/u).filter(word => word.length > 1 && !["the", "program", "accelerator", "2026", "2027"].includes(word));
  return tokens.length > 0 && tokens.every(token => normalized.includes(token));
}
function dateConfirmed(date: string, text: string): boolean {
  const [year, month, day] = date.split("-").map(Number);
  const fullMonth = new Date(date + "T00:00:00Z").toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  const monthName = `${fullMonth}|${fullMonth.slice(0, 3)}\\.?`;
  const patterns = [
    `\\b${year}[-./]0?${month}[-./]0?${day}\\b`,
    `${year}年\\s*${month}月\\s*${day}日`,
    `\\b(?:${monthName})\\s+${day}(?:st|nd|rd|th)?[ ,]+${year}\\b`,
    `\\b${day}(?:st|nd|rd|th)?\\s+(?:${monthName})[ ,]+${year}\\b`,
  ];
  return patterns.some(pattern => new RegExp(pattern, "i").test(text));
}

export async function reviewResource(input: ReviewInput, knownHosts: Set<string>, fetcher: typeof fetch = fetch, now = new Date()): Promise<ReviewResult> {
  const evidence: SourceEvidence = { checkedAt: now.toISOString(), checks: [] };
  const result = (status: ReviewResult["status"], reason: string): ReviewResult => ({ status, reason, evidence });
  let url: string;
  try { url = normalizePublicUrl(input.resourceUrl); } catch { return result("rejected", "public_https_required"); }
  evidence.checks.push("public_https");
  if (!validDeadline(input.deadline)) return result("pending", "date_format_required");
  // No outbound fetch to unknown hosts, private networks, or arbitrary redirect targets.
  if (!knownHosts.has(new URL(url).hostname)) return result("pending", "unknown_official_source");
  evidence.checks.push("known_official_host");
  if (input.deadline && new Date(input.deadline + "T23:59:59Z").getTime() < now.getTime()) return result("rejected", "historical_window");
  if (input.resourceType === "event" && !input.deadline) return result("pending", "event_date_required");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    let response: Response | undefined;
    for (let redirects = 0; redirects < 4; redirects++) {
      if (!knownHosts.has(new URL(url).hostname)) return result("pending", "redirect_needs_review");
      response = await fetcher(url, { redirect: "manual", signal: controller.signal, headers: { Accept: "text/html", "User-Agent": "Pioneer-Source-Check/1.0" } });
      if (response.status >= 300 && response.status < 400) {
        const target = response.headers.get("location");
        if (!target) return result("pending", "source_unavailable");
        try { url = normalizePublicUrl(new URL(target, url).href); } catch { return result("pending", "redirect_needs_review"); }
        await response.body?.cancel();
        response = undefined;
      } else break;
    }
    if (!response) return result("pending", "redirect_needs_review");
    evidence.httpStatus = response.status; evidence.finalUrl = url;
    if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) { await response.body?.cancel(); return result("pending", "source_unavailable"); }
    const reader = response.body?.getReader();
    if (!reader) return result("pending", "source_unavailable");
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.length;
      if (size > 400_000) { await reader.cancel(); return result("pending", "source_too_large"); }
      chunks.push(chunk.value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const html = new TextDecoder().decode(bytes);
    const text = visibleText(html);
    evidence.title = visibleText(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").slice(0, 160);
    if (!evidence.title || !nameConfirmed(input.resourceName, text)) return result("pending", "name_not_confirmed");
    evidence.checks.push("name_on_official_page");
    if (input.deadline) {
      if (!dateConfirmed(input.deadline, text)) return result("pending", "date_not_confirmed");
      evidence.checks.push("date_on_official_page");
    }
    const position = text.toLowerCase().indexOf(input.resourceName.toLowerCase().split(/\s+/)[0]);
    evidence.excerpt = text.slice(Math.max(0, position), Math.max(0, position) + 160);
    // These checks verify an official link and submitted date, never all benefits or eligibility claims.
    return result("approved", "official_link_checked");
  } catch { return result("pending", "source_unavailable"); }
  finally { clearTimeout(timeout); }
}

export const reviewReasons: Record<string, { zh: string; en: string }> = {
  public_https_required: { zh: "需要公开可访问的 HTTPS 官方链接。", en: "A public HTTPS official link is required." },
  unknown_official_source: { zh: "该域名尚未进入已知官方来源库，等待人工确认归属。", en: "This domain needs an editor to confirm official ownership." },
  historical_window: { zh: "提交的日期已经过去，不能作为当前可行动机会收录。", en: "This date has passed and cannot be published as a current opportunity." },
  event_date_required: { zh: "活动需要提供可核验的日期。", en: "An event needs a verifiable date." },
  name_not_confirmed: { zh: "官方页面中未确认资源名称，需要补充准确名称或具体页面。", en: "The name was not confirmed on the source. Supply the exact name or specific page." },
  date_not_confirmed: { zh: "未在官方页面确认提交的日期，需要补充日期依据。", en: "The submitted date was not confirmed on the official page." },
  source_unavailable: { zh: "官方页面暂时无法读取，保留提交并等待复核。", en: "The source could not be read. Your submission is retained for review." },
  redirect_needs_review: { zh: "来源跳转需要人工核验。", en: "The source redirect needs editor review." },
  source_too_large: { zh: "来源页面超出自动核验范围，等待人工复核。", en: "The source exceeds the automatic check limit and needs review." },
  date_format_required: { zh: "请用 YYYY-MM-DD 提供日期。", en: "Use YYYY-MM-DD for the date." },
  official_link_checked: { zh: "已自动核验官方来源、名称及所填日期，并加入社区资源目录。权益与资格请在行动前再核实。", en: "Official source, name and supplied date checked. Added to the community directory. Recheck benefits and eligibility before acting." },
  duplicate: { zh: "这个资源已经在目录里，直接查看已有档案即可。", en: "This resource is already listed. Open the existing brief." },
  editor_approved: { zh: "编辑已核验来源并收录。", en: "An editor verified the source and published this resource." },
  editor_rejected: { zh: "编辑未通过此次收录，具体原因见说明。", en: "An editor declined this submission; see the explanation." },
};
