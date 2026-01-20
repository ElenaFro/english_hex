<template>
    <div class="wrapper">
        <img src="@/assets/Di_avatar/girl-img2.webp" alt="Девочка" class="character-image" />
        <div class="page-container">
            <div class="title">Соедини слова</div>
            <constellation-game-grid
                :displayed-cards="displayedCards"
                :selected-cards="selectedCards"
                :matched-pairs="matchedPairs"
                :correct-cards="correctCards"
                :incorrect-cards="incorrectCards"
                @select:card="selectCard"
            />
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';

import ConstellationGameGrid from '@/shared/ui/ConstellationGameGrid.vue';

const emit = defineEmits(['change-component']);

const selectedCards = ref([]);
const matchedPairs = ref([]);
const incorrectCards = ref([]);
const allMatched = ref(false);
const correctCards = ref([]);
const cards = ref([]);
const currentChunk = ref(0);
const cardChunks = ref([]);

const displayedCards = computed(() => cardChunks.value[currentChunk.value] || []);

const data = [
    { id: 1, word: 'собака', translation_word: 'dog' },
    { id: 2, word: 'кот', translation_word: 'cat' },
    { id: 3, word: 'мышь', translation_word: 'mouse' },
    { id: 4, word: 'заяц', translation_word: 'hare' },
];

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

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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

const isChunkComplete = computed(() => {
    const currentPairIds = displayedCards.value
        .map((card) => card.pairId)
        .filter((value, index, self) => self.indexOf(value) === index);
    return currentPairIds.every((pairId) => matchedPairs.value.includes(pairId));
});

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
                    emit('change-component', 'AgeVerif');
                }
            }
        }, 1000);
    } else {
        incorrectCards.value = selectedCards.value;
        setTimeout(() => {
            incorrectCards.value = [];
            selectedCards.value = [];
        }, 1000);
    }
};

onMounted(async () => {
    const pairedCards = data.map((item) => {
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
});
</script>
<style scoped>
.wrapper {
    background-color: transparent;
    margin: 0 auto;
    max-width: 414px;
    position: relative;
    overflow: hidden;
}
.page-container {
    background-color: #f6f6fe;
    max-height: 75dvh;
    margin: 0 auto;
    padding-top: 10px;
    overflow: hidden;
}

.character-image {
    position: relative;
    top: 52px;
    margin: 0 auto;
}

.title {
    font-weight: 700;
    font-style: Bold;
    font-size: 24px;
    line-height: 100%;
    color: #311d5d;
    text-align: start;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 24px;
}
</style>
