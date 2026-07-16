export async function getD1() {
  const { env } = await import("cloudflare:workers");

  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let the hosting platform inject the real binding before using the audience counter."
    );
  }

  return env.DB;
}
