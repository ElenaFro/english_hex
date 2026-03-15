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
        <AnswerOptionButton
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            @click="checkAnswer(option)"
            :disabled="selectedOption === option && option === currentQuestion.correctAnswer"
            :state="getOptionState(option)"
            size="sm"
            class="answer-btn"
        >
            {{ option }}
        </AnswerOptionButton>
    </div>
</template>

<script setup>
//vue
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
//components
import ImgPage from './ImgPage.vue';
import AnswersPage from '@/components/wordTwinkle/AnswersPage.vue';
import AnswerOptionButton from '@/components/ui/AnswerOptionButton.vue';
//stores
import { useGamesStore } from '@/stores/games';
import { useCategoriesStore } from '@/stores/categories';
import { useUserStore } from '@/stores/user';

const props = defineProps({
    questions: { type: Array, default: null },
    isInfinity: { type: Boolean, default: false },
});
const emit = defineEmits(['wrong-answer', 'game-finished', 'question-opened', 'image-opened', 'finish']);

const router = useRouter();
const route = useRoute();
const currentUser = useUserStore().user;
const activeComponent = ref('ImgPage');
const showAnswer = ref(false);
const answerList = ref([]);
const currentIndex = ref(0);
const selectedOption = ref(null);
const wrongCount = ref(0);
const correctCount = ref(0);
const everPlayedGame = ref(currentUser.ever_played_game);
const selectedCategoryId = computed(
    () => useCategoriesStore().selectedCategory?.id || route.query.id
);

const resolveImage = (question) => {
    if (!question) return '';
    if (question.image) return question.image;
    if (typeof question.card_photo === 'string') {
        if (/^https?:\/\//i.test(question.card_photo)) return question.card_photo;
        if (question.card_photo.startsWith('/')) return question.card_photo;
    }

    const categoryId =
        question.category_id ||
        question.categoryId ||
        (typeof question.category === 'number' ? question.category : null) ||
        selectedCategoryId.value ||
        null;
    if (categoryId) {
        return `${import.meta.env.VITE_STORAGE_URI}/${categoryId}/cards/${question.id}/word_image/${question.card_photo}`;
    }
    if (question.id && question.card_photo) {
        return `${import.meta.env.VITE_STORAGE_URI}/cards/${question.id}/word_image/${question.card_photo}`;
    }
    if (question.card_photo) {
        return `${import.meta.env.VITE_STORAGE_URI}/${question.card_photo}`;
    }
    return '';
};

const currentQuestion = computed(() => {
    const question = answerList.value[currentIndex.value] || {};
    return {
        id: question.id || null,
        image: resolveImage(question),
        correctAnswer: question.correctAnswer ?? question.correct_answer ?? '',
        options: question.options || [],
    };
});

onMounted(async () => {
    if (props.questions?.length) {
        answerList.value = props.questions;
    } else {
        try {
            answerList.value = await useGamesStore().getWordForTwinkleGame(
                selectedCategoryId.value
            );
        } catch (error) {
            console.error('Error fetching game data:', error);
        }
    }
    emit('image-opened');
    setTimeout(goToAnswers, 4000);
});

const goToAnswers = () => {
    activeComponent.value = 'AnswersPage';
    emit('question-opened');

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
        correctCount.value += 1;
        setTimeout(() => {
            goToNext();
        }, 1000);
    }
};

const goToNext = async () => {
    if (currentIndex.value >= answerList.value.length - 1) return goToResult();
    emit('image-opened');
    currentIndex.value += 1;
    selectedOption.value = null;
    showAnswer.value = false;
    activeComponent.value = 'ImgPage';
    setTimeout(goToAnswers, 2000);
};

const goToResult = () => {
    emit('image-opened');
    emit('game-finished');
    if (props.isInfinity) {
        emit('finish', { correctCount: correctCount.value, wrongCount: wrongCount.value });
        return;
    }
    router.push({
        name: 'gameResult',
        query: {
            wrong: wrongCount.value,
            from: 'wordTwinkle',
            gameSource: 'flickering_words',
            id: route.query.id || useCategoriesStore().selectedCategory.id,
        },
    });
};

const getOptionState = (option) => {
    if (selectedOption.value !== option) return 'default';
    return option === currentQuestion.value.correctAnswer ? 'correct' : 'wrong';
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
    z-index: 1000;
}

.answer-btn {
    width: 140px;
}
</style>
