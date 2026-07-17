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
  referrer: text("referrer"),
  source: text("source"),
  medium: text("medium"),
  campaign: text("campaign"),
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

export const newsletterSubscribers = sqliteTable("newsletter_subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  language: text("language").notNull().default("zh"),
  sourcePath: text("source_path").notNull().default("/"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const resourceSubmissions = sqliteTable("resource_submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  resourceType: text("resource_type").notNull(),
  resourceName: text("resource_name").notNull(),
  resourceUrl: text("resource_url").notNull(),
  location: text("location"),
  deadline: text("deadline"),
  whyUseful: text("why_useful").notNull(),
  submitterName: text("submitter_name").notNull(),
  submitterEmail: text("submitter_email").notNull(),
  relationship: text("relationship").notNull(),
  language: text("language").notNull().default("zh"),
  sourcePath: text("source_path").notNull().default("/submit"),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
