const playSound = (sound : string, loop : boolean = false) : void => {
	if (sound) {
		let audio = new Audio(`/sound/${sound}`)
		audio.loop = loop
		audio.play()
	}
}

export { playSound }
