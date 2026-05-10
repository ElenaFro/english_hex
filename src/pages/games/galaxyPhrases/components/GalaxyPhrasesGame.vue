<template>
    <div class="page-content">
        <div class="scroll-container context-game">
            <!-- Таймер / Предпросмотр -->
            <p class="context-game__timer">
                <span v-if="isPreview">Предпросмотр</span>
                <template v-else>
                    <span>{{ seconds }} сек</span>
                    <span v-if="showPenalty" class="context-game__timer-penalty">+ 1 сек</span>
                </template>
            </p>

            <!-- Карточка -->
            <section v-if="current" class="context-card">
                <div class="context-card__content">
                    <!-- Русское предложение -->
                    <p class="context-card__ru">{{ current.sentence_ru }}</p>

                    <!-- Английское предложение с пропуском -->
                    <p class="context-card__en">
                        <span v-if="current.enBefore">{{ current.enBefore }} </span>
                        <span class="context-card__blank" :class="blankClass">{{
                            blankDisplay
                        }}</span>
                        <span v-if="current.enAfter"> {{ current.enAfter }}</span>
                    </p>
                </div>

                <!-- Иконка звука — появляется после правильного ответа -->
                <button
                    v-if="showAudioBtn && current.audioUrl"
                    class="context-card__audio-btn"
                    :class="{ 'context-card__audio-btn--active': audioPlaying }"
                    @click="playAudio"
                >
                    <img src="@/assets/img/sound-icon.svg" alt="audio" />
                </button>

                <!-- Голова девочки -->
                <img class="context-card__girl" :src="girlHead" alt="" />
            </section>

            <!-- Варианты ответа -->
            <section v-if="current" class="context-game__answers">
                <AnswerOptionButton
                    v-for="option in current.options"
                    :key="option"
                    class="context-game__answer"
                    size="sm"
                    :state="getOptionState(option)"
                    :disabled="buttonsLocked || isCorrectAnswered"
                    @click="onPick(option)"
                >
                    {{ option }}
                </AnswerOptionButton>
            </section>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategoriesStore } from '@/stores/categories';
import { useGamesStore } from '@/stores/games';
import { useUserStore } from '@/stores/user';
import AnswerOptionButton from '@/components/ui/AnswerOptionButton.vue';
import girlHead from '@/assets/Di_avatar/girl_head.png';

const props = defineProps({
    questions: { type: Array, default: null },
    isInfinity: { type: Boolean, default: false },
    isPreview: { type: Boolean, default: false },
});
const emit = defineEmits(['finish']);

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

// ─── Заголовок хедера ────────────────────────────────────────────────────────
onMounted(() => {
    if (!props.isInfinity) userStore.setHeaderTitle('Галактика фраз');
});
onBeforeUnmount(() => {
    if (!props.isInfinity) userStore.setHeaderTitle(null);
    stopTimer();
    clearPostCorrectTimer();
    stopAudio();
});

// ─── Данные ─────────────────────────────────────────────────────────────────
const BLANK_MARKERS = ['___?___', '___'];

const splitSentence = (sentence) => {
    for (const marker of BLANK_MARKERS) {
        const idx = sentence.indexOf(marker);
        if (idx !== -1) {
            return [
                sentence.slice(0, idx).trimEnd(),
                sentence.slice(idx + marker.length).trimStart(),
            ];
        }
    }
    return [sentence, ''];
};

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const normalizeQuestion = (item) => {
    const [enBefore, enAfter] = splitSentence(item.sentence_en ?? item.en ?? '');
    const correct = item.correct_answer ?? item.correct ?? '';
    const wrong = Array.isArray(item.wrong_answers) ? item.wrong_answers : [];
    const options = shuffle([correct, ...wrong]).filter(Boolean);

    // Аудио URL: File/Blob → objectURL, http-строка → as is, иначе строим путь
    let audioUrl = null;
    if (item.audio) {
        if (item.audio instanceof File || item.audio instanceof Blob) {
            audioUrl = URL.createObjectURL(item.audio);
        } else if (String(item.audio).startsWith('http')) {
            audioUrl = item.audio;
        } else {
            audioUrl = `${import.meta.env.VITE_STORAGE_URI}/phrase-galaxy-sentences/${item.id}/audio/${item.audio}`;
        }
    }

    return {
        id: item.id,
        sentence_ru: item.sentence_ru ?? item.ru ?? '',
        enBefore,
        enAfter,
        correct,
        options,
        audioUrl,
    };
};

