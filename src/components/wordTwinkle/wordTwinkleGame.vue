<template>
    <div class="page-content">
        <div class="timer-container">
            <p class="timer-container__timer">{{ time }} сек</p>
            <p v-show="isVisible" class="timer-container__timer-wrong">+ {{ timeWrong }} сек</p>
        </div>
        <div class="scroll-container">
            <gameComponent
            @wrong-answer="addTime"
            @game-finished="onGameFinished"
            @question-opened="startTimer"
            @image-opened="stopTimer"
            />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import gameComponent from '@/components/wordTwinkle/wordTwinkleGameComponent.vue';

const router = useRouter();
const time = ref(0);
const timeWrong = ref(0);
const isVisible = ref(false);
let timer = null;

const startTimer = () => {
    if (timer) return;
    timer = setInterval(() => {
        time.value++;
    }, 1000);
};

const stopTimer = () => {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
};

const addTime = () => {
    timeWrong.value++;

    if (timeWrong !== 0) {
        isVisible.value = true;
    }
};

onMounted(() => {
    startTimer();
});

const onGameFinished = () => {
    stopTimer();
    const total = timeCalcul();
};

const timeCalcul = () => {
    const totalTime = time.value + timeWrong.value;
    return totalTime;
};
</script>

<style scoped lang="scss">
.scroll-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100dvh;
    box-sizing: border-box;
    overflow: hidden !important;
    padding: 2dvh 4dvw;
}

.page-content {
    padding-top: 20px;
    align-items: center;

    .timer-container {
        margin-bottom: 15px;
        display: flex;
        gap: 5px;

        &__timer {
            font-size: 18px;
            font-weight: 700;
            line-height: 120%;
            color: #262060;
        }

        &__timer-wrong {
            font-size: 18px;
            font-weight: 700;
            line-height: 120%;
            color: #a90000;
        }
    }
}
</style>
