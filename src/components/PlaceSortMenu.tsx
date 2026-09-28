import { SortAsc } from "lucide-react";
import type { Dispatch, SetStateAction, SyntheticEvent } from "react";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
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

type PlaceSortMenuProps = {
	sortOption: SortOption;
	setSortOption: Dispatch<SetStateAction<SortOption>>;
};

const DEFAULT_SORT = "default";

export function PlaceSortMenu({ sortOption, setSortOption }: PlaceSortMenuProps) {
	const stop = (e: SyntheticEvent) => e.stopPropagation();

	const active = sortOptions.find(
		(o) =>
			o.value === sortOption.option && o.direction === sortOption.direction,
	);

	const handleValueChange = (label: string) => {
		const selected = sortOptions.find((o) => o.label === label);
		setSortOption(
			selected
				? { option: selected.value, direction: selected.direction }
				: { option: null, direction: null },
		);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild onClick={stop} onKeyDown={stop}>
				<Button
					variant={active ? "secondary" : "outline"}
					size="icon"
					aria-label={active ? `Sorted by ${active.label}` : "Sort places"}
				>
					<SortAsc />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" onClick={stop} onKeyDown={stop}>
				<DropdownMenuLabel>Sort By</DropdownMenuLabel>
				<DropdownMenuRadioGroup
					value={active?.label ?? DEFAULT_SORT}
					onValueChange={handleValueChange}
				>
					<DropdownMenuRadioItem value={DEFAULT_SORT}>
						No Sort
					</DropdownMenuRadioItem>
					<DropdownMenuSeparator />
					{sortOptions.map((option) => (
						<DropdownMenuRadioItem key={option.label} value={option.label}>
							{option.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
