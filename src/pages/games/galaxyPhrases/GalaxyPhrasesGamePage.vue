<template>
    <StartGamePopup
        v-if="openStartInfo"
        title="Галактика фраз"
        :subtitle="subtitleText"
        :message="popupMessage"
        game-name="galaxyPhrasesGame"
        :id="route.query.id"
        @start="openStartInfo = !openStartInfo"
    />
    <GalaxyPhrasesGame v-else />
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import StartGamePopup from '@/components/games/StartGamePopup.vue';
import GalaxyPhrasesGame from '@/pages/games/galaxyPhrases/components/GalaxyPhrasesGame.vue';

const route = useRoute();
const openStartInfo = ref(true);
const popupMessage =
    'Соедини английские слова с их переводом, чтобы получилось целое предложение. Ошибешься — добавим секунду ко времени. Сможешь собрать всё без ошибок?';
const subtitleText = `Собери слова в\n` + 'предложения';
onMounted(() => {
    if (route.query.startGame === 'true') {
        openStartInfo.value = false;
    }
});
</script>
