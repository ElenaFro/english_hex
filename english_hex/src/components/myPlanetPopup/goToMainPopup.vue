<template>
	<div class="popup">
		<div class="popup__header">Продолжим изучение</div>
		<div class="popup__text">Давай вернемся к изучению новых слов!</div>
	</div>
	<img src="@/assets/img/arrow-img.png" alt="" class="arrow-img">
</template>

<script setup>

</script>

<style scoped lang="scss">
.popup {
	position: absolute;
	bottom: 237px;
	z-index: 1000;

	&__header {
		margin-bottom: 12px;
	}
}

.arrow-img {
	position: absolute;
	transform: rotate(190deg);
	bottom: 80px;
	left: -20px;
}
</style>