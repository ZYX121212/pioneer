import type { Metadata } from "next";
import { EnglishDirectoryPage } from "../../components/EnglishDirectoryPage";

export const metadata: Metadata = {
  title: "Open Programs — Pioneer",
  description: "Curated startup programs, accelerators and founder opportunities.",
  alternates: { canonical: "/en/programs", languages: { "zh-CN": "/programs", en: "/en/programs" } },
};

export default function EnglishProgramsPage() {
  return <EnglishDirectoryPage type="program" />;
}
