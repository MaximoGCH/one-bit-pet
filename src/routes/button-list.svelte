<script lang="ts">
	import AnimatedContainer from '$lib/components/Animation/animated-container.svelte';
	import { tweenedAnimation } from '$lib/components/Animation/animations/tweened-animation';
	import Button from '$lib/components/button.svelte';
	import { gameOptions } from '$lib/game-options';
	import { uiStateStore } from '$lib/state/ui-state';
	import { Texture } from 'pixi.js';
	import { Sprite } from 'svelte-pixi';
	import { cubicOut } from 'svelte/easing';

	const buttonList = [
		{
			img: 'img/ui/games.png',
			href: '/games'
		},
		{
			img: 'img/ui/house.png',
			href: '/'
		},
		{
			img: 'img/ui/kitchen.png',
			href: '/kitchen'
		},
		{
			img: 'img/ui/shop.png',
			href: '/shop'
		}
	];
</script>

<AnimatedContainer
	active={$uiStateStore.showButtons}
	onStart={tweenedAnimation({
		from: {
			x: gameOptions.screen.width / 2,
			y: gameOptions.screen.height - 20,
			opacity: 0,
			scaleY: 0
		},
		to: { opacity: 1, scaleY: 1 },
		easing: cubicOut,
		duration: 400,
		delay: 0
	})}
	onEnd={tweenedAnimation({
		from: { opacity: 1, scaleY: 1 },
		to: { opacity: 0, scaleY: 0 },
		easing: cubicOut,
		duration: 400,
		delay: 0
	})}
	pivot={{ x: (40 * buttonList.length) / 2, y: 40 }}
>
	{#each buttonList as button, i}
		<Button x={43 * i} width={40} height={40} href={button.href}>
			<Sprite texture={Texture.from(button.img)} anchor={0.5} x={20} y={20} />
		</Button>
	{/each}
</AnimatedContainer>
