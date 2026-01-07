<template>
    <div class="video-container" @click="enableSound">
        <video
            ref="videoRef"
            class="video-container__lerning-video"
            :src="videoUrl"
            autoplay
            :muted="isIphone"
            playsinline
        ></video>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

defineProps({
    videoUrl: String,
});

const videoRef = ref(null);

const replayVideo = () => {
    if (videoRef.value) {
        videoRef.value.currentTime = 0;
        videoRef.value.play();
    }
};

const pauseVideo = () => {
    if (videoRef.value) {
        videoRef.value.pause();
        videoRef.value.currentTime = 0;
    }
};

const enableSound = () => {
    if (videoRef.value) {
        videoRef.value.muted = false;
        videoRef.value.play().catch((err) => console.warn('Play failed', err));
    }
};

const isIphone = computed(() => /iPhone/i.test(navigator.userAgent));

defineExpose({ replayVideo, pauseVideo });
</script>

<style scoped>
.video-container {
    width: 100%;
    height: 100%;
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.video-container__lerning-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
}
</style>
