-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `places` (
	`place_id` text PRIMARY KEY,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`city` text NOT NULL,
	`region` text NOT NULL,
	`neighborhood` text,
	`description` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`duration_minutes` integer,
	`price_level` integer NOT NULL,
	`price_range` text NOT NULL,
	`rating` real NOT NULL,
	`booking_required` integer,
	`hours_text` text,
	`hours_status` text NOT NULL,
	`hours_approx` text,
	`hours_days_specified` integer DEFAULT 0 NOT NULL,
	`seasonal_notes` text,
	CONSTRAINT "places_check_1" CHECK(latitude  BETWEEN 35 AND 48),
	CONSTRAINT "places_check_2" CHECK(longitude BETWEEN 6 AND 19),
	CONSTRAINT "places_check_3" CHECK(duration_minutes > 0),
	CONSTRAINT "places_check_4" CHECK(price_level BETWEEN 1 AND 4),
	CONSTRAINT "places_check_5" CHECK(rating BETWEEN 0 AND 5),
	CONSTRAINT "places_check_6" CHECK(booking_required IN (0, 1),
	CONSTRAINT "places_check_7" CHECK(hours_status IN ('scheduled','approximate','unknown'),
	CONSTRAINT "opening_hours_check_8" CHECK(weekday BETWEEN 0 AND 6),
	CONSTRAINT "opening_hours_check_9" CHECK(closes_next_day IN (0, 1)
);
--> statement-breakpoint
CREATE INDEX `idx_places_type` ON `places` (`type`);--> statement-breakpoint
CREATE INDEX `idx_places_city` ON `places` (`city`);--> statement-breakpoint
CREATE TABLE `tags` (
	`tag_id` integer PRIMARY KEY,
	`tag` text NOT NULL,
	CONSTRAINT "places_check_1" CHECK(latitude  BETWEEN 35 AND 48),
	CONSTRAINT "places_check_2" CHECK(longitude BETWEEN 6 AND 19),
	CONSTRAINT "places_check_3" CHECK(duration_minutes > 0),
	CONSTRAINT "places_check_4" CHECK(price_level BETWEEN 1 AND 4),
	CONSTRAINT "places_check_5" CHECK(rating BETWEEN 0 AND 5),
	CONSTRAINT "places_check_6" CHECK(booking_required IN (0, 1),
	CONSTRAINT "places_check_7" CHECK(hours_status IN ('scheduled','approximate','unknown'),
	CONSTRAINT "opening_hours_check_8" CHECK(weekday BETWEEN 0 AND 6),
	CONSTRAINT "opening_hours_check_9" CHECK(closes_next_day IN (0, 1)
);
--> statement-breakpoint
CREATE TABLE `place_tags` (
	`place_id` text NOT NULL,
	`tag_id` integer NOT NULL,
	`position` integer NOT NULL,
	PRIMARY KEY(`place_id`, `tag_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`tag_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`place_id`) REFERENCES `places`(`place_id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "places_check_1" CHECK(latitude  BETWEEN 35 AND 48),
	CONSTRAINT "places_check_2" CHECK(longitude BETWEEN 6 AND 19),
	CONSTRAINT "places_check_3" CHECK(duration_minutes > 0),
	CONSTRAINT "places_check_4" CHECK(price_level BETWEEN 1 AND 4),
	CONSTRAINT "places_check_5" CHECK(rating BETWEEN 0 AND 5),
	CONSTRAINT "places_check_6" CHECK(booking_required IN (0, 1),
	CONSTRAINT "places_check_7" CHECK(hours_status IN ('scheduled','approximate','unknown'),
	CONSTRAINT "opening_hours_check_8" CHECK(weekday BETWEEN 0 AND 6),
	CONSTRAINT "opening_hours_check_9" CHECK(closes_next_day IN (0, 1)
);
--> statement-breakpoint
CREATE INDEX `idx_place_tags_tag` ON `place_tags` (`tag_id`);--> statement-breakpoint
CREATE TABLE `opening_hours` (
	`place_id` text NOT NULL,
	`weekday` integer NOT NULL,
	`weekday_name` text NOT NULL,
	`open_minute` integer NOT NULL,
	`close_minute` integer NOT NULL,
	`open_time` text NOT NULL,
	`close_time` text NOT NULL,
	`closes_next_day` integer NOT NULL,
	PRIMARY KEY(`place_id`, `weekday`, `open_minute`),
	FOREIGN KEY (`place_id`) REFERENCES `places`(`place_id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "places_check_1" CHECK(latitude  BETWEEN 35 AND 48),
	CONSTRAINT "places_check_2" CHECK(longitude BETWEEN 6 AND 19),
	CONSTRAINT "places_check_3" CHECK(duration_minutes > 0),
	CONSTRAINT "places_check_4" CHECK(price_level BETWEEN 1 AND 4),
	CONSTRAINT "places_check_5" CHECK(rating BETWEEN 0 AND 5),
	CONSTRAINT "places_check_6" CHECK(booking_required IN (0, 1),
	CONSTRAINT "places_check_7" CHECK(hours_status IN ('scheduled','approximate','unknown'),
	CONSTRAINT "opening_hours_check_8" CHECK(weekday BETWEEN 0 AND 6),
	CONSTRAINT "opening_hours_check_9" CHECK(closes_next_day IN (0, 1)
);
--> statement-breakpoint
CREATE INDEX `idx_hours_day` ON `opening_hours` (`weekday`,`open_minute`,`close_minute`);--> statement-breakpoint
CREATE TABLE `data_fixes` (
	`place_id` text NOT NULL,
	`field` text NOT NULL,
	`old_value` text,
	`new_value` text,
	`reason` text NOT NULL,
	CONSTRAINT "places_check_1" CHECK(latitude  BETWEEN 35 AND 48),
	CONSTRAINT "places_check_2" CHECK(longitude BETWEEN 6 AND 19),
	CONSTRAINT "places_check_3" CHECK(duration_minutes > 0),
	CONSTRAINT "places_check_4" CHECK(price_level BETWEEN 1 AND 4),
	CONSTRAINT "places_check_5" CHECK(rating BETWEEN 0 AND 5),
	CONSTRAINT "places_check_6" CHECK(booking_required IN (0, 1),
	CONSTRAINT "places_check_7" CHECK(hours_status IN ('scheduled','approximate','unknown'),
	CONSTRAINT "opening_hours_check_8" CHECK(weekday BETWEEN 0 AND 6),
	CONSTRAINT "opening_hours_check_9" CHECK(closes_next_day IN (0, 1)
);

*/