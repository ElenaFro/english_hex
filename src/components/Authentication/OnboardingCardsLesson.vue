<template>
    <div class="onboarding-lesson">
        <div class="onboarding-lesson__sheet"></div>

        <button class="onboarding-lesson__skip" type="button" @click="skipStory">Пропустить</button>

        <Loader v-if="loading" class="onboarding-lesson__loader" />

        <template v-else-if="cards.length">
            <div class="onboarding-lesson__deck onboarding-lesson__deck--left">
                <img src="@/assets/onboarding/deck-card-left.png" alt="" />
            </div>
            <div class="onboarding-lesson__deck onboarding-lesson__deck--right">
                <img src="@/assets/onboarding/deck-card-right.png" alt="" />
            </div>

            <div class="onboarding-lesson__card" :class="{ flipped: activeSide === 'word' }">
                <div class="onboarding-lesson__card-inner">
                    <div class="onboarding-lesson__card-side onboarding-lesson__card-front">
                        <div class="onboarding-lesson__video-card" @click="playWithSound">
                            <video
                                v-if="currentVideoUrl && !videoFailed"
                                ref="videoRef"
                                class="onboarding-lesson__video"
                                :src="currentVideoUrl"
                                autoplay
                                muted
                                playsinline
                                @error="videoFailed = true"
                            ></video>
                            <p v-else class="onboarding-lesson__placeholder">Тут будет видео</p>
                        </div>
                    </div>

                    <div class="onboarding-lesson__card-side onboarding-lesson__card-back">
                        <WordPage
                            :eng-word="currentCard.translation_word"
                            :rus-word="currentCard.word"
                            :sound-url="currentAudioUrl"
                        />
                    </div>
                </div>
            </div>

            <div class="onboarding-lesson__buttons">
                <button
                    v-if="canGoBack"
                    class="button button--white onboarding-lesson__arrow"
                    type="button"
                    @click="goPrevious"
                >
                    <img src="@/assets/icons/arrow-left.svg" alt="arrow-left" />
                </button>
                <button class="button button--white" type="button" @click="replay">
                    Повторить
                </button>
                <button
                    class="button button--blue"
                    type="button"
                    :disabled="saving"
                    @click="goNext"
                >
                    Продолжить
                </button>
            </div>

            <!--
                Подсказка на первую карточку: по макету это полноэкранный coach-mark
                с затемнением, иконкой руки и текстом, а не плашка внутри карточки.
            -->
            <div v-if="showSoundHint" class="onboarding-lesson__coach" @click="playWithSound">
                <img
                    class="onboarding-lesson__coach-hand"
                    src="@/assets/onboarding/tap-hand.svg"
                    alt=""
                />
                <p class="onboarding-lesson__coach-text">
                    Нажми на видео, чтобы воспроизвести звук
                </p>
            </div>
        </template>

        <div v-else class="onboarding-lesson__empty">
            <p>Не удалось загрузить карточки</p>
            <button class="button button--purple" type="button" @click="goToStep()">
                Дальше
                <img src="@/assets/img/arrow_icon.svg" alt="arrow" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import Loader from '@/shared/components/Loader.vue';
import WordPage from '@/components/Learning/WordPage.vue';
import { useOnboardingFlow } from '@/shared/composables/useOnboardingFlow';
import { buildStorageUrl } from '@/shared/utils/mediaUrl';
import { FRONT_EVENTS, trackEventOnce } from '@/shared/analytics/onboardingAnalytics';

const emit = defineEmits(['change-component']);
const { onboarding, goToStep, skipStory } = useOnboardingFlow(emit);

const loading = ref(true);
const saving = ref(false);
const currentIndex = ref(0);
const activeSide = ref('video');
const soundHintDismissed = ref(false);
const videoFailed = ref(false);
const videoRef = ref(null);

const cards = computed(() => onboarding.words);
const currentCard = computed(() => cards.value[currentIndex.value] ?? {});
const canGoBack = computed(() => currentIndex.value > 0 || activeSide.value === 'word');

/**
 * Бэк отдаёт готовые ссылки в video_url / audio_url — берём их.
 * Запасной путь собираем как для обычных карточек, по category_id и id.
 */
