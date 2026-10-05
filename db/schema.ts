import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
  shareToken: text("share_token").unique(),
  reviewToken: text("review_token").unique(),
  canonicalUrl: text("canonical_url"),
  idempotencyKey: text("idempotency_key").unique(),
  requesterHash: text("requester_hash"),
  stage: text("stage").notNull().default("any"),
  reviewEvidence: text("review_evidence"),
  reviewReason: text("review_reason"),
  reviewedAt: text("reviewed_at"),
  reviewer: text("reviewer"),
  publishedSlug: text("published_slug"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, table => [index("idx_submissions_status_created").on(table.status, table.createdAt), index("idx_submissions_requester_created").on(table.requesterHash, table.createdAt)]);


export const communityResources = sqliteTable("community_resources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  submissionId: integer("submission_id").notNull().unique(),
  canonicalUrl: text("canonical_url").notNull().unique(),
  resourceType: text("resource_type").notNull(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  location: text("location"),
  deadline: text("deadline"),
  stage: text("stage").notNull().default("any"),
  contributorReason: text("contributor_reason").notNull(),
  sourceTitle: text("source_title").notNull(),
  sourceExcerpt: text("source_excerpt").notNull(),
  evidence: text("evidence").notNull(),
  status: text("status").notNull().default("published"),
  verifiedAt: text("verified_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, table => [index("idx_community_status_type_created").on(table.status, table.resourceType, table.createdAt)]);

export const moderationActions = sqliteTable("moderation_actions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  submissionId: integer("submission_id").notNull(),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  reason: text("reason").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const founderWorkspaces = sqliteTable("founder_workspaces", {
  userId: text("user_id").primaryKey(),
  state: text("state").notNull().default("{}"),
  version: integer("version").notNull().default(1),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const resourceReports = sqliteTable("resource_reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  resourceKey: text("resource_key").notNull(),
  reason: text("reason").notNull(),
  details: text("details").notNull(),
  status: text("status").notNull().default("pending"),
  resolutionNote: text("resolution_note"),
  resolvedBy: text("resolved_by"),
  resolvedAt: text("resolved_at"),
  requesterHash: text("requester_hash").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, table => [index("idx_reports_status_created").on(table.status, table.createdAt)]);
