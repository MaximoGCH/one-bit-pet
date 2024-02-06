<script lang="ts">
	import type { PetId, PetState } from '$lib/state/game/petState';
	import { uiStateStore } from '$lib/state/ui-state';
	import { Texture } from 'pixi.js';
	import { onTick, Sprite } from 'svelte-pixi';
	import { tweened, type Tweened } from 'svelte/motion';

	export let pet: PetState;

	let positionX: Tweened<number> = tweened($uiStateStore.centerScreen.width * Math.random());
	let positionY: Tweened<number> = tweened($uiStateStore.centerScreen.height * Math.random());
	let jumpY: Tweened<number> = tweened(0);
	let direction = 1;
	let action: { type: 'wait'; duration: number } | { type: 'move'; x: number; y: number } = {
		type: 'wait',
		duration: 100
	};

	const speed = 0.7;
	let count = 0;
	onTick((delta) => {
		count += delta;

		switch (action.type) {
			case 'wait':
				if (count > action.duration) {
					chooseAction();
				}
				break;
			case 'move':
				const dy = action.y - $positionY;
				const dx = action.x - $positionX;
				const angle = Math.atan2(dy, dx);
				jumpY.set(Math.abs(Math.sin(count)));
				positionX.update((x) => x + Math.cos(angle) * speed * delta);
				positionY.update((y) => y + Math.sin(angle) * speed * delta);

				direction = $positionX > action.x ? -1 : 1;

				if (Math.abs($positionY - action.y) + Math.abs($positionX - action.x) < 1) {
					chooseAction();
				}
				break;
		}
	});

	$: console.log(action);

	const chooseAction = () => {
		count = 0;
		jumpY.set(0);

		switch (Math.round(Math.random())) {
			case 0:
				action = {
					type: 'wait',
					duration: 100 + Math.random() * 1000
				};
				break;
			case 1:
				action = {
					type: 'move',
					x: $uiStateStore.centerScreen.width * Math.random(),
					y: $uiStateStore.centerScreen.height * Math.random()
				};
				break;
		}
	};
</script>

<Sprite
	texture={Texture.from(`/img/pets/${pet.petName}.png`)}
	anchor={0.5}
	x={$positionX}
	y={$positionY + $jumpY}
	scale={{ x: direction, y: 1 }}
/>
