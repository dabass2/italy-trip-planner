import type { LatLng } from "./utils";

type NamedPlace = LatLng & { name: string };

// Google Maps URLs allow 9 waypoints, plus the origin and destination.
const GOOGLE_MAX_STOPS = 11;

const coords = (p: LatLng) => `${p.latitude},${p.longitude}`;

export function googleMapsPlaceUrl(place: LatLng) {
	return `https://www.google.com/maps/search/?api=1&query=${coords(place)}`;
}

export function appleMapsPlaceUrl(place: NamedPlace) {
	return `https://maps.apple.com/?ll=${coords(place)}&q=${encodeURIComponent(place.name)}`;
}

/**
 * Driving directions through the stops in order. A single stop routes from the
 * user's current location. Routes longer than Google's limit are split into
 * legs, each starting where the previous one ended.
 */
export function googleMapsRouteUrls(stops: LatLng[]): string[] {
	if (stops.length === 0) return [];

	const legs: LatLng[][] = [];
	for (let i = 0; i === 0 || i < stops.length - 1; i += GOOGLE_MAX_STOPS - 1) {
		legs.push(stops.slice(i, i + GOOGLE_MAX_STOPS));
	}

	return legs.map((leg) => {
		const params = new URLSearchParams({ api: "1", travelmode: "driving" });
		params.set("destination", coords(leg[leg.length - 1]));
		if (leg.length > 1) {
			params.set("origin", coords(leg[0]));
			const waypoints = leg.slice(1, -1);
			if (waypoints.length > 0) {
				params.set("waypoints", waypoints.map(coords).join("|"));
			}
		}
		return `https://www.google.com/maps/dir/?${params}`;
	});
}

/**
 * Driving directions through the stops in order, using Apple's unified Maps
 * URLs (iOS / macOS 18.4+). A single stop routes from the current location.
 */
export function appleMapsRouteUrl(stops: LatLng[]) {
	const params = new URLSearchParams({ mode: "driving" });
	params.set("destination", coords(stops[stops.length - 1]));
	if (stops.length > 1) {
		params.set("source", coords(stops[0]));
		for (const stop of stops.slice(1, -1)) {
			params.append("waypoint", coords(stop));
		}
	}
	return `https://maps.apple.com/directions?${params}`;
}
