<script lang="ts">
	import { Text } from 'svelte-pixi';

	export let text: string;
	export let x: number = 0;
	export let y: number = 0;
	export let anchor: { x: number; y: number } | number = { x: 0, y: 0 };
</script>

<Text
	{text}
	style={{
		fill: 'white',
		fontSize: 80,
		fontFamily: 'HelvetiPixel'
	}}
	scale={0.19}
	{x}
	{y}
	{anchor}
/>
