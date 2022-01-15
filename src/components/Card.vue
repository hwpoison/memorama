<template>
	<div>
		<div class="shadow-xl hover:bg-green-400 transition duration-200 hover:border-green-500 cursor-default select-none bg-indigo-600 px-1 rounded h-24 md:h-32 lg:h-48  border-b border-indigo-500 border-b-4 pb-3 ">
			<transition name="flip">
			<div v-show='flipped'>
				<h1 class="object-cover text-xs md:text-bold md:text-xl text-white capitalize ">{{ title }}</h1>
				<img class="mt-1 object-cover border-2 border-blue-500 h-14 md:h-24 lg:h-32 w-full rounded-full " :src=imgSrc>
			</div>
			</transition>
			<transition name="opacity">
			<div v-show='!flipped'>
				<h1 class="transition duration-100 pt-5 lg:pt-14 lg:text-7xl text-5xl text-white text-bold">?</h1>
			</div>
		</transition>
		</div>
	</div>
</template>
<script>
export default {
	name: 'Card',
	props:{
		title:{ 
			type: String, 
			default:''
		},
		imgSrc:{ 
			type:String, 
			default:"/public/unknow_card.png"
		},
		flipped:{
			type: Boolean,
			default: false
		}
	},
	setup(props){


		return {}
	}
}

</script>

<style scoped>
.flip-enter-active, .flip-leave-active {
  transform: rotateY(50deg);
  transition-duration:  0.1s;

}
.flip-enter-from, .flip-leave-to {
   transform: rotateX(-50deg);
  transition-duration:  0.1s;
}


.opacity-enter-active, .opacity-leave-active {
  transition: opacity 0.1s;
  opacity: 0;

}
.opacity-enter-from, .opacity-leave-to {
  opacity: 0;
}
</style>