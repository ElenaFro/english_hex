<template>
		<div class="scroll-container">
			<div class="img-container">
				<img class="learning-img" src="@/assets/img/learning-img-group.png" alt="">
			</div>
			<h1 class="page-content__title">Заголовок для животных</h1>
			<p class="page-content__text">Отправляйся в увлекательное путешествие по миру животных с нашей колодой карточек! Каждая карточка  — это яркое изображение животного, его название на английском и русском, и пример употребления слова в предложении. </p>
			<button @click="$emit('switch-component', 'EducatVideo')" class="button button--blue">Перейти к изучению</button>
		</div>
</template>

<script setup>

</script>

<style scoped>

.img-container {
display: block;
position: relative;
padding-bottom: 19px;
align-self: center;
}

.page-content__title {
font-size: 24px;
font-weight: 700;
line-height: 100%;
color: rgba(49, 29, 93, 1);
margin-bottom: 25px;
}

.page-content__text {
font-size: 14px;
font-weight: 400;
line-height: 20px;
color: rgba(38, 32, 96, 1);
margin-bottom: 25px;
}
</style>