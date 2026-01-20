<template>
    <div class="main-container">
        <div class="content-container">
            <div class="image-container">
                <img src="@/assets/Di_avatar/girl_with_keychain.webp" alt="Girl" class="img" />
            </div>
            <div class="dots-container">
                <span
                    class="dot"
                    :class="{ active: activeDot >= 1 }"
                    style="top: 20px; left: 0"
                ></span>
                <span
                    class="dot"
                    :class="{ active: activeDot >= 2 }"
                    style="top: 0; left: 20px"
                ></span>
            </div>

            <div v-if="showBubble" class="speech-bubble-container">
                <span class="speech-bubble-text"
                    >Замечательно, значит за неделю вы выучите 20 новых слов!</span
                >
            </div>

            <div class="message-block message-block--shadow">
                <p class="message-block__title">Запоминай слова простыми приёмами!</p>
                <button @click="goToNext" class="button button--purple">
                    Продолжить
                    <img src="@/assets/img/arrow_icon.svg" alt="arrow" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['change-component']);

const showBubble = ref(false);
const activeDot = ref(0);

function goToNext() {
    emit('change-component', 'OnboardingGame');
}

onMounted(() => {
    let step = 0;
    const interval = setInterval(() => {
        step++;
        activeDot.value = step;
        if (step === 2) {
            clearInterval(interval);
            setTimeout(() => {
                showBubble.value = true;
            }, 300);
        }
    }, 200);
});
</script>

<style scoped>
.content-container {
    position: relative;
    bottom: 8%;
}

.character-container {
    position: relative;
}

.image-container {
    width: 270px;
    height: 380px;
    position: relative;
    top: 154px;
    left: -18%;
}

.dots-container {
    position: absolute;
    top: 22%;
    right: 44%;
    width: 40px;
    height: 40px;
    z-index: 3;
}

.dot {
    position: absolute;
    width: 23px;
    height: 14px;
    background: #fff;
    border-radius: 50%;

    opacity: 0;
    transform: scale(0.3) translateY(6px);

    transition:
        opacity 0.4s ease,
        transform 0.4s ease;
}

.dot.active {
    opacity: 1;
    transform: scale(1) translateY(0);
}

.speech-bubble-container {
    position: absolute;
    top: 0;
    right: -10%;
    width: 208px;
    height: 130px;
    padding: 18px 1px 15px 29px;
    border-radius: 50%;
    background-color: #fff;
    animation: bubbleFadeIn 0.6s forwards ease-out;
    z-index: 3;
}

@keyframes bubbleFadeIn {
    0% {
        opacity: 0;
        transform: scale(0.2);
    }
    60% {
        opacity: 1;
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
}

.speech-bubble-text {
    font-family: Mulish;
    font-weight: 700;
    font-style: Bold;
    font-size: 16px;
    line-height: 120%;
    letter-spacing: 0%;
    color: #311d5d;
}

.message-block {
    text-align: center;
    padding: 43px 25px 40px;
    z-index: 100;
}

.message-block__title {
    font-family: Mulish;
    font-weight: 700;
    text-align: center;
    line-height: 10%;
    font-size: 24px;
    line-height: 130%;
    margin-bottom: 22px;
}

.button img {
    margin-left: 12px;
    width: 23px;
}
</style>
