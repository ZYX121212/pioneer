import type { Metadata } from "next";
import { EnglishDirectoryPage } from "../../components/EnglishDirectoryPage";

export const metadata: Metadata = {
  title: "Startup Events — Pioneer",
  description: "Curated startup events, conferences and demo days.",
};

export default function EnglishEventsPage() {
  return <EnglishDirectoryPage type="event" />;
}
