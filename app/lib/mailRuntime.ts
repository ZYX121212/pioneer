import { mailConfiguration } from "./mailProvider";
import { accountMailConfiguration } from "./accountMailProvider";
export async function runtimeMailConfiguration() {
  try { const { env } = await import("cloudflare:workers"); return mailConfiguration(env); }
  catch { return mailConfiguration({}); }
}
export async function runtimeAccountMailConfiguration() {
  try { const { env } = await import("cloudflare:workers"); return accountMailConfiguration(env); }
  catch { return accountMailConfiguration({}); }
}
