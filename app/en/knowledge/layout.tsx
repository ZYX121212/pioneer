import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../../knowledge/knowledge-system.css";

export const metadata: Metadata = {
  title: "Founder Decision Guides — Pioneer",
  description: "Practical founder guides for problem discovery, user interviews, MVP design, early users, cofounders and fundraising.",
};

export default function EnglishKnowledgeLayout({ children }: { children: ReactNode }) { return children; }
