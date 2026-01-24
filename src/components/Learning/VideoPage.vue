<template>
    <div class="video-container" @click="enableSound">
        <video
            ref="videoRef"
            class="video-container__lerning-video"
            :src="videoUrl"
            autoplay
            muted
            playsinline
            @ended="onVideoEnded"
        ></video>
    </div>
    <teleport to="body">
        <div v-if="isSoundHintShow" class="hint-overlay" @click="closeHint">
            <div class="finger" :style="highlightStyle">
                <img
                    class="finger_icon"
                    src="@/assets/icons/one-finger-tap.svg"
                    alt="one-finger-tap"
                />
                <span class="finger_text">Нажми на видео, чтобы воспроизвести звук</span>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useElementPosition } from '@/shared/composables/useElementPosition';

const props = defineProps({
    videoUrl: String,
});

const emit = defineEmits(['showHintLike', 'showRetryHint', 'showPreviousHint']);

const isOnboardingShoved = ref(false);
const isSoundHintShow = ref(false);
const videoRef = ref(null);

const { calculatePositionDelayed, getPositionStyle } = useElementPosition(videoRef, {
    autoUpdate: true,
    watchResize: true,
});

onMounted(() => {
    if (localStorage.getItem('video_hint_shown')) return; //убрать после связкис бэком

    // if (isOnboardingShoved.value) return;

    setTimeout(() => {
        calculatePositionDelayed();
        isSoundHintShow.value = true;
    }, 300);
});

const overlayClass = computed(() => ({ 'index-up': isSoundHintShow.value }));

const highlightStyle = computed(() => getPositionStyle());

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

const closeHint = () => {
    isSoundHintShow.value = false;
    replayVideo();
    enableSound();
    localStorage.setItem('video_hint_shown', 'true');
};

const onVideoEnded = () => {
    if (!isOnboardingShoved.value && !isSoundHintShow.value) {
        emit('showRetryHint');
        emit('showPreviousHint');
    }
};

defineExpose({ replayVideo, pauseVideo });
</script>

<style scoped lang="scss">
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
    cursor: pointer;
}

.finger {
    position: absolute;
    z-index: 104;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &_text {
        color: #fff;
        text-align: center;
        margin-top: 22px;
        max-width: 300px;
    }

    &_icon {
        width: 30px;
    }
}
</style>
