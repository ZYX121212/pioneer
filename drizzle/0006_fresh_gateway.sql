CREATE TABLE `newsletter_unsubscribe_tokens` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`subscriber_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `user_id` text;--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `weekly` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `cases` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `verified_at` text;--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `version` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `requester_hash` text;--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `updated_at` text;--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_subscribers_user_id_unique` ON `newsletter_subscribers` (`user_id`);