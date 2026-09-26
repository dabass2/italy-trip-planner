import { Store, useSelector } from "@tanstack/react-store";

export type PlanStop = {
	id: string;
	placeId: string;
};

export type PlanDay = {
	id: number;
	stops: PlanStop[];
};

export type PlanState = {
	days: PlanDay[];
};

// Hard coded per reqs but could be made to allow adding/removing days
const DAY_COUNT = 3;

function initialState(): PlanState {
	const days = Array.from({ length: DAY_COUNT }, (_, i) => ({
		id: i + 1,
		stops: [],
	}));
	return { days };
}

function updateState(
	oldState: PlanState,
	targetDayId: number,
	updatedStops: PlanStop[],
): PlanState {
	return {
		...oldState,
		days: oldState.days.map((day) => {
			if (day.id !== targetDayId) return day;
			return { ...day, stops: updatedStops };
		}),
	};
}

export const planStore = new Store<
	PlanState,
	{
		addStop: (placeId: string, targetDayId: number) => void;
		removeStop: (dayId: number, stopId: string) => void;
		moveStop: (dayId: number, stopId: string, moveDirection: -1 | 1) => void;
		clearPlan: () => void;
	}
>(initialState(), ({ setState, get }) => ({
	addStop: (placeId, targetDayId) => {
		const newStop: PlanStop = { id: crypto.randomUUID(), placeId };

		setState((oldState) => {
			const targetDay = oldState.days.find((d) => d.id === targetDayId);

			// Check that the provided day exists
			if (!targetDay) return oldState;

			// Don't duplicate stops in the same day, could be allowed but disallow for now
			if (targetDay.stops.some((s) => s.placeId === placeId)) {
				return oldState;
			}

			// Copy the day's current stops and append the new one
			const updatedStops = [...targetDay.stops];
			updatedStops.push(newStop);

			// Update the state with the new stops for the target day
			return updateState(oldState, targetDayId, updatedStops);
		});
	},

	removeStop: (dayId, stopId) =>
		setState((oldState) => {
			// Find the day by id
			const day = oldState.days.find((d) => d.id === dayId);
			if (!day) return oldState;

			// Filter out the stop to be removed
			const updatedStops = day.stops.filter((s) => s.id !== stopId);

			// Update the state with the new stops for the requested day
			return updateState(oldState, dayId, updatedStops);
		}),

	moveStop: (dayId, stopId, moveDirection) =>
		setState((oldState) => {
			// Find the day by id
			const day = oldState.days.find((d) => d.id === dayId);
			if (!day) return oldState;

			// Find the stop that's being moved
			const stopIndex = day.stops.findIndex((st) => st.id === stopId);
			if (stopIndex === -1) return oldState;

			// Calculate the new index for the stop, if less than 0 or gt total stops, then don't move
			const newIndex = stopIndex + moveDirection;
			if (newIndex < 0 || newIndex >= day.stops.length) return oldState;

			// Remove the stop from its current position and insert it at the new index
			const updatedStops = [...day.stops];
			const [movedStop] = updatedStops.splice(stopIndex, 1);
			updatedStops.splice(newIndex, 0, movedStop);

			// Update the state with the new updated stops for the requested day
			return updateState(oldState, dayId, updatedStops);
		}),

	clearPlan: () => setState(() => initialState()),
}));

export const planActions = planStore.actions;

export function usePlan<T>(selector: (state: PlanState) => T): T {
	return useSelector(planStore, selector);
}
