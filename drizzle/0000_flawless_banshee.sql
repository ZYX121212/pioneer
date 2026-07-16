CREATE TABLE `site_visitors` (
	`visitor_id` text PRIMARY KEY NOT NULL,
	`first_seen_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`last_seen_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`page_views` integer DEFAULT 1 NOT NULL
);
