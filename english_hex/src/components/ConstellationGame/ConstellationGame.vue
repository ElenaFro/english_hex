<template>
    <section>
        <div class="page-container" :class="nonBg">
            <Loader v-if="loading" />
            <section v-else class="game_section">
                <div v-if="!allMatched" class="timer-area">
                    <span>{{ timer }} сек</span>
                    <span v-if="errorCount > 0" class="error-count">+1</span>
                </div>
                <div class="card-grid">
                    <div
                        v-for="(card, index) in cards"
                        :key="index"
                        class="card"
                        :class="{
                            selected: selectedCards.includes(card),
                            correct: isCorrect(card),
                            incorrect: incorrectCards.includes(card),
                            hidden: !card.visible,
                        }"
                        @click="selectCard(card)"
                    >
                        {{ card.visible ? card.displayWord : '' }}
                    </div>
                </div>
            </section>
        </div>
        <CongratulationPopup
            :is-visible="allMatched"
            title="Поздравляю!"
            :message="message"
            @confirm="goToPlanet"
        />
    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import CongratulationPopup from './CongratulationPopup.vue';
import { useRoute, useRouter } from 'vue-router';
import { useGamesStore } from '@/stores/games';
import Loader from '../Loader.vue';

const router = useRouter();
const route = useRoute();
const timer = ref(0);
const loading = ref(true);
const errorCount = ref(0);
const selectedCards = ref([]);
const matchedPairs = ref([]);
const incorrectCards = ref([]);
const allMatched = ref(false);
const correctCards = ref([]);
const cards = ref([]);
const message = ref('')
const wrongCount = ref(0)

let intervalId;

const data = ref([]);

const shuffleCards = () => {
    for (let i = cards.value.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards.value[i], cards.value[j]] = [cards.value[j], cards.value[i]];
    }
};

const isCorrect = computed(() => (card) => {
    return correctCards.value.includes(card.pairId);
});

const nonBg = computed(() => (allMatched.value ? 'pageNoBg' : ''));

const selectCard = (card) => {
    if (selectedCards.value.length < 2 && !matchedPairs.value.includes(card.pairId)) {
        selectedCards.value.push(card);
        if (selectedCards.value.length === 2) {
            checkMatch();
        }
    }
};

const checkMatch = () => {
    const [card1, card2] = selectedCards.value;
    if (card1.pairId === card2.pairId && card1.isTranslation !== card2.isTranslation) {
        matchedPairs.value.push(card1.pairId);
        correctCards.value.push(card1.pairId);
        setTimeout(() => {
            card1.visible = card2.visible = false;
            correctCards.value = correctCards.value.filter((id) => id !== card1.pairId);
            selectedCards.value = [];
            if (matchedPairs.value.length === cards.value.length / 2) {
                // message.value = `Вы завершили первую колоду за ${timer.value} секунд. Теперь вы можете создать свою планету и продвигать её, зарабатывая звёзды в каждой игре!`
                // allMatched.value = true;
                // clearInterval(intervalId);
				router.push({ name: 'gameResult', query: { wrong: wrongCount.value, from: 'constellationGame' } })
            }
        }, 1000);
    } else {
        incorrectCards.value = [...selectedCards.value];
        errorCount.value++;
		wrongCount.value++
        timer.value++;
        setTimeout(() => {
            incorrectCards.value = [];
            selectedCards.value = [];
            errorCount.value = 0;
        }, 1000);
    }
};

const goToPlanet = () => {
    router.push({ name: 'planetPage' });
};

onMounted(async () => {
    loading.value = true;
    data.value = await useGamesStore().getWordForConstellatonGame(route.query.id);
    cards.value = data.value.flatMap((item) => [
        {
            pairId: item.id,
            displayWord: item.translation_word,
            isTranslation: false,
            visible: true,
        },
        {
            pairId: item.id,
            displayWord: item.word,
            isTranslation: true,
            visible: true,
        },
    ]);
    shuffleCards();
    intervalId = setInterval(() => {
        timer.value++;
    }, 1000);
    loading.value = false;
});

onUnmounted(() => {
    clearInterval(intervalId);
});
</script>

<style scoped>
.pageNoBg {
    background: none;
}

.game_section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
    border-color: #3e9d47;
}

.incorrect {
    border-color: #a90000;
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
