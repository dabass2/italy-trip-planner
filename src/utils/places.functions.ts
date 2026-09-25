import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "#/db";

export const getAllPlaces = createServerFn({ method: "GET" }).handler(
	async () => {
		return db.query.places.findMany();
	},
);

export const placesQueryOptions = queryOptions({
	queryKey: ["places"],
	queryFn: () => getAllPlaces(),
});
