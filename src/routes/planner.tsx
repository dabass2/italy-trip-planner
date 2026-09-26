import { createFileRoute } from "@tanstack/react-router";
import { PlaceList } from "#/components/PlaceList";
import { PlanMap } from "#/components/PlanMap";
import { PlanViewer } from "#/components/PlanViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";

export const Route = createFileRoute("/planner")({
	component: Planner,
});

function Planner() {
	return (
		<div className="grid grid-cols-12 gap-4 m-4 h-[calc(100dvh-2rem)]">
			<div className="col-span-8 min-h-0">
				<PlanMap />
			</div>
			<div className="col-span-4 min-h-0 min-w-0">
				<div className="border border-olive-leaf rounded-2xl p-4 h-full">
					<Tabs defaultValue="plan" className="h-full">
						<TabsList>
							<TabsTrigger value="plan">Itinerary</TabsTrigger>
							<TabsTrigger value="places">Places</TabsTrigger>
						</TabsList>
						<TabsContent value="plan">
							<PlanViewer />
						</TabsContent>
						<TabsContent value="places" className="min-h-0">
							<PlaceList />
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
