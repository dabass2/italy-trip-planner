import { cn } from "cn";
import { Badge } from "./ui/badge";

export function PlaceFilterChip({
	label,
	count,
	active,
	onClick,
}: {
	label: string;
	count: number;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<Badge
			asChild
			variant={active ? "default" : "outline"}
			className={cn(
				"cursor-pointer capitalize",
				active && "bg-foreground text-background",
			)}
		>
			<button type="button" aria-pressed={active} onClick={onClick}>
				{label}
				<span className="opacity-60">{count}</span>
			</button>
		</Badge>
	);
}
