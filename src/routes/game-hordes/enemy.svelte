<script lang="ts">
	import { Texture } from 'pixi.js';
	import { Graphics, onTick, Sprite } from 'svelte-pixi';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { collectionStateStore, type CollisionHandlerUnsubscribe } from './collisions';
	import { gameHordesEnemyData } from './gameHordesData';
	import { uiStateStore } from '$lib/state/ui-state';
	import { onMount } from 'svelte';
	import type { Shoot } from './gameHordesData';
	import AnimatedContainer from '$lib/components/Animation/animated-container.svelte';
	import { tweenedAnimation } from '$lib/components/Animation/animations/tweened-animation';
	import { cubicOut } from 'svelte/easing';

	const dispatch = createEventDispatcher();

	export let enemyName: string;

	const startX = $uiStateStore.centerScreen.width + 32;
	export let startY: number;

	const { updateItem, addItem, removeItem, onItemCollision } = collectionStateStore;

	let x = startX;
	let y = startY;

	let foodReached = false;

	let collisionId = addItem('enemies', { bounds: { x: x - 10, y: y - 10, width: 20, height: 20 } });

	const updateCollision = () => {
		updateItem('enemies', collisionId, { bounds: { x: x - 10, y: y - 10, width: 20, height: 20 } });
	};

	const enemy = gameHordesEnemyData[enemyName];

	const { health: maxHealth, speed } = enemy;

	let health = maxHealth;

	const realSpeed = 0.1 + speed / 200;
	onTick((delta) => {
		if (foodReached) return;

		x -= realSpeed * delta;
		updateCollision();
		if (x < 50) {
			foodReached = true;
			dispatch('food-reached');
		}
	});

	let unsubscribers: CollisionHandlerUnsubscribe[] = [];
	onMount(() => {
		unsubscribers = [
			onItemCollision<void, Shoot>('enemies', collisionId, 'shoots', (_, item) => {
				health -= item.data?.damage || 0;

				if (health <= 0) {
					dispatch('destroy', { x, y });
				}
			}),
			onItemCollision<void, Shoot>('enemies', collisionId, 'pets', () => {
				health = 0;

				if (health <= 0) {
					dispatch('destroy', { x, y });
				}
			})
		];
	});

	onDestroy(() => {
		unsubscribers.forEach((item) => item());
		removeItem('enemies', collisionId);
	});
</script>

<Sprite texture={Texture.from(`img/game-hordes/enemy/${enemyName}.png`)} {x} {y} anchor={0.5} />

<Graphics
	draw={(graphics) => {
		graphics.clear();
		const rect = [x - 10, y + 10, 20, 2];
		graphics.beginFill(0xffffff);
		graphics.drawRect(rect[0], rect[1], rect[2] * (health / maxHealth), rect[3]);
		graphics.endFill();
		graphics.lineStyle(1, 0xffffff);
		graphics.drawRect(rect[0] - 2, rect[1] - 2, rect[2] + 4, rect[3] + 4);
	}}
/>

{#if foodReached}
	<AnimatedContainer
		onStart={tweenedAnimation({
			from: { x, y, scaleX: 0, scaleY: 0 },
			to: { scaleX: 1, scaleY: 1 },
			easing: cubicOut,
			duration: 200
		})}
	>
		<Graphics
			draw={(graphics) => {
				graphics.clear();
				graphics.lineStyle(5, 0xffffff);
				graphics.drawCircle(0, 0, 20);
			}}
		/>
	</AnimatedContainer>
{/if}
