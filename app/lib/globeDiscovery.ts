import regions from "../data/chinaRegions.json";
import countries from "../data/globePlaces.json";
import type { Resource } from "../data/resources";
import { getEnglishResource } from "../data/english";
export type GlobePlace = { id: string; zh: string; en: string; lon: number; lat: number; aliases: string[]; parent?: string };
const cityRows: [string, string, string, number, number][] = [
 ['CHN','上海','Shanghai',121.47,31.23],['CHN','北京','Beijing',116.4,39.9],['CHN','深圳','Shenzhen',114.06,22.54],['CHN','杭州','Hangzhou',120.16,30.27],['CHN','苏州','Suzhou',120.59,31.3],['CHN','广州','Guangzhou',113.26,23.13],['CHN','香港','Hong Kong',114.17,22.32],['CHN','澳门','Macao',113.55,22.2],['CHN','台北','Taipei',121.56,25.03],['CHN','高雄','Kaohsiung',120.3,22.63],
 ['JPN','东京','Tokyo',139.69,35.68],['JPN','大阪','Osaka',135.5,34.69],['SGP','新加坡','Singapore',103.82,1.35],
 ['USA','旧金山','San Francisco',-122.42,37.77],['USA','纽约','New York',-74,40.71],['USA','波士顿','Boston',-71.06,42.36],['USA','奥斯汀','Austin',-97.74,30.27],['USA','门洛帕克','Menlo Park',-122.18,37.45],['USA','山景城','Mountain View',-122.08,37.39],['USA','圣何塞','San Jose',-121.89,37.34],['USA','伯克利','Berkeley',-122.27,37.87],
 ['USA','帕洛阿尔托','Palo Alto',-122.14,37.44],['USA','森尼韦尔','Sunnyvale',-122.04,37.37],['USA','剑桥','Cambridge',-71.11,42.37],['USA','德文斯','Devens',-71.61,42.54],['USA','休斯顿','Houston',-95.37,29.76],['USA','拉斯维加斯','Las Vegas',-115.14,36.17],['USA','纽瓦克','Newark',-74.17,40.74],['USA','费城','Philadelphia',-75.17,39.95],['USA','匹兹堡','Pittsburgh',-80,40.44],['USA','科斯塔梅萨','Costa Mesa',-117.92,33.64],['CHN','嘉兴','Jiaxing',120.75,30.75],['CHN','酒泉','Jiuquan',98.49,39.74],['DEU','慕尼黑','Munich',11.58,48.14],['DNK','哥本哈根','Copenhagen',12.57,55.68],['AUS','墨尔本','Melbourne',144.96,-37.81],['ARE','阿布扎比','Abu Dhabi',54.38,24.45],
 ['GBR','伦敦','London',-.12,51.5],['FRA','巴黎','Paris',2.35,48.85],['DEU','柏林','Berlin',13.4,52.52],['FIN','赫尔辛基','Helsinki',24.94,60.17],['PRT','里斯本','Lisbon',-9.14,38.72],['ARE','迪拜','Dubai',55.27,25.2],['KOR','首尔','Seoul',126.98,37.57],['IND','班加罗尔','Bengaluru',77.59,12.97],['AUS','悉尼','Sydney',151.2,-33.87],['CAN','多伦多','Toronto',-79.38,43.65],
];
export const globeCountries: GlobePlace[] = countries;
export const globeCities: GlobePlace[] = cityRows.map(([country,zh,en,lon,lat])=>({id:`city:${country}:${en}`,parent:`country:${country}`,zh,en,lon,lat,aliases:[en,...(en === "Macao" ? ["Macau", "澳門"] : en === "Taipei" ? ["臺北"] : [])]}));
export const chinaRegions: GlobePlace[] = regions;
export const globePlaces = [...globeCountries,...chinaRegions,...globeCities];
export function locationLabel(id: string, lang: 'zh'|'en') { return globePlaces.find(p=>p.id===id)?.[lang]; }
function includesPlace(text: string, place: GlobePlace) {
 return [place.zh,...place.aliases].some(name=>/[^\x00-\x7F]/.test(name)?text.includes(name):new RegExp(`(?:^|[^a-z])${name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}(?:$|[^a-z])`,'i').test(text));
}
export function matchesGlobePlace(resource: Resource, id: string): boolean {
 const place=globePlaces.find(p=>p.id===id); if(!place) return false;
 const text=`${resource.location} ${getEnglishResource(resource.slug)?.location??''}`;
 if(place.parent) return includesPlace(text,place) && matchesGlobePlace(resource,place.parent);
 const direct=includesPlace(text,place);
 if(direct) return true;
 // A documented city in a global-only location can identify its country; an explicit conflicting country cannot.
 const hasCountry=globeCountries.some(country=>includesPlace(text,country));
 return !hasCountry && globeCities.some(city=>city.parent===place.id && includesPlace(text,city));
}
