import type { Metadata } from "next";
import { DirectoryPage } from "../components/DirectoryPage";

export const metadata: Metadata = {
  title: "全球创业项目与新产品 — Pioneer",
  description: "发现来自世界各地的新产品和创业团队，理解它们的产品、商业模式与成长阶段。",
  alternates: { canonical: "/startups", languages: { "zh-CN": "/startups", en: "/en/startups" } },
};

export default function StartupsPage() {
  return <DirectoryPage type="startup" />;
}
