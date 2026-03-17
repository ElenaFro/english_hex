<template>
    <div class="flip-card" :class="{ flipped: activeComponent === 'WordPage' }">
        <div class="flip-card__inner" @transitionend="onTransitionEnd">
            <div class="flip-card__side flip-card__front">
                <VideoPage
                    ref="videoRef"
                    :videoUrl="getVideoUrl(currentCard)"
                    @show-retry-hint="showRetryHint"
                    @show-previous-hint="openPreviousHint"
                    @video-ended="$emit('videoEnded')"
                />
            </div>
            <div class="flip-card__side flip-card__back">
                <WordPage
                    :engWord="currentCard.translation_word"
                    :rusWord="currentCard.word"
                    :soundUrl="getAudioUrl(currentCard)"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import VideoPage from '../../components/Learning/VideoPage.vue';
import WordPage from '../../components/Learning/WordPage.vue';

defineEmits(['videoEnded']);

const props = defineProps({
    cards: { type: Array, required: true },
    currentCardIndex: { type: Number, required: true },
    activeComponent: { type: String, required: true },
    onTransitionEnd: { type: Function, required: true },
    getVideoUrl: { type: Function, required: true },
    getAudioUrl: { type: Function, required: true },
    showRetryHint: { type: Function, default: () => ({}) },
    openPreviousHint: { type: Function, default: () => ({}) },
});

const videoRef = ref(null);

const currentCard = computed(() => props.cards[props.currentCardIndex] || {});

const replayVideo = () => {
    if (videoRef.value?.replayVideo) {
        videoRef.value.replayVideo();
    }
};

const pauseVideo = () => {
    if (videoRef.value?.pauseVideo) {
        videoRef.value.pauseVideo();
    }
};

defineExpose({
    replayVideo,
    pauseVideo,
});
</script>

<style scoped lang="scss">
.flip-card {
    perspective: 1000px;
    width: 100%;
    max-width: 356px;
    aspect-ratio: 3 / 4;
    position: relative;
    flex-shrink: 0;
    margin: 6dvh 0 0 0;
    max-height: 60dvh;
    max-width: 314px;
}

.flip-card__inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.8s ease-in-out;
}

.flip-card.flipped .flip-card__inner {
    transform: rotateY(180deg);
}

.flip-card__side {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
}

.flip-card__back {
    transform: rotateY(180deg);
}
</style>
