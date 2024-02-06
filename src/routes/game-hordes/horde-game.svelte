<script lang="ts">
	import { gameStateStore } from '$lib/state/game/gameState';
	import { uiStateStore } from '$lib/state/ui-state';
	import { Graphics, onTick, Sprite } from 'svelte-pixi';
	import { collectionStateStore } from './collisions';
	import Pet from './pet.svelte';
	import Shoot from './shoot.svelte';
	import type { Shoot as ShootType } from './gameHordesData';
	import Enemy from './enemy.svelte';
	import { createGameObjectListStore } from './gameObjectList';
	import { Texture } from 'pixi.js';
	import { foodItems } from '$lib/data/items';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import AnimatedContainer from '$lib/components/Animation/animated-container.svelte';
	import Text from '$lib/components/text.svelte';
	import { tweenedAnimation } from '$lib/components/Animation/animations/tweened-animation';
	import { cubicInOut } from 'svelte/easing';
	import Panel from '$lib/components/panel.svelte';
	import ClickItem from './click-item.svelte';

	const dispatch = createEventDispatcher();

	const { update: updateCollisions, createCollection } = collectionStateStore;

	uiStateStore.set({
		showButtons: false,
		showInventory: false,
		showRecipeList: false
	});

	onTick((delta) => {
		updateCollisions();

		if (gamePhase?.type === 'waiting-enemy-count-0' && $enemyListStore.length === 0) {
			startHorde();
		}
	});

	createCollection('pets');
	createCollection('shoots');
	createCollection('enemies');

	const petListStore = createGameObjectListStore(
		Object.keys($gameStateStore.pets).map((petId) => ({
			petId
		}))
	);

	const shootListStore = createGameObjectListStore<{
		shoot: ShootType;
		startX: number;
		startY: number;
	}>();

	let enemyListStore = createGameObjectListStore<{
		enemyName: string;
		startY: number;
	}>();

	let itemListStore = createGameObjectListStore<{
		item: string;
		x: number;
		y: number;
	}>();

	const foodItemsList = Object.keys(foodItems);
	const foodItemPile = new Array(30)
		.fill(undefined)
		.map((_) => foodItemsList[Math.floor(Math.random() * (foodItemsList.length - 1))]);

	const startPhaseDuration = 3000;

	type OtherPhases = {
		type: 'game-over' | 'start' | 'waiting-enemy-count-0';
	};

	const hordePhaseInitDuration = 500;
	const hordePhaseTextDuration = 1500;
	const hordePhaseHordeDuration = 60000;
	type HordePhase = {
		type: 'horde';
		difficulty: number;
		init: number;
	};

	type SubscriptionHolder = {
		timers?: NodeJS.Timer[];
	};

	let gamePhase: ((OtherPhases | HordePhase) & SubscriptionHolder) | undefined;

	const getEnemyY = () => 30 + Math.random() * ($uiStateStore.centerScreen.height - 60);

	const enemiesGeneration = (difficulty: number) => {
		const timers: NodeJS.Timer[] = [];

		enemyListStore.create({
			enemyName: 'fallen-angel',
			startY: getEnemyY()
		});

		timers.push(
			setInterval(() => {
				enemyListStore.create({
					enemyName: 'fallen-angel',
					startY: getEnemyY()
				});
			}, Math.max(500, 6500 - difficulty * 500))
		);

		if (difficulty >= 2) {
			timers.push(
				setInterval(() => {
					enemyListStore.create({
						enemyName: 'fallen-angel',
						startY: getEnemyY()
					});
				}, Math.max(500, 11000 - difficulty * 500))
			);
		}

		if (difficulty >= 3) {
			timers.push(
				setInterval(() => {
					enemyListStore.create({
						enemyName: 'demon',
						startY: getEnemyY()
					});
				}, Math.max(1000, 12900 - difficulty * 300))
			);
		}

		if (difficulty >= 6) {
			timers.push(
				setInterval(() => {
					enemyListStore.create({
						enemyName: 'fallen-angel',
						startY: getEnemyY()
					});
				}, Math.max(500, 18000 - difficulty * 500))
			);
		}

		if (difficulty >= 10) {
			timers.push(
				setInterval(() => {
					enemyListStore.create({
						enemyName: 'octopus',
						startY: getEnemyY()
					});
				}, Math.max(2000, 24000 - difficulty * 100))
			);
		}

		if (difficulty >= 12) {
			timers.push(
				setInterval(() => {
					enemyListStore.create({
						enemyName: 'fallen-angel',
						startY: getEnemyY()
					});
				}, Math.max(500, 18000 - difficulty * 500))
			);
		}

		if (difficulty >= 15) {
			timers.push(
				setInterval(() => {
					enemyListStore.create({
						enemyName: 'demon',
						startY: getEnemyY()
					});
				}, Math.max(500, 18000 - difficulty * 500))
			);
		}

		if (difficulty >= 18) {
			timers.push(
				setInterval(() => {
					enemyListStore.create({
						enemyName: 'octopus',
						startY: getEnemyY()
					});
				}, Math.max(2000, 20000 - difficulty * 100))
			);
		}

		if (difficulty >= 20) {
			timers.push(
				setInterval(() => {
					enemyListStore.create({
						enemyName: 'demon',
						startY: getEnemyY()
					});
				}, Math.max(500, 20000 - difficulty * 500))
			);
		}

		if (difficulty >= 22) {
			timers.push(
				setInterval(() => {
					enemyListStore.create({
						enemyName: 'fallen-angel',
						startY: getEnemyY()
					});
				}, Math.max(500, 15000 - difficulty * 500))
			);
		}

		if (difficulty >= 26) {
			timers.push(
				setInterval(() => {
					enemyListStore.create({
						enemyName: 'demon',
						startY: getEnemyY()
					});
				}, Math.max(500, 20000 - difficulty * 500))
			);
		}

		if (difficulty >= 28) {
			timers.push(
				setInterval(() => {
					enemyListStore.create({
						enemyName: 'demon',
						startY: getEnemyY()
					});
				}, Math.max(500, 20000 - difficulty * 500))
			);
		}

		if (difficulty >= 30) {
			timers.push(
				setInterval(() => {
					enemyListStore.create({
						enemyName: 'spider',
						startY: getEnemyY()
					});
				}, Math.max(5000, 23000 - difficulty * 100))
			);
		}

		if (difficulty >= 32) {
			timers.push(
				setInterval(() => {
					enemyListStore.create({
						enemyName: 'octopus',
						startY: getEnemyY()
					});
				}, Math.max(2000, 20000 - difficulty * 100))
			);
		}

		if (difficulty >= 35) {
			timers.push(
				setInterval(() => {
					enemyListStore.create({
						enemyName: 'dragon',
						startY: getEnemyY()
					});
				}, Math.max(3000, 25000 - difficulty * 100))
			);
		}

		return timers;
	};

	let hordeDifficulty = 1;
	const startHorde = () => {
		gamePhase = {
			type: 'horde',
			difficulty: hordeDifficulty++,
			init: 0
		};

		(gamePhase as SubscriptionHolder).timers = [
			setTimeout(() => {
				(gamePhase as HordePhase).init = 1;
				(gamePhase as SubscriptionHolder).timers = [
					setTimeout(() => {
						(gamePhase as HordePhase).init = 2;
						(gamePhase as SubscriptionHolder).timers = [
							setTimeout(() => {
								removeIntervals();
								gamePhase = {
									type: 'waiting-enemy-count-0'
								};
							}, hordePhaseHordeDuration),
							...enemiesGeneration((gamePhase as HordePhase).difficulty)
						];
					}, hordePhaseTextDuration)
				];
			}, hordePhaseInitDuration)
		];
	};

	onMount(() => {
		gamePhase = {
			type: 'start'
		};

		gamePhase.timers = [
			setTimeout(() => {
				startHorde();
			}, startPhaseDuration)
		];
	});

	const removeIntervals = () => {
		gamePhase?.timers?.forEach((timer) => clearTimeout(timer));
	};

	onDestroy(() => {
		removeIntervals();
	});

	let gameEnd = false;
	const onGameEnd = () => {
		if (gameEnd) return;
		gameEnd = true;

		removeIntervals();
		gamePhase = {
			type: 'game-over'
		};

		setTimeout(() => {
			dispatch('game-over', {
				clickedItems,
				killedEnemies
			});
		}, 3000);
	};

	const killedEnemies: { [enemyName: string]: number } = {};
	const enemyDestroy = (enemyName: string, id: number, x: number, y: number) => {
		enemyListStore.destroy(id);

		if (!killedEnemies[enemyName]) {
			killedEnemies[enemyName] = 0;
		}

		killedEnemies[enemyName]++;

		if (Math.random() > 0.95) {
			itemListStore.create({
				item: foodItemsList[Math.floor((foodItemsList.length - 1) * Math.random())],
				x,
				y
			});
		}
	};

	const clickedItems: { [item: string]: number } = {};
	const clickItem = (item: string, id: number) => {
		itemListStore.destroy(id);

		if (!clickedItems[item]) {
			clickedItems[item] = 0;
		}

		clickedItems[item]++;
	};
