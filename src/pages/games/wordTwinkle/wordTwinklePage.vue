<template>
    <startGame
        v-if="activeComponent === 'startGame'"
        game-name="wordTwinkle"
        :id="route.query.id"
    />
    <wordTwinkleGame v-if="activeComponent === 'wordTwinkleGame'" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import startGame from '@/components/wordTwinkle/wordTwinkleStart.vue';
import wordTwinkleGame from '@/components/wordTwinkle/wordTwinkleGame.vue';

const route = useRoute();
const activeComponent = ref('startGame');

const switchToGame = () => {
    activeComponent.value = 'wordTwinkleGame';
};

onMounted(() => {
    if (route.query.startGame === 'true') {
        activeComponent.value = 'wordTwinkleGame';
    }
});
</script>

<style scoped lang="scss"></style>
