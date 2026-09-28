import { SortAsc } from "lucide-react";
import type { Dispatch, SetStateAction, SyntheticEvent } from "react";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const sortOptions = [
	{ label: "Price Low to High", value: "priceLevel", direction: "asc" },
	{ label: "Price High to Low", value: "priceLevel", direction: "desc" },
	{ label: "Rating Low to High", value: "rating", direction: "asc" },
	{ label: "Rating High to Low", value: "rating", direction: "desc" },
	{
		label: "Duration Low to High",
		value: "durationMinutes",
		direction: "asc",
	},
	{
		label: "Duration High to Low",
		value: "durationMinutes",
		direction: "desc",
	},
] as const;

export type SortOption = {
	option: (typeof sortOptions)[number]["value"] | null;
	direction: (typeof sortOptions)[number]["direction"] | null;
};

type PlaceFilterMenuProps = {
	setSortOption: Dispatch<SetStateAction<SortOption>>;
};

export function PlaceFilterMenu({ setSortOption }: PlaceFilterMenuProps) {
	const stop = (e: SyntheticEvent) => e.stopPropagation();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild onClick={stop} onKeyDown={stop}>
				<Button variant={"outline"} size="icon">
					<SortAsc />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" onClick={stop} onKeyDown={stop}>
				<DropdownMenuLabel>Sort By</DropdownMenuLabel>
				{sortOptions.map((option) => (
					<DropdownMenuItem
						key={option.label}
						onSelect={() =>
							setSortOption({
								option: option.value,
								direction: option.direction,
							})
						}
					>
						{option.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
