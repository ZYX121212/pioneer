import { getChatGPTUser } from "../chatgpt-auth";

export async function isSiteAdmin(): Promise<boolean> {
  const user = await getChatGPTUser();
  if (!user) return false;
  const { env } = await import("cloudflare:workers");
  const emails = String(env.ADMIN_EMAILS ?? "").toLowerCase().split(",").map(email => email.trim()).filter(Boolean);
  return emails.includes(user.email.toLowerCase());
}
