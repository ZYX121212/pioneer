import type { Metadata } from "next";
import { AdditionalGuidePage } from "../../components/AdditionalGuidePage";
import { getAdditionalChineseGuide } from "../../data/additionalGuides";
const guide = getAdditionalChineseGuide("close-your-first-sales")!;
export const metadata: Metadata = { title: `${guide.title} — Pioneer 创业指南`, description: guide.description, alternates: { canonical: `/knowledge/${guide.slug}`, languages: { "zh-CN": `/knowledge/${guide.slug}`, en: `/en/knowledge/${guide.slug}` } } };
export default function FirstSalesGuidePage() { return <AdditionalGuidePage guide={guide} />; }
