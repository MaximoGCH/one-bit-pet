<script lang="ts">
	import Panel from '$lib/components/panel.svelte';
	import { gameOptions } from '$lib/game-options';
	import { uiStateStore } from '$lib/state/ui-state';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	const { setScreenSize } = uiStateStore;

	const margin = 20;
	const marginX2 = margin + margin;

	const tweenedOptions = {
		easing: cubicOut,
		duration: 400
	};

	const size = tweened(
		{
			x: margin,
			y: margin,
			width: gameOptions.screen.width - marginX2,
			height: gameOptions.screen.height - marginX2
		},
		tweenedOptions
	);

	$: {
		const xOffset = $uiStateStore.showInventory ? 120 : 0;
		const yOffset = $uiStateStore.showInventory ? 20 : 0;

		const sizeAux = {
			width:
				gameOptions.screen.width - xOffset - marginX2 - ($uiStateStore.showRecipeList ? 120 : 0),
			height: gameOptions.screen.height - yOffset - marginX2 - ($uiStateStore.showButtons ? 55 : 0)
		};

		size.set({
			y: yOffset + margin,
			x: xOffset + margin,
			...sizeAux
		});

		setScreenSize(sizeAux.width, sizeAux.height);
	}
</script>

<Panel x={$size.x} y={$size.y} width={$size.width} height={$size.height}>
	<slot />
</Panel>
