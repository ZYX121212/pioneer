ALTER TABLE `resource_reports` ADD `idempotency_key` text;--> statement-breakpoint
CREATE UNIQUE INDEX `resource_reports_idempotency_key_unique` ON `resource_reports` (`idempotency_key`);--> statement-breakpoint
CREATE INDEX `idx_reports_requester_created` ON `resource_reports` (`requester_hash`,`created_at`);