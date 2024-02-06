<script lang="ts">
	import Text from '$lib/components/text.svelte';
	import { itemList } from '$lib/data/items';
	import { uiStateStore } from '$lib/state/ui-state';
	import { Texture } from 'pixi.js';
	import { Sprite } from 'svelte-pixi';
	import { gameStateStore } from '$lib/state/game/gameState';
	import AnimatedContainer from '$lib/components/Animation/animated-container.svelte';
	import { tweenedAnimation } from '$lib/components/Animation/animations/tweened-animation';
	import { cubicInOut, linear } from 'svelte/easing';
	import Panel from '$lib/components/panel.svelte';
	import NewPet from '$lib/components/new-pet.svelte';

	const { addItem, addMoney } = gameStateStore.dispatch.inventory;

	uiStateStore.set({
		showButtons: true,
		showInventory: true,
		showRecipeList: false
	});

	let newPet = false;

	const sellItems: { [item: string]: number } = {
		apple: 5,
		banana: 5,
		cherry: 5,
		corn: 5,
		eggplant: 5,
		grapes: 5,
		orange: 5,
		pear: 5,
		tomato: 5,
		carrot: 5,
		pepper: 5,
		pumpkin: 5,
		'sugar cane': 10,
		rice: 10,
		milk: 10,
		wheat: 10,
		ice: 10,
		egg: 10,
		fish: 10,
		meat: 40,
		chocolate: 99
	};

	let noMoneyControl = false;
	const noMoney = () => {
		noMoneyControl = true;
		setTimeout(() => {
			noMoneyControl = false;
		}, 1000);
	};

	let itemsListSold: string[] = [];
	const buyItems = (item: string) => {
		const price = sellItems[item];
		if (price > $gameStateStore.inventory.money) {
			noMoney();
			return;
		}
		itemsListSold = [...itemsListSold, item];
		addMoney(-price);
		addItem(item);
	};

	const buyNewPet = () => {
		const price = Object.entries($gameStateStore.pets).length * 200;
		if (price > $gameStateStore.inventory.money) {
			noMoney();
			return;
		}
		addMoney(-price);
		newPet = true;
	};
</script>

<Sprite
	texture={Texture.from('img/shop/gacha.png')}
	x={$uiStateStore.centerScreen.width / 2 - 120}
	y={$uiStateStore.centerScreen.height - 6}
	anchor={{ x: 0.5, y: 1 }}
	interactive
	buttonMode
	on:click={buyNewPet}
/>

<Text
	anchor={{ x: 0.5, y: 0.5 }}
	text={`${Object.entries($gameStateStore.pets).length * 200}`}
	x={$uiStateStore.centerScreen.width / 2 - 125}
	y={$uiStateStore.centerScreen.height - 70}
/>

<Sprite
	anchor={0.5}
	texture={Texture.from(`/img/ui/coin.png`)}
	x={$uiStateStore.centerScreen.width / 2 - 108}
	y={$uiStateStore.centerScreen.height - 69}
/>

<Sprite
	texture={Texture.from('img/shop/vending-machine.png')}
	x={$uiStateStore.centerScreen.width / 2 + 65}
	y={$uiStateStore.centerScreen.height - 6}
	anchor={{ x: 0.5, y: 1 }}
/>

{#each Object.entries(sellItems) as [item, number], i}
	<Sprite
		anchor={0.5}
		texture={Texture.from(`/img/items/${itemList[item].img}.png`)}
		x={$uiStateStore.centerScreen.width / 2 - 22 + (i % 6) * 28}
		y={$uiStateStore.centerScreen.height - 168 + 38 * Math.floor(i / 6)}
		interactive
		buttonMode
		on:click={() => buyItems(item)}
	/>
	<Text
		anchor={{ x: 1, y: 0.5 }}
		text={`${number}`}
		x={$uiStateStore.centerScreen.width / 2 - 22 + (i % 6) * 28}
		y={$uiStateStore.centerScreen.height - 150 + 38 * Math.floor(i / 6)}
	/>
	<Sprite
		anchor={0.5}
		texture={Texture.from(`/img/ui/coin.png`)}
		x={$uiStateStore.centerScreen.width / 2 - 16 + (i % 6) * 28}
		y={$uiStateStore.centerScreen.height - 150 + 38.5 * Math.floor(i / 6)}
	/>
{/each}

{#each itemsListSold as item}
	<AnimatedContainer
		onStart={tweenedAnimation({
			from: {
				x: $uiStateStore.centerScreen.width / 2 + 155,
				y: $uiStateStore.centerScreen.height - 35,
				opacity: 1
			},
			to: { y: $uiStateStore.centerScreen.height, opacity: 0 },
			easing: linear,
			duration: 400
		})}
	>
		<Sprite anchor={0.5} texture={Texture.from(`/img/items/${itemList[item].img}.png`)} />
	</AnimatedContainer>
{/each}

<AnimatedContainer
	active={noMoneyControl}
	onStart={tweenedAnimation({
		from: {
			x: $uiStateStore.centerScreen.width / 2 - 40,
			y: $uiStateStore.centerScreen.height / 2 - 40,
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
	<Panel width={80} height={45}>
		<Text text="No money..." x={40} y={10} anchor={0.5} />
		<Sprite texture={Texture.from('img/shop/no-money.png')} x={40} y={30} anchor={0.5} />
	</Panel>
</AnimatedContainer>

{#if newPet}
	<NewPet on:end={() => (newPet = false)} />
{/if}
