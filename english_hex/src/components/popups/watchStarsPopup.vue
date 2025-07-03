<template>
	<img src="@/assets/img/arrow-img.png" alt="" class="arrow-img">
	<div class="shading-container">
		<div class="popup">
			<img class="popup__img" src="@/assets/img/girl_popup.png" alt="">
			<h1 class="popup__header">Звезды</h1>
			<p class="popup__text">Посмотреть страницу с отображением планет</p>
			<button class="button button--purple" @click="closePopup">Продолжить</button>
		</div>
	</div>
</template>

<script setup>
import apiClient from '@/api/axios';
import { useRouter } from 'vue-router';

const emit = defineEmits(['close'])
const router = useRouter()

const closePopup = async () => {
	emit('close')
}
</script>

<style scoped lang="scss">
.arrow-img {
	width: 110px;
	position: absolute;
	top: 55px;
	left: 100px;
	z-index: 101;
}

.shading-container {
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: 100;

	.popup {
		position: absolute;
		top: 210px;
		z-index: 101;
		border: 3px solid #262060;

		&__header{
			color: #311D5D;
			margin-bottom: 12px;
		}

		&__text {
			margin-bottom: 30px;
		}

		&__img {
			position: absolute;
			bottom: 140px;
			left: 160px;
		}
	}
}
</style>