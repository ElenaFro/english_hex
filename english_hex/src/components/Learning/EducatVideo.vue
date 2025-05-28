<template>
	<div class="scroll-container">
		<div class="img-container">
		</div>
		<div class="button-container">
			<button class="button button--white">Повторить</button>
			<button class="button button--blue">Продолжить</button>
		</div>
	</div>
</template>

<script setup>

</script>

<style scoped>
.img-container {
	width: 315px;
	height: 463px;
	border-radius: 20px;
	margin-block: 52px 25px;
	background-color: red;
	flex-shrink: 0;
}

.button-container {
	display: flex;
	justify-content: space-between;
}
</style>