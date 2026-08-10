ALTER TABLE `jobs` ADD COLUMN `upvotes` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `jobs` ADD COLUMN `downvotes` integer DEFAULT 0 NOT NULL;
