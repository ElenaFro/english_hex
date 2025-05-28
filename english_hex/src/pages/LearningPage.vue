<template>
		<div class="page-content">
			<component 
			:is="activeComponent" 
			@switch-component="switchComponent" 
			/>
			<Popup />
			<!-- <StartLerning /> -->
			<!-- <div class="scroll-container">
				<div class="img-container">
					<img class="learning-img" src="@/assets/img/learning-img-group.png" alt="">
				</div>
				<h1 class="page-content__title">Заголовок для животных</h1>
				<p class="page-content__text">Отправляйся в увлекательное путешествие по миру животных с нашей колодой карточек! Каждая карточка  — это яркое изображение животного, его название на английском и русском, и пример употребления слова в предложении. </p>
				<button class="button button--blue">Перейти к изучению</button>
			</div> -->
		</div>
</template>

<script setup>
import { ref } from 'vue'
import StartLerning from '../components/Learning/StartLerning.vue';
import EducatVideo from '../components/Learning/EducatVideo.vue';
import Popup from '../components/popups/defaultPopup.vue';

const activeComponent = ref(StartLerning)

function switchComponent () {
	activeComponent.value = EducatVideo
}

</script>

<style scoped>
.page-content {
	padding-top: 28px;
}
</style>