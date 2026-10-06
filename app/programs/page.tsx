import type { Metadata } from "next";
import { ProgramsPageContent } from "../components/ProgramsPageContent";

export const metadata: Metadata = {
  title: "全球创业计划与加速器 — Pioneer",
  description: "比较全球加速器、创业比赛、资助与国际落地计划，先判断是否适合，再决定是否申请。",
  alternates: { canonical: "/programs", languages: { "zh-CN": "/programs", en: "/en/programs" } },
};

export default function ProgramsPage() {
  return <ProgramsPageContent lang="zh" />;
}
