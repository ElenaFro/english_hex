<template>
    <section class="popup-overlay">
        <section class="popup">
            <p class="popup__header d-mb-16">
                {{ headerText }}
            </p>
            <img src="@/assets/img/close_icon.svg" class="popup__close" @click="emit('close')" />
            <div>
                {{ bodyText }}
            </div>
            <div class="full_width flex justify-between">
                <div class="flex items-end">
                    <button class="arrow_btn"> <img src="@/assets/img/arrow_icon.svg" alt="arrow"
                            @click="emit('close')"></button>
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
import soundMp3 from '@/assets/audio/helloFromDi.mp3'

const emit = defineEmits(['close'])
const headerText = 'Добро пожаловать!'
const bodyText = 'Привет! Меня зовут Di, и я рада приветствовать тебя в мире изучения английских слов! Ты сделал важный шаг к своей мечте - свободному владению иностранным языком.'

const playSound = () => {
    const audio = new Audio(soundMp3);
    audio.play().then(() => {
    }).catch((error) => {
        console.error('Ошибка воспроизведения звука:', error);
    });
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