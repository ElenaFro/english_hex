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
            :disabled="selectedOptions.includes(option)"
            :class="[
                'button button--white',
                selectedOptions.includes(option) && option !== currentQuestion.correctAnswer
                    ? 'button--wrong'
                    : '',
                selectedOptions.includes(option) && option === currentQuestion.correctAnswer
                    ? 'button--correct'
                    : '',
            ]"
        >
            {{ option }}
        </button>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import ImgPage from './ImgPage.vue';
import { useRouter, useRoute } from 'vue-router';
import AnswersPage from '@/components/wordTwinkle/AnswersPage.vue';
import { useGamesStore } from '@/stores/games';
import { useCategoriesStore } from '@/stores/categories';

const router = useRouter();
const route = useRoute();
const activeComponent = ref('ImgPage');
const showAnswer = ref(false);
const answerList = ref([]);
const currentIndex = ref(0);
const selectedOptions = ref([]);
const wrongCount = ref(0);
const everPlayedGame = ref(null);
const chosedCategoryId = computed(() => useCategoriesStore().chosedCategory?.id || route.query.id);

const emit = defineEmits(['wrong-answer', 'game-finished']);

const currentQuestion = computed(() => {
    const question = answerList.value[currentIndex.value] || {};
    return {
        id: question.id || null,
        image: `http://62.109.0.225:8000/storage/categories/${chosedCategoryId.value}/cards/${question.id}/word_image/${question.card_photo}`,
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
	activeComponent.value = 'AnswersPage'
	setTimeout(() => {
		showAnswers()
	}, 800)
}

const showAnswers = () => {
    if (activeComponent.value === 'AnswersPage') {
        showAnswer.value = true;
    }
};

const checkAnswer = (option) => {
    if (!selectedOptions.value.includes(option)) {
        selectedOptions.value.push(option);
    }

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
    if (currentIndex.value < answerList.value.length - 1) {
        currentIndex.value += 1;
        selectedOptions.value = [];
        showAnswer.value = false;
        activeComponent.value = 'ImgPage';

        setTimeout(goToAnswers, 4000);
    } else {
        await checkFirstGame();
        if (everPlayedGame.value === true) {
            goToResult();
        } else {
            router.push({ name: 'myPlanet' });
        }
    }
};

const checkFirstGame = async () => {
    try {
        await useUserStore().fetchUser();
        everPlayedGame.value = useUserStore().getCurrentUser().ever_played_game;
    } catch (error) {
        console.error('Error checking first game:', error);
    }
};

const goToResult = () => {
    emit('game-finished');
    router.push({ name: 'gameResult', query: { wrong: wrongCount.value, from: 'wordTwinkle' } });
};
</script>

<style scoped>
.flip-card {
    perspective: 1000px;
    height: 463px;
    position: relative;
    margin: auto;
    margin-bottom: 20px;
    width: 100%;
}

.flip-card__inner {
	position: relative;
	width: 100%;
	min-height: 100%;
	transform-style: preserve-3d;
	transition: transform 0.8s ease-in-out;
	display: flex;
}

.flip-card.flipped .flip-card__inner {
	transform: rotateY(180deg);
}

.flip-card__side {
	width: 100%;
	backface-visibility: hidden;
	flex-shrink: 0;
	flex-grow: 1;
}

.flip-card__front {
	z-index: 2;
}

.flip-card__back {
	transform: rotateY(180deg);
	position: absolute;
	top: 0;
	left: 0;
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
	color: #FFFFFF;
}

.button--correct {
	border: 0;
	background-color: #31AF40;
	color: #FFFFFF;
}
</style>