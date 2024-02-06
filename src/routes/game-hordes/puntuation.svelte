<script lang="ts">
	import AnimatedContainer from '$lib/components/Animation/animated-container.svelte';
	import { tweenedAnimation } from '$lib/components/Animation/animations/tweened-animation';
	import PetListXp from '$lib/components/pet-list-xp.svelte';
	import Text from '$lib/components/text.svelte';
	import { itemList } from '$lib/data/items';
	import { gameStateStore } from '$lib/state/game/gameState';
	import { uiStateStore } from '$lib/state/ui-state';
	import { Texture } from 'pixi.js';
	import { Sprite, Container } from 'svelte-pixi';
	import { cubicInOut } from 'svelte/easing';
	import { gameHordesEnemyData } from './gameHordesData';

	const { addItem, addMoney } = gameStateStore.dispatch.inventory;

	uiStateStore.set({
		showButtons: false,
		showInventory: false,
		showRecipeList: false
	});

	export let killedEnemies: { [type: string]: number };
	export let clickedItems: { [type: string]: number };

	const killedEnemiesCoinTotal = Object.entries(killedEnemies).map(([enemy, number]) => {
		const totalCoins = number * gameHordesEnemyData[enemy].coins;
		return {
			enemy,
			number,
			totalCoins
		};
	});

	let phase: 'killed' | 'items' | 'xp' | 'end' = 'killed';
	const totalMoney = killedEnemiesCoinTotal.reduce((total, item) => total + item.totalCoins, 0);

	const startXpPhase = () => {
		setTimeout(() => (phase = 'xp'), 3000);
		Object.entries(clickedItems).forEach(([item, number]) => {
			addItem(item, number);
		});
		addMoney(totalMoney);
	};

	const end = () => {
		phase = 'end';
		uiStateStore.set({
			showButtons: true,
			showInventory: false,
			showRecipeList: false
		});
	};
</script>

<Container x={$uiStateStore.centerScreen.width / 2 - 150} y={10}>
	<AnimatedContainer
		onStart={tweenedAnimation({
			from: {
				y: -5,
				opacity: 0
			},
			to: { y: 0, opacity: 1 },
			easing: cubicInOut,
			duration: 400
		})}
	>
		<Text text="Monsters killed" anchor={{ x: 0, y: 0.5 }} x={20} y={10} />
	</AnimatedContainer>

	{#if killedEnemiesCoinTotal.length === 0}
		<AnimatedContainer
			onStart={tweenedAnimation({
				from: {
					y: -5,
					opacity: 0
				},
				to: { y: 0, opacity: 1 },
				easing: cubicInOut,
				duration: 400,
				delay: 200
			})}
			on:animation-start-ended={() => (phase = 'items')}
		>
			<Text text="0 Enemy killed..." anchor={{ x: 0, y: 0.5 }} x={20} y={30} />
		</AnimatedContainer>
	{:else}
		{#each killedEnemiesCoinTotal as { enemy, number, totalCoins }, i}
			<AnimatedContainer
				onStart={tweenedAnimation({
					from: {
						y: -5,
						opacity: 0
					},
					to: { y: 0, opacity: 1 },
					easing: cubicInOut,
					duration: 400,
					delay: (i + 1) * 200
				})}
			>
				<Sprite
					x={30}
					y={35 + i * 30}
					anchor={0.5}
					texture={Texture.from(`img/game-hordes/enemy/${enemy}.png`)}
				/>
				<Text text={`x${number}`} anchor={{ x: 0, y: 0.5 }} x={60} y={35 + i * 30} />
				<Text text={`= ${totalCoins}`} anchor={{ x: 1, y: 0.5 }} x={130} y={35 + i * 30} />
				<Sprite texture={Texture.from(`img/ui/coin.png`)} anchor={0.5} x={140} y={35 + i * 30} />
			</AnimatedContainer>
		{/each}
		<AnimatedContainer
			on:animation-start-ended={() => (phase = 'items')}
			onStart={tweenedAnimation({
				from: {
					y: -5,
					opacity: 0
				},
				to: { y: 0, opacity: 1 },
				easing: cubicInOut,
				duration: 400,
				delay: (killedEnemiesCoinTotal.length + 1) * 200
			})}
		>
			<Text
				text={`Total = ${totalMoney}`}
				anchor={{ x: 1, y: 0.5 }}
				x={130}
				y={killedEnemiesCoinTotal.length * 30 + 40}
			/>
			<Sprite
				texture={Texture.from(`img/ui/coin.png`)}
				anchor={0.5}
				x={140}
				y={killedEnemiesCoinTotal.length * 30 + 40}
			/>
		</AnimatedContainer>
	{/if}
</Container>

{#if phase !== 'killed'}
	<Container x={$uiStateStore.centerScreen.width / 2 + 50} y={10}>
		<AnimatedContainer
			onStart={tweenedAnimation({
				from: {
					y: -5,
					opacity: 0
				},
				to: { y: 0, opacity: 1 },
				easing: cubicInOut,
				duration: 400
			})}
		>
			<Text text="Items found" anchor={{ x: 0, y: 0.5 }} x={20} y={10} />
		</AnimatedContainer>
		{#if Object.entries(clickedItems).length === 0}
			<AnimatedContainer
				onStart={tweenedAnimation({
					from: {
						y: -5,
						opacity: 0
					},
					to: { y: 0, opacity: 1 },
					easing: cubicInOut,
					duration: 400,
					delay: 200
				})}
				on:animation-start-ended={startXpPhase}
			>
				<Text text="0 items found..." anchor={{ x: 0, y: 0.5 }} x={20} y={30} />
			</AnimatedContainer>
		{/if}
		{#each Object.entries(clickedItems) as [item, number], i}
			<AnimatedContainer
				onStart={tweenedAnimation({
					from: {
						y: -5,
						opacity: 0
					},
					to: { y: 0, opacity: 1 },
					easing: cubicInOut,
					duration: 400,
					delay: (i + 1) * 200
				})}
				on:animation-start-ended={() =>
					i === Object.entries(clickedItems).length - 1 && startXpPhase()}
			>
				<Sprite
					x={30}
					y={35 + i * 25}
					anchor={0.5}
					texture={Texture.from(`img/items/${itemList[item].img}.png`)}
				/>
				<Text text={`x${number}`} anchor={{ x: 0, y: 0.5 }} x={45} y={35 + i * 25} />
			</AnimatedContainer>
		{/each}
	</Container>{/if}

{#if phase === 'xp'}
	<PetListXp petList={Object.keys($gameStateStore.pets)} xp={totalMoney * 30} on:end={end} />
{/if}
