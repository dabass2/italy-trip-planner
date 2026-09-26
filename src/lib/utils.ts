import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Full class names are written out so Tailwind can find them. Map pins use the
// darker shade because the lighter one washes out over the map tiles.
const DAY_COLORS = [
	{ badge: "bg-blushed-brick-300", pin: "var(--color-blushed-brick-600)" },
	{ badge: "bg-baltic-blue-300", pin: "var(--color-baltic-blue-600)" },
	{ badge: "bg-olive-leaf-300", pin: "var(--color-olive-leaf-600)" },
];

export function getColorForDay(dayIndex: number) {
	return DAY_COLORS[dayIndex % DAY_COLORS.length];
}

const EARTH_RADIUS_KM = 6371;

type LatLng = { latitude: number; longitude: number };

/** Straight-line (great-circle) distance between two points, in kilometres. */
export function distanceKm(a: LatLng, b: LatLng) {
	const toRad = (deg: number) => (deg * Math.PI) / 180;
	const dLat = toRad(b.latitude - a.latitude);
	const dLng = toRad(b.longitude - a.longitude);
	const h =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(a.latitude)) *
			Math.cos(toRad(b.latitude)) *
			Math.sin(dLng / 2) ** 2;
	return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}
