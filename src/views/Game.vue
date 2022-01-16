<template>
	<div>
		<div
			class="cursor-default select-none h-screen scroll-smooth pt-3 bg-pink-400 bg-gradient-to-r from-pink-500 to-transparent overflow-y-scroll pb-10"
		>
			<!-- PANEL -->
			<div id="panel">
				<div class="flex justify-center gap-2 pb-0">
					<label for="difficulty" class="text-white font-light">
						Dificultad:</label
					>
					<select
						id="difficulty"
						class="w-16 md:w-24 border-2 h-6 outline-white "
						v-model="difficulty"
					>
						<option value=1>Ameba(1)</option>
						<option value=2 selected>Normal (2)</option>
						<option value=3>Intermedio (3)</option>
						<option value=4>Dificil (4)</option>
						<option value=5>Prodigio (5)</option>
						<option value=10>Memoria Fotográfica (6)</option>
					</select>
					<br />
					<label for="amountCards" class="text-white font-light">
						Tarjetas:</label
					>
					<input
						name="amountCards"
						type="text"
						class="w-10 md:w-20 h-6 border-2 outline-white "
						v-model="amountCards"
					/>
					<button
						@click="initNewGame()"
						class="bg-green-400 hover:bg-green-300 hover:border-green-400 text-white text-sm font-bold rounded px-2 h-6 border-b-2 border-green-500 mb-2 transition duration-300"
					>
						Reiniciar
					</button>
				</div>
				<div
					class="flex flex-wrap justify-center text-sm font-mono  md:text-2xl bg-pink-200 shadow-md border-2 border-pink-300 font-sans p-1 rounded-b-lg"
				>
					<span class="px-10 text-pink-800 "
						>Nivel: {{ gameState.player.level }}
					</span>
					<span class="px-10 text-pink-800"
						>Puntaje: {{ gameState.player.score }}
					</span>
				</div>
				<div
					class="flex flex-wrap justify-center text-sm md:text-md font-semibold md:text-2xl bg-gray-200 shadow-md border-2 font-sans p-1 mb-4 mx-4 rounded-b-lg"
				>
					<span class="px-10 text-green-800"
								>Aciertos: {{ gameState.player.corrects }}
					</span>
					<span class="px-10 text-red-800"
								>Fallos: {{ gameState.player.fails }}
					</span>
				</div>
			</div>
			<!-- GRID -->
			<div class="border-2 rounded border-pink-500 p-4 grid grid-cols-5 lg:grid-cols-8 gap-2 px-3 grid-rows-4">
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
import { ref, watch, watchEffect, reactive, onMounted } from "vue"

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
			player:{
				fails:0,
				corrects:0,
				score:0,
				level:0
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

		const resetCounters = () => {
			gameState.player.fails = 0
			gameState.player.corrects = 0
		}

		const resetPlayerScore = () => {
			gameState.player.score = 0
			gameState.player.level = 0
		}

		// reset all game stat for a new
		const initNewGame = () => {
			resetPlayerScore()
			newRound()

		}

		// prepare for other game
		const newRound = ()=> {
			turnBackAll()
			resetCounters()
			initializeDeck()
			shuffleCards()
			turnOverAll()
			// show for 2 seconds
			setTimeout(turnBackAll, 3000)
		}

		const shuffleCards = () => {
			deckCards.value.sort(() => Math.random() - 0.5)
		}

		// turn back all cards
		const turnBackAll = () => {
			playSound(gameSounds.putDeck)
			deckCards.value.forEach((item) => {
				item.flipped = item.flippable ? false : true
			})
			gameState.currentSelected = []
		}

		// turn over all cards
		const turnOverAll = () => {
			playSound(gameSounds.putDeck)
			deckCards.value.forEach((item) => {
				item.flipped = true
			})
		}

		// generate deck
		const initializeDeck = () => {
			// empty the deck
			deckCards.value = []
			for (let i = 0; i < difficulty.value; i++) {
				fruits.slice(0, amountCards.value).map((fruit) => {
					deckCards.value.push({
						name: fruit,
						url: `fruits/${fruit}.jpg`,
						flipped: false,
						flippable: true,
					})
				})
			}
		}

		const checkCards = () => {
			const equalCards = gameState.currentSelected.reduce((n1, n2) =>
				n1.name == n2.name ? n1 : false
			)
			if (equalCards) {
				// disable equal cards
				gameState.currentSelected.map(
					(card) => (card.flippable = false)
				)

				gameState.player.corrects += 1
				playSound(gameSounds.correct)
				
				// check winner
				areWinner() || turnBackAll()


			} else {
				gameState.player.fails += 1
				setTimeout(turnBackAll, 1000)
				return false
			}
		}

		const areWinner = () => {
			if (!deckCards.value.map((card) => card.flippable).includes(true)) {
				playSound(gameSounds.winner)
				gameState.player.score += gameState.player.corrects**2 - (gameState.player.fails/2)
				gameState.player.level += 1
				newRound()
				return true
			}
			return false
		}

		const flipCard = (id) => {
			const card = deckCards.value[id]
			const totalSelected = gameState.currentSelected.length
			// if card is already flipped, do nothing
			if (!card.flippable || card.flipped || totalSelected == difficulty.value) return

			// flip the card
			playSound(gameSounds.flipCard)
			card.flipped = !card.flipped
			gameState.currentSelected.push(card)

			// check cards
			gameState.currentSelected.length == difficulty.value && checkCards()
		}

		const playSound = (sound) => {
			if (sound) {
				let audio = new Audio(`/sounds/${sound}`)
				audio.play()
			}
		}

		onMounted(async () => {
			initNewGame()
			//await getImages().then((data) => {
				// imageList.value = data
				// console.log(imageList.value)
			//})
		})

		const resetScore = ()=>{
			gameState.player.score = 0
		}

		watch(()=>[difficulty.value, amountCards.value], ([],[]) => {
			initNewGame()
		})

		return {
			deckCards,
			flipCard,
			gameState,
			difficulty,
			amountCards,
			initNewGame
		}
	},
}
</script>
