<template>
	<div class="scroll-container">
		<div class="flip-card" :class="{ flipped: activeComponent === 'WordPage' }">
			<div class="flip-card__inner">
				<div class="flip-card__side flip-card__front">
          			<VideoPage ref="videoRef" />
        		</div>
				<div class="flip-card__side flip-card__back">
          			<WordPage />
        		</div>
			</div>
		</div>
		<!-- <VideoPage :videoUrl="data.videoUrl"/>
		<WordPage 
			:engWord="data.engWord"
			:rusWord="data.rusWord"
			:soundUrl="data.soundUrl"	
		/> -->
		<!-- <component 
			:is="components[activeComponent]" 
			ref="videoRef"	
		/> -->
		<div class="button-container">
			<button class="button button--white" @click="replayAgain">Повторить</button>
			<button class="button button--blue" @click="goToCard">Продолжить</button>
		</div>
	</div>
</template>

<script setup>
import {ref} from 'vue'
import axios from 'axios'
import WordPage from './WordPage.vue'
import VideoPage from './VideoPage.vue'

// const data = ref([])

const videoRef = ref(null)

// onMounted(async () => {
// 	try {
// 		const res = await axios.get('#')
// 		data.value = res.data
// 	} catch (err) {
// 		console.error(err)
// 	}
// })

const activeComponent = ref('VideoPage')

const components = {
	WordPage,
	VideoPage
}

const replayAgain = () => {
	if (activeComponent.value == 'WordPage') {
		activeComponent.value = 'VideoPage'
	}

	if (videoRef.value?.replayVideo) {
		videoRef.value.replayVideo()
 	}
}

const goToCard = () => {
	activeComponent.value = 'WordPage'
}
</script>

<style scoped>
.flip-card {
	perspective: 1000px;
	height: 463px;
	position: relative;
	margin: auto;
	margin-block: 52px 25px;
}

.flip-card__inner {
	position: relative;
	width: 100%;
	min-height: 100%;
	transform-style: preserve-3d;
	transition: transform 0.8s ease-in-out;
	display: flex;
}

.flip-card.flipped .flip-card__inner {
	transform: rotateY(180deg);
}

.flip-card__side {
	width: 100%;
	backface-visibility: hidden;
	flex-shrink: 0;
	flex-grow: 1;
}

.flip-card__front {
	z-index: 2;
}

.flip-card__back {
	transform: rotateY(180deg);
	position: absolute;
	top: 0;
	left: 0;
}

.button-container {
	z-index: 1000;
	display: flex;
	justify-content: space-between;
}
</style>