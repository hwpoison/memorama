<template>
	<div>
		<GameMessage
			:title=gameMsg.title 
			:subtitle=gameMsg.subtitle
			v-model:show=showGameMsg
		/>	
		<div
			class="cursor-default select-none h-screen scroll-smooth pt-3 bg-pink-400 bg-gradient-to-r from-pink-500 to-transparent overflow-y-scroll pb-10"
		>
			<!-- PANEL -->
			<div id="panel">
				<div class="flex justify-center gap-2 pb-0">
					<label for="difficulty" class="text-white font-light">
						{{ gameText.gui.difficulty }}:</label
					>
					<select
						id="difficulty"
						class="w-16 md:w-24 rounded h-6 outline-white "
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
						{{ gameText.gui.cards }}:</label
					>
					<input
						name="amountCards"
						type="text"
						class="w-10 p-2 md:w-20 h-6 rounded outline-white "
						v-model="amountCards"
					/>
					<button
						@click="initNewGame()"
						class="bg-green-400 hover:bg-green-300 hover:border-green-400 text-white text-sm font-bold rounded px-2 h-6 border-b-2 border-green-500 mb-2 transition duration-300"
					>
						{{ gameText.gui.restart }}
					</button>
				</div>
				<div
					class="flex my-1 flex-wrap justify-center text-sm mt-2 rounded mx-1 shadow-md font-mono md:text-2xl border-2 bg-pink-300 shadow-md border-pink-300 font-bold font-sans p-1"
				>
					<span class="px-10 text-pink-800 "
						>{{ gameText.gui.level }}: {{ gameState.player.level }}
					</span>
					<span class="px-10 text-pink-800"
						>{{ gameText.gui.score }}: {{ gameState.player.score }}
					</span>
				</div>
				<div
					class="flex flex-wrap justify-center text-sm md:text-md font-semibold md:text-2xl bg-pink-300 shadow-md rounded font-sans p-1 mb-4 mx-5"
				>
					<span class="px-10 text-green-800"
								>{{ gameText.gui.corrects }}: {{ gameState.player.corrects }}
					</span>
					<span class="px-10 text-red-800"
								>{{ gameText.gui.fails }}: {{ gameState.player.fails }}
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
						:flippable="card.flippable"
						@click="flipCard(id)"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Card from "../components/Card.vue"
import GameMessage from '../components/GameMessage.vue'

import { ref, watch, watchEffect, reactive, onMounted } from "vue"
import { playSound } from '../utils/sound.ts'
import { gameSounds, gameText, getFruitsCards } from '../utils/resources.ts'

export default {
	name: "Game",
	components: {
		Card,
		GameMessage
	},
	setup() {
		const deckCards = ref([])
		const difficulty = ref(2)
		const amountCards = ref(7)

		const showGameMsg = ref(false)

		const gameMsg = reactive({
			title:'', 
			subtitle:''
		})

		const showMsg = ()=> {
			showGameMsg.value=true
			setTimeout(()=>{showGameMsg.value=false}, 2000)
		}
		//setInterval(()=>showMsg("nada"), 3000)

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

		// reset all game stat for a new
		const initNewGame = () => {
			[gameMsg.title, gameMsg.subtitle] = [gameText.ready,gameText.fullconcentration]
			resetPlayerScore()
			newRound()
		}

		// prepare for other game
		const newRound = ()=> {
			showMsg()
			turnBackAll()
			resetCounters()
			initializeDeck()
			shuffleDeck()
			turnOverAll()
			// show for 2 seconds
			setTimeout(turnBackAll, 4000)
		}

		// generate deck
		const initializeDeck = () => {
			// empty the deck
			deckCards.value = []
			const allCards = getFruitsCards()
			for (let i = 0; i < difficulty.value; i++) {
				Object.keys(allCards).slice(0, amountCards.value).map((card) => {
					deckCards.value.push({
						name: allCards[card].name,
						url: allCards[card].url,
						flipped: false,
						flippable: true,
					})
				})
			}
		}

		const shuffleDeck = () => {
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

		const checkCardsMatch = () => {
			const areMatch = new Set(gameState.currentSelected.map(card=>card.name)).size === 1 

			if(areMatch){
				if(gameState.currentSelected.length == difficulty.value){
					gameState.currentSelected.map(
						(card) => (card.flippable = false)
					)
					gameState.player.corrects += 1
					playSound(gameSounds.correct)
					areWinner() || turnBackAll()
				}
			}else{
				if(gameState.currentSelected.length >= 2){
					gameState.player.fails += 1
					setTimeout(turnBackAll,1000)
				}
			}
		}

		const areWinner = () => {
			if (!deckCards.value.map((card) => card.flippable).includes(true)) {
				playSound(gameSounds.winner)
				gameState.player.score += gameState.player.corrects**2 - (gameState.player.fails/2)
				const perfectGame = !gameState.player.fails
				const scoreRate = gameState.player.corrects >= gameState.player.fails
				
				if(perfectGame){
					// perfect game duplicate score
					[gameMsg.title, gameMsg.subtitle] = [gameText.perfect, gameText.whatmemory]
					gameState.player.score += gameState.player.score
				}else{
					// good or bad
					if(scoreRate)
						[gameMsg.title, gameMsg.subtitle] = [gameText.verygood,gameText.keep]
					else
						[gameMsg.title, gameMsg.subtitle] = [gameText.good,gameText.maybebetter]
				}

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

			// check cards match
			checkCardsMatch()
		}

		const resetCounters = () => {
			gameState.player.fails = 0
			gameState.player.corrects = 0
		}

		const resetPlayerScore = () => {
			gameState.player.score = 0
			gameState.player.level = 0
		}


		onMounted(async () => initNewGame())

		// check gameplay settings changes
		watch(()=>[difficulty.value, amountCards.value], ([],[]) => {
			initNewGame()
		})

		return {
			deckCards,
			flipCard,
			gameState,
			difficulty,
			amountCards,
			initNewGame,

			showGameMsg,
			gameMsg,
			gameText
		}
	},
}
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>