import { useQuery } from "@tanstack/react-query";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { placesQueryOptions } from "#/utils/places.functions";

// Leaflet touches `window` on import, so it must only load in the browser.
const PlanMapClient = lazy(() => import("./PlanMapClient"));

export function PlanMap() {
	const { data } = useQuery(placesQueryOptions);

	const fallback = (
		<div className="h-full grid place-items-center">Loading map…</div>
	);

	return (
		<div className="border rounded-2xl h-full overflow-hidden">
			<ClientOnly fallback={fallback}>
				<Suspense fallback={fallback}>
					<PlanMapClient places={data ?? []} />
				</Suspense>
			</ClientOnly>
		</div>
	);
}
