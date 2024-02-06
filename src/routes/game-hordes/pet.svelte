<script lang="ts">
	import { petData } from '$lib/data/pets';
	import { gameStateStore } from '$lib/state/game/gameState';
	import { uiStateStore } from '$lib/state/ui-state';
	import { InteractionEvent, Texture, Container as PixiContainer } from 'pixi.js';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { Graphics, onTick, Sprite, Container } from 'svelte-pixi';
	import { collectionStateStore, type CollisionHandlerUnsubscribe } from './collisions';
	import { gameHordesPetData } from './gameHordesData';

	const dispatch = createEventDispatcher();

	const { addItem, updateItem, onItemCollision } = collectionStateStore;

	let controlContainer: PixiContainer | undefined;

	export let petId: string;
	let collisionId = addItem('pets');
	export let startY: number;

	const { petName, level } = $gameStateStore.pets[petId];

	const { phase } = petData[petName];
	const { shoots } = gameHordesPetData[petName];

	const maxHealth = phase * 100;
	let health = maxHealth;
	let x = 100;
	let y = startY;
	let gotoPosition = {
		x,
		y
	};

	let selected = false;

	const mouseMove = (e: CustomEvent<InteractionEvent>) => {
		if (!selected || !controlContainer) return;

		const { x, y } = controlContainer.toLocal(e.detail.data.global);

		gotoPosition = {
			x,
			y: y - 3
		};

		const maxW = $uiStateStore.centerScreen.width - 200;
		const maxH = $uiStateStore.centerScreen.height - 20;
		if (gotoPosition.x > maxW) {
			gotoPosition.x = maxW;
		}
		if (gotoPosition.x < 70) {
			gotoPosition.x = 70;
		}
		if (gotoPosition.y > maxH) {
			gotoPosition.y = maxH;
		}
		if (gotoPosition.y < 20) {
			gotoPosition.y = 20;
		}
	};

	const updateCollision = () => {
		updateItem('pets', collisionId, { bounds: { x: x - 10, y, width: 20, height: 20 } });
	};

	updateCollision();

	$: pointDistance = Math.abs(gotoPosition.x - x) + Math.abs(gotoPosition.y - y) * 2;
	$: angle = Math.atan2(gotoPosition.y - y, gotoPosition.x - x);

	const speed = 0.8;

	let moveControl = false;
	onTick((delta) => {
		if (pointDistance > 20) {
			moveControl = true;
		}

		if (pointDistance > 1) {
			if (moveControl) {
				x += speed * Math.cos(angle) * delta;
				y += speed * Math.sin(angle) * delta;

				updateCollision();
			}
		} else {
			moveControl = false;
		}
	});

	let unsubscribe: CollisionHandlerUnsubscribe | undefined;

	let interval: NodeJS.Timer | undefined;
	onMount(() => {
		interval = setInterval(() => {
			shoots.forEach((shoot) => {
				setTimeout(() => {
					dispatch('shoot', {
						shoot: { ...shoot, damage: shoot.damage * (3 * level + 25) },
						startX: x,
						startY: y
					});
				}, shoot.delay);
			});
		}, 1500);

		unsubscribe = onItemCollision<void, void>('pets', collisionId, 'enemies', () => {
			health -= 50;

			if (health <= 0) {
				dispatch('destroy');
			}
		});
	});

	onDestroy(() => {
		unsubscribe && unsubscribe();
		clearInterval(interval);
	});
</script>

<svelte:window on:mouseup={() => (selected = false)} />

<Container bind:instance={controlContainer} />

<Sprite
	texture={Texture.from(`img/pets/${petName}.png`)}
	{x}
	{y}
	anchor={0.5}
	interactive
	buttonMode
	on:mousedown={() => (selected = true)}
	on:mousemove={mouseMove}
/>

<Graphics
	draw={(graphics) => {
		graphics.clear();
		const rect = [x - 10, y + 10, 20, 2];
		graphics.beginFill(0xffffff);
		graphics.drawRect(rect[0], rect[1], rect[2] * (health / maxHealth), rect[3]);
		graphics.endFill();
		graphics.lineStyle(1, 0xffffff);
		graphics.drawRect(rect[0] - 2, rect[1] - 2, rect[2] + 4, rect[3] + 4);

		if (selected) {
			graphics.drawEllipse(x, y + 4, 10, 3);
		}

		if (pointDistance > 20) {
			graphics.moveTo(x, y + 4);
			graphics.lineTo(gotoPosition.x, gotoPosition.y + 4);
			graphics.drawEllipse(gotoPosition.x, gotoPosition.y + 4, 10, 3);
		}
	}}
/>
