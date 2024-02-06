<script lang="ts">
	import { gameStateStore } from '$lib/state/game/gameState';
	import type { PetId } from '$lib/state/game/petState';
	import { uiStateStore } from '$lib/state/ui-state';
	import { Texture } from 'pixi.js';
	import { Graphics, onTick, Sprite } from 'svelte-pixi';
	import { cubicInOut } from 'svelte/easing';
	import { createEventDispatcher, onMount } from 'svelte';
	import AnimatedContainer from './Animation/animated-container.svelte';
	import { tweenedAnimation } from './Animation/animations/tweened-animation';
	import Panel from './panel.svelte';
	import Text from './text.svelte';
	import { petData } from '$lib/data/pets';

	const dispatch = createEventDispatcher();

	const { addXp, setPetName } = gameStateStore.dispatch.pet;

	export let petId: PetId;
	export let xp: number;
	let phase:
		| 'before-mount'
		| 'animation-start'
		| 'xp'
		| 'evolution'
		| 'evolution-end'
		| 'end'
		| 'waiting-end' = 'before-mount';

	const pet = $gameStateStore.pets[petId];
	const petType = petData[pet.petName];

	const panelSize = {
		width: 200,
		height: 130
	};

	const levelSpeed = 1;

	let endPetLevel: {
		level: number;
		xp: number;
	};

	const startPetLevel = {
		level: $gameStateStore.pets[petId].level,
		xp: $gameStateStore.pets[petId].xp
	};

	let currentXP = startPetLevel.xp;
	let level = startPetLevel.level;
	let maxXP = 100 * startPetLevel.level;
	let evolution: string | undefined;

	onMount(() => {
		phase = 'animation-start';
	});

	const addXpFunc = () => {
		setTimeout(() => {
			phase = 'xp';
			addXp(petId, xp);
			endPetLevel = {
				level: $gameStateStore.pets[petId].level,
				xp: $gameStateStore.pets[petId].xp
			};

			if (
				(petType.phase === 1 && endPetLevel.level >= 10) ||
				(petType.phase === 2 && endPetLevel.level >= 20)
			) {
				const evolutions = petType.evolutionName || [];
				if (!evolutions) return;
				evolution = evolutions[Math.round(Math.random() * (evolutions?.length - 1))];
			}
		}, 500);
	};

	onTick((delta) => {
		if (phase !== 'xp') return;

		if (level < endPetLevel.level) {
			currentXP += delta * levelSpeed * level;
			if (currentXP >= maxXP) {
				level++;
				currentXP = 0;
				maxXP = 100 * level;
			}
			return;
		}

		if (currentXP < endPetLevel.xp) {
			currentXP += delta * levelSpeed * level;
			return;
		}

		endPetLevel.xp = endPetLevel.xp;
		if (evolution) {
			phase = 'evolution';
		} else {
			phase = 'waiting-end';
			setTimeout(() => {
				phase = 'end';
			}, 3000);
		}
	});

	let scale = 1;
	let counter = 0;
	onTick((delta) => {
		if (phase !== 'evolution') return;

		counter += delta * 0.05;

		scale = 1 + Math.sin(counter) * 0.5;

		if (counter >= 20) {
			if (!evolution) return;
			setPetName(petId, evolution);
			phase = 'evolution-end';

			setTimeout(() => {
				phase = 'end';
			}, 6000);
		}
	});
</script>

<AnimatedContainer
	active={phase !== 'before-mount' && phase !== 'end'}
	onStart={tweenedAnimation({
		from: {
			x: $uiStateStore.centerScreen.width / 2 - panelSize.width / 2,
			y: $uiStateStore.centerScreen.height / 2 - panelSize.height / 2 - 15,
			opacity: 0
		},
		to: { y: $uiStateStore.centerScreen.height / 2 - panelSize.height / 2, opacity: 1 },
		easing: cubicInOut,
		duration: 400
	})}
	onEnd={tweenedAnimation({
		from: { y: $uiStateStore.centerScreen.height / 2 - panelSize.height / 2, opacity: 1 },
		to: { y: $uiStateStore.centerScreen.height / 2 - panelSize.height / 2 + 15, opacity: 0 },
		easing: cubicInOut,
		duration: 400
	})}
	on:animation-start-ended={addXpFunc}
	on:animation-end-ended={() => dispatch('end')}
