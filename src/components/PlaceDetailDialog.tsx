import { useQuery } from "@tanstack/react-query";
import { cn } from "cn";
import { Info, MapPin } from "lucide-react";
import type { ReactNode, SyntheticEvent } from "react";
import type { places } from "#/db/schema";
import { appActions, useAppState } from "#/lib/app-store";
import { formatDuration, toneFor } from "#/lib/utils";
import { placesQueryOptions } from "#/utils/places.functions";
import { AddToPlanMenu } from "./AddToPlanMenu";
import { PriceLevel } from "./PriceLevel";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";

type Place = typeof places.$inferSelect;

function DetailRow({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}) {
	return (
		<div className="grid grid-cols-[7rem_1fr] gap-2">
			<dt className="text-muted-foreground">{label}</dt>
			<dd>{children}</dd>
		</div>
	);
}

export function PlaceDetailsButton({
	placeId,
	iconOnly = false,
}: {
	placeId: string;
	iconOnly?: boolean;
}) {
	const open = (e: SyntheticEvent) => {
		e.stopPropagation();
		appActions.openPlaceDetails(placeId);
	};

	return iconOnly ? (
		<Button
			variant="ghost"
			size="icon-sm"
			aria-label="Place details"
			onClick={open}
		>
			<Info />
		</Button>
	) : (
		<Button variant="ghost" className="p-0" onClick={open}>
			<Info />
			Details
		</Button>
	);
}

export function PlaceDetailDialog() {
	const detailPlaceId = useAppState((s) => s.detailPlaceId);

	// Could make new server fn to get place by id, but data is already cached so might as well lookup
	const { data } = useQuery(placesQueryOptions);
	const place = data?.find((p) => p.placeId === detailPlaceId);

	return (
		<Dialog
			open={!!place}
			onOpenChange={(open) => {
				if (!open) appActions.closePlaceDetails();
			}}
		>
			{place && <PlaceDetailContent place={place} />}
		</Dialog>
	);
}

function PlaceDetailContent({ place }: { place: Place }) {
	const location = [place.neighborhood, place.city, place.region]
		.filter(Boolean)
		.join(", ");
	const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
	const appleMapsUrl = `https://maps.apple.com/?ll=${place.latitude},${place.longitude}&q=${encodeURIComponent(place.name)}`;

	return (
		<DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl">
			<DialogHeader>
				<Badge className={cn("uppercase", toneFor(place.type).badge)}>
					{place.type.replaceAll("_", " ")}
				</Badge>
				<DialogTitle className="text-xl font-bold">{place.name}</DialogTitle>
				<DialogDescription>{location}</DialogDescription>
			</DialogHeader>

			<p>{place.description}</p>

			<dl className="flex flex-col gap-2 text-sm">
				<DetailRow label="Rating">{place.rating} ★</DetailRow>
				<DetailRow label="Price">
					<PriceLevel level={place.priceLevel} /> · {place.priceRange}
				</DetailRow>
				{place.durationMinutes !== null && (
					<DetailRow label="Time needed">
						{formatDuration(place.durationMinutes)}
					</DetailRow>
				)}
				{place.bookingRequired !== null && (
					<DetailRow label="Booking">
						{place.bookingRequired ? "Required" : "Not required"}
					</DetailRow>
				)}
				<DetailRow label="Hours">
					{place.hoursText ?? place.hoursApprox ?? "Anytime"}
					{place.hoursStatus !== "scheduled" && (
						<span className="text-muted-foreground">
							{" "}
							({place.hoursStatus})
						</span>
					)}
				</DetailRow>
				{place.seasonalNotes && (
					<DetailRow label="Seasonal">{place.seasonalNotes}</DetailRow>
				)}
			</dl>

			<DialogFooter className="items-center sm:justify-between">
				<div className="flex gap-2 max-sm:w-full">
					<Button variant="outline" className="max-sm:flex-1" asChild>
						<a href={googleMapsUrl} target="_blank" rel="noreferrer">
							<MapPin />
							Google Maps
						</a>
					</Button>
					<Button variant="outline" className="max-sm:flex-1" asChild>
						<a href={appleMapsUrl} target="_blank" rel="noreferrer">
							<MapPin />
							Apple Maps
						</a>
					</Button>
				</div>
				<AddToPlanMenu placeId={place.placeId} />
			</DialogFooter>
		</DialogContent>
	);
}
