<template>
    <section>
        <div class="page-container" :class="nonBg">
            <Loader v-if="loading" />
            <section v-else class="game_section">
                <div v-if="!allMatched" class="timer-area">
                    <span>{{ timer }} сек</span>
                    <span v-if="errorCount > 0" class="error-count">+1</span>
                </div>
                <ConstellationGameGrid
                    :displayed-cards="displayedCards"
                    :selected-cards="selectedCards"
                    :matched-pairs="matchedPairs"
                    :correct-cards="correctCards"
                    :incorrect-cards="incorrectCards"
                    @select:card="selectCard"
                />
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
//component
import CongratulationPopup from '../myPlanetPopup/CongratulationPopup.vue';
import Loader from '../Loader.vue';
import ConstellationGameGrid from '@/shared/ui/ConstellationGameGrid.vue';
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
const maxStarsForGame = ref(50);

let intervalId;

const data = ref([]);

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

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
        const translationCard = card1.isTranslation ? card1 : card2;

        matchedPairs.value.push(card1.pairId);
        correctCards.value.push(translationCard.pairId);

        setTimeout(() => {
            card1.visible = card2.visible = false;
            correctCards.value = [];
            selectedCards.value = [];
            if (isChunkComplete.value) {
                if (currentChunk.value + 1 < cardChunks.value.length) {
                    currentChunk.value++;
                } else {
                    router.push({
                        name: 'gameResult',
                        query: {
                            wrong: wrongCount.value,
                            from: 'constellationGame',
                            gameSource: 'constellation_word',
                            id: route.query.id || useCategoriesStore().chosedCategory.id,
                        },
                    });
                }
            }
        }, 1000);
    } else {
        incorrectCards.value = selectedCards.value;
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

const normalizePairs = (pairs) =>
    pairs.map(([a, b]) => {
        if (a.isTranslation) return [b, a];
        return [a, b];
    });

const buildChessChunk = (pairs) => {
    const normalized = normalizePairs(pairs);
    const shuffledPairs = shuffleArray([...normalized]);

    let enCards = shuffledPairs.map(([en]) => en);
    let ruCards = shuffledPairs.map(([, ru]) => ru);

    enCards = shuffleArray(enCards);
    ruCards = shuffleArray(ruCards);

    const fixPairs = () => {
        for (let i = 0; i < enCards.length; i++) {
            if (enCards[i].pairId === ruCards[i].pairId) {
                const swapIndex = ruCards.findIndex(
                    (card, idx) =>
                        card.pairId !== enCards[i].pairId &&
                        enCards[idx].pairId !== ruCards[i].pairId
                );
                if (swapIndex !== -1) {
                    [ruCards[i], ruCards[swapIndex]] = [ruCards[swapIndex], ruCards[i]];
                }
            }
        }
    };

    fixPairs();

    const result = [];
    for (let i = 0; i < enCards.length; i++) {
        if (i % 2 === 0) {
            result.push(enCards[i], ruCards[i]);
        } else {
            result.push(ruCards[i], enCards[i]);
        }
    }

    return result;
};

const chunkPairsUnique = (pairs, chunkSize = 4) => {
    const chunks = [];
    let tempPairs = [...pairs];

    while (tempPairs.length > 0) {
        const chunk = [];
        const enIds = new Set();
        const ruIds = new Set();

        for (let i = 0; i < tempPairs.length && chunk.length < chunkSize; i++) {
            const [enCard, ruCard] = tempPairs[i];
            if (!enIds.has(enCard.pairId) && !ruIds.has(ruCard.pairId)) {
                chunk.push(tempPairs[i]);
                enIds.add(enCard.pairId);
                ruIds.add(ruCard.pairId);
            }
        }

        chunk.forEach((pair) => {
            const index = tempPairs.findIndex(
                (p) => p[0].pairId === pair[0].pairId && p[1].pairId === pair[1].pairId
            );
            if (index > -1) tempPairs.splice(index, 1);
        });

        chunks.push(chunk);
    }

    return chunks;
};

const currentStarsForCategory = ref(0);

watch(currentStarsForCategory, (newVal) => {
    maxStarsForGame.value = maxStarsForGame.value - newVal;
});

onMounted(async () => {
    loading.value = true;

    const categoryId = route.query.id || useCategoriesStore().chosedCategory.id;

    data.value = await useGamesStore().getWordForConstellatonGame(categoryId);

    const pairedCards = data.value.map((item) => {
        const pairId = item.id;
        const wordCard = {
            pairId,
            displayWord: item.translation_word,
            isTranslation: false,
            visible: true,
        };

        const translationCard = {
            pairId,
            displayWord: item.word,
            isTranslation: true,
            visible: true,
        };
        return [wordCard, translationCard];
    });
    const uniqueChunks = chunkPairsUnique(pairedCards, 4);

    cardChunks.value = uniqueChunks.map((chunkPairs) => buildChessChunk(chunkPairs));

    loading.value = false;

    intervalId = setInterval(() => {
        timer.value++;
    }, 1000);
    currentStarsForCategory.value = useCategoriesStore().getCategoryStars(categoryId);
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
