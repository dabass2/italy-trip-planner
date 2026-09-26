import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { planActions, usePlan } from "#/lib/plan-store";
import { placesQueryOptions } from "#/utils/places.functions";
import { Button } from "./ui/button";

function formatDuration(minutes: number) {
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	if (h === 0) return `${m}m`;
	return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function PlanViewer() {
	const { data: places } = useQuery(placesQueryOptions);
	const days = usePlan((s) => s.days);

	const placesById = new Map(places?.map((p) => [p.placeId, p]));

	return (
		<div className="flex h-full flex-col gap-3">
			{days.map((day, i) => (
				<div key={day.id}>
					<p className="font-bold">Day {i + 1}</p>
					{day.stops.length === 0 ? (
						<div className="grid flex-1 place-items-center rounded-2xl bg-surface p-6 text-center text-sm text-muted-foreground">
							No stops yet. Add places from the Places tab.
						</div>
					) : (
						<ol className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
							{day.stops.map((stop, i) => {
								const place = placesById.get(stop.placeId);
								return (
									<li
										key={stop.id}
										className="flex items-center gap-3 rounded-2xl bg-surface p-3"
									>
										<span className="grid size-7 shrink-0 place-items-center rounded-full bg-olive-leaf-300 text-sm font-bold">
											{i + 1}
										</span>
										<div className="min-w-0 flex-1">
											<div className="truncate font-bold">
												{place?.name ?? "Unknown place"}
											</div>
											<div className="truncate text-sm text-muted-foreground">
												{place?.city}
												{place?.durationMinutes
													? ` · ${formatDuration(place.durationMinutes)}`
													: null}
											</div>
										</div>
										<div className="flex shrink-0 flex-col">
											<Button
												variant="ghost"
												size="icon-xs"
												aria-label="Move up"
												disabled={i === 0}
												onClick={() =>
													planActions.moveStop(day.id, stop.id, -1)
												}
											>
												<ChevronUp />
											</Button>
											<Button
												variant="ghost"
												size="icon-xs"
												aria-label="Move down"
												disabled={i === day.stops.length - 1}
												onClick={() => planActions.moveStop(day.id, stop.id, 1)}
											>
												<ChevronDown />
											</Button>
										</div>
										<Button
											variant="ghost"
											size="icon-sm"
											aria-label="Remove stop"
											onClick={() => planActions.removeStop(day.id, stop.id)}
										>
											<X />
										</Button>
									</li>
								);
							})}
						</ol>
					)}
				</div>
			))}
		</div>
	);
}
