import type { Metadata } from "next";
import { EnglishDirectoryPage } from "../../components/EnglishDirectoryPage";

export const metadata: Metadata = {
  title: "Startup Projects — Pioneer",
  description: "Curated startup projects and product signals from global ecosystems.",
};

export default function EnglishStartupsPage() {
  return <EnglishDirectoryPage type="startup" />;
}
