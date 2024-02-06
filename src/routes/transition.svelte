<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import type { Unsubscriber } from 'svelte/store';
	import { page } from '$app/stores';
	import { cubicInOut } from 'svelte/easing';

	const transitionDuration = 600;
	let currentUrl: string;
	let opacity = tweened(0, {
		duration: transitionDuration / 2,
		easing: cubicInOut
	});

	let unsubscribe: Unsubscriber;
	let control = true;
	onMount(() => {
		unsubscribe = page.subscribe(({ url }) => {
			if (currentUrl !== url.pathname) {
				control = false;
				currentUrl = url.pathname;
				opacity.set(0);

				setTimeout(() => {
					opacity.set(1);

					control = true;
				}, transitionDuration / 2);
			}
		});
	});

	onDestroy(() => {
		unsubscribe && unsubscribe();
	});
</script>

{#if control}
	<slot />
{/if}
