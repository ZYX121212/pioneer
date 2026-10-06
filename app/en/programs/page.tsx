import type { Metadata } from "next";
import { ProgramsPageContent } from "../../components/ProgramsPageContent";

export const metadata: Metadata = {
  title: "Open Programs — Pioneer",
  description: "Curated startup programs, accelerators and founder opportunities.",
  alternates: { canonical: "/en/programs", languages: { "zh-CN": "/programs", en: "/en/programs" } },
};

export default function EnglishProgramsPage() {
  return <ProgramsPageContent lang="en" />;
}
