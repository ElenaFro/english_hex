<template>
    <div class="flip-card" :class="{ flipped: activeComponent === 'AnswersPage' }">
        <div class="flip-card__inner">
            <div class="flip-card__side flip-card__front">
                <ImgPage :src="currentQuestion.image" />
            </div>
            <div class="flip-card__side flip-card__back">
                <AnswersPage />
            </div>
        </div>
    </div>
    <div v-if="showAnswer" class="answer-container">
        <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            @click="checkAnswer(option)"
            :disabled="selectedOption === option && option === currentQuestion.correctAnswer"
            :class="[
                'button button--white',
                selectedOption === option && option !== currentQuestion.correctAnswer
                    ? 'button--wrong'
                    : '',
                selectedOption === option && option === currentQuestion.correctAnswer
                    ? 'button--correct'
                    : '',
            ]"
        >
            {{ option }}
        </button>
    </div>
</template>

<script setup>
//vue
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
//components
import ImgPage from './ImgPage.vue';
import AnswersPage from '@/components/wordTwinkle/AnswersPage.vue';
//stores
import { useGamesStore } from '@/stores/games';
import { useCategoriesStore } from '@/stores/categories';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const route = useRoute();
const currentUser = useUserStore().user;
const activeComponent = ref('ImgPage');
const showAnswer = ref(false);
const answerList = ref([]);
const currentIndex = ref(0);
const selectedOption = ref(null);
const wrongCount = ref(0);
const everPlayedGame = ref(currentUser.ever_played_game);
const chosedCategoryId = computed(() => useCategoriesStore().chosedCategory?.id || route.query.id);

const emit = defineEmits(['wrong-answer', 'game-finished']);

const currentQuestion = computed(() => {
    const question = answerList.value[currentIndex.value] || {};
    return {
        id: question.id || null,
        image: `${import.meta.env.VITE_STORAGE_URI}/${chosedCategoryId.value}/cards/${question.id}/word_image/${question.card_photo}`,
        correctAnswer: question.correctAnswer || '',
        options: question.options || [],
    };
});

onMounted(async () => {
    try {
        answerList.value = await useGamesStore().getWordForTwinkleGame(chosedCategoryId.value);
    } catch (error) {
        console.error('Error fetching game data:', error);
    }
    setTimeout(goToAnswers, 4000);
});

const goToAnswers = () => {
    activeComponent.value = 'AnswersPage';
    setTimeout(() => {
        showAnswers();
    }, 800);
};

const showAnswers = () => {
    if (activeComponent.value === 'AnswersPage') {
        showAnswer.value = true;
    }
};

const checkAnswer = (option) => {
    selectedOption.value = option;

    if (option !== currentQuestion.value.correctAnswer) {
        wrongCount.value++;
        emit('wrong-answer', 1);
    }

    if (option === currentQuestion.value.correctAnswer) {
        setTimeout(() => {
            goToNext();
        }, 1000);
    }
};

const goToNext = async () => {
    if (currentIndex.value >= answerList.value.length - 1) return goToResult();
    currentIndex.value += 1;
    selectedOption.value = null;
    showAnswer.value = false;
    activeComponent.value = 'ImgPage';
    setTimeout(goToAnswers, 2000);
};

const goToResult = () => {
    emit('game-finished');
    router.push({
        name: 'gameResult',
        query: {
            wrong: wrongCount.value,
            from: 'wordTwinkle',
            gameSource: 'flickering_words',
            id: route.query.id || useCategoriesStore().chosedCategory.id,
        },
    });
};
</script>

<style scoped>
.flip-card {
    perspective: 1000px;
    width: 100%;
    max-width: 356px;
    aspect-ratio: 3 / 4;
    position: relative;
    flex-shrink: 0;
    max-height: 50dvh;
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

.answer-container {
    align-self: center;
    width: 100%;
    max-width: 315px;
    display: grid;
    grid-template-rows: repeat(2, 40px);
    grid-template-columns: repeat(2, 140px);
    row-gap: 10px;
    justify-content: space-between;
    margin-top: 2dvh;
}

.button {
    width: 140px;
    height: 40px;
    border: 2px solid #262060;
    font-weight: 700;
}

.button--wrong {
    border: 0;
    background-color: #881717;
    color: #ffffff;
}

.button--correct {
    border: 0;
    background-color: #31af40;
    color: #ffffff;
}
</style>
