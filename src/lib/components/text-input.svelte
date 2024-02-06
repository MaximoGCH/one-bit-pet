<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import Text from './text.svelte';

	export let x: number;
	export let y: number;
	export let label: string;

	const dispatch = createEventDispatcher();
	let text = '|';

	let input: HTMLInputElement | undefined;
	onMount(() => {
		input = document.createElement('input');
		input.type = 'text';
		document.body.appendChild(input);

		input.style.top = `0`;
		input.style.left = `0`;
		input.style.opacity = `0`;
		input.style.position = 'absolute';
		input?.focus();
		input.addEventListener('input', () => {
			if (!input) return;
			dispatch<string>('change', input.value);
			const caretPosition1 = input.selectionStart || 0;
			text = `${input.value.substring(0, caretPosition1)}|${input.value.substring(caretPosition1)}`;
		});

		input.addEventListener('keyup', () => {
			if (!input) return;
			const caretPosition1 = input.selectionStart || 0;
			text = `${input.value.substring(0, caretPosition1)}|${input.value.substring(caretPosition1)}`;
		});
	});

	onDestroy(() => {
		if (input) {
			document.body.removeChild(input);
		}
	});
</script>

<svelte:body on:click={() => input?.focus()} />

<Text {x} {y} text={`${label} ${text}`} anchor={0.5} />
