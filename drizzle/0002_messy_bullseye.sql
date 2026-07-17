CREATE TABLE `newsletter_subscribers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`language` text DEFAULT 'zh' NOT NULL,
	`source_path` text DEFAULT '/' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_subscribers_email_unique` ON `newsletter_subscribers` (`email`);--> statement-breakpoint
ALTER TABLE `site_page_views` ADD `referrer` text;--> statement-breakpoint
ALTER TABLE `site_page_views` ADD `source` text;--> statement-breakpoint
ALTER TABLE `site_page_views` ADD `medium` text;--> statement-breakpoint
ALTER TABLE `site_page_views` ADD `campaign` text;