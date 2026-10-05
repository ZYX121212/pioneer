import { mailConfiguration } from "./mailProvider";
export async function runtimeMailConfiguration() {
  try { const { env } = await import("cloudflare:workers"); return mailConfiguration(env); }
  catch { return mailConfiguration({}); }
}
