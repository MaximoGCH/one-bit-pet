<script lang="ts">
	import { Container, Graphics, Sprite } from 'svelte-pixi';
	import {
		Graphics as PixiGraphics,
		Container as PixiContainer,
		Rectangle,
		Texture
	} from 'pixi.js';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import Button from './button.svelte';
	import { cubicIn, cubicInOut, cubicOut } from 'svelte/easing';
	import AnimatedContainer from './Animation/animated-container.svelte';
	import { tweenedAnimation } from './Animation/animations/tweened-animation';

	const dispatch = createEventDispatcher();

	export let width: number = 100;
	export let height: number = 100;
	export let x: number = 0;
	export let y: number = 0;
	export let inverted: boolean = false;
	export let z: number = 3;
	export let interactive: boolean = false;
	export let overflow: 'hidden' | 'visible' = 'hidden';
	export let scrollHeight: number = 0;
	export let scrollSize: number = height / 2 - 20;

	const mask = (overflow === 'hidden' && new PixiGraphics()) || undefined;

	$: {
		if (mask) {
			mask.clear();
			mask.beginFill(0xffffff);
			mask.drawRect(0, 0, width, height);
			mask.endFill();
		}
	}

	$: realZ = z + 2;

	let container: PixiContainer | undefined;

	if (mask) {
		onMount(() => {
			container?.addChild(mask);
		});

		onDestroy(() => {
			container?.removeChild(mask);
		});
	}

	$: maxScroll = Math.max(scrollHeight - height, 0);
	const scrollY = tweened(0, {
		easing: cubicInOut
	});

	let goto = 0;
	const scrollUp = () => {
		goto = Math.max(Math.min($scrollY - scrollSize, maxScroll), 0);
		scrollY.set(goto);
	};

	const scrollDown = () => {
		goto = Math.max(Math.min($scrollY + scrollSize, maxScroll), 0);
		scrollY.set(goto);
	};

	const scrollMask = (scrollHeight && new PixiGraphics()) || undefined;

	$: {
		if (scrollMask) {
			scrollMask.clear();
			scrollMask.beginFill(0xffffff);
			scrollMask.drawRect(0, 40, width, height - 70);
			scrollMask.endFill();
		}
	}

	if (scrollMask) {
		onMount(() => {
			container?.addChild(scrollMask);
		});

		onDestroy(() => {
			container?.removeChild(scrollMask);
		});
	}
</script>

<Container
	{x}
	{y}
	{width}
	{height}
	{mask}
	bind:instance={container}
	{interactive}
	buttonMode={interactive}
	hitArea={interactive ? new Rectangle(0, 0, width, height) : null}
	on:click={() => dispatch('click')}
	on:mousedown={() => dispatch('mousedown')}
	on:mouseup={() => dispatch('mouseup')}
>
	<Graphics
		x={0}
		y={0}
		draw={(graphics) => {
			graphics.clear();
			graphics.beginFill(0x000000);
			graphics.drawRect(0, 0, width, height);
			graphics.endFill();
			graphics.lineStyle(1, 0xffffff, 1);
			graphics.drawRect(0, 0, width, height);
			graphics.drawRect(1, 1, width - 2, height - 2);

			if (!inverted) {
				graphics.moveTo(0, realZ);
				graphics.lineTo(width, realZ);
			} else {
				graphics.moveTo(0, height - realZ);
				graphics.lineTo(width, height - realZ);
			}
		}}
	/>

	{#if scrollHeight}
		<AnimatedContainer
			active={goto !== 0}
			onStart={tweenedAnimation({
				from: { opacity: 0 },
				to: { opacity: 1 },
				easing: cubicOut,
				duration: 200
			})}
			onEnd={tweenedAnimation({
				from: { opacity: 1 },
				to: { opacity: 0 },
				easing: cubicOut,
				duration: 200
			})}
		>
			<Button on:click={scrollUp} x={width / 2 - 20} width={40} height={16} y={16}>
				<Sprite
					x={20}
					y={8}
					texture={Texture.from(`/img/ui/arrow-up.png`)}
					anchor={{ x: 0.5, y: 0.5 }}
				/>
			</Button>
		</AnimatedContainer>

		<Container mask={scrollMask} y={30}>
			<Container y={-$scrollY}>
				<slot />
			</Container>
		</Container>

		<AnimatedContainer
			active={goto !== maxScroll}
			onStart={tweenedAnimation({
				from: { opacity: 0 },
				to: { opacity: 1 },
				easing: cubicOut,
				duration: 200
			})}
			onEnd={tweenedAnimation({
				from: { opacity: 1 },
				to: { opacity: 0 },
				easing: cubicOut,
				duration: 200
			})}
		>
			<Button on:click={scrollDown} x={width / 2 - 20} width={40} height={16} y={height - 20}>
				<Sprite
					x={20}
					y={8}
					texture={Texture.from(`/img/ui/arrow-down.png`)}
					anchor={{ x: 0.5, y: 0.5 }}
				/>
			</Button>
		</AnimatedContainer>
	{:else}
		<slot />
	{/if}
</Container>
