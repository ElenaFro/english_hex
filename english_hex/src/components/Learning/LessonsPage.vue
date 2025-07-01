<template>
	<div class="scroll-container">
		<div class="flip-card" :class="{ flipped: activeComponent === 'WordPage' }">
			<div class="flip-card__inner">
				<div class="flip-card__side flip-card__front">
					<VideoPage :videoUrl="getVideoUrl(currentCard)" ref="videoRef" />
				</div>
				<div class="flip-card__side flip-card__back">
					<WordPage :engWord="currentCard.translation_word" :rusWord="currentCard.word"
						:soundUrl="getAudioUrl(currentCard)" />
				</div>
			</div>
		</div>
		<div class="button-container">
			<button class="button button--white" @click="replayAgain">Повторить</button>
			<button class="button button--blue" @click="handleNextOrFinish">
				{{ isLastCard ? 'Закончить' : 'Продолжить' }}
			</button>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import WordPage from './WordPage.vue'
import VideoPage from './VideoPage.vue'
import { useCategoriesStore } from '@/stores/categories'

const cards = ref([])
const currentCardIndex = ref(0)
const chosedCategory = ref({})
const videoRef = ref(null)
const activeComponent = ref('VideoPage')
const router = useRouter()

const currentCard = computed(() => cards.value[currentCardIndex.value] || {})
const isLastCard = computed(() => currentCardIndex.value === cards.value.length - 1 && activeComponent.value === 'WordPage')

onMounted(async () => {
	chosedCategory.value = useCategoriesStore().chosedCategory
	cards.value = chosedCategory.value.cards || []
})

const replayAgain = () => {
	if (activeComponent.value === 'WordPage') {
		activeComponent.value = 'VideoPage'
	}
	if (videoRef.value?.replayVideo) {
		videoRef.value.replayVideo()
	}
}

const handleNextOrFinish = () => {
	if (isLastCard.value) {
		router.push({ name: 'games' })
		return
	}
	if (activeComponent.value === 'VideoPage') {
		if (videoRef.value?.pauseVideo) {
			videoRef.value.pauseVideo()
		}
		activeComponent.value = 'WordPage'
	} else {
		currentCardIndex.value = (currentCardIndex.value + 1) % cards.value.length
		activeComponent.value = 'VideoPage'
	}
}

const getVideoUrl = (card) => {
	if (!card || !card.id || !card.video) return ''
	return `http://62.109.0.225:8000/storage/categories/${chosedCategory.value.id}/video/${card.id}/${card.video}`
}

const getAudioUrl = (card) => {
	if (!card || !card.id || !card.audio) return ''
	return `http://62.109.0.225:8000/storage/categories/${chosedCategory.value.id}/video/${card.id}/audio/${card.audio}`
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
	display: flex;
	justify-content: space-between;
}

.button--blue {
	background-color: #007bff;
	color: white;
}
</style>