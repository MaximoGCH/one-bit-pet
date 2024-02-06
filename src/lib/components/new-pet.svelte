<script lang="ts">
	import { petData } from '$lib/data/pets';
	import { gameOptions } from '$lib/game-options';
	import { gameStateStore } from '$lib/state/game/gameState';
	import { InteractionEvent, Rectangle, Texture } from 'pixi.js';
	import { createEventDispatcher } from 'svelte';
	import { Sprite, Graphics } from 'svelte-pixi';
	import { cubicOut } from 'svelte/easing';
	import { spring } from 'svelte/motion';
	import AnimatedContainer from './Animation/animated-container.svelte';
	import { tweenedAnimation } from './Animation/animations/tweened-animation';
	import Button from './button.svelte';
	import PixiPortal from './pixi-portal.svelte';
	import TextInput from './text-input.svelte';
	import Text from './text.svelte';

	const { addPet } = gameStateStore.dispatch.pet;

	const dispatch = createEventDispatcher();

	let panelActive = true;
	let moveEnd = false;

	let angleControl = false;
	let angleControlX = 0;
	let angle = spring(0, {
		stiffness: 0.1,
		damping: 0.2
	});

	let progress = 100;

	const mouseDown = (e: CustomEvent<InteractionEvent>) => {
		angleControl = true;
		angleControlX = e.detail.data.global.x;
	};

	const mouseUp = (e: CustomEvent<InteractionEvent>) => {
		angleControl = false;
		angle.set(0);
	};

	const mouseMove = (e: CustomEvent<InteractionEvent>) => {
		if (!angleControl || progress === 0) return;
		angle.update((state) =>
			Math.max(-30, Math.min(30, state + e.detail.data.global.x - angleControlX))
		);
		progress = progress - Math.abs(e.detail.data.global.x - angleControlX) / 100;
		angleControlX = e.detail.data.global.x;
		if (progress <= 0) {
			progress = 0;
			angle.set(0);
			setTimeout(() => (moveEnd = true), 1000);
		}
	};

	const pets = Object.entries(petData)
		.filter(([_, pet]) => pet.phase === 1)
		.map(([name, pet]) => ({ ...pet, name }));

	const pet = pets[Math.round(Math.random() * (pets.length - 1))];

	let name = '';

	const done = () => {
		if (name.length === 0 && panelActive) return;

		panelActive = false;

		addPet(name, pet.name);
	};
</script>

<PixiPortal>
	<AnimatedContainer
		active={panelActive}
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
		on:animation-end-ended={() => dispatch('end')}
	>
		<Graphics
			x={0}
			y={0}
			interactive
			hitArea={new Rectangle(0, 0, gameOptions.screen.width, gameOptions.screen.height)}
			draw={(graphics) => {
				graphics.clear();
				graphics.beginFill(0x000000);
				graphics.drawRect(0, 0, gameOptions.screen.width, gameOptions.screen.height);
				graphics.endFill();
			}}
		/>

		<AnimatedContainer
			active={!moveEnd}
			onStart={tweenedAnimation({
				from: {
					opacity: 0,
					y: 10
				},
				to: { opacity: 1, y: 0 },
				easing: cubicOut,
				duration: 200,
				delay: 1000
			})}
			onEnd={tweenedAnimation({
				from: { opacity: 1 },
				to: { opacity: 0 },
				easing: cubicOut,
				duration: 200
			})}
		>
			<Graphics
				x={gameOptions.screen.width / 2}
				y={gameOptions.screen.height / 2 + 10}
				interactive
				draw={(graphics) => {
					graphics.clear();
					const rect = [-10, 10, 20, 2];
					graphics.beginFill(0xffffff);
					graphics.drawRect(rect[0], rect[1], rect[2] * ((100 - progress) / 100), rect[3]);
					graphics.endFill();
					graphics.lineStyle(1, 0xffffff);
					graphics.drawRect(rect[0] - 2, rect[1] - 2, rect[2] + 4, rect[3] + 4);
				}}
			/>
			<Text
				x={gameOptions.screen.width / 2}
				y={gameOptions.screen.height / 2 + 35}
				anchor={0.5}
				text={'Move the egg!'}
			/>
		</AnimatedContainer>

		<AnimatedContainer
			active={!moveEnd}
			onStart={tweenedAnimation({
				from: {
					opacity: 0,
					x: gameOptions.screen.width / 2,
					y: gameOptions.screen.height / 2 - 100
				},
				to: { opacity: 1, y: gameOptions.screen.height / 2 },
				easing: cubicOut,
				duration: 200,
				delay: 500
			})}
			onEnd={tweenedAnimation({
				from: { opacity: 1 },
				to: { opacity: 0 },
				easing: cubicOut,
				duration: 200
			})}
		>
			<Sprite
				texture={Texture.from('img/new-pet/egg.png')}
				anchor={0.5}
				angle={$angle}
				interactive
				buttonMode
				on:mousemove={mouseMove}
				on:mousedown={mouseDown}
				on:mouseupoutside={mouseUp}
				on:mouseup={mouseUp}
			/>
		</AnimatedContainer>

		<AnimatedContainer
			active={moveEnd}
			onStart={tweenedAnimation({
				from: {
					opacity: 0,
					x: gameOptions.screen.width / 2,
					y: gameOptions.screen.height / 2 - 10
				},
				to: { opacity: 1, y: gameOptions.screen.height / 2 },
				easing: cubicOut,
				duration: 200,
				delay: 500
			})}
			onEnd={tweenedAnimation({
				from: { opacity: 1 },
				to: { opacity: 0 },
				easing: cubicOut,
				duration: 200
			})}
		>
			<Sprite texture={Texture.from(`img/pets/${pet.name}.png`)} anchor={0.5} />
		</AnimatedContainer>

		<AnimatedContainer
			active={moveEnd}
			onStart={tweenedAnimation({
				from: {
					opacity: 0,
					y: 10
				},
				to: { opacity: 1, y: 0 },
				easing: cubicOut,
				duration: 200,
				delay: 1000
			})}
			onEnd={tweenedAnimation({
				from: { opacity: 1 },
				to: { opacity: 0 },
				easing: cubicOut,
				duration: 200
			})}
		>
			<Text
				x={gameOptions.screen.width / 2}
				y={gameOptions.screen.height / 2 + 14}
				anchor={0.5}
				text={`You have got a ${pet.name}!!`}
			/>

			<TextInput
				label="Write the pet name:"
				x={gameOptions.screen.width / 2}
				y={gameOptions.screen.height / 2 + 30}
				on:change={(e) => (name = e.detail)}
			/>

			<Button
				x={gameOptions.screen.width / 2 - 30}
				y={gameOptions.screen.height / 2 + 55}
				width={60}
				height={30}
				on:click={done}
			>
				<Text x={30} y={15} anchor={0.5} text="Done!" />
			</Button>
		</AnimatedContainer>
	</AnimatedContainer>
</PixiPortal>
