import type { Metadata } from "next";
import { DirectoryPage } from "../components/DirectoryPage";

export const metadata: Metadata = {
  title: "全球创业机构与投资生态 — Pioneer",
  description: "理解并比较投资机构、孵化器、创业园区和大学创新平台的真实入口。",
  alternates: { canonical: "/organizations", languages: { "zh-CN": "/organizations", en: "/en/organizations" } },
};

export default function OrganizationsPage() {
  return <DirectoryPage type="organization" />;
}