const questions = ref([]);

onMounted(async () => {
    if (props.questions?.length) {
        questions.value = props.questions.map(normalizeQuestion);
        return;
    }
    try {
        const isAllCategories = route.query.allCategories === 'true';
        const categoryId = route.query.id || useCategoriesStore().selectedCategory?.id;
        const raw = isAllCategories
            ? await useGamesStore().getWordForGalaxyPhrasesAllCategories()
            : categoryId
              ? await useGamesStore().getWordForGalaxyPhrasesGame(categoryId)
              : [];
        questions.value = (Array.isArray(raw) ? raw : []).map(normalizeQuestion);
    } catch (e) {
        console.error('Ошибка загрузки Галактики фраз:', e);
    }
});

// ─── Состояние игры ───────────────────────────────────────────────────────────
const currentIndex = ref(0);
const selectedOption = ref(null);
const optionStates = ref({});
const buttonsLocked = ref(false);
const wrongCount = ref(0);
const correctCount = ref(0);

const current = computed(() => questions.value[currentIndex.value] ?? null);

const isCorrectAnswered = computed(
    () => selectedOption.value !== null && selectedOption.value === current.value?.correct
);

// ─── Таймер ───────────────────────────────────────────────────────────────────
const seconds = ref(0);
const showPenalty = ref(false);
let timerId = null;

const startTimer = () => {
    if (timerId || props.isPreview) return;
    timerId = window.setInterval(() => {
        seconds.value += 1;
    }, 1000);
};

const stopTimer = () => {
    if (timerId) {
        window.clearInterval(timerId);
        timerId = null;
    }
};

onMounted(() => {
    if (!props.isPreview) startTimer();
});

// ─── Отображение пропуска ─────────────────────────────────────────────────────
const blankDisplay = computed(() => {
    if (!selectedOption.value) return '_?_';
    return selectedOption.value;
});

const blankClass = computed(() => {
    if (!selectedOption.value) return 'context-card__blank--placeholder';
    if (selectedOption.value === current.value?.correct) return 'context-card__blank--correct';
    return 'context-card__blank--wrong';
});

// ─── Состояние кнопки ответа ──────────────────────────────────────────────────
const getOptionState = (option) => optionStates.value[option] ?? 'default';

// ─── Аудио ────────────────────────────────────────────────────────────────────
const showAudioBtn = ref(false);
const audioPlaying = ref(false);
let audioInstance = null;

const stopAudio = () => {
    if (audioInstance) {
        audioInstance.pause();
        audioInstance.onended = null;
        audioInstance = null;
    }
    audioPlaying.value = false;
};

const playAudio = () => {
    if (!current.value?.audioUrl || audioPlaying.value) return;

    // Останавливаем 5-секундный таймер — ждём пока аудио не закончится
    clearPostCorrectTimer();
    stopAudio();

    audioPlaying.value = true;
    audioInstance = new Audio(current.value.audioUrl);
    audioInstance.play().catch(() => {
        audioPlaying.value = false;
    });
    audioInstance.onended = () => {
        audioPlaying.value = false;
        audioInstance = null;
        // После окончания аудио — ещё 5 секунд паузы, потом следующее задание
        startPostCorrectTimer();
    };
};

// ─── Задержка после правильного ответа (5 сек) ───────────────────────────────
let postCorrectTimer = null;

const startPostCorrectTimer = () => {
    clearPostCorrectTimer();
    postCorrectTimer = window.setTimeout(() => {
        postCorrectTimer = null;
        next();
    }, 3000);
};

const clearPostCorrectTimer = () => {
    if (postCorrectTimer) {
        window.clearTimeout(postCorrectTimer);
        postCorrectTimer = null;
    }
};

