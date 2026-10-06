import type { Resource } from "../data/resources";
import { globeCities, globeCountries, matchesGlobePlace, type GlobePlace } from "./globeDiscovery";
export type EcosystemPoint = GlobePlace & { count: number; entries: Resource[] };
export function ecosystemPoints(entries: Resource[], level: "country" | "city"): EcosystemPoint[] {
  const unique = [...new Map(entries.map(row => [row.slug, row])).values()];
  return (level === "country" ? globeCountries : globeCities).map(place => {
    const rows = unique.filter(row => matchesGlobePlace(row, place.id));
    return { ...place, count: rows.length, entries: rows };
  }).filter(place => place.count > 0).sort((a,b) => b.count-a.count || a.id.localeCompare(b.id));
}
/** Circle area grows with count, with a small visible baseline for a single resource. */
export function ecosystemRadius(count: number, maximum: number) {
  return Math.sqrt(12 + 88 * Math.max(0,count) / Math.max(1,maximum));
}
export function unlocatedResources(entries: Resource[]) {
  return [...new Map(entries.map(row => [row.slug,row])).values()].filter(row => !globeCountries.some(place => matchesGlobePlace(row, place.id)));
}
