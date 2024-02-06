import { gameOptions } from '$lib/game-options';
import produce from 'immer';
import { writable } from 'svelte/store';
import { gameStateStore } from './game/gameState';

const { addItem, removeItem } = gameStateStore.dispatch.inventory;

export type UiPageProperties = {
	showInventory: boolean;
	showButtons: boolean;
	showRecipeList: boolean;
	inventoryFilter?: string[];
};

export type UiState = {
	inventorySelectedItem?: string;
	centerScreen: {
		width: number;
		height: number;
	};
} & UiPageProperties;

const { subscribe, update } = writable<UiState>({
	showInventory: true,
	showButtons: true,
	showRecipeList: false,
	centerScreen: gameOptions.screen
});

export const uiStateStore = {
	subscribe,
	set: (data: UiPageProperties) => {
		update(
			produce((state) => {
				state.showButtons = data.showButtons;
				state.showInventory = data.showInventory;
				state.showRecipeList = data.showRecipeList;
				state.inventoryFilter = data.inventoryFilter;
			})
		);
	},
	selectItem: (item: string) => {
		update(
			produce((state) => {
				removeItem(item);
				if (state.inventorySelectedItem) {
					addItem(state.inventorySelectedItem);
				}
				state.inventorySelectedItem = item;
			})
		);
	},
	resetSelectedItem: () => {
		update(
			produce((state) => {
				if (!state.inventorySelectedItem) {
					return;
				}

				addItem(state.inventorySelectedItem);
				delete state.inventorySelectedItem;
			})
		);
	},
	processSelectedItem: () => {
		update(
			produce((state) => {
				delete state.inventorySelectedItem;
			})
		);
	},
	setScreenSize: (width: number, height: number) => {
		update(
			produce((state) => {
				state.centerScreen.width = width;
				state.centerScreen.height = height;
			})
		);
	}
};
