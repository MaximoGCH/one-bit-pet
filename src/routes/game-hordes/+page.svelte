<script lang="ts">
	import HordeGame from './horde-game.svelte';
	import Puntuation from './puntuation.svelte';

	let endGame = false;

	let clickedItems: { [enemyName: string]: number } = {};
	let killedEnemies: { [enemyName: string]: number } = {};

	const gameOver = (state: {
		clickedItems: { [enemyName: string]: number };
		killedEnemies: { [enemyName: string]: number };
	}) => {
		clickedItems = state.clickedItems;
		killedEnemies = state.killedEnemies;
		endGame = true;
	};
</script>

{#if endGame}
	<Puntuation {killedEnemies} {clickedItems} />
{:else}
	<HordeGame on:game-over={(e) => gameOver(e.detail)} />
{/if}
