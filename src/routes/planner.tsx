import { createFileRoute } from "@tanstack/react-router";
import { PlaceList } from "#/components/PlaceList";
import { PlanMap } from "#/components/PlanMap";

export const Route = createFileRoute("/planner")({
	component: Planner,
});

function Planner() {
	return (
		<div className="grid grid-cols-12 gap-4 m-4 h-[calc(100dvh-2rem)]">
			<div className="col-span-8 min-h-0">
				<PlanMap />
			</div>
			<div className="col-span-4 min-h-0">
				<PlaceList />
			</div>
		</div>
	);
}