</script>

<Graphics
	draw={(graphics) => {
		graphics.clear();
		graphics.lineStyle(1, 0xffffff);
		graphics.moveTo(60, 0);
		graphics.lineTo(60, $uiStateStore.centerScreen.height);
		graphics.moveTo($uiStateStore.centerScreen.width - 190, 0);
		graphics.lineTo($uiStateStore.centerScreen.width - 190, $uiStateStore.centerScreen.height);
	}}
/>

{#each $petListStore as { petId, id }, i}
	<Pet
		on:destroy={() => petListStore.destroy(id)}
		{petId}
		startY={($uiStateStore.centerScreen.height / (Object.keys($gameStateStore.pets).length + 1)) *
			(i + 1)}
		on:shoot={(e) => shootListStore.create(e.detail)}
	/>
{/each}

{#each $shootListStore as { shoot, startX, startY, id } (id)}
	<Shoot {shoot} {startX} {startY} on:destroy={() => shootListStore.destroy(id)} />
{/each}

{#each $enemyListStore as { enemyName, startY, id } (id)}
	<Enemy
		{enemyName}
		{startY}
		on:destroy={(p) => enemyDestroy(enemyName, id, p.detail.x, p.detail.y)}
		on:food-reached={onGameEnd}
	/>
{/each}

{#each $itemListStore as { item, x, y, id } (id)}
	<ClickItem {item} {x} {y} on:click={() => clickItem(item, id)} />
{/each}

{#each foodItemPile as foodItem, i}
	<Sprite
		texture={Texture.from(`img/items/${foodItems[foodItem].img}.png`)}
		x={(i % 3) * 16 + 7}
		y={8 + (i / 30) * ($uiStateStore.centerScreen.height - 20)}
	/>
{/each}

<AnimatedContainer
	active={gamePhase?.type === 'start'}
	onStart={tweenedAnimation({
		from: {
			x: $uiStateStore.centerScreen.width / 2 - 150,
			y: $uiStateStore.centerScreen.height / 2 - 20,
			opacity: 0
		},
		to: { y: $uiStateStore.centerScreen.height / 2 - 30, opacity: 1 },
		easing: cubicInOut,
		duration: 400
	})}
	onEnd={tweenedAnimation({
		from: {
			y: $uiStateStore.centerScreen.height / 2 - 30,
			opacity: 1
		},
		to: {
			y: $uiStateStore.centerScreen.height / 2 - 20,
			opacity: 0
		},
		easing: cubicInOut,
		duration: 400
	})}
>
	<Panel width={300} height={40}>
		<Text
			anchor={{ x: 0.5, y: 0.5 }}
			x={150}
			y={20}
			text="Don't let the monsters reach the food pile!"
		/>
	</Panel>
</AnimatedContainer>

<AnimatedContainer
	active={gamePhase?.type === 'horde' && gamePhase.init === 1}
	onStart={tweenedAnimation({
		from: {
			x: $uiStateStore.centerScreen.width / 2 - 100,
			y: $uiStateStore.centerScreen.height / 2 - 20,
			opacity: 0
		},
		to: { y: $uiStateStore.centerScreen.height / 2 - 30, opacity: 1 },
		easing: cubicInOut,
		duration: 400
	})}
	onEnd={tweenedAnimation({
		from: {
			y: $uiStateStore.centerScreen.height / 2 - 30,
			opacity: 1
		},
		to: {
			y: $uiStateStore.centerScreen.height / 2 - 20,
			opacity: 0
		},
		easing: cubicInOut,
		duration: 400
	})}
>
	{#if gamePhase?.type === 'horde'}
		<Panel width={200} height={40}>
			<Text anchor={{ x: 0.5, y: 0.5 }} x={100} y={20} text={`Horde ${gamePhase.difficulty}`} />
		</Panel>
	{/if}
</AnimatedContainer>

<AnimatedContainer
	active={gameEnd}
	onStart={tweenedAnimation({
		from: {
			x: $uiStateStore.centerScreen.width / 2 - 100,
			y: $uiStateStore.centerScreen.height / 2 - 20,
			opacity: 0
		},
		to: { y: $uiStateStore.centerScreen.height / 2 - 30, opacity: 1 },
		easing: cubicInOut,
		duration: 400,
		delay: 1000
	})}
>
	<Panel width={200} height={40}>
		<Text anchor={{ x: 0.5, y: 0.5 }} x={100} y={20} text="Game Over" />
	</Panel>
</AnimatedContainer>
