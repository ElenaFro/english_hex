<template>
	<startGame v-if="activeComponent === 'startGame'" @start="switchToGame"/>
	<wordTwinkleGame v-if="activeComponent === 'wordTwinkleGame'"/>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import startGame from '@/components/wordTwinkle/wordTwinkleStart.vue'
import wordTwinkleGame from '@/components/wordTwinkle/wordTwinkleGame.vue';

const route = useRoute()
const activeComponent = ref('startGame')

const switchToGame = () => {
	activeComponent.value = 'wordTwinkleGame'
	firstGame()
}

onMounted(() => {
	if (route.query.startGame === 'true') {
		activeComponent.value = 'wordTwinkleGame'
	}
})
</script>

<style scoped lang="scss">

</style>