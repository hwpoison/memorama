const imgDir = '/img'


const fruitsCards : string[] = [
	"sandia",
	"manzana",
	"pera",
	"uva",
	"mango",
	"coco",
	"banana",
]

const gameSounds : Record<string, string> = {
	winner: "winner.mp3",
	putDeck: "put_deck.mp3",
	flipCard: "flip_card.mp3",
	correct: "correct_cards.mp3",
	mainMusic:"music.mp3"
}

const gameText : any = {
	ready:'¿Preparado?',
	fullconcentration:'Concentrate...',
	perfect:'¡Perfecto!',
	whatmemory:'¡Que memoria!',
	verygood:'¡Muy bueno!',
	keep:'Sigue así...',
	good:'¡Bien!',
	maybebetter:'Podría ser mejor...',
	gui:{
		level:'Nivel',
		score:'Puntaje',
		corrects:'Aciertos',
		fails:'Fallos',
		restart:'Reiniciar',
		difficulty:'Dificultad',
		cards:'Tarjetas',
		play:'Jugar!'
	}
}

const getFruitsCards = () : any => {
	return fruitsCards.map((card) : Record<string,string> =>{
		return {
				name:card, 
				url:`${imgDir}/fruits/${card}.jpg`
				}})
}


export { gameSounds, gameText, getFruitsCards }