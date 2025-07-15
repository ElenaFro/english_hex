<template>
	<CongratulationPopup v-if="dataLoaded && !popupShowed && !everPlayedGame" @next="handlePopup"/>
	<myNewPlanetPopup v-if="showNewPlanet" @goToMain="handlePopup" />
	<goToMainPopup v-if="showGoToMain" />
	<div class="page-content">
		<div v-if="myPlanet" class="content-container">
			<div class="img-container">
				<img :src="planetImg" alt="" class="img-container__planet-img">
			</div>
			<!-- <div class="stars-container">
				<p class="stars-container__stars">+{{ totalStars }}</p>
				<img class="stars-container__star-img" src="@/assets/img/star-img.svg" alt="">
			</div> -->
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CongratulationPopup from '@/components/myPlanetPopup/CongratulationPopup.vue'
import myNewPlanetPopup from '@/components/myPlanetPopup/myNewPlanetPopup.vue';
import goToMainPopup from '@/components/myPlanetPopup/goToMainPopup.vue';
import planet0 from '@/assets/img/planets/planet-img 0.png'
import planet1 from '@/assets/img/planets/planet-img 1.png'
import planet2 from '@/assets/img/planets/planet-img 2.png'
import planet3 from '@/assets/img/planets/planet-img 3.png'
import planet4 from '@/assets/img/planets/planet-img 4.png'

const popupShowed = ref(false)
const myPlanet = ref(false)
const showNewPlanet = ref(false)
const showGoToMain = ref (false)
const everPlayedGame = ref(null)
const dataLoaded = ref(false)

onMounted (async () => {
	try {
		const response = await apiClient.get('/profile/get')
		everPlayedGame.value = response.data.ever_played_game
	} catch (error) {
		console.error(error)
	} finally {
		dataLoaded.value = true
	}
})

const handlePopup = (action) => {
	if (action === 'toPlanet') {
		popupShowed.value = true
		showNewPlanet.value = true
		myPlanet.value = true
	} else if (action === 'goToMain'){
		showNewPlanet.value = false
		setTimeout(() => {
			showGoToMain.value = true
		}, 3000)
		myPlanet.value = true
	}
}

const router = useRouter()
const route = useRoute()
// const earnedStars = parseInt(route.query.earnedStars || 0)
const earnedStars = 200
const totalStars = 20

const planetImg = computed(() => {
	if (everPlayedGame.value === false) {
		return planet0
	} else {
		if (earnedStars < 100) return planet1
		if (earnedStars >= 100 && earnedStars < 200) return planet2
		if (earnedStars >= 200 && earnedStars < 300) return planet3
		return planet4
	}
})
</script>

<style scoped lang="scss">
.page-content {
	background-color: transparent;
	align-items: center;
	padding-block: 0;

	.content-container {
		margin-top: 126px;

		.img-container {
			margin-bottom: 15px;
		}

		.stars-container {
			display: flex;
			align-items: center;
			gap: 3px;

		&__stars {
			font-size: 50px;
			font-weight: 800;
			line-height: 100%;
			color: #FFFFFF;
		}

		&__star-img {
			width: 35px;
			height: 35px;
		}
	}
	}
}
</style>