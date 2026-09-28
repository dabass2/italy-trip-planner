import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, MoveDown, X } from "lucide-react";
import { appActions } from "#/lib/app-store";
import { planActions, usePlan } from "#/lib/plan-store";
import { cn, distanceKm, formatDuration, getColorForDay } from "#/lib/utils";
import { placesQueryOptions } from "#/utils/places.functions";
import { PlaceDetailsButton } from "./PlaceDetailDialog";
import { Button } from "./ui/button";

function formatDistance(km: number) {
	if (km < 1) return `${Math.round(km * 100) * 10} m`;
	return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}

export function PlanViewer() {
	const { data: places } = useQuery(placesQueryOptions);
	const days = usePlan((s) => s.days);

	const placesById = new Map(places?.map((p) => [p.placeId, p]));

	return (
		<div className="flex h-full flex-col gap-3 overflow-y-auto scrollbar-track-transparent">
			{days.map((day, dayIdx) => (
				<div key={day.id}>
					<p className="font-bold">Day {dayIdx + 1}</p>
					{day.stops.length === 0 ? (
						<div className="grid place-items-center rounded-2xl bg-surface p-6 text-center text-sm text-muted-foreground">
							<span>
								No stops yet. Add places from the{" "}
								<Button
									variant="link"
									className="p-0 text-sm"
									onClick={() => appActions.setTab("places")}
								>
									Places
								</Button>{" "}
								tab.
							</span>
						</div>
					) : (
						<ol className="flex flex-col gap-2">
							{day.stops.map((stop, stopIdx) => {
								const place = placesById.get(stop.placeId);
								const prevStop = day.stops[stopIdx - 1];
								const prevPlace = prevStop && placesById.get(prevStop.placeId);
								return (
									<li key={stop.id} className="flex flex-col gap-2">
										{prevPlace && place && (
											<div
												className="flex items-center gap-3 px-3 text-xs text-muted-foreground"
												title="Straight-line distance from the previous stop"
											>
												<span className="grid w-7 shrink-0 place-items-center">
													<MoveDown className="size-3.5" />
												</span>
												~{formatDistance(distanceKm(prevPlace, place))}
											</div>
										)}
										<div className="flex items-center gap-3 rounded-2xl bg-surface p-3">
											<span
												className={cn(
													"grid size-7 shrink-0 place-items-center rounded-full text-sm font-bold",
													getColorForDay(dayIdx).badge,
												)}
											>
												{stopIdx + 1}
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
													className="max-md:size-8"
													aria-label="Move up"
													disabled={stopIdx === 0}
													onClick={() =>
														planActions.moveStop(day.id, stop.id, -1)
													}
												>
													<ChevronUp />
												</Button>
												<Button
													variant="ghost"
													size="icon-xs"
													className="max-md:size-8"
													aria-label="Move down"
													disabled={stopIdx === day.stops.length - 1}
													onClick={() =>
														planActions.moveStop(day.id, stop.id, 1)
													}
												>
													<ChevronDown />
												</Button>
											</div>
											{place && (
												<PlaceDetailsButton placeId={place.placeId} iconOnly />
											)}
											<Button
												variant="ghost"
												size="icon-sm"
												aria-label="Remove stop"
												onClick={() => planActions.removeStop(day.id, stop.id)}
											>
												<X />
											</Button>
										</div>
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
