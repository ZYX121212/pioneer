import type { Metadata } from "next";
import { EnglishDirectoryPage } from "../../components/EnglishDirectoryPage";

export const metadata: Metadata = {
  title: "Startup Projects — Pioneer",
  description: "Curated startup projects and product signals from global ecosystems.",
  alternates: { canonical: "/en/startups", languages: { "zh-CN": "/startups", en: "/en/startups" } },
};

export default function EnglishStartupsPage() {
  return <EnglishDirectoryPage type="startup" />;
}