const resolveCardMedia = (card, field) => {
    const direct = card[`${field}_url`];
    if (direct) return direct;

    const value = card[field];
    if (!value) return '';

    if (card.category_id && card.id) {
        return `${import.meta.env.VITE_STORAGE_URI}/${card.category_id}/cards/${card.id}/${field}/${value}`;
    }

    return buildStorageUrl(value);
};

const currentVideoUrl = computed(() => resolveCardMedia(currentCard.value, 'video'));
const currentAudioUrl = computed(() => resolveCardMedia(currentCard.value, 'audio'));

// Подсказку про звук показываем только на первой карточке и только пока её не нажали.
const showSoundHint = computed(
    () =>
        currentIndex.value === 0 &&
        !soundHintDismissed.value &&
        Boolean(currentVideoUrl.value) &&
        !videoFailed.value
);

watch(currentIndex, () => {
    videoFailed.value = false;
});

const stopVideo = () => {
    if (!videoRef.value) return;
    videoRef.value.pause();
    videoRef.value.currentTime = 0;
};

const playFromStart = () => {
    setTimeout(() => {
        if (!videoRef.value) return;
        videoRef.value.currentTime = 0;
        videoRef.value.play();
    }, 0);
};

// По макету на видео нужно нажать, чтобы услышать звук: автоплей браузеры пускают только без него.
const playWithSound = () => {
    if (!videoRef.value) return;
    soundHintDismissed.value = true;
    videoRef.value.muted = false;
    playFromStart();
};

const replay = () => {
    if (activeSide.value === 'word') {
        activeSide.value = 'video';
    }
    playFromStart();
};

const goPrevious = () => {
    if (activeSide.value === 'word') {
        activeSide.value = 'video';
        playFromStart();
        return;
    }

    stopVideo();
    currentIndex.value -= 1;
    activeSide.value = 'video';
};

const goNext = async () => {
    if (activeSide.value === 'video') {
        stopVideo();
        activeSide.value = 'word';
        return;
    }

    if (saving.value) return;
    saving.value = true;

    try {
        const result = await onboarding.completeWord(currentCard.value.id);
        stopVideo();

        // Третье слово закрывает сектор — показываем видео «сектор восстановлен».
        if (result?.sector_completed) {
            emit('change-component', 'OnboardingOutroVideo');
            return;
        }

        if (currentIndex.value >= cards.value.length - 1) {
            goToStep();
            return;
        }

        currentIndex.value += 1;
        activeSide.value = 'video';
    } finally {
        saving.value = false;
    }
};

onMounted(async () => {
    await onboarding.loadContent();

    // Продолжаем с того слова, на котором остановились до перезагрузки.
    const completed = onboarding.wordsCompleted;
    if (completed > 0 && completed < cards.value.length) {
        currentIndex.value = completed;
    }

    loading.value = false;

    // Событие про первую карточку — только если она действительно первая.
    if (cards.value.length && currentIndex.value === 0) {
        trackEventOnce(FRONT_EVENTS.FIRST_WORD_STARTED, { card_id: currentCard.value.id });
    }
});

onBeforeUnmount(stopVideo);
</script>

