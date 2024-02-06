import { writable } from 'svelte/store';
import { createInventoryDispatch } from './inventoryDispatch';
import { createPetDispatch } from './petDispatch';
import type { PetId, PetState } from './petState';

export type GameState = {
	pets: { [id: PetId]: PetState };
	inventory: {
		items: { [itemName: string]: number };
		money: number;
		knownRecipes: { itemName: string; recipeNumber: number }[];
	};
};

const store = writable<GameState>({
	pets: {},
	inventory: {
		money: 10,
		items: { apple: 2 },
		knownRecipes: []
	}
});

export const gameStateStore = {
	subscribe: store.subscribe,
	dispatch: {
		pet: createPetDispatch(store),
		inventory: createInventoryDispatch(store)
	}
};
