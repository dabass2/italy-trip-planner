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

const TYPE_TONES = {
	brick: {
		index: "bg-blushed-brick-300",
		badge: "bg-blushed-brick-100 text-blushed-brick-800",
	},
	baltic: {
		index: "bg-baltic-blue-300",
		badge: "bg-baltic-blue-100 text-baltic-blue-800",
	},
	olive: {
		index: "bg-olive-leaf-300",
		badge: "bg-olive-leaf-100 text-olive-leaf-800",
	},
};

const TONE_BY_TYPE: Record<string, keyof typeof TYPE_TONES> = {
	restaurant: "brick",
	cafe: "brick",
	market: "brick",
	experience: "baltic",
	shop: "baltic",
};

/** Colour classes for a place type; unlisted types fall back to olive. */
export function toneFor(type: string) {
	return TYPE_TONES[TONE_BY_TYPE[type] ?? "olive"];
}

/** Formats a duration in minutes as e.g. "45m", "2h" or "1h 30m". */
export function formatDuration(minutes: number) {
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	if (h === 0) return `${m}m`;
	return m === 0 ? `${h}h` : `${h}h ${m}m`;
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