<style scoped lang="scss">
// Геометрия и типографика — из макета, кадр 375×812: светлая «шторка» #f6f6fe от 75px
// со скруглением 40px, карточка 314×463 @ (30.5, 158), кнопки 249px @ top 642,
// подсказка — затемнение 80% + иконка руки 35×35 @ (170, 377) + текст 18px @ top 434.
.onboarding-lesson {
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
    min-height: 100dvh;
    position: relative;
    overflow: hidden;

    &__sheet {
        position: absolute;
        top: 9.2%;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 40px 40px 0 0;
        background: #f6f6fe;
        z-index: 0;
    }

    &__skip {
        position: absolute;
        top: 19px;
        right: 19px;
        z-index: 5;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 132px;
        height: 31px;
        border: 0;
        border-radius: 16px;
        padding: 0 24px;
        background: rgba(211, 206, 255, 0.2);
        color: #ffffff;
        font-size: 18px;
        font-weight: 600;
        line-height: 1.2;
    }

    &__loader {
        position: absolute;
        left: 50%;
        top: 45%;
        transform: translateX(-50%);
        z-index: 2;
    }

    &__deck {
        position: absolute;
        z-index: 1;
        pointer-events: none;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        &--left {
            left: -19.3%;
            top: 12.4%;
            width: 88.1%;
            height: 51.1%;
        }

        &--right {
            left: 18.4%;
            top: 14.5%;
            width: 94.3%;
            height: 54.1%;
        }
    }

    &__card {
        position: absolute;
        left: 50%;
        top: 19.5%;
        transform: translateX(-50%);
        z-index: 2;
        perspective: 1000px;
        height: 57%;
        aspect-ratio: 314 / 463;
        max-width: 83.7%;
    }

    &__card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        transition: transform 0.8s ease-in-out;
    }

    &__card.flipped &__card-inner {
        transform: rotateY(180deg);
    }

    &__card-side {
        position: absolute;
        inset: 0;
        backface-visibility: hidden;
    }

    &__card-back {
        transform: rotateY(180deg);
    }

    &__video-card {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 20px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ffffff;
        background-image: url('@/assets/lesson/word_card_bg.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
    }

    &__video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &__placeholder {
        max-width: 230px;
        margin: 0;
        color: #262060;
        font-size: 32px;
        font-weight: 800;
        line-height: 1.15;
        text-align: center;
    }

    &__coach {
        position: absolute;
        inset: 0;
        z-index: 6;
        background: rgba(0, 0, 0, 0.8);
    }

    &__coach-hand {
        position: absolute;
        left: 45.3%;
        top: 46.4%;
        width: 35px;
        height: 35px;
    }

    &__coach-text {
        position: absolute;
        left: 50%;
        top: 53.4%;
        transform: translateX(-50%);
        width: 83.7%;
        margin: 0;
        color: #ffffff;
        font-size: 18px;
        font-weight: 600;
        line-height: 1.2;
        text-align: center;
    }

    // В макете (узел 5150:36016) ряд 249×40 — это ДВЕ кнопки по содержимому:
    // «Повторить» 114 (текст 84 + паддинги 15) и «Продолжить» 127 (текст 100 + 13.5),
    // зазор 10. Раньше тут стояли `flex: 1; min-width: 0` на фиксированной ширине 249,
    // и когда появлялась третья кнопка — стрелка «назад», флекс ужимал «Продолжить»
    // до 92.5px при 99.7px текста: подпись вылезала за края градиента.
    // Поэтому ряд теперь по содержимому, а кнопки не ужимаются.
    &__buttons {
        position: absolute;
        left: 50%;
        top: 79%;
        transform: translateX(-50%);
        z-index: 3;
        width: fit-content;
        max-width: calc(100% - 24px);
        display: flex;
        align-items: center;
        gap: 10px;

        .button {
            flex: 0 0 auto;
            height: 40px;
            padding: 12px 15px;
            font-size: 16px;
            font-weight: 600;
            line-height: 1.2;
            border-radius: 16px;
            white-space: nowrap;
        }

        .button--blue {
            // В макете «Продолжить» 127px при тексте 100 — паддинг 13.5, а не 15.
            padding-inline: 13.5px;
            background: linear-gradient(to right, #355cd5, #714ab4);
            color: #ffffff;
        }

        .button--white {
            // Рамка 2px входит в ширину (border-box), а в макете «Повторить» — 114px
            // при тексте 84 и отступе до текста 15. Значит паддинг 13 + рамка 2.
            padding-inline: 13px;
            background-color: transparent;
            color: #262060;
            border: 2px solid #311d5d;
        }
    }

    &__arrow {
        width: 40px;
        padding: 6px !important;

        img {
            width: 24px;
        }
    }

    &__empty {
        position: absolute;
        left: 50%;
        top: 45%;
        transform: translateX(-50%);
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 18px;
        text-align: center;

        p {
            margin: 0;
            color: #311d5d;
            font-size: 20px;
            font-weight: 700;
        }

        img {
            width: 23px;
        }
    }
}
</style>
