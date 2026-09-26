import { Store, useSelector } from "@tanstack/react-store";

type TabType = "plan" | "places";

export type AppState = {
	currentTab: TabType;
	currentMapPins: string[];
};

function initialState(): AppState {
	return {
		currentTab: "plan",
		currentMapPins: [],
	};
}

export const appStore = new Store<
	AppState,
	{
		setTab: (newTab: TabType) => void;
		setMapPins: (newPins: string[]) => void;
	}
>(initialState(), ({ setState }) => ({
	setTab: (newTab) => {
		setState((oldState) => ({ ...oldState, currentTab: newTab }));
	},

	setMapPins: (newPins) => {
		setState((oldState) => ({ ...oldState, currentMapPins: newPins }));
	},
}));

export const appActions = appStore.actions;

export function useAppState<T>(selector: (state: AppState) => T): T {
	return useSelector(appStore, selector);
}
