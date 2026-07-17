import type { Metadata } from "next";
import { EnglishDirectoryPage } from "../../components/EnglishDirectoryPage";

export const metadata: Metadata = {
  title: "Incubators & Institutions — Pioneer",
  description: "Curated startup institutions, incubators, campuses and ecosystem builders.",
};

export default function EnglishOrganizationsPage() {
  return <EnglishDirectoryPage type="organization" />;
}
