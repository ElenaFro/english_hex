<template>
    <div class="sound-container">
        <p ref="wordRef" class="sound-container__word">{{ engWord }}</p>
        <button class="sound-container__sound-button" @click="playSound">
            <img src="@/assets/img/sound-icon.svg" alt="" class="sound-container__sound-img" />
        </button>
        <p ref="wordRef" class="sound-container__word">{{ rusWord }}</p>
        <img src="@/assets/img/girl-img.svg" alt="" class="sound-container__girl-img" />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useAudio } from '@/shared/composables/useAudio';

const props = defineProps({
    engWord: String,
    rusWord: String,
    soundUrl: String,
});
const { playAudio, stopAudio } = useAudio();
const wordRef = ref(null);

const playSound = () => {
    playAudio(props.soundUrl);
};

// Останавливаем звук при переходе к следующей карточке
watch(() => props.soundUrl, stopAudio);

onUnmounted(stopAudio);

const resizeText = () => {
    const el = wordRef.value;
    if (!el) return;

    let fontSize = 32;
    el.style.fontSize = fontSize + 'px';

    while (el.scrollWidth > el.clientWidth && fontSize > 12) {
        fontSize -= 6;
        el.style.fontSize = fontSize + 'px';
    }
};

onMounted(resizeText);
watch(() => [props.engWord, props.rusWord], resizeText);
</script>

<style scoped>
.sound-container {
    width: 100%;
    height: 100%;
    padding: 4dvh 2dvw 0 2dvw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    border: 3px solid rgba(38, 32, 96, 1);
    border-radius: 20px;
    box-sizing: border-box;
    width: 100%;
    background-color: #ffffff;
    background-image: url('@/assets/lesson/word_card_bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    max-height: 430px;
    z-index: 100;
    overflow-y: hidden;
}

.sound-container__word {
    font-weight: 800;
    text-align: center;
    color: rgba(38, 32, 96, 1);
    font-size: clamp(2.4rem, 4vw, 2rem);
}

.sound-container__sound-button {
    background-color: transparent;
    border: 0;
}

.sound-container__girl-img {
    width: auto;
    height: 55%;
    align-self: flex-end;
}
</style>
