<template>
    <div class="page-container">
        <div class="character-container">
            <img
                src="@/assets/Di_avatar/girl_thinking.webp"
                alt="Девочка"
                class="character-image"
            />

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

            <div v-if="showBubble" class="speech-bubble-img">
                <span class="speech-bubble-text">На сколько хорошо ты знаешь английскийй?</span>
            </div>
        </div>

        <div class="answers">
            <button
                v-for="(option, index) in options"
                :key="index"
                class="answer-btn"
                @click="handleOptionClick(index)"
                :class="{ selected: selectedIndex === index }"
            >
                {{ option }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['change-component']);

const options = [
    'Я новичок, только знакомлюсь с языком',
    'Я знаю базовые фразы и слова',
    'Я родитель, занимаюсь английским с ребёнком',
    'Я учитель, интересуюсь методиками обучения',
];

const selectedIndex = ref(null);
const showBubble = ref(false);
const activeDot = ref(0);

const handleOptionClick = (index) => {
    selectedIndex.value = index;

    if (index === options.length - 1) {
        emit('change-component', 'RegistForm');
    } else {
        emit('change-component', 'OnboardingStartSolutionGame');
    }
};
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
.page-container {
    margin: 40px auto;
    color: #3a3a3a;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: transparent;
}

.character-container {
    position: relative;
    width: 180px;
    height: 280px;
    padding-left: 20px;
}

.character-image {
    width: 100%;
    height: auto;
    display: block;
    position: absolute;
    left: -10px;
    bottom: -40px;
    z-index: 1;
}

/* Точки по диагонали */
.dots-container {
    position: absolute;
    top: 110px;
    left: 100%;
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

.speech-bubble-img {
    position: absolute;
    top: 10px;
    left: 100%;
    width: 179px;
    height: 109px;
    top: 0;
    right: 0;
    padding: 18px 6px 14px 20px;
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

.answers {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 14px;
    z-index: 3;
}

.answer-btn {
    background: #f8f5ff;
    border: none;
    border-radius: 20px;
    padding: 20px;
    cursor: pointer;
    color: #311d5d;
    transition: background-color 0.3s ease;
    text-align: left;
    font-family: Mulish;
    font-weight: 700;
    font-style: Bold;
    font-size: 20px;
    line-height: 120%;
    letter-spacing: 0%;
}

.answer-btn:hover {
    background-color: #d6caff;
}

.answer-btn.selected {
    background-color: #6c54ff;
    color: white;
}
</style>
