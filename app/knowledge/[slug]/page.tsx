import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdditionalGuidePage } from "../../components/AdditionalGuidePage";
import { additionalChineseGuides, getAdditionalChineseGuide } from "../../data/additionalGuides";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return additionalChineseGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getAdditionalChineseGuide(slug);
  if (!guide) return {};
  return {
    title: `${guide.title} — Pioneer 创业指南`,
    description: guide.description,
    alternates: {
      canonical: `/knowledge/${guide.slug}`,
      languages: { "zh-CN": `/knowledge/${guide.slug}`, en: `/en/knowledge/${guide.slug}` },
    },
  };
}

export default async function ChineseGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getAdditionalChineseGuide(slug);
  if (!guide) notFound();
  return <AdditionalGuidePage guide={guide} />;
}
