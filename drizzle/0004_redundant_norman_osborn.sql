ALTER TABLE `resource_submissions` ADD `share_token` text;--> statement-breakpoint
CREATE UNIQUE INDEX `resource_submissions_share_token_unique` ON `resource_submissions` (`share_token`);