<script lang="ts">
	import { itemList } from '$lib/data/items';
	import { gameStateStore } from '$lib/state/game/gameState';
	import { uiStateStore } from '$lib/state/ui-state';
	import AnimatedContainer from '$lib/components/Animation/animated-container.svelte';
	import Panel from '$lib/components/panel.svelte';
	import { tweenedAnimation } from '$lib/components/Animation/animations/tweened-animation';
	import { cubicOut } from 'svelte/easing';
	import { gameOptions } from '$lib/game-options';
	import Text from '$lib/components/text.svelte';

	$: recipeItems = [...$gameStateStore.inventory.knownRecipes]
		.sort((i1, i2) => i1.itemName.localeCompare(i2.itemName))
		.reduce<{ type: 'title' | 'item'; value: string }[]>((list, { itemName, recipeNumber }) => {
			list.push({
				type: 'title',
				value: itemName
			});
			itemList[itemName].recipe?.at(recipeNumber)?.forEach((item) => {
				list.push({
					type: 'item',
					value: item
				});
			});
			return list;
		}, []);
</script>

<AnimatedContainer
	active={$uiStateStore.showRecipeList}
	onStart={tweenedAnimation({
		from: { x: gameOptions.screen.width - 10, y: 40, opacity: 0, scaleX: 0 },
		to: { opacity: 1, scaleX: 1 },
		easing: cubicOut,
		duration: 400,
		delay: 0
	})}
	onEnd={tweenedAnimation({
		from: { opacity: 1, scaleX: 1 },
		to: { opacity: 0, scaleX: 0 },
		easing: cubicOut,
		duration: 400,
		delay: 0
	})}
	pivot={{ x: 120, y: 0 }}
>
	<Panel
		width={120}
		height={gameOptions.screen.height - 60}
		scrollHeight={recipeItems.length * 15 + 100}
	>
		<Text text="Known recipes:" x={10} y={10} />
		{#each recipeItems as { type, value }, i}
			{#if type === 'title'}
				<Text text={value} x={10} y={i * 15 + 30} />
			{:else}
				<Text text={`- ${value}`} x={20} y={i * 15 + 30} />
			{/if}
		{/each}
	</Panel>
</AnimatedContainer>
