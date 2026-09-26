import { cn } from "cn";
import { Plus } from "lucide-react";
import type { places } from "#/db/schema";
import { PriceLevel } from "./PriceLevel";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

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
	selected = false,
	onSelect,
}: {
	place: Place;
	selected?: boolean;
	onSelect?: () => void;
}) {
	const tone = toneFor(place.type);

	return (
		<Card
			role="button"
			tabIndex={0}
			aria-pressed={selected}
			onClick={onSelect}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onSelect?.();
				}
			}}
			className={cn(
				"cursor-pointer gap-2 rounded-2xl py-4 shadow-none transition-[background-color,border-color]",
				selected
					? "border-foreground bg-olive-leaf-100"
					: "border-transparent bg-surface hover:border-olive-leaf-200",
			)}
		>
			<CardHeader>
				<CardTitle className="truncate text-lg font-bold">
					{place.name}
				</CardTitle>
				<CardAction>
					<PriceLevel level={place.priceLevel} />
				</CardAction>
				<CardDescription className="flex flex-col min-w-0 gap-2">
					<Badge className={cn("uppercase", tone.badge)}>
						{place.type.replaceAll("_", " ")}
					</Badge>
					<div>
						<span className={!selected ? "truncate" : undefined}>
							{place.city}
						</span>{" "}
						- <span>{place.hoursText ?? "Anytime"}</span>
					</div>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className={!selected ? "truncate" : undefined}>
					{place.description}
				</p>
			</CardContent>
			<CardAction className="flex items-center justify-end px-4 w-full">
				<Button variant="secondary" onClick={(e) => e.stopPropagation()}>
					<Plus />
					Add To Plan
				</Button>
			</CardAction>
		</Card>
	);
}
