import { Store, useSelector } from "@tanstack/react-store";

type TabType = "plan" | "places";

export type AppState = {
	currentTab: TabType;
	currentMapPins: string[];
	detailPlaceId: string | null;
};

function initialState(): AppState {
	return {
		currentTab: "plan",
		currentMapPins: [],
		detailPlaceId: null,
	};
}

export const appStore = new Store<
	AppState,
	{
		setTab: (newTab: TabType) => void;
		setMapPins: (newPins: string[]) => void;
		openPlaceDetails: (placeId: string) => void;
		closePlaceDetails: () => void;
	}
>(initialState(), ({ setState }) => ({
	setTab: (newTab) => {
		setState((oldState) => ({ ...oldState, currentTab: newTab }));
	},

	setMapPins: (newPins) => {
		setState((oldState) => ({ ...oldState, currentMapPins: newPins }));
	},

	openPlaceDetails: (placeId) => {
		setState((oldState) => ({ ...oldState, detailPlaceId: placeId }));
	},

	closePlaceDetails: () => {
		setState((oldState) => ({ ...oldState, detailPlaceId: null }));
	},
}));

export const appActions = appStore.actions;

export function useAppState<T>(selector: (state: AppState) => T): T {
	return useSelector(appStore, selector);
}
