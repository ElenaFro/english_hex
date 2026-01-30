<template>
    <div class="page-content">
        <div class="scroll-container context-game">
            <p class="context-game__timer">
                <span>{{ timeText }}</span>
                <span v-if="showPenalty" class="context-game__timer-penalty">+ 1 сек</span>
            </p>

            <section class="context-card">
                <div class="context-card__content">
                    <p class="context-card__ru">{{ current.ru }}</p>
                    <p class="context-card__en">{{ current.en }}</p>

                    <p
                        class="context-card__gap"
                        :class="{ 'context-card__gap--placeholder': isGapPlaceholder }"
                    >
                        __<span class="context-card__gap-value">{{ gapValue }}</span>__
                    </p>
                </div>

                <img class="context-card__girl" :src="girlHead" alt="" />
            </section>

            <section class="context-game__answers">
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
import { useUserStore } from '@/stores/user';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategoriesStore } from '@/stores/categories';
import AnswerOptionButton from '@/components/ui/AnswerOptionButton.vue';
import girlHead from '@/assets/Di_avatar/girl_head.png';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

onMounted(() => {
    userStore.setHeaderTitle('Контекст');
});

onBeforeUnmount(() => {
    userStore.setHeaderTitle(null);
});

const questions = ref([
    {
        id: 1,
        ru: 'Я иду в школу',
        en: "I'm going to",
        correct: 'School',
        options: ['School', 'House', 'Street', 'Café'],
    },
    {
        id: 2,
        ru: 'Я пью кофе',
        en: "I'm drinking",
        correct: 'Café',
        options: ['School', 'Café', 'House', 'Street'],
    },
]);

const currentIndex = ref(0);
const selectedOption = ref(null);
const buttonsLocked = ref(false);
const wrongCount = ref(0);

const seconds = ref(0);
const showPenalty = ref(false);
let timerId = null;

onMounted(() => {
    timerId = window.setInterval(() => {
        seconds.value += 1;
    }, 1000);
});

onBeforeUnmount(() => {
    if (timerId) window.clearInterval(timerId);
});

const current = computed(() => questions.value[currentIndex.value] || { ru: '', en: '', options: [] });

const isCorrectAnswered = computed(
    () => selectedOption.value && selectedOption.value === current.value.correct
);

const gapValue = computed(() => selectedOption.value || '?');
const isGapPlaceholder = computed(() => !selectedOption.value);

const timeText = computed(() => `${seconds.value} сек`);

const getOptionState = (option) => {
    if (selectedOption.value !== option) return 'default';
    return option === current.value.correct ? 'correct' : 'wrong';
};

const next = () => {
    if (currentIndex.value >= questions.value.length - 1) {
        return goToResult();
    }

    currentIndex.value += 1;
    selectedOption.value = null;
    buttonsLocked.value = false;
};

const categoryId = computed(() => route.query.id || useCategoriesStore().chosedCategory?.id);

const goToResult = () => {
    router.push({
        name: 'gameResult',
        query: {
            wrong: wrongCount.value,
            from: 'galaxyPhrasesGame',
            gameSource: 'galaxy_phrases',
            id: categoryId.value,
        },
    });
};

const onPick = (option) => {
    if (buttonsLocked.value) return;

    selectedOption.value = option;

    if (option === current.value.correct) {
        buttonsLocked.value = true;
        window.setTimeout(() => {
            next();
        }, 900);
        return;
    }

    wrongCount.value += 1;
    seconds.value += 1;
    showPenalty.value = true;
    buttonsLocked.value = true;
    window.setTimeout(() => {
        selectedOption.value = null;
        buttonsLocked.value = false;
        showPenalty.value = false;
    }, 650);
};
</script>

<style scoped lang="scss">
.context-game {
    align-items: center;
    padding-top: 6px;

    &__timer {
        margin: 0 0 26px;
        font-weight: 700;
        font-size: 18px;
        line-height: 1.2;
        color: #262060;
        text-align: center;
    }

    &__timer-penalty {
        margin-left: 10px;
        color: #881717;
        font-weight: 800;
    }

    &__answers {
        width: 100%;
        max-width: 315px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        justify-content: space-between;
        margin-top: 36px;
    }

    &__answer {
        width: 140px;
        justify-self: center;
    }
}

.context-card {
    width: 100%;
    max-width: 315px;
    height: min(52dvh, 420px);
    border-radius: 24px;
    border: 3px solid #262060;
    background-color: #ffffff;
    background-image: url('@/assets/lesson/word_card_bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
    min-height: 386px;

    &__content {
        position: absolute;
        inset: 0;
        padding: 18px 16px 150px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    &__ru {
        margin: 0;
        font-weight: 800;
        font-size: 35px;
        line-height: 1.2;
        color: #262060;
        text-align: center;
    }

    &__en {
        margin: 0;
        font-weight: 800;
        font-size: 40px;
        line-height: 1.2;
        color: #262060;
        text-align: center;
        opacity: 0.95;
    }

    &__gap {
        margin: 0;
        font-weight: 800;
        font-size: 28px;
        line-height: 1.2;
        color: #262060;
        text-align: center;
    }

    &__gap--placeholder {
        color: #881717;
    }

    &__gap-value {
        display: inline-block;
        min-width: 32px;
        text-align: center;
        color: #881717;
    }

    &__girl {
        position: absolute;
        left: 60%;
        bottom: -37px;
        transform: translateX(-50%);
        width: min(52dvw, 210px);
        height: auto;
        pointer-events: none;
        user-select: none;
    }
}
</style>
