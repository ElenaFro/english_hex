<template>
    <div class="sound-container">
        <p class="sound-container__word">{{ engWord }}</p>
        <button class="sound-container__sound-button" @click="playSound">
            <img src="@/assets/img/sound-icon.svg" alt="" class="sound-container__sound-img" />
        </button>
        <audio ref="soundRef" class="sound-container__lerning-sound" :src="soundUrl"></audio>
        <p class="sound-container__word">{{ rusWord }}</p>
        <img src="@/assets/img/girl-img.png" alt="" class="sound-container__girl-img" />
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    engWord: String,
    rusWord: String,
    soundUrl: String,
});
const soundRef = ref(null);

const playSound = () => {
    if (soundRef.value) {
        soundRef.value.currentTime = 0;
        soundRef.value.play();
    }
};
</script>

<style scoped>
.sound-container {
    overflow: hidden;
    position: relative;
    width: 315px;
    height: 463px;
    border-radius: 20px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding-top: 62px;
    border: 3px solid rgba(38, 32, 96, 1);
}

.sound-container__word {
    font-size: 40px;
    font-weight: 800;
    line-height: 100%;
    text-align: center;
    color: rgba(38, 32, 96, 1);
}

.sound-container__sound-button {
    background-color: transparent;
    border: 0;
}

.sound-container__girl-img {
    position: relative;
    margin-top: auto;
    align-self: end;
}
</style>