>
	<Panel width={panelSize.width} height={panelSize.height}>
		<AnimatedContainer
			active={phase !== 'evolution-end' && (phase !== 'end' || !evolution)}
			onEnd={tweenedAnimation({
				from: {
					opacity: 1
				},
				to: { opacity: 0 },
				easing: cubicInOut,
				duration: 400
			})}
		>
			<Sprite
				x={panelSize.width / 2}
				y={40}
				{scale}
				texture={Texture.from(`img/pets/${pet.petName}.png`)}
				anchor={0.5}
			/>
		</AnimatedContainer>

		<AnimatedContainer
			active={phase === 'evolution-end' || (phase === 'end' && !!evolution)}
			onStart={tweenedAnimation({
				from: {
					opacity: 0
				},
				to: { opacity: 1 },
				easing: cubicInOut,
				duration: 400,
				delay: 400
			})}
		>
			<Sprite
				x={panelSize.width / 2}
				y={40}
				{scale}
				texture={Texture.from(`img/pets/${evolution}.png`)}
				anchor={0.5}
			/>
		</AnimatedContainer>

		<Text x={panelSize.width / 2} y={64} anchor={0.5} text={`Level: ${level}`} />

		<Graphics
			x={panelSize.width / 2}
			y={70}
			draw={(graphics) => {
				graphics.clear();
				const rect = [-30, 10, 60, 2];
				graphics.beginFill(0xffffff);
				graphics.drawRect(rect[0], rect[1], rect[2] * (currentXP / maxXP), rect[3]);
				graphics.endFill();
				graphics.lineStyle(1, 0xffffff);
				graphics.drawRect(rect[0] - 2, rect[1] - 2, rect[2] + 4, rect[3] + 4);
			}}
		/>

		<AnimatedContainer
			active={phase !== 'evolution' && phase !== 'evolution-end'}
			onStart={tweenedAnimation({
				from: {
					x: panelSize.width / 2,
					y: 90,
					opacity: 0
				},
				to: { y: 95, opacity: 1 },
				easing: cubicInOut,
				duration: 400,
				delay: 200
			})}
			onEnd={tweenedAnimation({
				from: { y: 95, opacity: 1 },
				to: {
					x: panelSize.width / 2,
					y: 90,
					opacity: 0
				},
				easing: cubicInOut,
				duration: 400
			})}
		>
			<Text anchor={0.5} text={`+ ${xp} XP`} />
		</AnimatedContainer>

		<AnimatedContainer
			active={phase === 'evolution'}
			onStart={tweenedAnimation({
				from: {
					x: panelSize.width / 2,
					y: 90,
					opacity: 0
				},
				to: { y: 95, opacity: 1 },
				easing: cubicInOut,
				duration: 400,
				delay: 400
			})}
			onEnd={tweenedAnimation({
				from: { y: 95, opacity: 1 },
				to: {
					x: panelSize.width / 2,
					y: 90,
					opacity: 0
				},
				easing: cubicInOut,
				duration: 400
			})}
		>
			<Text anchor={0.5} text={`${pet.name} is evolving!!`} />
		</AnimatedContainer>

		<AnimatedContainer
			active={phase === 'evolution-end'}
			onStart={tweenedAnimation({
				from: {
					x: panelSize.width / 2,
					y: 90,
					opacity: 0
				},
				to: { y: 95, opacity: 1 },
				easing: cubicInOut,
				duration: 400,
				delay: 400
			})}
			onEnd={tweenedAnimation({
				from: { y: 95, opacity: 1 },
				to: {
					x: panelSize.width / 2,
					y: 90,
					opacity: 0
				},
				easing: cubicInOut,
				duration: 400
			})}
		>
			<Text anchor={0.5} text={`${pet.name} has evolved into a ${evolution}!!`} />
		</AnimatedContainer>
	</Panel>
</AnimatedContainer>
