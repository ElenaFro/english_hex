<template>
	<div class="page-content">
		<div :class="wrong <=2 ? 'img-container' : 'img-container-loss'">
			<img v-if="wrong <=2" class="img-container__passed-img" src="@/assets/img/girl-img2.png" alt="">
			<img v-else class="img-container__loss-img" src="@/assets/img/sad-girl-img.png" alt="">
		</div>
		<div class="result-popup">
			<h1 class="result-popup__header">{{ resultHeader }}</h1>
			<p class="result-popup__text">{{ resultText }}</p>
			<p class="result-popup__const-text">Награда:</p>
			<div class="stars-container">
				<p class="stars-container__prize">{{ totalStars }}</p>
				<img height="41px" width="41px" src="@/assets/img/star-img.svg" alt="" class="stars-container__stars-img">
			</div>
			<div class="button-container">
				<button 
				@click="repeatGame" 
				v-show="showButton" 
				class="button button--purple"
				>{{ buttonText }}
				<img src="@/assets/img/arrow_icon.svg">
				</button>
				<button 
				@click="goToMainPage" 
				class="button button--purple"
				>Дальше
				<img src="@/assets/img/arrow_icon.svg">
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const wrong = Number(route.query.wrong)
const headerPerfect = ('Превосходный результат!')
const textPerfect = ('Все ответы верны. Внимание и визуальная память на отличном уровне. Так держать!')
const headerPassed = ('Задание выполнено')
const textPassed = ('Были допущены небольшие ошибки - это часть процесса обучения. Продолжайте в том же духе.')
const headerLoss = ('Задание не завершено')
const textLoss = ('Не стоит расстраиваться - каждая ошибка приближает к успеху. Рекомендуется повторить попытку.')
const buttonText = ref('')
const buttonPassed = ('Пройти еще раз')
const buttonLoss = ('Попробовать еще раз')
const stars = ref(0)

const resultHeader = computed(() => {
	if (wrong === 0) {
		return headerPerfect
	} if (wrong <=2) {
		return headerPassed
	} else {
		return headerLoss
	}
})

const resultText = computed(() => {
	if (wrong === 0) {
		return textPerfect
	} if (wrong <= 2) {
		return textPassed
	} else {
		return textLoss
	}
})

const showButton = computed(() => {
	if (wrong <= 2 && wrong !== 0) {
		buttonText.value = buttonPassed
		return true
	} if ( wrong >= 2) {
		buttonText.value = buttonLoss
		return true
	} else {
		return false
	}
})

const totalStars = computed(() => {
	if (wrong <= 2 && wrong !== 0) {
		return '+35'
	} if ( wrong > 2) {
		return '+0'
	} else {
		return '+50'
	}
}) 

const repeatGame = () => {
	router.push('/wordTwinkleGame'); 
}

const goToMainPage = () => {
	router.push({ name: 'mainPage', query: { stars: totalStars.value } })
}
</script>

<style scoped lang="scss">
.page-content {
	background-color: transparent;
	align-items: center;

	.img-container {
		position: absolute;
		z-index: 200;

		&__passed-img {
			width: 204px;
			height: 204px;
			position: fixed;
			top: 10px;
			left: 50%;
			transform: translate(-50%);
		}

		&__loss-img {
			width: 274px;
			height: 411px;
			position: fixed;
			top: 0px;
			left: 50%;
			transform: translate(-50%);
		}
	}

	.img-container-loss {
		z-index: 0;
	}

	.result-popup {
		position: relative;
		width: 326px;
		height: 422px;
		background-color: #FFFFFF;
		border-radius: 20px;
		padding: 39px 18px 34px;
		margin-top: 30px;
		display: flex;
		flex-direction: column;
		z-index: 100;

		&__header {
			font-size: 22px;
			font-weight: 700;
			line-height: 120%;
			margin-bottom: 12px;
			text-align: center;
			color: #311D5D;
		}

		&__text {
			font-size: 18px;
			font-weight: 400;
			line-height: 120%;
			color: #262060;
			margin-bottom: 12px;
		}

		&__const-text {
			font-size: 22px;
			font-weight: 700;
			line-height: 120%;
			color: #311D5D;
			margin-bottom: 12px;
		}

		.stars-container {
			display: flex;
			align-items: center;
			gap: 3px;
			margin-bottom: 30px;

			&__prize {
				font-size: 40px;
				font-weight: 800;
				line-height: 100%;
				color: #311D5D;
			}
		}

		.button-container {
			display: flex;
			flex-direction: column;
			gap: 12px;

			.button {
				gap: 12px;
			}
		}
	}
}
</style>