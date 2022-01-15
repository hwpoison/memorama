<template>
	<div>
		<div
			class="cursor-default select-none h-screen scroll-smooth pt-3 bg-pink-400 overflow-y-scroll pb-10"
		>
			<!-- PANEL -->
			<div id="panel">
				<div class="flex justify-center gap-2 pb-0">
					<label for="difficulty" class="text-white font-bold">
						Dificultad:</label
					>
					<select
						id="difficulty"
						class="w-16 md:w-24 border-2 h-6"
						v-model="difficulty"
					>
						<option value="1">Ameba(1)</option>
						<option value="2" selected>Normal (2)</option>
						<option value="3">Intermedio (3)</option>
						<option value="4">Dificil (4)</option>
						<option value="5">Prodigio (5)</option>
						<option value="10">Memoria Fotográfica (6)</option>
					</select>
					<br />
					<label for="amountCards" class="text-white font-bold">
						Tarjetas:</label
					>
					<input
						name="amountCards"
						type="text"
						class="w-10 md:w-20 h-6 border-2"
						v-model="amountCards"
					/>
					<button
						@click="initGame()"
						class="bg-green-400 hover:bg-green-300 hover:border-green-400 text-white text-sm font-bold rounded px-2 h-6 border-b-2 border-green-500 mb-2 transition duration-300"
					>
						Reiniciar
					</button>
				</div>
				<div
					class="text-sm md:text-2xl bg-pink-200 shadow-md border-4 border-pink-300 font-sans p-3 rounded-md m-2"
				>
					<span class="px-10 text-green-800"
						>Aciertos: {{ gameState.score.corrects }}
					</span>
					<span class="px-10 text-red-800"
						>Fallos: {{ gameState.score.fails }}
					</span>
				</div>
			</div>
			<!-- GRID -->
			<div class="grid grid-cols-5 lg:grid-cols-8 gap-2 px-3 grid-rows-4">
				<div v-for="(card, id) in deckCards" :key="id">
					<Card
						:title="card.name"
						:imgSrc="card.url"
						:flipped="card.flipped"
						@click="flipCard(id)"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Card from "../components/Card.vue"
import { ref, watchEffect, reactive, onMounted } from "vue"

export default {
	name: "Game",
	components: {
		Card,
	},
	setup() {
		let imageList = ref({})
		const deckCards = ref([])
		const difficulty = ref(2)
		const amountCards = ref(7)

		const gameState = reactive({
			totalSelected: 0,
			currentSelected: [],
			score:{
				fails:0,
				corrects:0
			}
		})

		const gameSounds = {
			winner: "winner.mp3",
			putDeck: "put_deck.mp3",
			flipCard: "flip_card.mp3",
			correct: "correct_cards.mp3",
		}

		async function getImages() {
			const response = await fetch("https://picsum.photos/v2/list")
			return response.json()
		}

		const fruits = [
			"sandia",
			"manzana",
			"pera",
			"uva",
			"mango",
			"coco",
			"banana",
		]

		const resetScore = () => {
			gameState.score.fails = 0
			gameState.score.corrects = 0
		}

		const initGame = () => {
			resetScore()
			initializeDeck()
			turnOverAll()
			// show for 2 seconds
			setTimeout(turnBackAll, 3000)
		}

		const shuffleCards = () => {
			deckCards.value.sort(() => Math.random() - 0.5)
		}

		// ocultar las cartas
		const turnBackAll = () => {
			playSound(gameSounds.putDeck)
			deckCards.value.forEach((item) => {
				item.flipped = item.flippable ? false : true
			})
		}
		// mostrarlas
		const turnOverAll = () => {
			playSound(gameSounds.putDeck)
			deckCards.value.forEach((item) => {
				item.flipped = true
			})
		}

		const initializeDeck = () => {
			deckCards.value = []
			for (let i = 0; i < difficulty.value; i++) {
				fruits.slice(0, amountCards.value).map((fruit) => {
					deckCards.value.push({
						name: fruit,
						url: `/public/fruits/${fruit}.jpg`,
						flipped: false,
						flippable: true,
					})
				})
			}
			shuffleCards()
		}

		const checkCards = () => {
			const equalCards = gameState.currentSelected.reduce((n1, n2) =>
				n1.name == n2.name ? n1 : false
			)
			if (equalCards) {
				gameState.score.corrects += 1
				gameState.currentSelected.map(
					(card) => (card.flippable = false)
				)
				playSound(gameSounds.correct)
				areWinner()
			} else {
				gameState.score.fails += 1
			}
			// reset all
			turnBackAll()
			gameState.totalSelected = 0
			gameState.currentSelected = []
			return true
		}

		const areWinner = () => {
			if (!deckCards.value.map((card) => card.flippable).includes(true)) {
				playSound(gameSounds.winner)
				initGame()
			}
		}

		const flipCard = (id) => {
			const card = deckCards.value[id]

			// if card is already flipped, do nothing
			if (!card.flippable || card.flipped) return

			if (gameState.totalSelected == difficulty.value) {
				console.log("Hey! No más de ", difficulty.value, " jejeje")
				return
			}

			playSound(gameSounds.flipCard)
			card.flipped = !card.flipped
			gameState.currentSelected.push(card)
			gameState.totalSelected += 1

			if (gameState.totalSelected == difficulty.value) {
				// check if is equals
				setTimeout(checkCards, 1000)
			}
		}

		const playSound = (sound) => {
			if (sound) {
				var audio = new Audio(`/public/sounds/${sound}`)
				audio.play()
			}
		}

		onMounted(async () => {
			initGame()
			await getImages().then((data) => {
				// imageList.value = data
				// console.log(imageList.value)
			})
		})

		watchEffect(() => {
			difficulty.value
			initGame()
		})

		return {
			deckCards,
			flipCard,
			gameState,
			difficulty,
			amountCards,
			initGame
		}
	},
}
</script>
