<template>
    <StartGamePopup v-if="openStartInfo" title="Созвездие слов" subtitle="Готовы?" :message="popupMessage"
        @start="openStartInfo = !openStartInfo" />
    <ConstellationGame v-else />
</template>
<script setup>
import { ref } from 'vue';
import StartGamePopup from '@/components/games/StartGamePopup.vue';
import ConstellationGame from '@/components/ConstellationGame/ConstellationGame.vue';

const openStartInfo = ref(true)
const popupMessage = 'Найдите соответствующее определение для каждого термина. Если вы допустите ошибку, мы добавим к вашему результату дополнительное время.'
</script>