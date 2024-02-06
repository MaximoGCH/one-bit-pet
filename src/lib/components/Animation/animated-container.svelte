<script lang="ts">
	import { Container } from 'svelte-pixi';
	import type { PointLike } from 'svelte-pixi/util/data-types';
	import { tweened } from 'svelte/motion';
	import type { Readable } from 'svelte/store';
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import type {
		ConditionalAnimation,
		AnimationParametersSet,
		Animation
	} from './animated-container';

	const dispatch = createEventDispatcher();

	export let onStart: Animation | undefined = undefined;
	export let loop: ConditionalAnimation[] | undefined = undefined;
	export let onEnd: Animation | undefined = undefined;

	export let active: boolean = true;

	export let pivot: PointLike | undefined = undefined;

	let phase:
		| 'loading'
		| 'non-active-idle'
		| 'running-on-start'
		| 'active-idle'
		| 'running-loop'
		| 'running-on-end' = 'loading';

	let x: Readable<number> = tweened(0);
	let y: Readable<number> = tweened(0);
	let angle: Readable<number> = tweened(0);
	let opacity: Readable<number> = tweened(1);
	let scaleX: Readable<number> = tweened(1);
	let scaleY: Readable<number> = tweened(1);

	let visible = false;

	const setParameters: AnimationParametersSet = (params) => {
		x = params.x || x;
		y = params.y || y;
		angle = params.angle || angle;
		opacity = params.opacity || opacity;
		scaleX = params.scaleX || scaleX;
		scaleY = params.scaleY || scaleY;
	};

	let timeOut: NodeJS.Timer | undefined;

	const executeAnimation = (animation: Animation, onEnd: () => void) => {
		timeOut = setTimeout(() => {
			visible = true;
			const animationEnd = animation.execute(setParameters);
			timeOut = setTimeout(() => {
				animationEnd && animationEnd();
				onEnd();
			}, animation.duration);
		}, animation.delay || 0);
	};

	const onStartPhase = () => {
		if (!onStart) {
			phase = 'active-idle';
			visible = true;
			return;
		}

		dispatch('animation-start-started');
		executeAnimation(onStart, () => {
			phase = 'active-idle';
			dispatch('animation-start-ended');
		});
	};

	const loopPhase = () => {
		if (!loop) return;

		const instance = loop.find((instance) => instance.condition);
		if (!instance) return;

		dispatch('animation-loop-started');
		executeAnimation(instance.animation, () => {
			dispatch('animation-loop-ended');
			phase = 'active-idle';
		});
	};

	const onEndPhase = () => {
		if (!onEnd) {
			phase = 'non-active-idle';
			visible = false;
			return;
		}

		dispatch('animation-end-started');
		executeAnimation(onEnd, () => {
			dispatch('animation-end-ended');
			phase = 'non-active-idle';
			visible = false;
		});
	};

	$: {
		if (phase === 'non-active-idle') {
			if (active) {
				phase = 'running-on-start';
			}
		}
	}

	$: {
		if (phase === 'running-on-start') {
			onStartPhase();
		}
	}

	$: {
		if (phase === 'active-idle') {
			if (active) {
				if (loop) {
					phase = 'running-loop';
				}
			} else {
				phase = 'running-on-end';
			}
		}
	}

	$: {
		if (phase === 'running-loop') {
			loopPhase();
		}
	}

	$: {
		if (phase === 'running-on-end') {
			onEndPhase();
		}
	}

	onMount(() => {
		phase = 'non-active-idle';
	});

	onDestroy(() => {
		timeOut && clearTimeout(timeOut);
	});
</script>

{#if visible}
	<Container
		x={$x}
		y={$y}
		angle={$angle}
		{pivot}
		scale={{ x: $scaleX, y: $scaleY }}
		alpha={$opacity}
	>
		<slot />
	</Container>
{/if}
