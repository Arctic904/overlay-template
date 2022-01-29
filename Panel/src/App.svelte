<script>
	import { createPanelConnection } from "./socketio";
	import { updateScreen } from "./socketio";
	import { onMount } from "svelte";
	import { reset } from "./socketio";
	onMount(() => {
		createPanelConnection();
	});
	function blueUp() {
		if (document.getElementById("blueWins").value != 4) {
			document.getElementById("blueWins").value =
				parseInt(document.getElementById("blueWins").value) + 1;
		}
	}
	function orngUp() {
		if (document.getElementById("orngWins").value != 4) {
			document.getElementById("orngWins").value =
				parseInt(document.getElementById("orngWins").value) + 1;
		}
	}
	function resetWins() {
		document.getElementById("orngWins").value = 0;
		document.getElementById("blueWins").value = 0;
	}
	function resetColors() {
		document.getElementById("orng-color").value = "ee8723";
		document.getElementById("blue-color").value = "52acfe";
	}
</script>

<main>
	<label for="series-length">Choose a Series Length</label>

	<select name="series-length" id="series-length">
		<option value="Best of 1">Best of 1</option>
		<option value="Best of 3">Best of 3</option>
		<option value="Best of 5">Best of 5</option>
		<option value="Best of 7">Best of 7</option>
	</select><br /><br />

	<label for="round">Choose the current round</label>
	<select name="round" id="round">
		<option value="Winners Round 1">Winners Round 1</option>
		<option value="Winners Round 2">Winners Round 2</option>
		<option value="Winners Round 3">Winners Round 3</option>
		<option value="Winners Round 3">Winners Round 4</option>
		<option value="Winners Round 3">Winners Round 5</option>
		<option value="Winners Quarter-Final">Winners Quarters</option>
		<option value="Winners Semi-Final">Winners Semis</option>
		<option value="Winners Final">Winners Finals</option>
		<option value="Grand Final">Grand Final</option>
		<option value="Losers Round 1">Losers Round 1</option>
		<option value="Losers Round 2">Losers Round 2</option>
		<option value="Losers Round 3">Losers Round 3</option>
		<option value="Losers Round 4">Losers Round 4</option>
		<option value="Losers Round 5">Losers Round 5</option>
		<option value="Losers Round 6">Losers Round 6</option>
		<option value="Losers Quarter-Final">Losers Quarters</option>
		<option value="Losers Semi-Final">Losers Semis</option>
		<option value="Losers Final">Losers Finals</option>
	</select>
	<br /><br />
	<label for="blue-name">Input blue name here</label>
	<input type="text" id="blue-name" name="blue-name" value="Blue" />
	<label for="orng-name">Input orange name here</label>
	<input type="text" id="orng-name" name="orng-name" value="Orange" />

	<br /><br />

	<label for="blueWins">Set wins for Blue (left)</label>

	<input
		type="number"
		id="blueWins"
		name="blueWins"
		min="0"
		max="4"
		value="0"
	/>
	<button class="bluebtn" on:click={() => blueUp()}>Blue Win</button>
	<br /><br />

	<label for="orngWins">Set wins for Orange (right)</label>

	<input
		type="number"
		id="orngWins"
		name="orngWins"
		min="0"
		max="4"
		value="0"
	/>
	<button class="orngbtn" on:click={() => orngUp()}>Orange Win</button>
	<br /><br />
	<div>Do not include the # in the team color hex codes</div>
	<label for="blue-color">Input blue color here</label>
	<input type="text" id="blue-color" name="blue-color" value="52acfe" />
	<label for="orng-color">Input orange color here</label>
	<input type="text" id="orng-color" name="orng-color" value="ee8723" />

	<br /><br />

	<button id="update-btn" on:click={() => updateScreen()}>Update</button>
	<button id="reset-wins" on:click={() => resetWins()}>Reset Wins</button>
	<button id="reset-colors" on:click={() => resetColors()}
		>Reset Colors</button
	>
	<br />
	<br />
	<br />
	<br />
	<br />
	<label for="reset-overlay"
		>Instantly resets all font sizes and text contents. Use if there is a
		sizing error or if something would stop working</label
	>
	<button id="reset-overlay" on:click={() => reset()}>Reset Overlay</button>
</main>

<style>
</style>
