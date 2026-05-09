<template>
    <section class="popup-overlay">
        <section class="popup">
            <p class="popup__header d-mb-16">
                {{ title }}
            </p>
            <img src="@/assets/img/close_icon.svg" class="popup__close" @click="stopAndClose" />
            <div>
                {{ message }}
            </div>
            <div class="full_width flex justify-between full-height items-end">
                <div class="flex items-end">
                    <button class="arrow_btn" @click="handleArrow">
                        <img src="@/assets/img/arrow_icon.svg" alt="arrow" />
                    </button>
                </div>
                <div class="relative">
                    <img
                        src="@/assets/Di_avatar/girl_with_flag.svg"
                        alt="girl with flag"
                        class="girl_with_flag"
                    />
                    <img src="@/assets/icons/sound.svg" class="sound_icon" @click="playSound" />
                </div>
            </div>
        </section>
    </section>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { useAudio } from '@/shared/composables/useAudio';

const props = defineProps({
    title: { type: String, default: '' },
    message: { type: String, default: '' },
    soundMp3: { type: String, default: '' },
});

const emit = defineEmits(['close', 'arrowClick']);

const { playAudio, stopAudio } = useAudio();

const lastPlayed = ref(0);
const COOLDOWN_MS = 15 * 1000;

const playSound = () => {
    const currentTime = Date.now();
    if (currentTime - lastPlayed.value < COOLDOWN_MS) return;
    lastPlayed.value = currentTime;
    playAudio(props.soundMp3);
};

const stopAndClose = () => {
    stopAudio();
    emit('close');
};

const handleArrow = () => {
    stopAudio();
    emit('arrowClick');
};

onUnmounted(stopAudio);
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
    z-index: 1000;
    margin: auto;
}

.popup {
    position: static;
    max-height: 463px;
    height: 463px;
    z-index: 400;
    margin-bottom: 25vh;
    display: flex;
    flex-direction: column;

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
