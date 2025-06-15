<template>
    <div class="page-container" :class="nonBg">
        <div v-if="!allMatched" class="timer-area">
            <span>{{ timer }} сек</span>
            <span v-if="errorCount > 0" class="error-count">+1</span>
        </div>
        <div class="card-grid">
            <div v-for="(card, index) in cards" :key="index" class="card"
                :class="{ 'selected': selectedCards.includes(card), 'correct': isCorrect(card), 'incorrect': incorrectCards.includes(card), 'hidden': !card.visible }"
                @click="selectCard(card)">
                {{ card.visible ? (card.isEnglish ? card.english : card.russian) : '' }}
            </div>
        </div>
    </div>
    <CongratulationPopup :is-visible="allMatched" title="Поздравляю!" :message="message" @confirm="goToPlanet" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import CongratulationPopup from './CongratulationPopup.vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const timer = ref(0);
const errorCount = ref(0);
const selectedCards = ref([]);
const matchedPairs = ref([]);
const incorrectCards = ref([]);
const allMatched = ref(false);
const correctCards = ref([]);
const cards = ref([]);
const message = ref('')

let intervalId;

const mockData = [
    { id: 1, english: 'dog', russian: 'собака', isEnglish: true },
    { id: 2, english: 'dog', russian: 'собака', isEnglish: false },
    { id: 3, english: 'cat', russian: 'кот', isEnglish: true },
    { id: 4, english: 'cat', russian: 'кот', isEnglish: false },
    { id: 5, english: 'mouse', russian: 'мышь', isEnglish: true },
    { id: 6, english: 'mouse', russian: 'мышь', isEnglish: false },
    { id: 7, english: 'hare', russian: 'заяц', isEnglish: true },
    { id: 8, english: 'hare', russian: 'заяц', isEnglish: false },
];

const shuffleCards = () => {
    for (let i = cards.value.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards.value[i], cards.value[j]] = [cards.value[j], cards.value[i]];
    }
};

const isCorrect = computed(() => (card) => {
    return correctCards.value.includes(card.id);
});

const nonBg = computed(() => allMatched.value ? 'pageNoBg' : '')

const selectCard = (card) => {
    if (selectedCards.value.length < 2 && !matchedPairs.value.includes(card.id)) {
        selectedCards.value.push(card);
        if (selectedCards.value.length === 2) {
            checkMatch();
        }
    }
};

const checkMatch = () => {
    const [card1, card2] = selectedCards.value;
    if (card1.isEnglish !== card2.isEnglish && card1.english === card2.english) {
        matchedPairs.value.push(card1.id);
        correctCards.value.push(card1.id, card2.id);
        setTimeout(() => {
            card1.visible = card2.visible = false;
            correctCards.value = correctCards.value.filter(id => id !== card1.id && id !== card2.id);
            selectedCards.value = [];
            if (matchedPairs.value.length === cards.value.length / 2) {
                message.value = `Вы завершили первую колоду за ${timer.value} секунд. Теперь вы можете создать свою планету и продвигать её, зарабатывая звёзды в каждой игре!`
                allMatched.value = true;
                clearInterval(intervalId);
            }
        }, 1000);
    } else {
        incorrectCards.value = [...selectedCards.value];
        errorCount.value++;
        timer.value++;
        setTimeout(() => {
            incorrectCards.value = [];
            selectedCards.value = [];
            errorCount.value = 0;
        }, 1000);
    }
};

const goToPlanet = () => {
    router.push({ name: 'planetPage' })
}

onMounted(() => {
    cards.value = mockData.map(card => ({ ...card, visible: true }));
    shuffleCards();
    intervalId = setInterval(() => {
        timer.value++;
    }, 1000);
});

onUnmounted(() => {
    clearInterval(intervalId);
});

</script>

<style scoped>
.pageNoBg {
    background: none;
}

.timer-area {
    font-size: 1.5em;
    margin-bottom: 28px;
}

.timer-area .error-count {
    color: red;
    margin-left: 10px;
    transition: opacity 1s;
}

.card-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    justify-content: center;
}

.card {
    border: 2px solid #262060;
    width: 150px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.5s;
    border-radius: 20px;
}

.card,
.timer-area {
    font-size: 18px;
    font-weight: 700;
    line-height: 120%;
    letter-spacing: 0%;
    color: #262060;
}

.selected {
    border-color: yellow;
}

.correct {
    border-color: #3E9D47;
}

.incorrect {
    border-color: #A90000;
}

.hidden {
    border: none;
    width: 0;
    height: 0;
    margin: 0;
    padding: 0;
    opacity: 0;
}

.popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
}

.popup-content button {
    margin-top: 10px;
    padding: 5px 10px;
}
</style>