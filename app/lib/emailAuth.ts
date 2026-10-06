import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import type { Database } from "../../db/types";
import * as schema from "../../db/authSchema";
import { mailConfiguration, sendResend } from "./mailProvider";

export const AUTH_ORIGIN = "https://pioneer-global-resources.hiayun.chatgpt.site";
export function createEmailAuth(db: Database, runtime: Record<string, unknown>, origin = AUTH_ORIGIN) {
  const secret = String(runtime.PIONEER_AUTH_SECRET ?? "");
  if (secret.length < 32) throw new Error("Email authentication is not configured");
  if (origin !== AUTH_ORIGIN && !/^http:\/\/(localhost|127\.0\.0\.1):300[01]$/.test(origin)) throw new Error("Invalid authentication origin");
  const mail = mailConfiguration(runtime);
  const deliver = async (email: string, url: string, purpose: "verify" | "reset") => {
    if (!mail.config) throw new Error("Account email delivery is not configured");
    const target = new URL(url);
    if (target.origin !== origin) throw new Error("Invalid account email destination");
    await sendResend(mail.config, `account-${purpose}-${crypto.randomUUID()}`, { from: mail.config.from, to: [email], subject: purpose === "verify" ? "Pioneer · 验证邮箱 / Verify your email" : "Pioneer · 重设密码 / Reset your password", text: `Pioneer\n\n${purpose === "verify" ? "验证你的邮箱 / Verify your email" : "重设你的密码 / Reset your password"}\n${url}\n\n如果不是你发起的请求，请忽略此邮件。\nIf you did not request this, ignore this email.`, headers: {} });
  };
  return betterAuth({
    appName: "Pioneer", baseURL: origin, basePath: "/api/auth", secret,
    database: drizzleAdapter(drizzle(db, { schema }), { provider: "sqlite", schema, transaction: false }),
    emailAndPassword: { enabled: true, minPasswordLength: 12, maxPasswordLength: 128, requireEmailVerification: false, revokeSessionsOnPasswordReset: true,
      ...(mail.enabled ? { sendResetPassword: async ({ user, url }: { user: { email: string }; url: string }) => deliver(user.email, url, "reset") } : {}) },
    ...(mail.enabled ? { emailVerification: { sendOnSignUp: false, sendVerificationEmail: async ({ user, url }: { user: { email: string }; url: string }) => deliver(user.email, url, "verify") } } : {}),
    account: { accountLinking: { enabled: false } },
    session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24, cookieCache: { enabled: false } },
    advanced: { cookiePrefix: "pioneer", useSecureCookies: origin.startsWith("https:"), ipAddress: { ipAddressHeaders: ["cf-connecting-ip"] } },
    rateLimit: { enabled: true, storage: "database", window: 60, max: 30, customRules: { "/sign-in/email": { window: 60, max: 5 }, "/sign-up/email": { window: 3600, max: 5 }, "/request-password-reset": { window: 3600, max: 3 }, "/send-verification-email": { window: 3600, max: 3 } } },
  });
}
export async function getEmailAuth() {
  const { env } = await import("cloudflare:workers");
  const origin = env.PIONEER_AUTH_ORIGIN ? String(env.PIONEER_AUTH_ORIGIN) : AUTH_ORIGIN;
  return createEmailAuth(env.DB, env, origin);
}
