CREATE TABLE `pioneer_auth_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`password` text,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`scope` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `pioneer_auth_users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pioneer_auth_accounts_user_idx` ON `pioneer_auth_accounts` (`user_id`);--> statement-breakpoint
CREATE TABLE `pioneer_auth_rate_limits` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`count` integer NOT NULL,
	`last_request` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pioneer_auth_rate_limits_key_unique` ON `pioneer_auth_rate_limits` (`key`);--> statement-breakpoint
CREATE TABLE `pioneer_auth_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	FOREIGN KEY (`user_id`) REFERENCES `pioneer_auth_users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pioneer_auth_sessions_token_unique` ON `pioneer_auth_sessions` (`token`);--> statement-breakpoint
CREATE INDEX `pioneer_auth_sessions_user_idx` ON `pioneer_auth_sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `pioneer_auth_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pioneer_auth_users_email_unique` ON `pioneer_auth_users` (`email`);--> statement-breakpoint
CREATE TABLE `pioneer_auth_verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `pioneer_auth_verifications_identifier_idx` ON `pioneer_auth_verifications` (`identifier`);