CREATE TABLE `mail_campaigns` (
	`id` text PRIMARY KEY NOT NULL,
	`topic` text NOT NULL,
	`content` text NOT NULL,
	`valid_until` text,
	`actor` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mail_deliveries` (
	`id` text PRIMARY KEY NOT NULL,
	`campaign_id` text NOT NULL,
	`subscriber_id` integer NOT NULL,
	`subscriber_version` integer NOT NULL,
	`payload` text NOT NULL,
	`status` text DEFAULT 'queued' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`first_attempt_at` integer,
	`next_attempt_at` integer DEFAULT 0 NOT NULL,
	`lease_until` integer DEFAULT 0 NOT NULL,
	`provider_id` text,
	`error` text,
	`checked_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_mail_campaign_status` ON `mail_deliveries` (`campaign_id`,`status`);