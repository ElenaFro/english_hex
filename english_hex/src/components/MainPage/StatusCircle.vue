<template>
	<div 
	class="progress-wrapper" 
	:style="{ '--value': percent }"
	>
			<p class="progress-text">{{ percent }}%</p>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const percent = ref(70)
</script>

<style scoped>
.progress-wrapper {
	width: 100%;
	height: 100%;
	background: conic-gradient(
		from 360deg,
		rgb(255, 255, 255) 0%,
		rgb(255, 255, 255) calc(100% - var(--value) * 1%),
		rgba(62, 157, 71, 1) calc(100% - var(--value) * 1%),
		rgba(62, 157, 71, 1) 100%
	);
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
}

.progress-wrapper::after {
	content: "";
	width: 27px;
	height: 27px;
	border-radius: 50%;
	background: white;
	position: absolute;
}

.progress-text {
	font-size: 7px;
	font-weight: 500;
	line-height: 100%;
	text-align: center;
	color: rgba(38, 32, 96, 1);
	z-index: 2;
}
</style>