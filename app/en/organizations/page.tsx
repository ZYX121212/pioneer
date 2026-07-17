import type { Metadata } from "next";
import { EnglishDirectoryPage } from "../../components/EnglishDirectoryPage";

export const metadata: Metadata = {
  title: "Startup Institutions — Pioneer",
  description: "Curated investors, incubators, startup campuses, university platforms and ecosystem builders.",
  alternates: { canonical: "/en/organizations", languages: { "zh-CN": "/organizations", en: "/en/organizations" } },
};

export default function EnglishOrganizationsPage() {
  return <EnglishDirectoryPage type="organization" />;
}
