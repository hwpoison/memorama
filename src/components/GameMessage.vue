<template>
	<transition name="slide-fade">
		<div id="message" v-show='show'>
				<div id="gameMsg" class="fixed select-none cursor-default overflow-y-hidden inset-x-0 mt-52">
					<div class="absolute -z-10 bg-blue-500  opacity-90 h-32 w-screen"></div>
					<div class="flex flex-col py-5">
						<span class="text-white text-3xl md:text-7xl">{{ title }}</span>	
						<span class="text-white"> {{ subtitle }} </span>
					</div>

				</div>
		</div>
	</transition>	
</template>
<script>
export default {
	name:'GameMessage',
	props:{
		title:{
			type: String,
			default:''
		},
		subtitle:{
			type:String,
			default:''
		},
		show:{
			type: Boolean,
			default: false
		}
	}
}
</script>
