<template>
    <div class="scroll-container">
        <div class="flip-card" :class="{ flipped: activeComponent === 'WordPage' }">
            <div class="flip-card__inner" @transitionend="handleTransitionEnd">
                <div class="flip-card__side flip-card__front">
                    <VideoPage
                        ref="videoRef"
                        :videoUrl="getVideoUrl(currentCard)"
                        @show-retry-hint="showRetryHint"
                        @show-previous-hint="openPreviousHint"
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
        <div class="button-container" :class="btnContainerClass">
            <button
                ref="previousBtnRef"
                v-if="currentCardIndex > 0"
                class="button button--white arrow"
                @click="goPreviousCard"
            >
                <img class="arrow_icon" src="@/assets/icons/arrow-left.svg" alt="arrow-left" />
            </button>
            <button ref="retryBtnRef" class="button button--white" @click="replayAgain">
                Повторить
            </button>
            <button class="button button--blue" @click="handleNextOrFinish">
                {{ isLastCard ? 'Закончить' : 'Продолжить' }}
            </button>
        </div>
        <div v-if="isPreview && propsCards.length > 1" class="button-container center">
            <button class="button publish-btn" @click="emit('publish')">Опубликовать</button>
        </div>
        <defaultPopup
            :isVisible="isNotEndedLearn"
            :message="beforLeaveMessage"
            title="Уже уходите?"
            @confirm="handleConfirmLeave"
            @close="handleClosePopup"
        />
    </div>
    <teleport to="body">
        <div v-if="isShowRetryHint" class="hint-overlay" @click="closeRetryHint">
            <div class="arrow-container" :style="highlightStyle">
                <span class="arrow-container_text"
                    >Нажми на кнопку «Повторить», чтобы снова воспроизвести видео</span
                >
                <img
                    class="arrow-container_icon"
                    src="@/assets/onboarding/arrow_down.svg"
                    alt="arrow"
                />
            </div>

            <button
                class="button button--white absolute"
                :class="overlayClass"
                :style="btnPositionClass"
            >
                Повторить
            </button>
        </div>
    </teleport>

    <teleport to="body">
        <div v-if="isShowPreviousHint" class="hint-overlay" @click="closePreviousHint">
            <div class="previous-container" :style="highlightStylePrevious">
                <span class="previous-container_text"
                    >Нажми на кнопку <br />
                    «Стрелочку», чтобы снова<br />
                    вернуться к предыдущему слову</span
                >
                <img
                    class="previous-container_icon"
                    src="@/assets/onboarding/arrow_down.svg"
                    alt="arrow"
                />
            </div>

            <button
                v-if="currentCardIndex > 0"
                class="button button--white arrow absolute"
                :style="arrowBtnPositionClass"
            >
                <img class="arrow_icon" src="@/assets/icons/arrow-left.svg" alt="arrow-left" />
            </button>
        </div>
    </teleport>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import WordPage from './WordPage.vue';
import VideoPage from './VideoPage.vue';
import defaultPopup from '../popups/defaultPopup.vue';
import { useCategoriesStore } from '@/stores/categories';
import { useElementPosition } from '@/shared/composables/useElementPosition';

const props = defineProps({
    propsCards: { type: Array, default: () => [] },
    isPreview: { type: Boolean, default: false },
});

const emit = defineEmits(['closePreview', 'publish', 'showLikeHint', 'like-changed']);

const cards = ref(props.propsCards);
const currentCardIndex = ref(0);
const chosedCategory = ref({});
const videoRef = ref(null);
const retryBtnRef = ref(null);
const previousBtnRef = ref(null);
const activeComponent = ref('VideoPage');
const isTransitioning = ref(false);
const isNotEndedLearn = ref(false);
const navigationNext = ref(null);
const router = useRouter();
const beforLeaveMessage = 'Чтобы не потерять текущий прогресс заверши изучение раздела';

const isRetryHintShowed = ref(!!localStorage.getItem('retry_hint_shown'));
const isPreviousHintShowed = ref(!!localStorage.getItem('previous_hint_shown'));
const isShowRetryHint = ref(false);
const isShowPreviousHint = ref(false);

const { calculatePositionDelayed, getPositionStyle } = useElementPosition(retryBtnRef, {
    autoUpdate: true,
    watchResize: true,
});

