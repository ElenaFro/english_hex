<template>
    <section class="popup-overlay">
        <section class="popup">
            <p class="popup__header d-mb-16">
                {{ headerText }}
            </p>
            <img src="@/assets/img/close_icon.svg" class="popup__close" @click="stopAndClose" />
            <div>
                {{ bodyText }}
            </div>
            <div class="full_width flex justify-between">
                <div class="flex items-end">
                    <button class="arrow_btn" @click="stopAndClose">
                        <img src="@/assets/img/arrow_icon.svg" alt="arrow" />
                    </button>
                </div>
                <div class="relative">
                    <img src="@/assets/Di_avatar/girl_with_flag.svg" alt="girl with flag" class="girl_with_flag">
                    <img src="@/assets/icons/sound.svg" class="sound_icon" @click="playSound" />
                </div>
            </div>
        </section>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import soundMp3 from '@/assets/audio/helloFromDi.mp3';

const emit = defineEmits(['close']);
const headerText = 'Добро пожаловать!';
const bodyText = 'Привет! Меня зовут Di, и я рада приветствовать тебя в мире изучения английских слов! Ты сделал важный шаг к своей мечте - свободному владению иностранным языком.';

const lastPlayed = ref(0);
const COOLDOWN_MS = 15 * 1000;

const currentAudio = ref(null);

const playSound = () => {
    const currentTime = Date.now();
    if (currentTime - lastPlayed.value < COOLDOWN_MS) return

    if (currentAudio.value) {
        currentAudio.value.pause();
        currentAudio.value.currentTime = 0;
    }

    const audio = new Audio(soundMp3);
    currentAudio.value = audio;
    audio.play().then(() => {
        lastPlayed.value = currentTime;
    }).catch((error) => {
        console.error('Ошибка воспроизведения звука:', error);
    });

    audio.onended = () => {
        currentAudio.value = null;
    };
};

const stopAndClose = () => {
    if (currentAudio.value) {
        currentAudio.value.pause();
        currentAudio.value.currentTime = 0;
        currentAudio.value = null;
    }
    emit('close');
};
</script>

<style scoped lang="scss">
.popup-overlay {
    position: fixed;
    height: 100vh;
    width: 100vw;
    backdrop-filter: blur(20px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 300;
    margin: auto;
}

.popup {
    position: relative;
    z-index: 400;
    margin-bottom: 20vh;

    &__close {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
}

.arrow_btn {
    background-color: #262060;
    color: #fff;
    padding: 12px 24px;
    border-radius: 16px;

    &:hover {
        border: 2px solid #fff;
    }
}

.sound_icon {
    position: absolute;
    top: 127px;
    right: 8px;
    z-index: 500;
    padding: 10px;
    cursor: pointer;
}
</style>