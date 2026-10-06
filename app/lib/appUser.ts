import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getChatGPTUser, type ChatGPTUser } from "../chatgpt-auth";
import { getEmailAuth } from "./emailAuth";
export type AppUser = ChatGPTUser & { provider: "email" | "chatgpt"; emailVerified: boolean };
export async function getAppUser(): Promise<AppUser | null> {
  const requestHeaders = await headers();
  if (/\b(?:__Secure-)?pioneer\.session_token=/.test(requestHeaders.get("cookie") ?? "")) {
    const result = await (await getEmailAuth()).api.getSession({ headers: requestHeaders });
    if (result) return { id: `email:${result.user.id}`, email: result.user.email, displayName: result.user.name || result.user.email, fullName: result.user.name || null, provider: "email", emailVerified: result.user.emailVerified };
  }
  const user = await getChatGPTUser();
  return user ? { ...user, provider: "chatgpt", emailVerified: true } : null;
}
export function accountReturnPath(value: string | undefined, fallback = "/workspace") {
  try {
    if (!value?.startsWith("/") || value.startsWith("//")) return fallback;
    const url = new URL(value, "https://pioneer.local");
    if (url.origin !== "https://pioneer.local" || /\/(api|login|signin-with-chatgpt|signout-with-chatgpt|callback)(\/|$)/.test(url.pathname)) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch { return fallback; }
}

export async function requireAppUser(returnTo: string): Promise<AppUser> {
  const user = await getAppUser();
  if (user) return user;
  redirect(`/login?return_to=${encodeURIComponent(accountReturnPath(returnTo))}`);
}
