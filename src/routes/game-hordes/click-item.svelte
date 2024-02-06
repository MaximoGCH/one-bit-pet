<script lang="ts">
	import AnimatedContainer from '$lib/components/Animation/animated-container.svelte';
	import { tweenedAnimation } from '$lib/components/Animation/animations/tweened-animation';
	import { foodItems } from '$lib/data/items';
	import { Texture } from 'pixi.js';
	import { createEventDispatcher } from 'svelte';
	import { Sprite } from 'svelte-pixi';
	import { bounceOut, cubicOut, elasticInOut, elasticOut, linear } from 'svelte/easing';

	export let item: string;

	export let x: number;
	export let y: number;

	const dispatch = createEventDispatcher();

	const animationDuration = 500;
	let click = false;

	const onClick = () => {
		click = true;
	};
</script>

<AnimatedContainer
	active={!click}
	onStart={tweenedAnimation({
		from: { x, y: y - 20 },
		to: { y },
		easing: bounceOut,
		duration: 700
	})}
	onEnd={tweenedAnimation({
		from: { opacity: 1, y },
		to: { opacity: 0, y: y - 30 },
		easing: linear,
		duration: 500
	})}
	on:animation-end-ended={() => dispatch('click')}
>
	<Sprite
		interactive
		buttonMode
		on:click={onClick}
		texture={Texture.from(`img/items/${foodItems[item].img}.png`)}
	/>
</AnimatedContainer>
