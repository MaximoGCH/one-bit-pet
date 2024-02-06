import produce from 'immer';
import type { Writable } from 'svelte/store';
import type { GameState } from './gameState';
import { itemList } from '$lib/data/items';

export const createInventoryDispatch = ({ update }: Writable<GameState>) => ({
	addMoney: (number: number) => {
		update(
			produce((state) => {
				state.inventory.money += number;
			})
		);
	},

	addItem: (name: string, number = 1) => {
		if (!(name in itemList)) throw new Error(`${name} is not a valid item`);

		update(
			produce((state) => {
				if (!(name in state.inventory.items)) {
					state.inventory.items[name] = 0;
				}

				state.inventory.items[name] += number;
			})
		);
	},

	removeItem: (name: string, number = 1) => {
		if (!(name in itemList)) throw new Error(`${name} is not a valid item`);

		update(
			produce((state) => {
				if (!(name in state.inventory.items) || state.inventory.items[name] < number) {
					throw new Error(`Not enough items of type ${name} to remove ${number}`);
				}

				state.inventory.items[name] -= number;

				if (state.inventory.items[name] === 0) {
					delete state.inventory.items[name];
				}
			})
		);
	},

	addRecipe: (itemName: string, recipeNumber: number) => {
		update(
			produce((state) => {
				if (
					state.inventory.knownRecipes.find(
						(item) => item.itemName === itemName && item.recipeNumber === recipeNumber
					)
				)
					return;

				state.inventory.knownRecipes.push({
					itemName,
					recipeNumber
				});
			})
		);
	}
});
