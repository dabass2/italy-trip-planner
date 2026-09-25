import { useQuery } from "@tanstack/react-query";
import { ListFilter } from "lucide-react";
import { useState } from "react";
import { placesQueryOptions } from "#/utils/places.functions";
import { PlaceCard } from "./PlaceCard";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

export function PlaceList() {
	const { data, isLoading, isError } = useQuery(placesQueryOptions);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!isError && data?.length === 0) {
		return <div>No places found.</div>;
	}

	if (isError || data === undefined) {
		return <div>Error occurred while fetching places.</div>;
	}

	const uniqueTypes = Array.from(new Set(data.map((place) => place.type))).map(
		(type) => type.replaceAll("_", " "),
	);

	return (
		<div className="border border-olive-leaf rounded-2xl p-4 flex flex-col gap-4 h-full">
			<div className="flex items-center justify-between">
				<Badge variant="secondary">
					<ListFilter data-icon="inline-start" />
					All Types
				</Badge>
				<Separator orientation="vertical" className="mx-2" />
				<div className="flex flex-row gap-2 w-0 flex-1 overflow-x-auto scrollbar-none">
					{uniqueTypes.map((type) => (
						<Badge key={type} variant="outline" className="capitalize">
							{type}
						</Badge>
					))}
				</div>
			</div>
			<div className="flex flex-1 flex-col gap-4 overflow-y-auto scrollbar-track-transparent">
				{data.map((place, i) => (
					<PlaceCard
						key={place.placeId}
						place={place}
						index={i + 1}
						selected={place.placeId === selectedId}
						onSelect={() => setSelectedId(place.placeId)}
					/>
				))}
			</div>
		</div>
	);
}
