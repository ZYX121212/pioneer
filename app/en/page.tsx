import type { Metadata } from "next";
import { EnglishHome } from "../components/EnglishHome";

export const metadata: Metadata = {
  title: "Pioneer — Global Startup Resources & Founder Briefs",
  description: "Understand, compare and choose startup programs, incubators, events and new startup projects around the world.",
  alternates: {
    canonical: "/en",
    languages: { "zh-CN": "/", en: "/en" },
  },
};

export default function EnglishPage() {
  return <EnglishHome />;
}
