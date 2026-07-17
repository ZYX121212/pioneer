import type { Metadata } from "next";
import ResourceDetailPage from "../resources/[slug]/page";

export const metadata: Metadata = {
  title: "WAIC 2026 世界人工智能大会 — Pioneer 深度介绍",
  description: "面向创业者的 WAIC 2026 上海参会指南、场馆选择、创投入口与行动路线。",
};

export default function Waic2026Page() {
  return <ResourceDetailPage params={Promise.resolve({ slug: "waic-shanghai-2026" })} />;
}
