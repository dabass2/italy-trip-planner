import { useQuery } from "@tanstack/react-query";
import { ClientOnly } from "@tanstack/react-router";
import { useAppState } from "#/lib/app-store";
import { usePlan } from "#/lib/plan-store";
import { placesQueryOptions } from "#/utils/places.functions";
import PlanMapClient, { type PlaceGroup } from "./PlanMapClient";

export function PlanMap() {
	const { data } = useQuery(placesQueryOptions);

	const currentView = useAppState((s) => s.currentTab);
	const plan = usePlan((s) => s.days);

	// Kept as separate values so the compiler memoizes them independently: plan
	// edits made from the places view must not change its groups, or the map
	// refits its bounds.
	const allPlacesGroups: PlaceGroup[] = [
		{ dayIndex: null, places: data ?? [] },
	];
	const planGroups: PlaceGroup[] = plan.map((day, dayIndex) => ({
		dayIndex,
		places: day.stops
			.map((stop) => data?.find((p) => p.placeId === stop.placeId))
			.filter((p) => !!p),
	}));

	const groups = currentView === "places" ? allPlacesGroups : planGroups;

	const fallback = (
		<div className="h-full grid place-items-center">Loading map…</div>
	);

	return (
		<div className="border border-olive-leaf rounded-2xl h-full overflow-hidden">
			<ClientOnly fallback={fallback}>
				<PlanMapClient groups={groups} />
			</ClientOnly>
		</div>
	);
}
