<template>
    <div class="scroll-container">
        <div class="flip-card" :class="{ flipped: activeComponent === 'WordPage' }">
            <div class="flip-card__inner" @transitionend="handleTransitionEnd">
                <div class="flip-card__side flip-card__front">
                    <VideoPage :videoUrl="getVideoUrl(currentCard)" ref="videoRef" />
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
        <div class="button-container">
            <button class="button button--white" @click="replayAgain">Повторить</button>
            <button class="button button--blue" @click="handleNextOrFinish">
                {{ isLastCard ? 'Закончить' : 'Продолжить' }}
            </button>
        </div>
        <defaultPopup
            :isVisible="isNotEndedLearn"
            :message="beforLeaveMessage"
            title="Уже уходите?"
            @confirm="handleConfirmLeave"
            @close="handleClosePopup"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import WordPage from './WordPage.vue';
import VideoPage from './VideoPage.vue';
import defaultPopup from '../popups/defaultPopup.vue';
import { useCategoriesStore } from '@/stores/categories';

const cards = ref([]);
const currentCardIndex = ref(0);
const chosedCategory = ref({});
const videoRef = ref(null);
const activeComponent = ref('VideoPage');
const isTransitioning = ref(false);
const isNotEndedLearn = ref(false);
const navigationNext = ref(null);
const router = useRouter();
const beforLeaveMessage = 'Чтобы не потерять текущий прогресс завершите изучение раздела';

const currentCard = computed(() => cards.value[currentCardIndex.value] || {});
const isLastCard = computed(
    () => currentCardIndex.value === cards.value.length - 1 && activeComponent.value === 'WordPage'
);

onMounted(async () => {
    chosedCategory.value = useCategoriesStore().chosedCategory;
    cards.value = chosedCategory.value.cards || [];
});

const replayAgain = () => {
    if (activeComponent.value === 'WordPage') {
        activeComponent.value = 'VideoPage';
    }
    if (videoRef.value?.replayVideo) {
        videoRef.value.replayVideo();
    }
};

const handleNextOrFinish = async () => {
    if (isTransitioning.value) return;
    if (isLastCard.value) {
        if (!chosedCategory.value.completed_category) localStorage.setItem('earnedStars', 20);
        await useCategoriesStore().updateComplateCategory(chosedCategory.value.id);
        router.push({ name: 'games', query: { id: chosedCategory.value.id } });
        return;
    }
    if (activeComponent.value === 'VideoPage') {
        if (videoRef.value?.pauseVideo) {
            videoRef.value.pauseVideo();
        }
        activeComponent.value = 'WordPage';
    } else {
        isTransitioning.value = true;
        activeComponent.value = 'VideoPage';
    }
};

onBeforeRouteLeave((to, from, next) => {
    if (cards.value.length > 0 && currentCardIndex.value < cards.value.length - 1) {
        isNotEndedLearn.value = true;
        navigationNext.value = next;
    } else {
        next();
    }
});

const handleConfirmLeave = () => {
    isNotEndedLearn.value = false;
    if (navigationNext.value) {
        navigationNext.value();
    }
};

const handleClosePopup = () => {
    isNotEndedLearn.value = false;
    if (navigationNext.value) {
        navigationNext.value(false);
    }
};

const handleTransitionEnd = () => {
    if (isTransitioning.value && activeComponent.value === 'VideoPage') {
        currentCardIndex.value = (currentCardIndex.value + 1) % cards.value.length;
        isTransitioning.value = false;
    }
};

const getVideoUrl = (card) => {
    if (!card || !card.id || !card.video) return '';
    return `${import.meta.env.VITE_STORAGE_URI}/${chosedCategory.value.id}/cards/${card.id}/video/${card.video}`;
};

const getAudioUrl = (card) => {
    if (!card || !card.id || !card.audio) return '';
    return `${import.meta.env.VITE_STORAGE_URI}/${chosedCategory.value.id}/cards/${card.id}/audio/${card.audio}`;
};
</script>

<style scoped>
.scroll-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100dvh;
    box-sizing: border-box;
    overflow: hidden;
}

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

.button-container {
    width: 100%;
    max-width: 356px;
    margin-top: 2.5dvh;
    display: flex;
    justify-content: space-between;
    gap: 8px;
}

.button {
    flex: 1;
    padding: 0.6rem 1rem;
    font-size: 1rem;
    border-radius: 16px;
}

.button--blue {
    background-color: #007bff;
    color: white;
}

.button--white {
    background-color: white;
    color: #222;
    border: 2px solid #311d5d;
}

@media (max-width: 480px) {
    .scroll-container {
        padding: 0;
    }
}
</style>
