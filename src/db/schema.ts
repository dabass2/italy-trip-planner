import { sql } from "drizzle-orm";
import {
	check,
	index,
	integer,
	primaryKey,
	real,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

export const places = sqliteTable(
	"places",
	{
		placeId: text("place_id").primaryKey(),
		name: text().notNull(),
		type: text().notNull(),
		city: text().notNull(),
		region: text().notNull(),
		neighborhood: text(),
		description: text().notNull(),
		latitude: real().notNull(),
		longitude: real().notNull(),
		durationMinutes: integer("duration_minutes"),
		priceLevel: integer("price_level").notNull(),
		priceRange: text("price_range").notNull(),
		rating: real().notNull(),
		bookingRequired: integer("booking_required"),
		hoursText: text("hours_text"),
		hoursStatus: text("hours_status").notNull(),
		hoursApprox: text("hours_approx"),
		hoursDaysSpecified: integer("hours_days_specified").default(0).notNull(),
		seasonalNotes: text("seasonal_notes"),
	},
	(table) => [
		index("idx_places_type").on(table.type),
		index("idx_places_city").on(table.city),
		check("places_check_1", sql`latitude  BETWEEN 35 AND 48`),
		check("places_check_2", sql`longitude BETWEEN 6 AND 19`),
		check("places_check_3", sql`duration_minutes > 0`),
		check("places_check_4", sql`price_level BETWEEN 1 AND 4`),
		check("places_check_5", sql`rating BETWEEN 0 AND 5`),
		check("places_check_6", sql`booking_required IN (0, 1`),
		check(
			"places_check_7",
			sql`hours_status IN ('scheduled','approximate','unknown'`,
		),
		check("opening_hours_check_8", sql`weekday BETWEEN 0 AND 6`),
		check("opening_hours_check_9", sql`closes_next_day IN (0, 1`),
	],
);

export const tags = sqliteTable(
	"tags",
	{
		tagId: integer("tag_id").primaryKey(),
		tag: text().notNull(),
	},
	(table) => [
		check("places_check_1", sql`latitude  BETWEEN 35 AND 48`),
		check("places_check_2", sql`longitude BETWEEN 6 AND 19`),
		check("places_check_3", sql`duration_minutes > 0`),
		check("places_check_4", sql`price_level BETWEEN 1 AND 4`),
		check("places_check_5", sql`rating BETWEEN 0 AND 5`),
		check("places_check_6", sql`booking_required IN (0, 1`),
		check(
			"places_check_7",
			sql`hours_status IN ('scheduled','approximate','unknown'`,
		),
		check("opening_hours_check_8", sql`weekday BETWEEN 0 AND 6`),
		check("opening_hours_check_9", sql`closes_next_day IN (0, 1`),
	],
);

export const placeTags = sqliteTable(
	"place_tags",
	{
		placeId: text("place_id")
			.notNull()
			.references(() => places.placeId),
		tagId: integer("tag_id")
			.notNull()
			.references(() => tags.tagId),
		position: integer().notNull(),
	},
	(table) => [
		index("idx_place_tags_tag").on(table.tagId),
		primaryKey({
			columns: [table.placeId, table.tagId],
			name: "place_tags_place_id_tag_id_pk",
		}),
		check("places_check_1", sql`latitude  BETWEEN 35 AND 48`),
		check("places_check_2", sql`longitude BETWEEN 6 AND 19`),
		check("places_check_3", sql`duration_minutes > 0`),
		check("places_check_4", sql`price_level BETWEEN 1 AND 4`),
		check("places_check_5", sql`rating BETWEEN 0 AND 5`),
		check("places_check_6", sql`booking_required IN (0, 1`),
		check(
			"places_check_7",
			sql`hours_status IN ('scheduled','approximate','unknown'`,
		),
		check("opening_hours_check_8", sql`weekday BETWEEN 0 AND 6`),
		check("opening_hours_check_9", sql`closes_next_day IN (0, 1`),
	],
);

export const openingHours = sqliteTable(
	"opening_hours",
	{
		placeId: text("place_id")
			.notNull()
			.references(() => places.placeId),
		weekday: integer().notNull(),
		weekdayName: text("weekday_name").notNull(),
		openMinute: integer("open_minute").notNull(),
		closeMinute: integer("close_minute").notNull(),
		openTime: text("open_time").notNull(),
		closeTime: text("close_time").notNull(),
		closesNextDay: integer("closes_next_day").notNull(),
	},
	(table) => [
		index("idx_hours_day").on(
			table.weekday,
			table.openMinute,
			table.closeMinute,
		),
		primaryKey({
			columns: [table.placeId, table.weekday, table.openMinute],
			name: "opening_hours_place_id_weekday_open_minute_pk",
		}),
		check("places_check_1", sql`latitude  BETWEEN 35 AND 48`),
		check("places_check_2", sql`longitude BETWEEN 6 AND 19`),
		check("places_check_3", sql`duration_minutes > 0`),
		check("places_check_4", sql`price_level BETWEEN 1 AND 4`),
		check("places_check_5", sql`rating BETWEEN 0 AND 5`),
		check("places_check_6", sql`booking_required IN (0, 1`),
		check(
			"places_check_7",
			sql`hours_status IN ('scheduled','approximate','unknown'`,
		),
		check("opening_hours_check_8", sql`weekday BETWEEN 0 AND 6`),
		check("opening_hours_check_9", sql`closes_next_day IN (0, 1`),
	],
);

export const dataFixes = sqliteTable(
	"data_fixes",
	{
		placeId: text("place_id").notNull(),
		field: text().notNull(),
		oldValue: text("old_value"),
		newValue: text("new_value"),
		reason: text().notNull(),
	},
	(table) => [
		check("places_check_1", sql`latitude  BETWEEN 35 AND 48`),
		check("places_check_2", sql`longitude BETWEEN 6 AND 19`),
		check("places_check_3", sql`duration_minutes > 0`),
		check("places_check_4", sql`price_level BETWEEN 1 AND 4`),
		check("places_check_5", sql`rating BETWEEN 0 AND 5`),
		check("places_check_6", sql`booking_required IN (0, 1`),
		check(
			"places_check_7",
			sql`hours_status IN ('scheduled','approximate','unknown'`,
		),
		check("opening_hours_check_8", sql`weekday BETWEEN 0 AND 6`),
		check("opening_hours_check_9", sql`closes_next_day IN (0, 1`),
	],
);
