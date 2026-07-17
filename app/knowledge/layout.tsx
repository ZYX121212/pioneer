import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./knowledge-system.css";

export const metadata: Metadata = {
  title: "创业决策指南 — Pioneer",
  description: "从发现真问题、完成用户访谈到定义 MVP 和找到首批用户，把创业知识变成下一步行动。",
};

export default function KnowledgeLayout({ children }: { children: ReactNode }) {
  return children;
}
