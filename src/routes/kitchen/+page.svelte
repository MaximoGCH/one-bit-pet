<script lang="ts">
	import AnimatedContainer from '$lib/components/Animation/animated-container.svelte';
	import { tweenedAnimation } from '$lib/components/Animation/animations/tweened-animation';
	import Panel from '$lib/components/panel.svelte';
	import PixiPortal from '$lib/components/pixi-portal.svelte';
	import Text from '$lib/components/text.svelte';
	import { itemList, type FoodCategory } from '$lib/data/items';
	import { gameStateStore } from '$lib/state/game/gameState';
	import { uiStateStore } from '$lib/state/ui-state';
	import {
		Rectangle,
		Texture,
		Container as PixiContainer,
		InteractionEvent,
		Ellipse
	} from 'pixi.js';
	import { Container, Graphics, Sprite } from 'svelte-pixi';
	import { cubicInOut } from 'svelte/easing';
	import { spring } from 'svelte/motion';
	const { processSelectedItem, resetSelectedItem } = uiStateStore;
	const { addItem, addRecipe } = gameStateStore.dispatch.inventory;

	uiStateStore.set({
		showButtons: true,
		showInventory: true,
		showRecipeList: true,
		inventoryFilter: ['food']
	});

	let selectedItems: string[] = [];

	const getRecipeItemAndNumber = (ingredients: string[]) => {
		for (const [itemName, item] of Object.entries(itemList)) {
			if (!item.recipe) continue;

			const recipeNumber = getRecipeNumber(item.recipe, ingredients);

			if (recipeNumber === -1) continue;

			return {
				itemName,
				recipeNumber
			};
		}
	};

	const getRecipeNumber = (recipeList: string[][], ingredients: string[]) => {
		let i = 0;
		for (const recipe of recipeList) {
			if (recipeCheck(recipe, ingredients)) {
				return i;
			}
			i++;
		}

		return -1;
	};

	const recipeCheck = (recipe: string[], ingredients: string[]) => {
		const recipeAux = [...recipe];
		const ingredientsAux = [...ingredients];
		for (const ingredient of ingredientsAux) {
			const index = recipeAux.findIndex(
				(recipeItem) =>
					recipeItem === ingredient ||
					itemList[ingredient].categories?.includes(recipeItem as FoodCategory)
			);

			if (index < 0) return false;

			recipeAux.splice(index, 1);
		}

		if (recipeAux.length === 0) return true;

		return false;
	};

	let cookingPhase = 1;
	let resultItem: string | null = null;
	const startCook = () => {
		cookingPhase = 2;
		setTimeout(() => {
			cookingPhase = 3;
			setTimeout(() => {
				cookingPhase = 1;
			}, 2000);

			resultItem = null;

			const createdItemAndRecipeNumber = getRecipeItemAndNumber(selectedItems);

			if (!createdItemAndRecipeNumber) return;

			resultItem = createdItemAndRecipeNumber.itemName;
			addItem(createdItemAndRecipeNumber.itemName);
			addRecipe(createdItemAndRecipeNumber.itemName, createdItemAndRecipeNumber.recipeNumber);
			selectedItems = [];
		}, 1000);
	};

	const cancelCook = () => {
		selectedItems.forEach((item) => addItem(item));
		selectedItems = [];
	};

	const selectedItemPositionOptions = {
		stiffness: 0.1,
		damping: 0.3
	};

	let selectedItemPositionControl = false;
	let selectedItemPosition = spring({ x: 0, y: 0, angle: 0 }, selectedItemPositionOptions);
	let selectedSpriteContainer: PixiContainer | undefined;

	const handleDrag = (event: CustomEvent<InteractionEvent>) => {
		if (!selectedSpriteContainer) return;

		const { x, y } = selectedSpriteContainer.toLocal(event.detail.data.global);
		const angle = $selectedItemPosition.x - x;

		if (!selectedItemPositionControl) {
			selectedItemPosition = spring({ x, y, angle }, selectedItemPositionOptions);
			selectedItemPositionControl = true;

			return;
		}

		selectedItemPosition.update(() => ({
			x,
			y,
			angle
		}));
	};

	let dropControl = false;
	const dropObject = () => {
		selectedSpriteContainer = undefined;
		if (!$uiStateStore.inventorySelectedItem) return;

		if (dropControl) {
			selectedItems = [...selectedItems, $uiStateStore.inventorySelectedItem];

			processSelectedItem();
		} else {
			resetSelectedItem();
		}

		selectedItemPositionControl = false;
	};
</script>

<svelte:window on:mouseup={dropObject} />

<Sprite
	interactive={cookingPhase === 1}
	texture={Texture.from(`/img/kitchen/kitchen-${cookingPhase == 2 ? 2 : 1}.png`)}
	anchor={0.5}
	x={$uiStateStore.centerScreen.width / 2 - 20}
	y={$uiStateStore.centerScreen.height / 2 + 20}
	on:mouseover={() => (dropControl = true)}
	on:mouseout={() => (dropControl = false)}
	hitArea={new Ellipse(-16, -40, 30, 25)}
