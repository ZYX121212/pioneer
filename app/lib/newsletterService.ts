import type { Database } from "../../db/types";
export type NewsletterIdentity = { id: string; email: string };
export type NewsletterPreferences = { language: "zh" | "en"; weekly: boolean; cases: boolean };
type Subscriber = { id: number; email: string; user_id: string | null; language: string; weekly: number; cases: number; status: string; version: number; verified_at: string | null; updated_at: string | null };
export const validEmail = (email: string) => email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export function validatePreferences(value: unknown): NewsletterPreferences {
  if (!value || typeof value !== "object") throw new Error("Invalid notification preferences");
  const row = value as Record<string, unknown>;
  if ((row.language !== "zh" && row.language !== "en") || typeof row.weekly !== "boolean" || typeof row.cases !== "boolean") throw new Error("Choose a language and notification topics");
  return { language: row.language, weekly: row.weekly, cases: row.cases };
}
async function findSubscriber(db: Database, user: NewsletterIdentity): Promise<Subscriber | null> {
  const owned = await db.prepare("SELECT * FROM newsletter_subscribers WHERE user_id = ?").bind(user.id).first<Subscriber>();
  if (owned) return owned;
  return db.prepare("SELECT * FROM newsletter_subscribers WHERE email = ? AND user_id IS NULL").bind(user.email.trim().toLowerCase()).first<Subscriber>();
}
function snapshot(row: Subscriber | null, user: NewsletterIdentity) {
  return { email: row?.email ?? user.email.trim().toLowerCase(), language: (row?.language === "en" ? "en" : "zh") as "zh" | "en", weekly: !!row?.weekly, cases: !!row?.cases, status: row?.status === "unsubscribed" ? "unsubscribed" : row?.verified_at ? "registered" : row ? "interest" : "none", version: row?.version ?? 0, updatedAt: row?.updated_at ?? null };
}
export async function loadNewsletter(db: Database, user: NewsletterIdentity) { return snapshot(await findSubscriber(db, user), user); }
export async function registerNewsletterInterest(db: Database, email: string, language: "zh" | "en", path: string, requester: string): Promise<"saved" | "limited"> {
  // An anonymous repeat must never change preferences or reactivate an opt-out.
  const existing = await db.prepare("SELECT id FROM newsletter_subscribers WHERE email = ?").bind(email).first();
  if (existing) return "saved";
  const quota = await db.prepare("SELECT COUNT(*) AS n FROM newsletter_subscribers WHERE requester_hash = ? AND created_at >= datetime('now', '-1 hour')").bind(requester).first<{ n: number }>();
  if ((quota?.n ?? 0) >= 5) return "limited";
  const inserted = await db.prepare("INSERT INTO newsletter_subscribers (email, language, source_path, status, requester_hash, updated_at) SELECT ?, ?, ?, 'active', ?, CURRENT_TIMESTAMP WHERE (SELECT COUNT(*) FROM newsletter_subscribers WHERE requester_hash = ? AND created_at >= datetime('now', '-1 hour')) < 5 ON CONFLICT(email) DO NOTHING RETURNING id").bind(email, language, path, requester, requester).first();
  return inserted || await db.prepare("SELECT id FROM newsletter_subscribers WHERE email = ?").bind(email).first() ? "saved" : "limited";
}
export async function saveNewsletter(db: Database, user: NewsletterIdentity, version: number, preferences: NewsletterPreferences) {
  const row = await findSubscriber(db, user);
  const status = preferences.weekly || preferences.cases ? "active" : "unsubscribed";
  const values = [preferences.language, Number(preferences.weekly), Number(preferences.cases), status];
  let changed: Subscriber | null;
  if (row) {
    changed = await db.prepare("UPDATE newsletter_subscribers SET language = ?, weekly = ?, cases = ?, status = ?, user_id = ?, verified_at = COALESCE(verified_at, CURRENT_TIMESTAMP), version = version + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND version = ? AND (user_id = ? OR (user_id IS NULL AND email = ?)) RETURNING *").bind(...values, user.id, row.id, version, user.id, user.email.trim().toLowerCase()).first<Subscriber>();
  } else {
    if (version !== 0) return null;
    changed = await db.prepare("INSERT INTO newsletter_subscribers (email, language, weekly, cases, status, user_id, source_path, verified_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, '/notifications', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ON CONFLICT DO NOTHING RETURNING *").bind(user.email.trim().toLowerCase(), ...values, user.id).first<Subscriber>();
  }
  return changed ? snapshot(changed, user) : null;
}
export async function unsubscribeNewsletter(db: Database, user: NewsletterIdentity, version: number) {
  const row = await findSubscriber(db, user);
  if (!row) return version === 0 ? saveNewsletter(db, user, version, { language: "zh", weekly: false, cases: false }) : null;
  return saveNewsletter(db, user, version, { language: row.language === "en" ? "en" : "zh", weekly: false, cases: false });
}
async function tokenHash(token: string) {
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token)))].map(byte => byte.toString(16).padStart(2, "0")).join("");
}
// Email delivery can issue this capability without exposing an email in the URL.
export async function issueUnsubscribeToken(db: Database, subscriberId: number) {
  const token = [...crypto.getRandomValues(new Uint8Array(32))].map(byte => byte.toString(16).padStart(2, "0")).join("");
  const issued = await db.prepare("INSERT INTO newsletter_unsubscribe_tokens (token_hash, subscriber_id) SELECT ?, id FROM newsletter_subscribers WHERE id = ? AND verified_at IS NOT NULL AND status = 'active' RETURNING token_hash").bind(await tokenHash(token), subscriberId).first();
  if (!issued) throw new Error("Only confirmed active subscribers can receive an unsubscribe link");
  return token;
}
export async function unsubscribeByToken(db: Database, token: string) {
  if (!/^[a-f0-9]{64}$/.test(token)) return false;
  const result = await db.prepare("UPDATE newsletter_subscribers SET status = 'unsubscribed', weekly = 0, cases = 0, version = version + 1, updated_at = CURRENT_TIMESTAMP WHERE id = (SELECT subscriber_id FROM newsletter_unsubscribe_tokens WHERE token_hash = ?) RETURNING id").bind(await tokenHash(token)).first();
  return !!result;
}
