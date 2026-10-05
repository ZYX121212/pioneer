import { getD1 } from "../../db/d1";
import { communityToResource } from "./communityResource";
export { communityToResource } from "./communityResource";
export { communityExpired, communityFreshness, communityStatus } from "./communityFreshness";
import { listCommunity } from "./submissionService";

export async function communityEntries(type?: string, lang: "zh" | "en" = "zh") {
  try { return { resources: (await listCommunity(await getD1(), type)).filter(row => row.resource_type !== "knowledge").map(row => communityToResource(row, lang)), unavailable: false }; }
  catch (error) { console.error("Community directory unavailable", error); return { resources: [], unavailable: true }; }
}
