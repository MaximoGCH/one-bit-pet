<script>
	import { uiStateStore } from '$lib/state/ui-state';
	import Button from '$lib/components/button.svelte';
	import { Sprite } from 'svelte-pixi';
	import { Texture } from 'pixi.js';
	import Text from '$lib/components/text.svelte';

	uiStateStore.set({
		showButtons: true,
		showInventory: false,
		showRecipeList: false
	});
</script>

<Text text="Games" x={$uiStateStore.centerScreen.width / 2} y={50} anchor={0.5} />

<Button
	x={$uiStateStore.centerScreen.width / 2 - 50}
	y={$uiStateStore.centerScreen.height / 2 - 30}
	width={100}
	height={60}
	href={'/game-hordes'}
>
	<Sprite x={50} y={30} texture={Texture.from(`img/game-hordes/icon.png`)} anchor={0.5} />
</Button>
