<template>
	<div class="username-container">
		<div class="username-container__img-container">
			<div class="username-container__img-container-inner">
				<img src="" alt="" class="user-img">
			</div>
		</div>
		<p class="username-container__name">Имя пользователя</p>
	</div>
	<div class="content-container">
		<div class="scroll-container">
			<CategoryChoice />
			<CategoryChoice />
			<CategoryChoice />
			<CategoryChoice />
			<CategoryChoice />
			<CategoryChoice />
		</div>
	</div>
	<loader v-if="loading" />
	<HelloPopupWithSound v-if="openHelloPopup" 
	:title="titlePopup" 
	:message="messagePopup" 
	:sound-mp3="SoundForPopup"
	@close="closePopup" 
	@arrow-click="closePopup" />
</template>
<script setup>
import { ref, onMounted } from 'vue';
import CategoryChoice from '@/components/MainPage/CategoryChoice.vue';
import loader from '@/components/loader.vue';
import HelloPopupWithSound from '@/components/popups/HelloPopupWithSound.vue';
import SoundForPopup from '@/assets/audio/helloFromDi.mp3'

const loading = ref(true);
const openHelloPopup = ref(false);

// onMounted(() => {
// 	loading.value = false;
// 	openHelloPopup.value = true;
// })

// Проверяем значение hasVisited в sessionStorage
const hasVisited = ref(sessionStorage.getItem('hasVisited') === 'true');

onMounted(() => {
    loading.value = false;
    if (!hasVisited.value) {
        openHelloPopup.value = true; // Открываем попап только один раз
        hasVisited.value = true; // Устанавливаем флаг, чтобы не открывать попап снова
		sessionStorage.setItem('hasVisited', 'true'); // Сохраняем значение в этой сессии , состояние будет сбрасываться при закрытии вкладки или обновлении страницы
    }
});

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
	width: 100%;
	overflow-y: scroll;
	display: grid;
	grid-template-columns: repeat(2, 148px);
	grid-auto-rows: 220px;
	gap: 20px;
	padding-bottom: 70px;
}

.scroll-container::-webkit-scrollbar {
	width: 0;
}
</style>
