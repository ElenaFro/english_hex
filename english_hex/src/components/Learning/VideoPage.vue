<template>
	<div class="video-container">
			<!-- <video
				ref="videoRef"
				class="video-container__lerning-video" 
				:src="videoUrl" 
				autoplay
			></video> -->
			<video
				ref="videoRef"
				class="video-container__lerning-video" 
				src="@/assets/video/video.mp4"
				autoplay
			></video>
		</div>
</template>

<script setup>
import { ref } from 'vue'

const videoRef = ref(null)

const replayVideo = () => {
	if (videoRef.value && videoRef.value.ended) {
		videoRef.value.currentTime = 0
		videoRef.value.play()
	} 
}

defineExpose({ replayVideo })

</script>

<style scoped>
.video-container{
	overflow: hidden;
	position: relative;
	width: 315px;
	height: 463px;
	border-radius: 20px;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
}

.video-container__lerning-video {
	height: 100%;
	width: auto;
	position: absolute;
	object-fit: cover;
	border-radius: 20px;
}
</style>