import { useHydrated } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "#/lib/utils";

const APP_NAME = "Amore";
// Keep the splash up long enough for the intro animation to finish.
const MIN_VISIBLE_MS = 1800;
const EXIT_MS = 600;

type Phase = "visible" | "leaving" | "gone";

/**
 * Full-screen intro shown on the first page load. It's server-rendered so the
 * animation starts on first paint, then fades out once the app has hydrated.
 */
export function SplashScreen() {
	const hydrated = useHydrated();
	const [phase, setPhase] = useState<Phase>("visible");

	useEffect(() => {
		if (!hydrated) return;
		// performance.now() is time since navigation start, so this only waits
		// for whatever is left of the intro.
		const remaining = Math.max(0, MIN_VISIBLE_MS - performance.now());
		const leave = setTimeout(() => setPhase("leaving"), remaining);
		const remove = setTimeout(() => setPhase("gone"), remaining + EXIT_MS);
		return () => {
			clearTimeout(leave);
			clearTimeout(remove);
		};
	}, [hydrated]);

	if (phase === "gone") return null;

	return (
		<output
			aria-label={`Loading ${APP_NAME}`}
			aria-hidden={phase === "leaving"}
			className={cn(
				"splash fixed inset-0 z-[2000] flex flex-col items-center justify-center gap-6 bg-olive-leaf-50",
				phase === "leaving" && "splash-leave pointer-events-none",
			)}
		>
			<svg
				viewBox="0 0 24 24"
				className="splash-heart size-16 text-blushed-brick"
				aria-hidden="true"
			>
				<path
					pathLength={1}
					d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
					fill="currentColor"
					stroke="currentColor"
					strokeWidth={1.25}
					strokeLinejoin="round"
				/>
			</svg>

			<h1 className="font-display text-6xl italic text-coffee-bean sm:text-7xl">
				{APP_NAME.split("").map((letter, i) => (
					<span
						// biome-ignore lint/suspicious/noArrayIndexKey: static string
						key={i}
						className="splash-letter inline-block"
						style={{ animationDelay: `${500 + i * 90}ms` }}
					>
						{letter}
					</span>
				))}
			</h1>

			<div className="splash-bar flex h-1 w-40 overflow-hidden rounded-full">
				<span className="flex-1 bg-olive-leaf" />
				<span className="flex-1 bg-white" />
				<span className="flex-1 bg-blushed-brick" />
			</div>

			<p className="splash-tagline text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
				Your Italian journey awaits
			</p>
		</output>
	);
}