// ─── Навигация ────────────────────────────────────────────────────────────────
const next = () => {
    stopAudio();
    showAudioBtn.value = false;

    if (currentIndex.value >= questions.value.length - 1) {
        return goToResult();
    }
    currentIndex.value += 1;
    selectedOption.value = null;
    optionStates.value = {};
    buttonsLocked.value = false;
    startTimer();
};

const categoryId = computed(() => route.query.id || useCategoriesStore().selectedCategory?.id);

const goToResult = () => {
    stopTimer();
    // В режиме предпросмотра — возвращаемся к первому вопросу
    if (props.isPreview) {
        emit('finish');
        return;
    }
    if (props.isInfinity) {
        emit('finish', { correctCount: correctCount.value, wrongCount: wrongCount.value });
        return;
    }
    const resultQuery = {
        wrong: wrongCount.value,
        from: 'galaxyPhrasesGame',
        gameSource: 'phrase_galaxy',
        id: categoryId.value,
    };
    if (route.query.allCategories) resultQuery.allCategories = route.query.allCategories;
    router.push({ name: 'gameResult', query: resultQuery });
};

// ─── Выбор ответа ────────────────────────────────────────────────────────────
const onPick = (option) => {
    if (buttonsLocked.value || isCorrectAnswered.value) return;

    selectedOption.value = option;

    if (option === current.value?.correct) {
        optionStates.value = { [option]: 'correct' };
        correctCount.value += 1;
        buttonsLocked.value = true;
        stopTimer();
        showAudioBtn.value = true;
        startPostCorrectTimer();
        return;
    }

    // Неправильный ответ
    optionStates.value = { [option]: 'wrong' };
    wrongCount.value += 1;
    seconds.value += 1;
    showPenalty.value = true;
    buttonsLocked.value = true;

    window.setTimeout(() => {
        selectedOption.value = null;
        optionStates.value = {};
        buttonsLocked.value = false;
        showPenalty.value = false;
    }, 800);
};
</script>

<style scoped lang="scss">
.page-content {
    width: 100%;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    padding-top: 20px;
}

.scroll-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    overflow: hidden;
}

.context-game {
    &__timer {
        margin: 0 0 16px;
        font-weight: 700;
        font-size: 18px;
        line-height: 1.2;
        color: #262060;
        text-align: center;
    }

    &__timer-penalty {
        margin-left: 8px;
        color: #881717;
        font-weight: 800;
    }

    &__answers {
        width: 100%;
        max-width: 315px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin-top: 20px;
    }

    &__answer {
        width: 100%;
    }
}

.context-card {
    width: 100%;
    max-width: 315px;
    height: min(52dvh, 420px);
    min-height: 340px;
    border-radius: 24px;
    border: 3px solid #262060;
    background-color: #ffffff;
    background-image: url('@/assets/lesson/word_card_bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;

    &__content {
        position: absolute;
        inset: 0;
        padding: 20px 16px 150px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
    }

    &__ru {
        margin: 0;
        font-weight: 700;
        font-size: 24px;
        line-height: 1.3;
        color: #262060;
        text-align: center;
    }

    &__en {
        margin: 0;
        font-weight: 800;
        font-size: 24px;
        line-height: 1.3;
        color: #262060;
        text-align: center;
        word-break: break-word;
    }

    &__blank {
        display: inline-block;
        font-weight: 800;
        font-size: 20px;
        padding: 0 4px;
        min-width: 40px;
        text-align: center;

        &--placeholder {
            color: #881717;
            font-size: 34px;
            margin: 0 10px;
        }

        &--correct {
            color: #2e8b57;
            font-size: 24px;
        }

        &--wrong {
            color: #c6070b;
        }
    }

    // Иконка звука — слева от девочки
    &__audio-btn {
        position: absolute;
        bottom: 24px;
        left: 16px;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 2px solid #262060;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
        transition: background 0.2s;

        img {
            width: 22px;
            height: 22px;
        }

        &--active {
            background: #262060;

            img {
                filter: brightness(10);
            }
        }
    }

    // Голова девочки
    &__girl {
        position: absolute;
        left: 68%;
        bottom: -37px;
        transform: translateX(-50%);
        width: min(52dvw, 177px);
        height: auto;
        pointer-events: none;
        user-select: none;
    }
}
</style>
