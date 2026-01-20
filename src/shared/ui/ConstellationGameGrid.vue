<template>
    <div v-if="displayedCards.length > 0" class="card-grid">
        <div
            v-for="(card, index) in displayedCards"
            :key="index"
            class="card"
            :class="{
                selected: selectedCards?.includes(card),
                correct: isCorrect(card),
                incorrect: incorrectCards?.includes(card),
                hidden: !card.visible,
                translation: card.isTranslation,
            }"
            @click="$emit('select:card', card)"
        >
            <span v-if="card.visible"> {{ card.displayWord }}</span>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';

defineEmits(['select:card']);
const props = defineProps({
    displayedCards: { type: Array, default: () => [] },
    selectedCards: { type: Array, default: () => [] },
    incorrectCards: { type: Array, default: () => [] },
    correctCards: { type: Array, default: () => [] },
    matchedPairs: { type: Array, default: () => [] },
});

const isCorrect = computed(() => (card) => {
    if (card.isTranslation) {
        return props.correctCards.includes(card.pairId);
    }

    return props.matchedPairs.includes(card.pairId);
});
</script>
<style scoped>
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

.selected {
    border-color: yellow;
}

.hidden {
    border: none;
    width: 0;
    height: 0;
    margin: 0;
    padding: 0;
    opacity: 0;
}

.card {
    font-size: 18px;
    font-weight: 700;
    line-height: 120%;
    letter-spacing: 0%;
    color: #262060;
}
.card.translation {
    background: #262060;
    color: #fff;
}

.card:not(.translation) {
    background: #fff;
    color: #262060;
}

.card.correct:not(.translation) {
    border-color: #3e9d47;
}

.card.incorrect:not(.translation) {
    border-color: #a90000;
}

.card.translation.correct {
    background: #3e9d47;
    border-color: #3e9d47;
    color: #fff;
}

.card.translation.incorrect {
    background: #a90000;
    border-color: #a90000;
    color: #fff;
}
</style>
