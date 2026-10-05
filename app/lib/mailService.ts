import type { Database } from "../../db/types";
import type { MailEdition } from "./mailContent";
import { issueUnsubscribeToken } from "./newsletterService";
import { inspectResend, MailProviderError, sendResend, type MailConfig, type MailPayload } from "./mailProvider";
type Campaign = { id: string; topic: string; content: string; valid_until: string | null };
type Subscriber = { id: number; email: string; language: string; version: number; status: string; weekly: number; cases: number; verified_at: string | null };
type Delivery = { id: string; campaign_id: string; subscriber_id: number; subscriber_version: number; payload: string; status: string; attempts: number; first_attempt_at: number | null; next_attempt_at: number; lease_until: number; provider_id: string | null };
const withinRetryWindow = (row: Delivery, now: number) => row.first_attempt_at === null || now - row.first_attempt_at < 23 * 60 * 60 * 1000;
const validCampaign = (row: Campaign | MailEdition, now: Date) => !("valid_until" in row ? row.valid_until : row.validUntil) || now.getTime() < Date.parse(("valid_until" in row ? row.valid_until : row.validUntil)!);
const eligible = (row: Subscriber | null, topic: string) => !!row && row.status === "active" && !!row.verified_at && (topic === "weekly" ? row.weekly === 1 : row.cases === 1);
export async function campaignPreview(db: Database, edition: MailEdition) {
  const stored = await db.prepare("SELECT * FROM mail_campaigns WHERE id = ?").bind(edition.id).first<Campaign>();
  const content: MailEdition = stored ? JSON.parse(stored.content) : edition;
  const counts = await db.prepare(`SELECT language, COUNT(*) AS n FROM newsletter_subscribers WHERE status = 'active' AND verified_at IS NOT NULL AND ${content.topic === "weekly" ? "weekly" : "cases"} = 1 GROUP BY language`).all<{ language: string; n: number }>();
  return { edition: content, recipients: counts.results, existing: !!stored };
}
export async function enqueueCampaign(db: Database, edition: MailEdition, config: MailConfig, actor: string, now = new Date()) {
  if (!validCampaign(edition, now)) throw new Error("Campaign expired");
  await db.prepare("INSERT INTO mail_campaigns (id, topic, content, valid_until, actor) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING").bind(edition.id, edition.topic, JSON.stringify(edition), edition.validUntil, actor).run();
  const campaign = (await db.prepare("SELECT * FROM mail_campaigns WHERE id = ?").bind(edition.id).first<Campaign>())!;
  if (!validCampaign(campaign, now)) throw new Error("Campaign expired");
  const stored: MailEdition = JSON.parse(campaign.content);
  const candidates = await db.prepare(`SELECT s.* FROM newsletter_subscribers s WHERE s.status = 'active' AND s.verified_at IS NOT NULL AND s.${stored.topic === "weekly" ? "weekly" : "cases"} = 1 AND NOT EXISTS (SELECT 1 FROM mail_deliveries d WHERE d.campaign_id = ? AND d.subscriber_id = s.id) ORDER BY s.id LIMIT 20`).bind(campaign.id).all<Subscriber>();
  let added = 0;
  for (const recipient of candidates.results) {
    const token = await issueUnsubscribeToken(db, recipient.id).catch(() => null); if (!token) continue;
    const lang = recipient.language === "en" ? "en" : "zh", copy = stored[lang], unsubscribe = `${config.origin}${lang === "en" ? "/en" : ""}/unsubscribe#token=${token}`;
    const payload: MailPayload = { from: config.from, to: [recipient.email], subject: copy.subject, text: `${copy.text}\n\n${lang === "en" ? "You confirmed this topic in your Pioneer account. Manage preferences:" : "你在 Pioneer 账号中确认了此通知主题。管理偏好："}\n${config.origin}${lang === "en" ? "/en" : ""}/notifications\n${lang === "en" ? "Stop all email updates:" : "退出全部邮件通知："}\n${unsubscribe}`, headers: { "List-Unsubscribe": `<${unsubscribe}>` } };
    const result = await db.prepare("INSERT INTO mail_deliveries (id, campaign_id, subscriber_id, subscriber_version, payload) SELECT ?, ?, id, version, ? FROM newsletter_subscribers WHERE id = ? AND version = ? AND status = 'active' AND verified_at IS NOT NULL ON CONFLICT(id) DO NOTHING RETURNING id").bind(`${campaign.id}/${recipient.id}`, campaign.id, JSON.stringify(payload), recipient.id, recipient.version).first();
    if (result) added++;
  }
  return { id: campaign.id, added };
}
export async function drainCampaign(db: Database, campaignId: string, config: MailConfig, now = new Date(), fetcher: typeof fetch = fetch) {
  const campaign = await db.prepare("SELECT * FROM mail_campaigns WHERE id = ?").bind(campaignId).first<Campaign>(); if (!campaign) throw new Error("Campaign missing");
  const timestamp = now.getTime();
  const rows = await db.prepare("SELECT * FROM mail_deliveries WHERE campaign_id = ? AND ((status IN ('queued', 'retry') AND next_attempt_at <= ?) OR (status = 'sending' AND lease_until <= ?)) ORDER BY created_at, id LIMIT 3").bind(campaignId, timestamp, timestamp).all<Delivery>();
  for (const candidate of rows.results) {
    if (!withinRetryWindow(candidate, timestamp)) { await db.prepare("UPDATE mail_deliveries SET status = 'uncertain', error = 'retry_window_closed' WHERE id = ? AND status IN ('sending','retry','queued')").bind(candidate.id).run(); continue; }
    const claim = await db.prepare("UPDATE mail_deliveries SET status = 'sending', attempts = attempts + 1, first_attempt_at = COALESCE(first_attempt_at, ?), lease_until = ? WHERE id = ? AND attempts = ? AND ((status IN ('queued','retry') AND next_attempt_at <= ?) OR (status = 'sending' AND lease_until <= ?)) RETURNING *").bind(timestamp, timestamp + 60_000, candidate.id, candidate.attempts, timestamp, timestamp).first<Delivery>(); if (!claim) continue;
    const recipient = await db.prepare("SELECT * FROM newsletter_subscribers WHERE id = ?").bind(claim.subscriber_id).first<Subscriber>();
    if (!validCampaign(campaign, now) || !eligible(recipient, campaign.topic) || recipient?.version !== claim.subscriber_version) { await db.prepare("UPDATE mail_deliveries SET status = 'cancelled', error = 'expired_or_preferences_changed' WHERE id = ? AND attempts = ? AND status = 'sending'").bind(claim.id, claim.attempts).run(); continue; }
    try {
      const id = await sendResend(config, claim.id, JSON.parse(claim.payload), fetcher);
      await db.prepare("UPDATE mail_deliveries SET status = 'accepted', provider_id = ?, error = NULL WHERE id = ? AND attempts = ? AND status = 'sending'").bind(id, claim.id, claim.attempts).run();
    } catch (error) {
      const provider = error instanceof MailProviderError ? error : new MailProviderError("local_write_uncertain", true);
      await db.prepare("UPDATE mail_deliveries SET status = ?, error = ?, next_attempt_at = ? WHERE id = ? AND attempts = ? AND status = 'sending'").bind(provider.retryable ? "retry" : "failed", provider.code, timestamp + provider.retryAfter, claim.id, claim.attempts).run();
    }
  }
  return campaignStatus(db, campaignId);
}
export async function inspectCampaign(db: Database, campaignId: string, config: MailConfig, fetcher: typeof fetch = fetch) {
  const rows = await db.prepare("SELECT * FROM mail_deliveries WHERE campaign_id = ? AND status IN ('accepted','delivered','undeliverable') AND provider_id IS NOT NULL ORDER BY checked_at, id LIMIT 3").bind(campaignId).all<Delivery>();
  for (const row of rows.results) {
    try { const status = await inspectResend(config, row.provider_id!, fetcher); await db.prepare("UPDATE mail_deliveries SET status = ?, checked_at = CURRENT_TIMESTAMP, error = NULL WHERE id = ? AND status IN ('accepted','delivered','undeliverable')").bind(status, row.id).run(); }
    catch { await db.prepare("UPDATE mail_deliveries SET checked_at = CURRENT_TIMESTAMP, error = 'provider_status_unavailable' WHERE id = ?").bind(row.id).run(); }
  }
  return campaignStatus(db, campaignId);
}
export async function campaignStatus(db: Database, campaignId: string) {
  const statuses = await db.prepare("SELECT status, COUNT(*) AS n FROM mail_deliveries WHERE campaign_id = ? GROUP BY status").bind(campaignId).all<{ status: string; n: number }>();
  const rows = await db.prepare("SELECT id, status, attempts, error, provider_id, checked_at, next_attempt_at FROM mail_deliveries WHERE campaign_id = ? ORDER BY created_at DESC, id DESC LIMIT 30").bind(campaignId).all();
  return { id: campaignId, counts: statuses.results, deliveries: rows.results };
}

export async function retryFailedCampaign(db: Database, campaignId: string, now = new Date()) {
  const campaign = await db.prepare("SELECT * FROM mail_campaigns WHERE id = ?").bind(campaignId).first<Campaign>();
  if (!campaign || !validCampaign(campaign, now)) throw new Error("Campaign expired");
  // Only explicit rejection can open a new retry window. Unknown outcomes stay held.
  const result = await db.prepare("UPDATE mail_deliveries SET status = 'queued', first_attempt_at = NULL, next_attempt_at = 0, lease_until = 0 WHERE campaign_id = ? AND status = 'failed' AND provider_id IS NULL AND error IN ('provider_http_400','provider_http_401','provider_http_403','provider_http_422')").bind(campaignId).run();
  return { ...await campaignStatus(db, campaignId), requeued: result.meta.changes };
}
