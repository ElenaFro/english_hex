<template>
	<div class="container">
		<button type="button" class="nav-arrow" @click="goToLearningPage">
			<img class="nav-arrow__img" src="@/assets/img/nav-arrow_icon.svg" alt="">
		</button>
		<div class="category-img">
			<img src="@/assets/img/clothes_img.png" alt="">
		</div>
		<p class="category-name">Clothes</p>
		<div class="statusa-bar">
			<div class="statusa-bar__active">
				<img src="@/assets/img/open-lock_icon.svg" alt="">
				<div class="status-circle">
					<StatusCircle />
				</div>
			</div>
			<div class="statusa-bar__active">
				<img src="@/assets/img/closed-lock_icon.svg" alt="">
				<div class="status-circle">
					<StatusCircle />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import StatusCircle from './StatusCircle.vue';

const router = useRouter()

const goToLearningPage = () => {
	router.push('/learning')
}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	justify-content: end;
	width: 100%;
	height: 100%;
	position: relative;
	border-radius: 15px;
	padding: 19px 14px 13px;
	background: url('/src/assets/img/background_category.png');
	/* background-color: rgba(189, 139, 207, 1); */
}

.category-img {
	padding-bottom: 17px;
}

.category-name {
	font-size: 16px;
	font-weight: 700;
	line-height: 100%;
	color: rgba(38, 32, 96, 1);
	padding-bottom: 16px;
}

.nav-arrow {
	width: 16px;
	height: 15px;
	position: absolute;
	background-color: transparent;
	padding: 0;
	border: 0;
	transform: translate(0%, -50%);
	top: 50%;
	left: 88%;
}

.statusa-bar {
	width: 120px;
	height: 56px;
	background-color: rgba(255, 255, 255, 0.3);
	border-radius: 10px;
	display: flex;
	justify-content: space-between;
	padding: 11px 5px;
}

.statusa-bar__active {
	display: flex;
	align-items: center;
	gap: 3px;
}

.statusa-bar__active img {
	width: 16px;
	height: 16px;
}

.status-circle {
	width: 33px;
	height: 33px;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>