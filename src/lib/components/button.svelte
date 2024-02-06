<script lang="ts">
	import { goto } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import { elasticOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import Panel from './panel.svelte';

	const dispatch = createEventDispatcher();
	export let x: number = 0;
	export let y: number = 0;
	export let width: number = 100;
	export let height: number = 100;

	export let href: string | undefined = undefined;

	let z = tweened(3, {
		duration: 1000,
		easing: elasticOut
	});

	const onClick = () => {
		href && goto(href);
		dispatch('click');
	};
</script>

<svelte:window on:mouseup={() => z.set(3)} />

<Panel
	inverted
	{x}
	y={y - $z - 3}
	{width}
	height={height + $z}
	z={$z}
	interactive
	on:click={onClick}
	on:mousedown={() => z.set(0)}
>
	<slot />
</Panel>