const { calculatePositionDelayed: calculatePrevious, getPositionStyle: getPreviousPosition } =
    useElementPosition(previousBtnRef, {
        autoUpdate: true,
        watchResize: true,
    });

const currentCard = computed(() => cards.value[currentCardIndex.value] || {});

const isLastCard = computed(
    () => currentCardIndex.value === cards.value.length - 1 && activeComponent.value === 'WordPage'
);

const highlightStyle = computed(() => getPositionStyle({ top: -117, width: 121 }));

const highlightStylePrevious = computed(() => getPreviousPosition({ top: -125, width: 218 }));

const overlayClass = computed(() => ({ 'index-up': isShowRetryHint.value }));

const btnContainerClass = computed(() => (currentCardIndex.value === 0 ? 'max-250' : ''));

const btnPositionClass = computed(() => getPositionStyle());

const arrowBtnPositionClass = computed(() => getPreviousPosition());

onMounted(async () => {
    if (props.propsCards.length > 0) return;
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
        if (props.propsCards.length > 0) return emit('closePreview');
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

const goPreviousCard = () => {
    if (activeComponent.value === 'VideoPage') {
        if (videoRef.value?.pauseVideo) {
            videoRef.value.pauseVideo();
        }
    }
    currentCardIndex.value = currentCardIndex.value - 1;
    activeComponent.value = 'VideoPage';
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
    if (props.propsCards.length > 0) return card.video_preview;
    if (!card || !card.id || !card.video) return '';
    return `${import.meta.env.VITE_STORAGE_URI}/${chosedCategory.value.id}/cards/${card.id}/video/${card.video}`;
};

const getAudioUrl = (card) => {
    if (props.propsCards.length > 0) return card.audio_preview;
    if (!card || !card.id || !card.audio) return '';
    return `${import.meta.env.VITE_STORAGE_URI}/${chosedCategory.value.id}/cards/${card.id}/audio/${card.audio}`;
};

function showRetryHint() {
    if (!isRetryHintShowed.value) {
        calculatePositionDelayed();
        isShowRetryHint.value = true;
    }
}

const closeRetryHint = () => {
    isRetryHintShowed.value = true;
    isShowRetryHint.value = false;
    replayAgain();
    localStorage.setItem('retry_hint_shown', 'true');
};

const closePreviousHint = () => {
    isPreviousHintShowed.value = true;
    isShowPreviousHint.value = false;
    localStorage.setItem('retry_hint_shown', 'true');
    setTimeout(() => {
        emit('showLikeHint');
    }, 500);
};

const openPreviousHint = async () => {
    if (currentCardIndex.value !== 1) return;
    await nextTick();
    if (currentCardIndex.value === 1 && !isPreviousHintShowed.value && !isShowPreviousHint.value) {
        calculatePrevious();
        isShowPreviousHint.value = true;
        localStorage.setItem('previous_hint_shown', 'true');
    }
};

watch(
    () => currentCard.value.isLiked,
    (newValue) => {
        emit('like-changed', newValue);
    },
    { immediate: true }
);

const updateLike = (liked) => {
    if (cards.value[currentCardIndex.value]) {
        cards.value[currentCardIndex.value].isLiked = liked;
        // mutation/action
    }
};

defineExpose({
    updateLike,
});
</script>

<style scoped lang="scss">
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
    max-width: 314px;
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
    max-width: 127px;
}

.button--white {
    background-color: white;
    color: #222;
    border: 2px solid #311d5d;
    max-width: 114px;
}

.arrow_icon {
    width: 29px;
}

.button.arrow {
    padding: 6px;
}

.publish-btn {
    background: #2e236d;
    color: white;
    padding: 9px 24px;
    font-family: Mulish;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 18px;
    line-height: 120%;
    letter-spacing: 0%;
}

.center {
    align-content: center;
    max-width: fit-content;
}

@media (max-width: 480px) {
    .scroll-container {
        padding: 0;
    }
}

.arrow-container,
.previous-container {
    position: absolute;
    z-index: 104;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    cursor: pointer;
    width: 300px;

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

.previous-container_text {
    text-align: center;
    width: 314px;
}
.previous-container {
    margin: 0 auto;
}
.max-250 {
    max-width: 250px;
}
</style>
