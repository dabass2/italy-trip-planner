import { createFileRoute } from "@tanstack/react-router";
import { PlaceDetailDialog } from "#/components/PlaceDetailDialog";
import { PlaceList } from "#/components/PlaceList";
import { PlanMap } from "#/components/PlanMap";
import { PlanViewer } from "#/components/PlanViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { appActions, useAppState } from "#/lib/app-store";

export const Route = createFileRoute("/planner")({
	component: Planner,
});

function Planner() {
	const currentTab = useAppState((s) => s.currentTab);

	return (
		<>
			{/* Shared by the place cards, plan stops and map pins. */}
			<PlaceDetailDialog />
			{/* Fills the space below the header. Small screens stack the map above the panel; wider ones sit side by side. */}
			<div className="flex flex-1 min-h-0 flex-col gap-2 m-2 mt-0 md:grid md:grid-cols-12 md:gap-4 md:m-4 md:mt-0">
				<div className="h-[40dvh] shrink-0 md:h-auto md:col-span-7 md:min-h-0 lg:col-span-8">
					<PlanMap />
				</div>
				<div className="flex-1 min-h-0 min-w-0 md:col-span-5 lg:col-span-4">
					<div className="border border-olive-leaf rounded-2xl p-3 h-full md:p-4">
						<Tabs
							value={currentTab}
							className="h-full"
							onValueChange={(value) =>
								appActions.setTab(value as "plan" | "places")
							}
						>
							<TabsList className="w-full md:w-fit">
								<TabsTrigger value="plan">My Plan</TabsTrigger>
								<TabsTrigger value="places">Places</TabsTrigger>
							</TabsList>
							<TabsContent value="plan" className="min-h-0">
								<PlanViewer />
							</TabsContent>
							<TabsContent value="places" className="min-h-0">
								<PlaceList />
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</>
	);
}
