<template>
    <div class="relative all">
        <loader v-if="!questions.length" class="loader" />
        <section v-else>
            <img
                src="@/assets/img/Games/метеор_small.png"
                alt="meteor"
                class="meteor"
                :style="{ top: meteorTop, right: meteorRight, width: meteorWidth }"
            />
            <section class="page-container">
                <section class="image-section_game">
                    <div class="image-container">
                        <img src="@/assets/img/Games/Планеты_big.png" alt="planet" class="planet" />
                    </div>
                </section>
                <button class="page-container__game" @click="playSound">
                    <p class="question">?</p>
                    <img src="@/assets/img/Games/sound.svg" alt="sound" class="sound1" />
                </button>
                <audio ref="soundRef"></audio>
                <section class="page-container__button" v-if="currentQuestion.options">
                    <div
                        class="line"
                        v-for="(option, index) in currentQuestion.options"
                        :key="index"
                    >
                        <AnswerOptionButton
                            class="answer-button"
                            :style="buttonStyles[index]"
                            :disabled="!isQuestionPlayed"
                            size="md"
                            @click="sendAnswer(option)"
                        >
                            {{ option }}
                        </AnswerOptionButton>
                    </div>
                </section>
            </section>
        </section>
    </div>
</template>
<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue';
import { onBeforeUnmount } from 'vue';
import { useUserStore } from '@/stores/user';
import { useCategoriesStore } from '@/stores/categories';
import { useGamesStore } from '@/stores/games';
import { useRoute } from 'vue-router';
import Loader from '../Loader.vue';
import AnswerOptionButton from '@/components/ui/AnswerOptionButton.vue';

const soundRef = ref(null);
const route = useRoute();
const currentUser = useUserStore().getCurrentUser();
const emit = defineEmits(['update:lives', 'update:earnedStars', 'switch-component']);
const lives = ref(5);
const earnedStars = ref(currentUser.rating);
const chosedCategory = computed(() => useCategoriesStore().chosedCategory);
const maxStarsForGame = ref(50);
const meteorWidth = ref('min(18dvw, 74px)');

const categoryId = computed(() => chosedCategory.value.id || route.query.id);

const isQuestionPlayed = ref(false);

const playSound = () => {
    if (soundRef.value) {
        const audioUrl = `${import.meta.env.VITE_STORAGE_URI}/${categoryId.value}/cards/${currentQuestion.value.id}/audio/${currentQuestion.value.audio}`;
        soundRef.value.src = audioUrl;
        soundRef.value.currentTime = 0;
        soundRef.value.play();
        isQuestionPlayed.value = true;
    }
};

const onAudioEnded = () => {
    isQuestionPlayed.value = true;
    const currentQuestionData = currentQuestion.value;
    resetButtonStyles(currentQuestionData, false);
};

const currentQuestionIndex = ref(0);
const questions = ref([]);

const buttonStyles = ref({});

const resetButtonStyles = (currentQuestionData, disableButtons = false) => {
    currentQuestionData.options.forEach((option, index) => {
        buttonStyles.value[index] = {
            backgroundColor: '#fff',
            color: '#262060',
            border: disableButtons
                ? '2px solid rgba(118, 118, 118, 0.3)'
                : '2px solid rgba(49, 29, 93, 1)',
        };
    });
};

const currentQuestion = computed(() => {
    return questions.value[currentQuestionIndex.value] || {};
});

const sendAnswer = (answer) => {
    const currentQuestionData = currentQuestion.value;
    resetButtonStyles(currentQuestionData);
    if (answer === currentQuestionData.correctAnswer) {
        buttonStyles.value[currentQuestionData.options.indexOf(answer)] = {
            backgroundColor: '#31AF40',
            color: '#FFFFFF',
            border: 'none',
        };
        setTimeout(nextQuestion, 1000);
    } else {
        buttonStyles.value[currentQuestionData.options.indexOf(answer)] = {
            backgroundColor: '#881717',
            color: '#FFFFFF',
            border: 'none',
        };
        lives.value--;
        meteorTop.value = `calc(${meteorTop.value} + 3vh)`;
        meteorRight.value = `${parseInt(meteorRight.value) + 8}px`;
        meteorWidth.value = `${parseInt(meteorWidth.value) + 8}px`;

        emit('update:lives', lives.value);
        if (lives.value <= 0) {
            emit('switch-component', 'AttackPlanetLoss');
        }
    }
};

