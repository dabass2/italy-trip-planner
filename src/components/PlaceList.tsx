import { useQuery } from "@tanstack/react-query";
import { placesQueryOptions } from "#/utils/places.functions";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

export function PlaceList() {
	const { data, isLoading, isError } = useQuery(placesQueryOptions);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!isError && data?.length === 0) {
		return <div>No places found.</div>;
	}

	if (isError || data === undefined) {
		return <div>Error occurred while fetching places.</div>;
	}

	return (
		<div className="border rounded-2xl p-4 flex flex-col gap-4 h-full overflow-y-auto">
			{data.map((place) => (
				<Card key={place.placeId}>
					<CardHeader>
						<CardTitle>{place.name}</CardTitle>
						<CardDescription>
							{place.city} - {place.hoursText ?? "Anytime"} -{" "}
							<span className="text-yellow-400">{place.priceRange}</span>
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p>{place.description}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
