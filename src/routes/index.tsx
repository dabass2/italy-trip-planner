import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { AddToPlanMenu } from "#/components/AddToPlanMenu";
import {
	PlaceDetailDialog,
	PlaceDetailsButton,
} from "#/components/PlaceDetailDialog";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { appActions } from "#/lib/app-store";
import { usePlan } from "#/lib/plan-store";
import { cn, getColorForDay, toneFor } from "#/lib/utils";
import { placesQueryOptions } from "#/utils/places.functions";

export const Route = createFileRoute("/")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(placesQueryOptions),
	component: Home,
});

const HERO_IMAGE = `${import.meta.env.BASE_URL}engjell-gjepali-M0OIyN5u8ZM-unsplash.jpg`;
const HERO_IMAGE_CREDIT_URL = "https://unsplash.com/photos/M0OIyN5u8ZM";
const TOP_PICK_COUNT = 6;
const CITY_COUNT = 6;

function Home() {
	const { data: places = [] } = useQuery(placesQueryOptions);
	const days = usePlan((s) => s.days);

	const cityCounts = new Map<string, number>();
	for (const place of places) {
		cityCounts.set(place.city, (cityCounts.get(place.city) ?? 0) + 1);
	}
	const topCities = [...cityCounts]
		.sort((a, b) => b[1] - a[1])
		.slice(0, CITY_COUNT);

	const topPicks = [...places]
		.sort((a, b) => b.rating - a.rating)
		.slice(0, TOP_PICK_COUNT);

	const stats = [
		{ value: places.length, label: "places" },
		{ value: cityCounts.size, label: "cities" },
		{ value: new Set(places.map((p) => p.region)).size, label: "regions" },
		{ value: days.length, label: "days to plan" },
	];

	const plannedStops = days.reduce((sum, day) => sum + day.stops.length, 0);

	return (
		<>
			{/* Shared by the top pick cards. */}
			<PlaceDetailDialog />
			{/* The page itself never scrolls, so the home content scrolls in here. */}
			<main className="flex-1 min-h-0 overflow-y-auto">
				<div className="relative isolate">
					{/* Runs past the hero and fades out, so the page below settles back to plain white. */}
					<div
						aria-hidden="true"
						className="absolute inset-x-0 top-0 -bottom-24 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_3rem,black_55%,transparent)]"
					>
						<img
							src={HERO_IMAGE}
							alt=""
							fetchPriority="high"
							decoding="async"
							className="home-hero-image size-full object-cover object-[center_30%]"
						/>
					</div>
					<div className="mx-auto flex max-w-6xl flex-col items-end gap-2 px-2 pt-8 pb-12 md:px-4 md:pt-20 md:pb-20">
						<section className="grid w-full gap-8 rounded-3xl border border-white/60 bg-white/75 p-6 shadow-2xl shadow-coffee-bean/15 backdrop-blur-md md:grid-cols-5 md:p-10">
							<div className="flex flex-col gap-5 md:col-span-3">
								<div className="flex h-1 w-16 overflow-hidden rounded-full shadow-[0_0_0_1px_var(--border)]">
									<span className="flex-1 bg-olive-leaf" />
									<span className="flex-1 bg-white" />
									<span className="flex-1 bg-blushed-brick" />
								</div>
								<h1 className="font-display text-4xl leading-tight italic text-coffee-bean md:text-6xl">
									Fall in love with Italy, one stop at a time.
								</h1>
								<p className="max-w-prose text-muted-foreground md:text-lg">
									Pick from hand-chosen trattorie, piazzas, museums and
									viewpoints, then shape them into a {days.length}-day itinerary
									you can take straight to your maps app.
								</p>
								<div className="flex flex-wrap gap-3">
									<Button asChild size="lg">
										<Link
											to="/planner"
											onClick={() => appActions.setTab("plan")}
										>
											{plannedStops > 0
												? "Continue planning"
												: "Start planning"}
											<ArrowRight />
										</Link>
									</Button>
									<Button asChild size="lg" variant="outline">
										<Link
											to="/planner"
											onClick={() => appActions.setTab("places")}
										>
											Browse places
										</Link>
									</Button>
								</div>
							</div>
							<dl className="grid grid-cols-2 gap-3 self-center md:col-span-2">
								{stats.map((stat) => (
									<div
										key={stat.label}
										className="rounded-2xl bg-white/80 p-4 shadow-sm"
									>
										<dt className="text-sm text-muted-foreground">
											{stat.label}
										</dt>
										<dd className="font-display text-4xl italic text-blushed-brick">
											{stat.value}
										</dd>
									</div>
								))}
							</dl>
						</section>
						<a
							href={HERO_IMAGE_CREDIT_URL}
							target="_blank"
							rel="noreferrer"
							className="rounded-full bg-white/60 px-2.5 py-0.5 text-xs text-coffee-bean/70 backdrop-blur-sm hover:text-coffee-bean"
						>
							Photo by Engjell Gjepali on Unsplash
						</a>
					</div>
				</div>

				{/* Positioned so it paints above the fading tail of the photo. */}
				<div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-2 pb-10 md:px-4">
					<section className="flex flex-col gap-4">
						<SectionHeading
							title="Your plan"
							description={
								plannedStops > 0
									? `${plannedStops} ${plannedStops === 1 ? "stop" : "stops"} so far`
									: "Nothing planned yet. Add places to any day to get started."
							}
						/>
						<div className="grid gap-3 md:grid-cols-3">
							{days.map((day, i) => {
								const names = day.stops
									.map((s) => places.find((p) => p.placeId === s.placeId)?.name)
									.filter((name) => !!name);
								return (
									<Link
										key={day.id}
										to="/planner"
										onClick={() => appActions.setTab("plan")}
										className="group flex flex-col gap-2 rounded-2xl border border-transparent bg-surface p-4 transition-colors hover:border-olive-leaf-200"
									>
										<div className="flex items-center gap-2">
											<span
												className={cn(
													"size-2.5 rounded-full",
													getColorForDay(i).badge,
												)}
											/>
											<span className="font-bold">Day {day.id}</span>
											<span className="ml-auto text-sm text-muted-foreground">
												{names.length} {names.length === 1 ? "stop" : "stops"}
											</span>
										</div>
										<p className="truncate text-sm text-muted-foreground">
											{names.length > 0
												? names.join(" · ")
												: "Free day, for now"}
										</p>
									</Link>
								);
							})}
						</div>
					</section>

					<section className="flex flex-col gap-4">
						<SectionHeading
							title="Top-rated picks"
							description="The highest-rated places across every city."
						/>
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{topPicks.map((place) => (
								<article
									key={place.placeId}
									className="flex flex-col gap-3 rounded-2xl bg-surface p-4"
								>
									<div className="flex items-center justify-between gap-2">
										<Badge
											className={cn("uppercase", toneFor(place.type).badge)}
										>
											{place.type.replaceAll("_", " ")}
										</Badge>
										<span className="flex items-center gap-1 text-sm font-semibold">
											<Star className="size-3.5 fill-current text-blushed-brick" />
											{place.rating}
										</span>
									</div>
									<div className="min-w-0">
										<h3 className="truncate text-lg font-bold">{place.name}</h3>
										<p className="flex items-center gap-1 text-sm text-muted-foreground">
											<MapPin className="size-3.5 shrink-0" />
											{place.city}
										</p>
									</div>
									<p className="line-clamp-2 text-sm">{place.description}</p>
									<div className="mt-auto flex items-center justify-end gap-2">
										<PlaceDetailsButton placeId={place.placeId} />
										<AddToPlanMenu placeId={place.placeId} />
									</div>
								</article>
							))}
						</div>
					</section>

					<section className="flex flex-col gap-4">
						<SectionHeading
							title="Where you could go"
							description="The cities with the most to see."
						/>
						<ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
							{topCities.map(([city, count]) => (
								<li
									key={city}
									className="rounded-2xl border border-olive-leaf-200 p-4"
								>
									<p className="font-display text-xl italic">{city}</p>
									<p className="text-sm text-muted-foreground">
										{count} {count === 1 ? "place" : "places"}
									</p>
								</li>
							))}
						</ul>
					</section>
				</div>
			</main>
		</>
	);
}

function SectionHeading({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div>
			<h2 className="text-2xl font-bold">{title}</h2>
			<p className="text-muted-foreground">{description}</p>
		</div>
	);
}
