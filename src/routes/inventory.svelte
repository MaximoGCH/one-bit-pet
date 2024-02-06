<script lang="ts">
	import { itemList } from '$lib/data/items';
	import { gameStateStore } from '$lib/state/game/gameState';
	import { uiStateStore } from '$lib/state/ui-state';
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import AnimatedContainer from '$lib/components/Animation/animated-container.svelte';
	import Panel from '$lib/components/panel.svelte';
	import { tweenedAnimation } from '$lib/components/Animation/animations/tweened-animation';
	import { cubicOut } from 'svelte/easing';
	import { gameOptions } from '$lib/game-options';
	import ItemButton from '$lib/components/item-button.svelte';

	const { selectItem, resetSelectedItem } = uiStateStore;

	$: filteredItemList = Object.fromEntries(
		[
			...Object.entries($gameStateStore.inventory.items).filter(([name]) =>
				$uiStateStore.inventoryFilter
					? $uiStateStore.inventoryFilter?.includes(itemList[name].type)
					: true
			)
		].sort(([name1, v1], [name2, v2]) => name1.localeCompare(name2))
	);

	const selectInventoryItem = (name: string, position: { x: number; y: number }) => {
		selectItem(name);
	};

	let currentUrl: string;
	let unsubscribe: Unsubscriber;
	onMount(() => {
		unsubscribe = page.subscribe(({ url }) => {
			if (currentUrl !== url.pathname) {
				currentUrl = url.pathname;
				resetSelectedItem();
			}
		});
	});

	onDestroy(() => {
		unsubscribe && unsubscribe();
	});
</script>

<AnimatedContainer
	active={$uiStateStore.showInventory}
	onStart={tweenedAnimation({
		from: { x: 10, y: 40, opacity: 0, scaleX: 0 },
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
>
	<Panel
		width={120}
		height={gameOptions.screen.height - 60}
		scrollHeight={Object.entries(filteredItemList).length * 26 + 80}
	>
		{#each Object.entries(filteredItemList) as [name, number], i}
			<ItemButton
				on:mousedown={() => selectInventoryItem(name, { x: 30, y: i * 26 + 40 })}
				itemName={name}
				itemNumber={number}
				x={0}
				y={i * 26 + 10}
				width={120}
			/>
		{/each}
	</Panel>
</AnimatedContainer>
