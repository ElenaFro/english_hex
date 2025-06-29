<template>
	<div class="container" :style="{ backgroundColor: backgroundColor }">
		<button type="button" class="nav-arrow" @click="goToLearningPage">
			<img class="nav-arrow__img" src="@/assets/img/nav-arrow_icon.svg" alt="">
		</button>
		<div class="category-img">
			<img :src="img_url" alt="">
		</div>
		<p class="category-name">{{ sectionName }}</p>
		<div class="statusa-bar">
			<div class="statusa-bar__active">
				<img src="@/assets/img/open-lock_icon.svg" alt="">
				<div class="status-circle">
					<StatusCircle :percent="progress" />
				</div>
			</div>
			<div class="statusa-bar__active">
				<img :src="locked
					? closedLockIcon
					: openLockIcon" alt="">
				<div class="status-circle">
					<StatusCircle :percent="0" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import StatusCircle from './StatusCircle.vue';
import closedLockIcon from '@/assets/img/closed-lock_icon.svg'
import openLockIcon from '@/assets/img/open-lock_icon.svg'
import { computed } from 'vue';

const props = defineProps({
	id: Number,
	sectionName: String,
	imgUrl: String,
	backgroundColor: String,
	progress: Number,
	locked: Boolean
})

const router = useRouter()

const goToLearningPage = () => {
	router.push({ name: 'learning', params: { id: props.id }, query: { name: props.sectionName } })
}
const img_url = computed(() => `http://62.109.0.225:8000/storage/categories/${props.id}/images/${props.imgUrl}`)
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	/* justify-content: end; */
	justify-content: flex-end;
	width: 100%;
	height: 100%;
	position: relative;
	border-radius: 15px;
	padding: 19px 14px 13px;
	background-size: 100% auto !important;
	background-position: center !important;
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
	width: 50px;
	height: 70px;
	position: absolute;
	background-color: transparent;
	padding: 0;
	border: 0;
	background-color: rgb(246, 246, 254);
	border-radius: 400px;
	transform: translate(0%, -50%);
	top: 50%;
	left: 80%;
	display: flex;
	justify-content: center;
	align-items: center;
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