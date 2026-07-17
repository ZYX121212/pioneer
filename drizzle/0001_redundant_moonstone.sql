CREATE TABLE `site_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`visitor_id` text NOT NULL,
	`event_name` text NOT NULL,
	`path` text DEFAULT '/' NOT NULL,
	`target` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_page_views` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`visitor_id` text NOT NULL,
	`path` text DEFAULT '/' NOT NULL,
	`viewed_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
