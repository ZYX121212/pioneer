import type { Metadata } from "next";
import { AdditionalGuidePage } from "../../components/AdditionalGuidePage";
import { getAdditionalChineseGuide } from "../../data/additionalGuides";
const guide = getAdditionalChineseGuide("test-your-pricing")!;
export const metadata: Metadata = { title: `${guide.title} — Pioneer 创业指南`, description: guide.description, alternates: { canonical: `/knowledge/${guide.slug}`, languages: { "zh-CN": `/knowledge/${guide.slug}`, en: `/en/knowledge/${guide.slug}` } } };
export default function PricingGuidePage() { return <AdditionalGuidePage guide={guide} />; }
