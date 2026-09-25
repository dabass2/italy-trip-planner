import { cn } from "cn";
import type { places } from "#/db/schema";
import { PriceLevel } from "./PriceLevel";
import { Badge } from "./ui/badge";

type Place = typeof places.$inferSelect;

const tones = {
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

const typeTones: Record<string, keyof typeof tones> = {
	restaurant: "brick",
	cafe: "brick",
	market: "brick",
	experience: "baltic",
	shop: "baltic",
};

function toneFor(type: string) {
	return tones[typeTones[type] ?? "olive"];
}

export function PlaceCard({
	place,
	index,
	selected = false,
	onSelect,
}: {
	place: Place;
	index: number;
	selected?: boolean;
	onSelect?: () => void;
}) {
	const tone = toneFor(place.type);

	return (
		<button
			type="button"
			onClick={onSelect}
			aria-pressed={selected}
			className={cn(
				"flex w-full gap-4 rounded-2xl border p-4 text-left transition-[background-color,border-color]",
				selected
					? "border-foreground bg-surface-raised"
					: "border-transparent bg-surface hover:border-olive-leaf-200",
			)}
		>
			<div className="flex min-w-0 flex-1 flex-col gap-2">
				<div className="flex items-baseline justify-between gap-2">
					<h3 className="truncate text-lg font-bold">{place.name}</h3>
					<PriceLevel level={place.priceLevel} />
				</div>
				<div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
					<Badge
						className={cn("px-2 py-1 uppercase tracking-widest", tone.badge)}
					>
						{place.type.replaceAll("_", " ")}
					</Badge>
					<span className="truncate">
						{place.city} · {place.hoursText ?? "Anytime"}
					</span>
				</div>
				<p className={!selected ? "truncate" : undefined}>
					{place.description}
				</p>
			</div>
		</button>
	);
}
