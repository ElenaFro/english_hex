<template>
    <div class="flip-card" :class="{ flipped: activeComponent === 'AnswersPage' }">
        <div class="flip-card__inner">
            <div class="flip-card__side flip-card__front">
                <ImgPage />
            </div>
            <div class="flip-card__side flip-card__back">
                <AnswersPage />
            </div>
        </div>
    </div>
    <div v-show="showAnswer" class="answer-container">
        <button
            v-for="item in currentQuestion?.answers"
            :key="item.id"
            @click="checkAnswer(item)"
            :disabled="selectedAnswerIds.includes(item.id)"
            :class="[
                'button button--white',
                selectedAnswerIds.includes(item.id) && !item.isCorrect ? 'button--wrong' : '',
                selectedAnswerIds.includes(item.id) && item.isCorrect ? 'button--correct' : '',
            ]"
        >
            {{ item.text }}
        </button>
    </div>
</template>

<script setup>
import { markFirstGame } from '@/stores/progress';
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router';
import axios from 'axios'
import ImgPage from '@/components/wordTwinkle/ImgPage.vue'
import AnswersPage from '@/components/wordTwinkle/AnswersPage.vue'
import apiClient from '@/api/axios';

const router = useRouter();
const activeComponent = ref('ImgPage');
const showAnswer = ref(false);
const answerList = ref([]);
const currentIndex = ref(0);
const selectedAnswerId = ref(null);
const selectedAnswerIds = ref([]);
const wrongCount = ref(0);
const emit = defineEmits(['wrong-answer', 'game-finished']);

const currentQuestion = computed(() => answerList.value[currentIndex.value]);

onMounted(async () => {
    try {
        const response = await axios.get('/wordTwinkleTest.json');
        answerList.value = response.data;
    } catch {
        console.log('Error', error);
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
    if (activeComponent.value == 'AnswersPage') {
        showAnswer.value = true;
    }
};

const checkAnswer = (item) => {
    if (!selectedAnswerIds.value.includes(item.id)) {
        selectedAnswerIds.value.push(item.id);
    }

    if (!item.isCorrect) {
        wrongCount.value++;
        emit('wrong-answer', 1);
    }

    if (item.isCorrect) {
        setTimeout(() => {
            goToNext();
        }, 1000);
    }
};

const goToNext = async () => {
	if (currentIndex.value < answerList.value.length - 1) {
		currentIndex.value += 1;
		selectedAnswerIds.value = [];
		showAnswer.value = false;
		activeComponent.value = 'ImgPage';

		setTimeout(goToAnswers, 4000)
	} else {
		await chekFirstGame()

		if (everPlayedGame.value === true) {
			goToResult()
		} else {
			router.push({ name: 'myPlanet'})
		}

	}
}

const everPlayedGame = ref(null)

const chekFirstGame = async () => {
	try {
		const response = await apiClient.get('/profile/get')
		everPlayedGame.value = response.data.ever_played_game
	} catch (error) {
		console.error(error)
	}
}

const goToResult = () => {
	emit('game-finished')
	router.push({ name: 'gameResult', query: { wrong: wrongCount.value, from: 'wordTwinkle' } })
}
</script>

<style scoped>
.flip-card {
    perspective: 1000px;
    height: 463px;
    position: relative;
    margin: auto;
    margin-bottom: 20px;
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
    color: #ffffff;
}

.button--correct {
    border: 0;
    background-color: #31af40;
    color: #ffffff;
}
</style>
