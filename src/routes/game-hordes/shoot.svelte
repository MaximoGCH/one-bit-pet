<script lang="ts">
	import { Texture } from 'pixi.js';
	import { onTick, Sprite } from 'svelte-pixi';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { collectionStateStore, type CollisionHandlerUnsubscribe } from './collisions';
	import type { Shoot } from './gameHordesData';
	import { uiStateStore } from '$lib/state/ui-state';
	import { onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	export let shoot: Shoot;
	export let startY: number;
	export let startX: number;

	const { updateItem, addItem, removeItem, onItemCollision } = collectionStateStore;

	let x = startX;
	let y = startY;

	let collisionId = addItem('shoots', {
		data: shoot,
		bounds: { x: x - 5, y: y - 5, width: 10, height: 10 }
	});

	const updateCollision = () => {
		updateItem('shoots', collisionId, {
			data: shoot,
			bounds: { x: x - 5, y: y - 5, width: 10, height: 10 }
		});
	};

	const { angle, sprite, duration } = shoot;

	const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);

	const realAngle = degreesToRadians(angle);

	const speed = 1.5;
	onTick((delta) => {
		x += speed * Math.cos(realAngle) * delta;
		y += speed * Math.sin(realAngle) * delta;
		updateCollision();

		if (x > $uiStateStore.centerScreen.width) {
			dispatch('destroy');
		}
	});

	let unsubscribe: CollisionHandlerUnsubscribe | undefined;
	onMount(() => {
		unsubscribe = onItemCollision('shoots', collisionId, 'enemies', () => {
			dispatch('destroy');
		});

		if (duration) {
			setTimeout(() => {
				dispatch('destroy');
			}, duration * 30);
		}
	});

	onDestroy(() => {
		unsubscribe && unsubscribe();
		removeItem('shoots', collisionId);
	});
</script>

<Sprite texture={Texture.from(`img/game-hordes/shoot/${sprite}`)} {x} {y} anchor={0.5} />
