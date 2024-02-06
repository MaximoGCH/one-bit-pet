<script lang="ts">
	import { itemList } from '$lib/data/items';
	import { Rectangle, Texture } from 'pixi.js';
	import { createEventDispatcher } from 'svelte';
	import { Container, Sprite } from 'svelte-pixi';
	import { quadInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import Text from './text.svelte';

	const dispatch = createEventDispatcher();
	export let x: number;
	export let y: number;
	export let width: number;
	export let itemName: string;
	export let itemNumber: number;

	const height = 22;
	$: item = itemList[itemName];

	let hover = tweened(0, {
		easing: quadInOut,
		duration: 100
	});
</script>

<Container
	hitArea={new Rectangle(0, 0, width, height)}
	on:mousedown={() => dispatch('mousedown')}
	on:mouseover={() => hover.set(2)}
	on:mouseout={() => hover.set(0)}
	buttonMode
	interactive
	{x}
	{y}
>
	<Sprite
		x={10}
		texture={Texture.from(`/img/items/${item.img}.png`)}
		y={height / 2 - $hover}
		anchor={{ x: 0, y: 0.5 }}
	/>
	<Text text={`x${itemNumber}`} x={35} y={height / 2} anchor={{ x: 0, y: 0.5 }} />
	<Text text={`${itemName}`} x={60} y={height / 2} anchor={{ x: 0, y: 0.5 }} />
</Container>
