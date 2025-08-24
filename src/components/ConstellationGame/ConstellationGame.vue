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
                        v-for="(card, index) in displayedCards"
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
                        <img
                            v-if="card.isTranslation === false && card.visible"
                            :src="card.imageUrl"
                            alt="Card image"
                            class="card-image"
                        />
                        <span v-else-if="card.visible"> {{ card.displayWord }}</span>
                    </div>
                </div>
            </section>
        </div>
        <CongratulationPopup
            v-if="allMatched"
            title="Поздравляю!"
            :message="message"
            @confirm="goToPlanet"
        />
    </section>
</template>

<script setup>
//vue
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
//component
import CongratulationPopup from '../myPlanetPopup/CongratulationPopup.vue';
import Loader from '../Loader.vue';
//stores
import { useGamesStore } from '@/stores/games';
import { useCategoriesStore } from '@/stores/categories';

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
const message = ref('');
const wrongCount = ref(0);
const currentChunk = ref(0);
const cardChunks = ref([]);

let intervalId;

const data = ref([]);

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const isCorrect = computed(() => (card) => {
    return correctCards.value.includes(card.pairId);
});

const nonBg = computed(() => (allMatched.value ? 'pageNoBg' : ''));

const displayedCards = computed(() => cardChunks.value[currentChunk.value] || []);

const isChunkComplete = computed(() => {
    const currentPairIds = displayedCards.value
        .map((card) => card.pairId)
        .filter((value, index, self) => self.indexOf(value) === index);
    return currentPairIds.every((pairId) => matchedPairs.value.includes(pairId));
});

const selectCard = (card) => {
    if (
        selectedCards.value.length < 2 &&
        !matchedPairs.value.includes(card.pairId) &&
        card.visible
    ) {
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
            if (isChunkComplete.value) {
                if (currentChunk.value + 1 < cardChunks.value.length) {
                    currentChunk.value++;
                } else {
                    router.push({
                        name: 'gameResult',
                        query: { wrong: wrongCount.value, from: 'constellationGame', game:'constellation_word' },
                    });
                }
            }
        }, 1000);
    } else {
        incorrectCards.value = [...selectedCards.value];
        errorCount.value++;
        wrongCount.value++;
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

    const categoryId = route.query.id || useCategoriesStore().chosedCategory.id;

    data.value = await useGamesStore().getWordForConstellatonGame(categoryId);

    const pairedCards = data.value.map((item) => {
        const pairId = item.id;
        const imageCard = {
            pairId,
            imageUrl: `${import.meta.env.VITE_STORAGE_URI}/${categoryId}/cards/${pairId}/word_image/${item.card_photo}`,
            displayWord: item.word,
            isTranslation: false,
            visible: true,
        };
        const wordCard = {
            pairId,
            displayWord: item.translation_word,
            isTranslation: true,
            visible: true,
        };
        return [imageCard, wordCard];
    });

    const shuffledPairs = shuffleArray(pairedCards);

    cardChunks.value = [];

    for (let i = 0; i < shuffledPairs.length; i += 4) {
        const chunkPairs = shuffledPairs.slice(i, i + 4);
        const flattenedChunk = shuffleArray(chunkPairs.flat());
        cardChunks.value.push(flattenedChunk);
    }

    loading.value = false;

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

.game_section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
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
    align-items: center;
    width: 100%;
}

.card {
    border: 2px solid #262060;
    width: 100%;
    aspect-ratio: 5 / 3;
    max-width: 150px;
    min-width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.5s;
    border-radius: 20px;
    margin: 0 auto;
}

.card,
.timer-area {
    font-size: 18px;
    font-weight: 700;
    line-height: 120%;
    letter-spacing: 0%;
    color: #262060;
}

.card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
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
