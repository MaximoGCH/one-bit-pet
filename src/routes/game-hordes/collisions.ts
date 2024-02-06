import produce from 'immer';
import { writable, get } from 'svelte/store';

function intersect(a: Bounds, b: Bounds) {
	const x = Math.max(a.x, b.x);
	const num1 = Math.min(a.x + a.width, b.x + b.width);
	const y = Math.max(a.y, b.y);
	const num2 = Math.min(a.y + a.height, b.y + b.height);
	if (num1 >= x && num2 >= y) return true;
	else return false;
}

let lastId = 0;

export type ItemId = string;

export type Bounds = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export type CollisionItem<T> = {
	data?: T;
	bounds?: Bounds;
};

export type CollisionsState = {
	collection: { [collectionName: string]: { [id: ItemId]: CollisionItem<any> } };
};

const store = writable<CollisionsState>({
	collection: {}
});

const { subscribe, update } = store;

const collisionHandlers: {
	[collectionName: string]: {
		[collectionName: string]: {
			collectionHandler?: ConnectionHandler<any, any>;
			itemHandler?: { [itemId: ItemId]: ConnectionHandler<any, any> };
		};
	};
} = {};

export type ConnectionHandler<T, D> = (
	item1: CollisionItem<T> & { id: string },
	item2: CollisionItem<D> & { id: string }
) => void;

const addItem = <T>(collectionName: string, item?: CollisionItem<T>) => {
	const id = `${lastId++}`;
	update(
		produce((state) => {
			state.collection[collectionName][id] = item || {};
		})
	);
	return id;
};

const createCollection = (collectionName: string) => {
	update(
		produce((state) => {
			state.collection[collectionName] = {};
		})
	);
};

export type CollisionHandlerUnsubscribe = () => void;

export const collectionStateStore = {
	subscribe,
	createCollection,
	addItem,
	updateItem: <T>(collectionName: string, id: ItemId, data: CollisionItem<T>) => {
		update(
			produce((state) => {
				state.collection[collectionName][id] = data;
			})
		);
	},
	removeItem: (collectionName: string, id: ItemId) => {
		update(
			produce((state) => {
				delete state.collection[collectionName][id];
			})
		);
	},
	getItem: (collectionName: string, id: ItemId) => {
		get(store).collection[collectionName][id];
	},
	onCollision: <T, D>(
		collectionName1: string,
		collectionName2: string,
		handler: ConnectionHandler<T, D>
	) => {
		if (!collisionHandlers[collectionName1]) {
			collisionHandlers[collectionName1] = {};
		}

		if (!collisionHandlers[collectionName1][collectionName2]) {
			collisionHandlers[collectionName1][collectionName2] = {};
		}

		collisionHandlers[collectionName1][collectionName2].collectionHandler = handler;

		return () => {
			delete collisionHandlers[collectionName1][collectionName2].collectionHandler;

			if (!collisionHandlers[collectionName1][collectionName2].itemHandler) {
				delete collisionHandlers[collectionName1][collectionName2];
			}
		};
	},
	onItemCollision: <T, D>(
		collectionName1: string,
		collection1ItemId: ItemId,
		collectionName2: string,
		handler: ConnectionHandler<T, D>
	) => {
		if (!collisionHandlers[collectionName1]) {
			collisionHandlers[collectionName1] = {};
		}

		if (!collisionHandlers[collectionName1][collectionName2]) {
			collisionHandlers[collectionName1][collectionName2] = {};
		}

		if (!collisionHandlers[collectionName1][collectionName2].itemHandler) {
			collisionHandlers[collectionName1][collectionName2].itemHandler = {};
		}

		(collisionHandlers[collectionName1][collectionName2].itemHandler as any)[collection1ItemId] =
			handler;

		return () => {
			delete (collisionHandlers[collectionName1][collectionName2].itemHandler as any)[
				collection1ItemId
			];

			if (
				Object.entries(collisionHandlers[collectionName1][collectionName2].itemHandler as any)
					.length === 0 &&
				!collisionHandlers[collectionName1][collectionName2].collectionHandler
			) {
				delete collisionHandlers[collectionName1][collectionName2];
			}
		};
	},
	update: () => {
		Object.entries(collisionHandlers).forEach(([collectionName1, collections]) => {
			Object.entries(collections).forEach(
				([collectionName2, { collectionHandler, itemHandler }]) => {
					Object.entries(get(store).collection[collectionName1]).forEach(([id1, item1]) => {
						if (!item1.bounds) return;

						const collectionItems = get(store).collection[collectionName2];
						const itemsToMatch = Object.entries(collectionItems)
							? Object.entries(collectionItems)
							: itemHandler
							? Object.keys(itemHandler).map<[string, CollisionItem<any>]>((itemId) => [
									itemId,
									collectionItems[itemId]
							  ])
							: null;

						if (itemsToMatch) {
							itemsToMatch.forEach(([id2, item2]) => {
								if (!item2.bounds) return;

								if (intersect(item1.bounds as Bounds, item2.bounds)) {
									if (collectionHandler) {
										collectionHandler({ ...item1, id: id1 }, { ...item2, id: id2 });
									}

									if (itemHandler && itemHandler[id1]) {
										itemHandler[id1]({ ...item1, id: id1 }, { ...item2, id: id2 });
									}
								}
							});
						}
					});
				}
			);
		});
	}
};
