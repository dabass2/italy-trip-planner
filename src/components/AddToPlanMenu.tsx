import { Check, ChevronDown, Plus } from "lucide-react";
import type { SyntheticEvent } from "react";
import { planActions, usePlan } from "#/lib/plan-store";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const stop = (e: SyntheticEvent) => e.stopPropagation();

export function AddToPlanMenu({
	placeId,
	inlineView,
}: {
	placeId: string;
	inlineView?: boolean;
}) {
	const days = usePlan((s) => s.days);

	const plannedDays = days.flatMap((day, i) =>
		day.stops.some((s) => s.placeId === placeId) ? [i + 1] : [],
	);
	const isPlanned = plannedDays.length > 0;

	const buttonVariant = inlineView
		? "ghost"
		: isPlanned
			? "outline"
			: "secondary";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild onClick={stop} onKeyDown={stop}>
				<Button variant={buttonVariant} className="p-0">
					{isPlanned ? <Check /> : <Plus />}
					{isPlanned ? `In Day ${plannedDays.join(", ")}` : "Add To Plan"}
					<ChevronDown />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" onClick={stop} onKeyDown={stop}>
				<DropdownMenuLabel>Add to…</DropdownMenuLabel>
				{days.map((day, i) => {
					const inDay = plannedDays.includes(i + 1);
					return (
						<DropdownMenuItem
							key={day.id}
							disabled={inDay}
							onSelect={() => planActions.addStop(placeId, day.id)}
						>
							Day {i + 1}
							{inDay && <Check className="ml-auto" />}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
