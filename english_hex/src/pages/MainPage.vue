<template>
	<div class="username-container">
		<div class="username-container__img-container">
			<div class="username-container__img-container-inner">
				<img :src="avatarIcon" alt="" class="user-img">
			</div>
		</div>
		<!-- <p class="username-container__name">{{ userName }}</p> -->

		<!-- Черновик -->
		<p class="username-container__name">{{ userName }}</p>
	</div>
	<div class="page-content">
		<div class="scroll-container">
			<CategoryChoice v-for="section in sections" :key="section.id" :id="section.id" :sectionName="section.name"
				:imgUrl="section.image" :backgroundColor="section.color" :progress="section.progress"
				:locked="section.locked" />
		</div>
	</div>
	<loader v-if="loading" />
	<HelloPopupWithSound v-if="openHelloPopup" :title="titlePopup" :message="messagePopup" :sound-mp3="SoundForPopup"
		@close="closePopup" @arrow-click="closePopup" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import CategoryChoice from '@/components/MainPage/CategoryChoice.vue';
import BoyIcon from "@/assets/img/DefaultUserAvatar/male.svg";
import GirlIcon from "@/assets/img/DefaultUserAvatar/female.svg";
import loader from '@/components/loader.vue';
import HelloPopupWithSound from '@/components/popups/HelloPopupWithSound.vue';
import SoundForPopup from '@/assets/audio/helloFromDi.mp3'
import { useAuthStore } from '@/stores/auth';

const loading = ref(true);
const openHelloPopup = ref(false);
const sections = ref([]);

onMounted(async () => {
	try {
		const res = await axios.get('/test.json')
		sections.value = res.data
	} catch (err) {
		//Уточнить что делать в случае ошибки
		console.error(err)
	}
})

// onMounted(() => {
// 	loading.value = false;
// 	openHelloPopup.value = true;
// })

// Проверяем значение hasVisited в sessionStorage
const hasVisited = ref(sessionStorage.getItem('hasVisited') === 'true');

onMounted(() => {
	loading.value = false;
	if (!hasVisited.value) {
		openHelloPopup.value = true;
		hasVisited.value = true;
		sessionStorage.setItem('hasVisited', 'true');
	}
});

const currentUser = computed(() => useAuthStore().getCurrentUser());
const userName = computed(() => currentUser.value.name);
const avatarIcon = computed(() => currentUser.value.gender === "male" ? BoyIcon : GirlIcon
);

const closePopup = () => {
	// openHelloPopup.value = !openHelloPopup.value
	openHelloPopup.value = false;
}
const titlePopup = 'Добро пожаловать!';
const messagePopup = 'Привет! Меня зовут Di, и я рада приветствовать тебя в мире изучения английских слов! Ты сделал важный шаг к своей мечте - свободному владению иностранным языком.';
</script>

<style scoped>
.username-container {
	position: relative;
	box-sizing: content-box;
	height: 64px;
	padding: 0 0 21px 27px;
	display: flex;
	align-items: center;
	align-self: flex-start;
}

.username-container__img-container-inner {
	width: 55px;
	height: 55px;
	border: 1px solid rgba(161, 161, 0, 0.5);
	border-radius: 50%;
	background: rgba(255, 243, 237, 1);
	box-shadow: 0 0 106px 0 rgba(46, 236, 197, 0.1);
}

.username-container__img-container {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 64px;
	height: 64px;
	border: 1px solid rgba(240, 172, 25, 1);
	border-radius: 50%;
	box-shadow: 0 0 250px 0 rgba(191, 166, 25, 0.1);
	margin-right: 11px;
}

.username-container__name {
	font-size: 20px;
	font-weight: 600;
	line-height: 100%;
	text-align: center;
	color: rgba(255, 255, 255, 1);
}

.content-container {
	display: flex;
	flex: 1;
	overflow: hidden;
	width: 100%;
	border-radius: 40px 40px 0 0;
	padding: 57px 30px 0;
	background-color: rgba(246, 246, 254, 1);
}

.scroll-container {
	display: grid !important;
	/* grid-template-columns: repeat(2, 148px); */
	grid-template-columns: repeat(2, 1fr);
	grid-auto-rows: 220px;
	justify-content: space-between;
	gap: 20px;
}
</style>
