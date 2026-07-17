import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const siteVisitors = sqliteTable("site_visitors", {
  visitorId: text("visitor_id").primaryKey(),
  firstSeenAt: text("first_seen_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  lastSeenAt: text("last_seen_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  pageViews: integer("page_views").notNull().default(1),
});

export const sitePageViews = sqliteTable("site_page_views", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  visitorId: text("visitor_id").notNull(),
  path: text("path").notNull().default("/"),
  viewedAt: text("viewed_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const siteEvents = sqliteTable("site_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  visitorId: text("visitor_id").notNull(),
  eventName: text("event_name").notNull(),
  path: text("path").notNull().default("/"),
  target: text("target"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
