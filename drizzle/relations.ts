import { relations } from "drizzle-orm/relations";
import { openingHours, placeTags, places, tags } from "../src/db/schema";

export const placeTagsRelations = relations(placeTags, ({one}) => ({
	tag: one(tags, {
		fields: [placeTags.tagId],
		references: [tags.tagId]
	}),
	place: one(places, {
		fields: [placeTags.placeId],
		references: [places.placeId]
	}),
}));

export const tagsRelations = relations(tags, ({many}) => ({
	placeTags: many(placeTags),
}));

export const placesRelations = relations(places, ({many}) => ({
	placeTags: many(placeTags),
	openingHours: many(openingHours),
}));

export const openingHoursRelations = relations(openingHours, ({one}) => ({
	place: one(places, {
		fields: [openingHours.placeId],
		references: [places.placeId]
	}),
}));