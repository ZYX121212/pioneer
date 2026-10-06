import { getAppUser } from "./appUser";

export async function isSiteAdmin(): Promise<boolean> {
  const user = await getAppUser();
  if (!user || !user.emailVerified) return false;
  const { env } = await import("cloudflare:workers");
  const emails = String(env.ADMIN_EMAILS ?? "").toLowerCase().split(",").map(email => email.trim()).filter(Boolean);
  return emails.includes(user.email.toLowerCase());
}
