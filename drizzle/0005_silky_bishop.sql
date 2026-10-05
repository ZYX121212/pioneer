CREATE TABLE `community_resources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`submission_id` integer NOT NULL,
	`canonical_url` text NOT NULL,
	`resource_type` text NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`location` text,
	`deadline` text,
	`stage` text DEFAULT 'any' NOT NULL,
	`contributor_reason` text NOT NULL,
	`source_title` text NOT NULL,
	`source_excerpt` text NOT NULL,
	`evidence` text NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`verified_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `community_resources_slug_unique` ON `community_resources` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `community_resources_submission_id_unique` ON `community_resources` (`submission_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `community_resources_canonical_url_unique` ON `community_resources` (`canonical_url`);--> statement-breakpoint
CREATE INDEX `idx_community_status_type_created` ON `community_resources` (`status`,`resource_type`,`created_at`);--> statement-breakpoint
CREATE TABLE `founder_workspaces` (
	`user_id` text PRIMARY KEY NOT NULL,
	`state` text DEFAULT '{}' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `moderation_actions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`submission_id` integer NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`reason` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `resource_reports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`resource_key` text NOT NULL,
	`reason` text NOT NULL,
	`details` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`resolution_note` text,
	`resolved_by` text,
	`resolved_at` text,
	`requester_hash` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_reports_status_created` ON `resource_reports` (`status`,`created_at`);--> statement-breakpoint
ALTER TABLE `resource_submissions` ADD `review_token` text;--> statement-breakpoint
ALTER TABLE `resource_submissions` ADD `canonical_url` text;--> statement-breakpoint
ALTER TABLE `resource_submissions` ADD `idempotency_key` text;--> statement-breakpoint
ALTER TABLE `resource_submissions` ADD `requester_hash` text;--> statement-breakpoint
ALTER TABLE `resource_submissions` ADD `stage` text DEFAULT 'any' NOT NULL;--> statement-breakpoint
ALTER TABLE `resource_submissions` ADD `review_evidence` text;--> statement-breakpoint
ALTER TABLE `resource_submissions` ADD `review_reason` text;--> statement-breakpoint
ALTER TABLE `resource_submissions` ADD `reviewed_at` text;--> statement-breakpoint
ALTER TABLE `resource_submissions` ADD `reviewer` text;--> statement-breakpoint
ALTER TABLE `resource_submissions` ADD `published_slug` text;--> statement-breakpoint
CREATE UNIQUE INDEX `resource_submissions_review_token_unique` ON `resource_submissions` (`review_token`);--> statement-breakpoint
CREATE UNIQUE INDEX `resource_submissions_idempotency_key_unique` ON `resource_submissions` (`idempotency_key`);--> statement-breakpoint
CREATE INDEX `idx_submissions_status_created` ON `resource_submissions` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_submissions_requester_created` ON `resource_submissions` (`requester_hash`,`created_at`);