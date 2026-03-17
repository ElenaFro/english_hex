<template>
    <StartGamePopup
        v-if="openStartInfo"
        title="Созвездие слов"
        :subtitle="subtitleText"
        :message="popupMessage"
        game-name="constellationGame"
        :id="route.query.id"
        @start="openStartInfo = !openStartInfo"
    />
    <ConstellationGame v-else />
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import StartGamePopup from '@/components/games/StartGamePopup.vue';
import ConstellationGame from '@/components/ConstellationGame/ConstellationGame.vue';

const route = useRoute();
const openStartInfo = ref(true);
const popupMessage =
    'Сопоставь каждое слово с правильным переводом. Если ошибёшься — мы добавим немного времени к твоему результату. Играй внимательно, побеждает точность!';
const subtitleText = `Найди свою пару,\n` + 'запомни навсегда';
onMounted(() => {
    if (route.query.startGame === 'true') {
        openStartInfo.value = false;
    }
});
</script>
