import { writable } from 'svelte/store';

export const createGameObjectListStore = <T extends object>(initialData: T[] = []) => {
	const { subscribe, update } = writable<
		(T & {
			id: number;
		})[]
	>([]);

	let lastId = 0;

	const create = (data: T) => {
		const id = lastId++;
		update((list) => [...list, { ...data, id }]);

		return id;
	};

	const destroy = (id: number) => {
		update((list) => list.filter((item) => item.id !== id));
	};

	initialData.forEach(create);

	return {
		subscribe,
		create,
		destroy
	};
};
