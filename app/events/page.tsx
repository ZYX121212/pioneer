import type { Metadata } from "next";
import { DirectoryPage } from "../components/DirectoryPage";

export const metadata: Metadata = {
  title: "全球创业活动与科技大会 — Pioneer",
  description: "发现并比较全球科技大会、Demo Day、路演和创始人活动。",
  alternates: { canonical: "/events", languages: { "zh-CN": "/events", en: "/en/events" } },
};

export default function EventsPage() {
  return <DirectoryPage type="event" />;
}
