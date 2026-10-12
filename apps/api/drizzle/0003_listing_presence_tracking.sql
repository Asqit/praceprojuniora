ALTER TABLE `jobs` ADD `lastSeenAt` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `jobs` ADD `missingRuns` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `jobs` ADD `missingCheckedAt` text;--> statement-breakpoint
ALTER TABLE `jobs` ADD `isActive` integer DEFAULT true NOT NULL;--> statement-breakpoint
UPDATE `jobs` SET `isActive` = CASE WHEN julianday(`expiresAt`) > julianday('now') THEN 1 ELSE 0 END;