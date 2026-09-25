export function PriceLevel({ level }: { level: number }) {
	return (
		<span className="shrink-0 text-sm font-semibold">
			<span className="sr-only">Price level {level} of 4</span>
			{Array.from({ length: 4 }, (_, i) => (
				<span
					// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length static list
					key={i}
					aria-hidden
					className={i < level ? "text-foreground" : "text-foreground/20"}
				>
					€
				</span>
			))}
		</span>
	);
}
