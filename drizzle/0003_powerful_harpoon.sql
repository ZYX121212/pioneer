CREATE TABLE `resource_submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`resource_type` text NOT NULL,
	`resource_name` text NOT NULL,
	`resource_url` text NOT NULL,
	`location` text,
	`deadline` text,
	`why_useful` text NOT NULL,
	`submitter_name` text NOT NULL,
	`submitter_email` text NOT NULL,
	`relationship` text NOT NULL,
	`language` text DEFAULT 'zh' NOT NULL,
	`source_path` text DEFAULT '/submit' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
