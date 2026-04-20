CREATE TABLE `jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`company` text NOT NULL,
	`link` text NOT NULL,
	`status` text DEFAULT '' NOT NULL,
	`location` text DEFAULT '' NOT NULL,
	`source` text NOT NULL,
	`description` text,
	`createdAt` text NOT NULL,
	`expiresAt` text DEFAULT '' NOT NULL,
	`updatedAt` text,
	`clicks` integer DEFAULT 0 NOT NULL,
	`manuallyAdded` integer DEFAULT false NOT NULL,
	`isDevRole` integer,
	`relevanceScore` real,
	`tags` text,
	`salaryMin` integer,
	`salaryMax` integer,
	`workType` text,
	`enrichmentStatus` text DEFAULT 'pending' NOT NULL,
	`enrichedAt` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `jobs_link_unique` ON `jobs` (`link`);--> statement-breakpoint
CREATE TABLE `subscribers` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`createdAt` text NOT NULL,
	`confirmed` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscribers_email_unique` ON `subscribers` (`email`);