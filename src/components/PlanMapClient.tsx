import type { LatLngTuple } from "leaflet";
import { useEffect } from "react";
import {
	CircleMarker,
	MapContainer,
	Popup,
	TileLayer,
	useMap,
} from "react-leaflet";
import type { places } from "#/db/schema";

type Place = typeof places.$inferSelect;

const ITALY_CENTER: LatLngTuple = [42.5, 12.5];

function FitBounds({ points }: { points: LatLngTuple[] }) {
	const map = useMap();

	useEffect(() => {
		if (points.length > 0) {
			map.fitBounds(points, { padding: [30, 30] });
		}
	}, [map, points]);

	return null;
}

export default function PlanMapClient({ places }: { places: Place[] }) {
	const points = places.map((p): LatLngTuple => [p.latitude, p.longitude]);

	const mapPinColor = "var(--color-blushed-brick)";

	return (
		<MapContainer
			center={ITALY_CENTER}
			zoom={6}
			className="h-full w-full rounded-2xl"
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{places.map((place) => (
				<CircleMarker
					key={place.placeId}
					center={[place.latitude, place.longitude]}
					radius={7}
					pathOptions={{ color: mapPinColor, fillOpacity: 1 }}
				>
					<Popup>
						<strong>{place.name}</strong>
						<br />
						{place.city} · {place.type.replaceAll("_", " ")}
						<br />
						{place.priceRange} · ★ {place.rating}
					</Popup>
				</CircleMarker>
			))}
			<FitBounds points={points} />
		</MapContainer>
	);
}
