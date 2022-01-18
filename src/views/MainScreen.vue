<template>
<div>
	<div
		class="select-none cursor-default flex flex-col overflow-hidden h-screen bg-gradient-to-b from-pink-500 to-transparent -mt-7"
	>
		<div class="flex justify-center mt-10">
			<p
				id="main-title"
				class="text-white text-5xl md:text-6xl md:text-7xl -rotate-6 mt-20"
			>
				Memorama!
			</p>
			<img
				src="https://images.emojiterra.com/google/android-11/512px/1f9e0.png"
				class="rotate-6 animate animate-bounce self-center mt-10 w-10"
			/>
		</div>
		<div class="flex flex-col gap-2 mt-20">
			<button
				@click="playGame()"
				class="transition duration-100 self-center w-32 rounded py-3 text-2xl text-white text-bold bg-pink-500 border-b-4 border-pink-400 hover:rotate-2 hover:text-3xl duration-300 "
			>
				{{ gameText.gui.play }}
			</button>
		</div>
	</div>

	<footer class="select-none cursor-default rounded-t bg-pink-400 text-white bottom-0">
		by hwpoison
	</footer>
</div>
</template>
<script lang="ts">
import { useRouter, NavigationFailure } from "vue-router";
import { playSound } from "../utils/sound"
import { gameText, gameSounds } from "../utils/resources"
export default {
	name: "MainScreen",
	setup() {
		const router = useRouter();

		const playGame = () : Promise<void | NavigationFailure | undefined>=> router.push("/game");

		const playMusic = () : void => {
			playSound(gameSounds.mainMusic, true)
			removeEventListener("click", playMusic);
		};

		addEventListener("click", playMusic);

		return {
			playGame,
			gameText
		};
	},
};
</script>
<style scoped></style>
