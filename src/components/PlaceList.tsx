import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { placesQueryOptions } from "#/utils/places.functions";
import { PlaceCard } from "./PlaceCard";
import { PlaceFilterChip } from "./PlaceFilterChip";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

export function PlaceList() {
	const { data, isLoading, isError } = useQuery(placesQueryOptions);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [typeFilter, setTypeFilter] = useState<string | null>(null);
	const [search, setSearch] = useState("");

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!isError && data?.length === 0) {
		return <div>No places found.</div>;
	}

	if (isError || data === undefined) {
		return <div>Error occurred while fetching places.</div>;
	}

	const query = search.trim().toLowerCase();
	const searchedPlaces = data.filter((place) =>
		[
			place.name,
			place.city,
			place.region,
			place.neighborhood,
			place.type.replaceAll("_", " "),
			place.description,
		]
			.join(" ")
			.toLowerCase()
			.includes(query),
	);

	const typeCounts = new Map<string, number>(
		data.map((place) => [place.type, 0]),
	);
	for (const place of searchedPlaces) {
		typeCounts.set(place.type, (typeCounts.get(place.type) ?? 0) + 1);
	}
	const filteredPlaces = typeFilter
		? searchedPlaces.filter((place) => place.type === typeFilter)
		: searchedPlaces;

	return (
		<div className="flex h-full flex-col gap-2">
			<div className="flex shrink-0 flex-col gap-2">
				<div>
					<InputGroup>
						<InputGroupInput
							type="search"
							value={search}
							onChange={(e) => [setSelectedId(null), setSearch(e.target.value)]}
							placeholder="Search places"
							aria-label="Search places"
						/>
						<InputGroupAddon>
							<Search />
						</InputGroupAddon>
					</InputGroup>
				</div>

				<div className="flex flex-row gap-2 min-w-0 overflow-x-auto scrollbar-none">
					<PlaceFilterChip
						label="All"
						count={searchedPlaces.length}
						active={typeFilter === null}
						onClick={() => setTypeFilter(null)}
					/>

					{Array.from(typeCounts, ([type, count]) => (
						<PlaceFilterChip
							key={type}
							label={type.replaceAll("_", " ")}
							count={count}
							active={typeFilter === type}
							onClick={() => [setSelectedId(null), setTypeFilter(type)]}
						/>
					))}
				</div>
			</div>

			<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto scrollbar-track-transparent">
				{filteredPlaces.map((place) => (
					<PlaceCard
						key={place.placeId}
						place={place}
						selected={place.placeId === selectedId}
						onSelect={() => setSelectedId(place.placeId)}
					/>
				))}
			</div>
		</div>
	);
}
