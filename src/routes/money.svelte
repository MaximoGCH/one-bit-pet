<script lang="ts">
	import AnimatedContainer from '$lib/components/Animation/animated-container.svelte';
	import { tweenedAnimation } from '$lib/components/Animation/animations/tweened-animation';
	import Text from '$lib/components/text.svelte';
	import { gameStateStore } from '$lib/state/game/gameState';
	import { uiStateStore } from '$lib/state/ui-state';
	import { Texture } from 'pixi.js';
	import { Sprite } from 'svelte-pixi';
	import { cubicOut } from 'svelte/easing';
</script>

<AnimatedContainer
	active={$uiStateStore.showInventory}
	onStart={tweenedAnimation({
		from: { x: 10, y: 20, opacity: 0, scaleY: 0, scaleX: 0 },
		to: { opacity: 1, scaleY: 1, scaleX: 1 },
		easing: cubicOut,
		duration: 400,
		delay: 0
	})}
	onEnd={tweenedAnimation({
		from: { opacity: 1, scaleY: 1, scaleX: 1 },
		to: { opacity: 0, scaleY: 0, scaleX: 0 },
		easing: cubicOut,
		duration: 400,
		delay: 0
	})}
>
	<Sprite texture={Texture.from(`/img/ui/coin.png`)} />
	<Text text={`${$gameStateStore.inventory.money}`} x={12} y={4} anchor={{ x: 0, y: 0.5 }} />
</AnimatedContainer>