const nextQuestion = () => {
    const currentQuestionData = currentQuestion.value;
    resetButtonStyles(currentQuestionData, true);
    isQuestionPlayed.value = false;

    if (lives.value > 0 && currentQuestionIndex.value < questions.value.length - 1) {
        currentQuestionIndex.value++;
    } else if (
        currentQuestionIndex.value >= questions.value.length - 1 &&
        maxStarsForGame.value === 0
    ) {
        earnedStars.value = 0;
        emit('update:earnedStars', earnedStars.value);
        emit('switch-component', 'AttackPlanetAllStarsGiven');
    } else if (
        lives.value === 5 &&
        currentQuestionIndex.value >= questions.value.length - 1 &&
        maxStarsForGame.value === 50
    ) {
        earnedStars.value = 50;
        emit('update:earnedStars', earnedStars.value);
        emit('switch-component', 'AttackPlanetWin');
    } else if (
        lives.value > 0 &&
        lives.value <= 5 &&
        currentQuestionIndex.value >= questions.value.length - 1 &&
        maxStarsForGame.value > 0
    ) {
        const starsForLives = 50 - 5 * (5 - lives.value);
        earnedStars.value =
            starsForLives > maxStarsForGame.value ? maxStarsForGame.value : starsForLives;
        emit('update:earnedStars', earnedStars.value);
        emit('switch-component', 'AttackPlanetResult');
    } else if (lives.value <= 0) {
        emit('switch-component', 'AttackPlanetLoss');
    }
};

const meteorTop = ref('-25px');
const meteorRight = ref('-4px');

onMounted(async () => {
    if (!chosedCategory.value.id) useCategoriesStore().getChosedCategory(route.query.id);
    try {
        if (soundRef.value) {
            soundRef.value.addEventListener('ended', onAudioEnded);
        }
        if (!chosedCategory.value) return;
        const response = await useGamesStore().fetchDataForPlanetAttack(categoryId.value);

        questions.value = response.map((question) => ({
            id: question.id,
            audio: question.audio,
            correctAnswer: question.correctAnswer,
            options: question.options,
        }));
        if (categoryId.value) {
            const currentStarsForCategory = await useCategoriesStore().getCategoryStars(
                categoryId.value
            );
            maxStarsForGame.value = maxStarsForGame.value - currentStarsForCategory?.planet_attack;
        }
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
});

onBeforeUnmount(() => {
    if (soundRef.value) {
        soundRef.value.removeEventListener('ended', onAudioEnded);
    }
});
</script>
<style scoped lang="scss">
.page-container {
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: transparent;
    width: 100vw;
    max-width: 414px;
    gap: 23px;
    padding-top: 20px;
    &__game {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        width: 173px;
        height: 183px;
        background-color: #ffffff;
        border-radius: 20px;
        border: 3px solid #262060;
        margin-left: 30px;
        margin-right: 30px;
        color: #311d5d;
    }
    &__button {
        display: flex;
        flex-wrap: wrap;
        margin: -5px;
    }
}

.image-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.meteor {
    position: absolute;
    width: min(18dvw, 74px);
    height: auto;
    right: -4px;
    top: -25px;
    z-index: 3000;
}

.image-section_game {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.answer-button {
    width: 100%;
}
.line {
    display: flex;
    width: calc(50% - 12.5px);
    margin: 5px;
}
.question {
    font-weight: 800;
    font-size: 8dvh;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;
    vertical-align: middle;
}
.sound1 {
    width: 43px;
    height: auto;
}
.sound0 {
    border: none;
    background-color: transparent;
}
@media (min-width: 415px) {
    .all,
    .meteor,
    .layout {
        overflow: visible;
    }
}
@media (max-height: 800px) {
    .page-container {
        gap: 18px;
        padding-top: 10px;
    }
}
@media (max-height: 780px) {
    .page-container__game {
        gap: 8px;
        width: 163px;
        height: 173px;
    }
    .page-container {
        gap: 18px;
    }
    .sound1 {
        width: 38px;
        height: auto;
    }
    .planet {
        width: min(46dvw, 200px);
        height: auto;
    }
    .page-container__button {
        margin-bottom: 93px;
    }
}
@media (max-height: 740px) {
    .page-container__game {
        gap: 8px;
        width: 143px;
        height: 153px;
    }
    .page-container {
        gap: 18px;
    }
    .sound1 {
        width: 38px;
        height: auto;
    }
    .page-container__button {
        margin-bottom: 93px;
    }
}
@media (max-height: 668px) {
    .page-container {
        gap: 16px;
    }
    .sound1 {
        width: 34px;
        height: auto;
    }
}
@media (max-height: 600px) {
    .page-container__game {
        gap: 5px;
        width: 130px;
        height: 135px;
    }
    .page-container {
        gap: 12px;
    }
    .sound1 {
        width: 28px;
        height: auto;
    }
    .line {
        display: flex;
        width: calc(50% - 6px);
        margin: 3px;
    }
}

.loader {
    margin: 70% 0;
    min-width: 360px;
    min-height: auto;
}

.page-container__game {
    gap: 7px;
    width: min(80dvw, 315px);
    height: min(22dvh, 238px);
    background-color: #ffffff;
    background-image: url('@/assets/lesson/word_card_bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}
</style>
