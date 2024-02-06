<script lang="ts">
	import type { PetId } from '$lib/state/game/petState';
	import { createEventDispatcher } from 'svelte';
	import PetXp from './pet-xp.svelte';

	const dispatch = createEventDispatcher();
	export let petList: PetId[];
	export let xp: number;

	const realXp = Math.floor(xp / petList.length);
	let currentPet = 0;
	const endPet = () => {
		currentPet++;
		if (currentPet >= petList.length) {
			dispatch('end');
		}
	};
</script>

{#each petList as pet, i}
	{#if currentPet === i}
		<PetXp petId={pet} xp={realXp} on:end={endPet} />
	{/if}
{/each}
