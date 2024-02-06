<script lang="ts">
	import './styles.scss';
	import { Application, Container } from 'svelte-pixi';
	import {
		settings,
		SCALE_MODES,
		Application as PixiApplication,
		Container as PixiContainer
	} from 'pixi.js';
	import Inventory from './inventory.svelte';
	import FontFaceObserver from 'fontfaceobserver';
	import RecipeList from './recipeList.svelte';
	import { gameOptions } from '$lib/game-options';
	import ButtonList from './button-list.svelte';
	import CenterScreen from './center-screen.svelte';
	import { setPixiApp, setPixiContainer } from '$lib/state/pixi-app';
	import Transition from './transition.svelte';
	import Money from './money.svelte';
	import { gameStateStore } from '$lib/state/game/gameState';
	import { onMount } from 'svelte';
	import NewPet from '$lib/components/new-pet.svelte';

	let fontLoaded = false;

	new FontFaceObserver('HelvetiPixel').load().then(() => {
		fontLoaded = true;
	});

	settings.SCALE_MODE = SCALE_MODES.NEAREST;
	settings.ROUND_PIXELS = true;

	let pixiApp: PixiApplication;
	let screenContainer: HTMLElement | undefined;
	let wrapperWidth = 1;
	$: pixelScale = wrapperWidth / gameOptions.screen.width;

	const resizeRenderer = () => {
		if (!pixiApp) return;
		pixiApp.resize();
	};

	let loadControl = false;
	setTimeout(() => (loadControl = true), 500);

	$: pixiApp && setPixiApp(pixiApp);

	let pixiContainerSet = false;
	let screenPixiContainer: PixiContainer | undefined;
	$: {
		if (screenPixiContainer) {
			setPixiContainer(screenPixiContainer);
			pixiContainerSet = true;
		}
	}

	let newGame = false;
	onMount(() => {
		newGame = Object.keys($gameStateStore.pets).length === 0;
	});
</script>

<svelte:window on:resize={resizeRenderer} />

<div class="screen">
	<div
		class="pixi-wrapper"
		bind:this={screenContainer}
		style:aspect-ratio={`${gameOptions.screen.width} / ${gameOptions.screen.height}`}
		style:width={`min(100vw, ${(gameOptions.screen.width / gameOptions.screen.height) * 100}vh)`}
		bind:clientWidth={wrapperWidth}
	>
		{#if screenContainer && fontLoaded && loadControl}
			<Application resizeTo={screenContainer} bind:instance={pixiApp}>
				<Container scale={pixelScale} bind:instance={screenPixiContainer}>
					{#if pixiContainerSet}
						<Money />
						<Inventory />
						<ButtonList />
						<RecipeList />
						<CenterScreen>
							<Transition>
								<slot />
								{#if newGame}
									<NewPet on:end={() => (newGame = false)} />
								{/if}
							</Transition>
						</CenterScreen>
					{/if}
				</Container>
			</Application>
		{/if}
	</div>
</div>

<style lang="scss">
	.screen {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;

		.pixi-wrapper {
			position: absolute;
			overflow: hidden;
		}
	}
</style>
