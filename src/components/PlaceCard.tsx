import { cn } from "cn";
import type { places } from "#/db/schema";
import { toneFor } from "#/lib/utils";
import { AddToPlanMenu } from "./AddToPlanMenu";
import { PlaceDetailsButton } from "./PlaceDetailDialog";
import { PriceLevel } from "./PriceLevel";
import { Badge } from "./ui/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

type Place = typeof places.$inferSelect;

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
			<CardHeader className="px-4 md:px-6">
				<CardTitle className="truncate text-lg font-bold">
					{place.name}
				</CardTitle>
				<CardAction>
					<PriceLevel level={place.priceLevel} /> · {place.rating} ★
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
			<CardContent className="px-4 md:px-6">
				<p className={!selected ? "truncate" : undefined}>
					{place.description}
				</p>
			</CardContent>
			<CardAction className="flex items-center justify-end gap-2 px-4 w-full">
				<PlaceDetailsButton placeId={place.placeId} />
				<AddToPlanMenu placeId={place.placeId} />
			</CardAction>
		</Card>
	);
}
