import { Link } from "@tanstack/react-router";
import { Heart, House, NotepadText } from "lucide-react";

const NAV_LINKS = [
	{ to: "/", label: "Home", icon: House },
	{ to: "/planner", label: "Planner", icon: NotepadText },
] as const;

export default function Header() {
	return (
		<header className="flex shrink-0 items-center justify-between gap-4 px-2 py-2 md:px-4 md:py-3">
			<Link to="/" className="flex items-center gap-2">
				<span className="grid size-8 place-items-center rounded-lg bg-blushed-brick text-azure-mist">
					<Heart className="size-4" fill="currentColor" aria-hidden="true" />
				</span>
				<span className="font-display text-2xl leading-none italic text-coffee-bean">
					Amore
				</span>
			</Link>
			<nav className="flex items-center gap-1">
				{NAV_LINKS.map((link) => (
					<Link
						key={link.to}
						to={link.to}
						activeOptions={{ exact: true }}
						className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-olive-leaf-100 data-[status=active]:text-foreground"
					>
						<link.icon className="size-4" aria-hidden="true" />
						{link.label}
					</Link>
				))}
			</nav>
		</header>
	);
}
