import produce from 'immer';
import type { Writable } from 'svelte/store';
import type { GameState } from './gameState';
import { v4 as uuidv4 } from 'uuid';
import type { PetId } from './petState';

export const createPetDispatch = ({ update }: Writable<GameState>) => ({
	addPet: (name: string, petName: string): PetId => {
		const newId = uuidv4();
		update(
			produce((state) => {
				state.pets[newId] = {
					name: name,
					petName: petName,
					id: newId,
					level: 1,
					xp: 0
				};
			})
		);
		return newId;
	},
	addXp: (petId: PetId, xp: number) => {
		update(
			produce((state) => {
				const pet = state.pets[petId];
				pet.xp += xp;
				// eslint-disable-next-line no-constant-condition
				while (true) {
					const nextLevelXp = pet.level * 100;
					if (pet.xp > nextLevelXp) {
						pet.xp -= nextLevelXp;
						pet.level++;
					} else {
						break;
					}
				}
			})
		);
	},
	setPetName: (petId: PetId, petName: string) => {
		update(
			produce((state) => {
				state.pets[petId].petName = petName;
			})
		);
	}
});
