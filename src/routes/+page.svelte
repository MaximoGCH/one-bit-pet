<script lang="ts">
	import { uiStateStore } from '$lib/state/ui-state';
	import { gameStateStore } from '$lib/state/game/gameState';
	import Pet from './pet.svelte';
	import PixiPortal from '$lib/components/pixi-portal.svelte';
	import { Container, Sprite } from 'svelte-pixi';
	import { Rectangle, Texture, Container as PixiContainer, InteractionEvent } from 'pixi.js';
	import { spring } from 'svelte/motion';
	import { itemList } from '$lib/data/items';

	uiStateStore.set({
		showButtons: true,
		showInventory: true,
		showRecipeList: false
	});

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
</script>

{#each Object.values($gameStateStore.pets) as pet}
	<Pet {pet} />
{/each}

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
