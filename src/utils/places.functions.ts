import { createServerFn } from "@tanstack/react-start";
import { db } from "#/db";

export const getAllPlaces = createServerFn({ method: "GET" }).handler(
	async () => {
		return db.query.places.findMany();
	},
);
