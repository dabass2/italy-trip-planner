import {
	divIcon,
	type LatLngBounds,
	type LatLngBoundsExpression,
	type LatLngTuple,
	latLngBounds,
} from "leaflet";
import { useEffect, useRef } from "react";
import {
	CircleMarker,
	LayerGroup,
	MapContainer,
	Marker,
	Polyline,
	Popup,
	TileLayer,
	useMap,
} from "react-leaflet";
import type { places } from "#/db/schema";
import { useAppState } from "#/lib/app-store";
import { getColorForDay } from "#/lib/utils";
import { AddToPlanMenu } from "./AddToPlanMenu";
import { PlaceDetailsButton } from "./PlaceDetailDialog";

type Place = typeof places.$inferSelect;

export type PlaceGroup = { dayIndex: number | null; places: Place[] };

function pinColor(dayIndex: number | null) {
	if (dayIndex === null) return "var(--color-blushed-brick)";
	return getColorForDay(dayIndex).pin;
}

function stopIcon(color: string, stopNumber: number) {
	return divIcon({
		className: "", // drop Leaflet's default white box
		html: `<span class="grid size-6 place-items-center rounded-full border-2 border-white text-xs font-bold text-white shadow-md" style="background:${color}">${stopNumber}</span>`,
		iconSize: [24, 24],
		popupAnchor: [0, -12],
	});
}

const ITALY_CENTER: LatLngTuple = [42.5, 12.5];
const START_ZOOM = 6;
// Italy with some margin; panning is limited to this box.
const MAX_BOUNDS: LatLngBoundsExpression = [
	[34, 4.5],
	[48.5, 21],
];

function FitBounds({ points }: { points: LatLngTuple[] }) {
	const map = useMap();
	const lastFitted = useRef<LatLngBounds | null>(null);

	useEffect(() => {
		if (points.length === 0) return;

		// Only refit when the bounds actually change, not on every new array
		// (e.g. reordering stops keeps the same bounds).
		const bounds = latLngBounds(points);
		if (lastFitted.current?.equals(bounds)) return;

		lastFitted.current = bounds;
		map.fitBounds(bounds, { padding: [30, 30] });
	}, [map, points]);

	return null;
}

export default function PlanMapClient({ groups }: { groups: PlaceGroup[] }) {
	const points = groups.flatMap((g) =>
		g.places.map((p): LatLngTuple => [p.latitude, p.longitude]),
	);

	const currentView = useAppState((s) => s.currentTab);

	return (
		<MapContainer
			center={ITALY_CENTER}
			zoom={START_ZOOM}
			minZoom={START_ZOOM}
			maxBounds={MAX_BOUNDS}
			className="h-full w-full rounded-2xl isolate"
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			{groups.map(({ dayIndex, places }) => {
				const color = pinColor(dayIndex);

				return (
					<LayerGroup key={dayIndex ?? "all"}>
						{places.map((place, stopIdx) => {
							const popup = (
								<Popup key={`popup-${place.placeId}`}>
									<strong>{place.name}</strong>
									<br />
									{place.city} · {place.type.replaceAll("_", " ")}
									<br />
									{place.priceRange} · ★ {place.rating}
									<div className="flex items-center gap-2">
										<PlaceDetailsButton placeId={place.placeId} />
										<AddToPlanMenu placeId={place.placeId} inlineView />
									</div>
								</Popup>
							);

							// Plan pins are numbered to match the itinerary.
							return dayIndex === null ? (
								<CircleMarker
									key={place.placeId}
									center={[place.latitude, place.longitude]}
									radius={7}
									pathOptions={{ color }}
								>
									{popup}
								</CircleMarker>
							) : (
								<Marker
									key={place.placeId}
									position={[place.latitude, place.longitude]}
									icon={stopIcon(color, stopIdx + 1)}
								>
									{popup}
								</Marker>
							);
						})}

						{currentView === "plan" && (
							<Polyline
								positions={places.map((p) => [p.latitude, p.longitude])}
								pathOptions={{ color, weight: 2 }}
							/>
						)}
					</LayerGroup>
				);
			})}

			<FitBounds points={points} />
		</MapContainer>
	);
}