/>

<AnimatedContainer
	active={cookingPhase === 1 && selectedItems.length > 0}
	onStart={tweenedAnimation({
		from: {
			x: $uiStateStore.centerScreen.width / 2 + 30,
			y: $uiStateStore.centerScreen.height / 2 + 10,
			scaleX: 0,
			scaleY: 0
		},
		to: { scaleX: 1, scaleY: 1 },
		easing: cubicInOut,
		duration: 400
	})}
	onEnd={tweenedAnimation({
		from: {
			scaleX: 1,
			scaleY: 1
		},
		to: { scaleX: 0, scaleY: 0 },
		easing: cubicInOut,
		duration: 400
	})}
	pivot={{ x: 20, y: 0 }}
>
	<Container interactive on:click={() => startCook()} buttonMode>
		<Graphics
			draw={(graphics) => {
				graphics.clear();
				graphics.lineStyle(1, 0xffffff, 1);
				graphics.moveTo(20, 1).lineTo(40, 1);
				graphics.lineStyle(1, 0x000000, 1);
				graphics.moveTo(20, 0).lineTo(40, 0);
				graphics.moveTo(20, 2).lineTo(40, 2);

				graphics.lineStyle(1, 0xffffff, 1);
				graphics.drawRect(40, -10, 50, 20);
				graphics.hitArea = new Rectangle(0, -10, 90, 20);
			}}
		/>

		<Text text="Cook" x={65} anchor={{ x: 0.5, y: 0.5 }} />
	</Container>

	<Container interactive y={30} on:click={cancelCook} buttonMode>
		<Graphics
			draw={(graphics) => {
				graphics.lineStyle(1, 0xffffff, 1);
				graphics.drawRect(40, -10, 50, 20);
				graphics.hitArea = new Rectangle(40, -10, 50, 20);
			}}
		/>

		<Text text="Cancel" x={65} anchor={{ x: 0.5, y: 0.5 }} />
	</Container>
</AnimatedContainer>

<AnimatedContainer
	active={cookingPhase === 3}
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
	<Panel width={80} height={60}>
		<Text
			text={resultItem ? 'New item!' : 'Bad recipe...'}
			x={40}
			y={10}
			anchor={{ x: 0.5, y: 0.5 }}
		/>
		{#if resultItem}
			<Text text={resultItem} x={40} y={25} anchor={{ x: 0.5, y: 0.5 }} />
			<Sprite
				texture={Texture.from(`img/items/${itemList[resultItem].img}.png`)}
				anchor={0.5}
				x={40}
				y={45}
			/>
		{:else}
			<Sprite texture={Texture.from(`img/kitchen/bad-recipe.png`)} anchor={0.5} x={40} y={35} />
		{/if}
	</Panel>
</AnimatedContainer>

<Container
	x={$uiStateStore.centerScreen.width / 2}
	y={10}
	pivot={{ x: ((selectedItems.length - 1) * 32) / 2, y: 0 }}
>
	{#each selectedItems as item, i}
		{#if i != 0}
			<AnimatedContainer
				onStart={tweenedAnimation({
					from: {
						x: i * 32 - 16,
						y: 20,
						scaleX: 0,
						scaleY: 0
					},
					to: { scaleX: 1, scaleY: 1 },
					easing: cubicInOut,
					duration: 400
				})}
			>
				<Sprite texture={Texture.from(`/img/kitchen/plus.png`)} anchor={0.5} />
			</AnimatedContainer>
		{/if}

		<AnimatedContainer
			onStart={tweenedAnimation({
				from: {
					x: i * 32,
					y: 20,
					scaleX: 0,
					scaleY: 0
				},
				to: { scaleX: 1, scaleY: 1 },
				easing: cubicInOut,
				duration: 400,
				delay: i > 0 ? 100 : 0
			})}
		>
			<Sprite texture={Texture.from(`img/items/${itemList[item].img}.png`)} anchor={0.5} />
		</AnimatedContainer>
	{/each}
</Container>

{#if $uiStateStore.inventorySelectedItem}
	<PixiPortal>
		<Container bind:instance={selectedSpriteContainer}>
			<Sprite
				interactive
				hitArea={new Rectangle(0, 0, 0, 0)}
				on:mousemove={handleDrag}
				x={$selectedItemPosition.x}
				y={$selectedItemPosition.y}
				angle={$selectedItemPosition.angle}
				alpha={selectedItemPositionControl ? 1 : 0}
				texture={Texture.from(`img/items/${itemList[$uiStateStore.inventorySelectedItem].img}.png`)}
				anchor={0.5}
			/>
		</Container>
	</PixiPortal>
{/if}
