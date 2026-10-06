import { matchesGlobePlace } from "./globeDiscovery";
import type { Resource } from "../data/resources";
import { getEnglishResource } from "../data/english";
export const homeRegions = [
  { id: "north-america", zh: "北美", en: "North America", pattern: /美国|加拿大|United States|Canada/i },
  { id: "europe", zh: "欧洲", en: "Europe", pattern: /英国|法国|德国|芬兰|丹麦|葡萄牙|瑞典|荷兰|西班牙|瑞士|爱沙尼亚|United Kingdom|France|Germany|Finland|Denmark|Portugal|Sweden|Netherlands|Spain|Switzerland|Estonia/i },
  { id: "asia", zh: "亚洲", en: "Asia", pattern: /中国|新加坡|阿联酋|日本|韩国|印度|印尼|China|Singapore|United Arab Emirates|Japan|Korea|India|Indonesia/i },
  { id: "latin-america", zh: "拉美", en: "Latin America", pattern: /Mexico|墨西哥|巴西|阿根廷|智利|哥伦比亚|Brazil|Argentina|Chile|Colombia/i },
  { id: "oceania", zh: "大洋洲", en: "Oceania", pattern: /澳大利亚|新西兰|Australia|New Zealand/i },
] as const;
export function matchesHomeRegion(resource: Resource, region: string) {
  if (region === "all") return true;
  if (region.startsWith("country:") || region.startsWith("city:")) return matchesGlobePlace(resource, region);
  const preset = homeRegions.find(row => row.id === region);
  return !!preset?.pattern.test([resource.location, getEnglishResource(resource.slug)?.location ?? ""].join(" "));
}
