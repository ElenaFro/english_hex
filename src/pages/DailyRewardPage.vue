<template>
    <div class="daily-reward-page">
        <img class="girl" src="@/assets/Di_avatar/girl-img2.webp" alt="girl" />

        <div class="card">
            <h2 class="title">Продолжай в том же духе!</h2>
            <p class="subtitle">{{ headerText }}</p>
        </div>

        <div class="block daily">
            <p class="block-title">Ежедневная награда</p>

            <div class="days">
                <div v-for="day in 7" :key="day" class="day-container">
                    <div class="icon-wrapper">
                        <img
                            v-if="completedDays.includes(day)"
                            src="@/assets/dailyIcon/checkmark_icon.webp"
                            class="icon"
                        />
                    </div>
                    <div
                        class="day"
                        :class="{
                            active: day === currentDay,
                            completed: completedDays.includes(day),
                            'last-day': day === 7,
                        }"
                    >
                        {{ day }}
                    </div>

                    <span class="star-container">
                        <img
                            v-if="day === 7"
                            src="@/assets/dailyIcon/gold_chest.webp"
                            class="icon-chest"
                        />
                        <span v-else class="star-block">
                            5<img class="star" src="@/assets/dailyIcon/star.webp" alt="star" />
                        </span>
                    </span>
                </div>
            </div>
        </div>

        <p class="block-title task">Задание на сегодня:</p>

        <div class="task-wrapper" :class="overlayClass">
            <!-- Текст подсказки -->
            <div v-if="showHint">
                <div class="hint-text-above">
                    Повтори 20 слов в бесконечном режиме, чтобы не потерять прогресс и получить
                    награду
                </div>
                <div class="hint-text-above">Задания на сегодня:</div>
            </div>
            <div class="block task">
                <p class="task-text">Выучи 20 слов в бесконечном режиме</p>

                <div class="progress-bar">
                    <div class="progress-bar__fill" :style="{ width: percentOfFill }" />
                    <span class="progress-bar__label"> {{ learnedWords }} / 20 </span>
                </div>
                <button class="start-btn" @click="goToInfinityGame">Начать</button>
            </div>
        </div>
    </div>
    <teleport to="body">
        <div v-if="showHint" class="hint-overlay" @click="closeHint"></div>
    </teleport>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

onMounted(async () => {
    if (localStorage.getItem('task_hint_shown')) return;

    setTimeout(() => {
        showHint.value = true;
    }, 500);
});

const closeHint = () => {
    showHint.value = false;
    localStorage.setItem('task_hint_shown', 'true');
};

const showHint = ref(false);
const currentDay = ref(1);
const completedDays = ref([1, 2, 3, 4, 5, 6]);
const learnedWords = ref(0);
const headerText = 'Заходи каждый день, изучай новые слова и получай награду!';
const router = useRouter();

const percentOfFill = computed(() => (learnedWords.value === 0 ? 4 : learnedWords.value * 5) + '%');

const overlayClass = computed(() => ({ 'index-up': showHint.value }));

const goToInfinityGame = () => {
    router.push('/');
    localStorage.setItem('task_hint_shown', 'true');
};
</script>

<style scoped>
.daily-reward-page {
    min-height: 100dvh;
    background: transparent;
    display: flex;
    flex-direction: column;
    padding-top: 40px;
}

.girl {
    width: 160px;
    margin: 0 auto;
    margin-bottom: -40px;
    z-index: 2;
}

.card {
    width: 90%;
    width: 314px;
    background: #fff;
    max-height: 171px;
    border-radius: 24px;
    padding: 32px 12px;
    margin-bottom: 24px;
}

.title {
    text-align: center;
    font-size: 22px;
    font-weight: 700;
    font-style: Bold;
    line-height: 120%;
    max-width: 175px;
    margin: 0 auto;
}

.subtitle {
    font-weight: 400;
    color: #262060;
    margin: 12px 0 0 0;
    font-size: 18px;
    line-height: 120%;
}

.block {
    border-radius: 20px;
    margin-bottom: 16px;
}

.block.task {
    background-color: #262060;
    max-width: 315px;
    height: 150px;
    padding: 14px 16px;
}

.block-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
    margin-top: 14px;
    color: #fff;
    text-align: center;
}

.block-title.task {
    text-align: start;
    align-items: flex-start;
}

.daily {
    width: 314px;
    height: 164px;
    background-image: url('@/assets/dailyIcon/background.webp');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.days {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #fff;
    max-width: 300px;
    height: 105px;
    margin: 0 8px 10px 7px;
    padding: 0 12px 0 13px;
    border-radius: 20px;
}

.day-container {
    width: 36px;
    height: 90px;
    background: #fff;
    border-radius: 10px;
    text-align: center;
    font-size: 14px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.day {
    width: 34px;
    height: 32px;
    border: 1px solid var(--Dark-purple, #262060);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;

    font-weight: 600;
    font-size: 18px;
    line-height: 100%;
    color: #262060;
}

.day.last-day {
    border-color: #ffc736;
}

.day.active {
    border: 1px solid #3e9d47;
}

.day.completed {
    border-color: #3e9d47;
}

.icon {
    width: 20px;
}
.star-container {
    max-height: 19px;
    height: 24px;
    font-weight: 700;
    font-size: 14px;
    line-height: 100%;
    margin-top: 2px;
    color: #262060;
}

.star-block {
    display: flex;
    align-items: center;
    position: relative;
}

.icon-chest {
    position: absolute;
    z-index: 2;
    bottom: 11px;
    left: 20%;
    width: 24px;
    height: 24px;
}

.star {
    width: 14px;
}

.task-text {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #fff;
}

.progress {
    font-weight: 600;
}

.start-btn {
    width: 100%;
    height: 34px;
    padding: 5px auto;
    border-radius: 12px;
    border: none;
    background: #fff;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
}

.progress-bar {
    position: relative;
    height: 21px;
    background: #ffffff;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
}

.progress-bar__fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: #ffc736;
    transition: width 0.3s;
}

.progress-bar__label {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
    color: #262060;
    z-index: 1;
    pointer-events: none;
}

.icon-wrapper {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/**/
.hint-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.8);
}

.index-up {
    z-index: 101;
}
.task-wrapper {
    max-width: 315px;
}

.hint-text-above {
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.2;
    z-index: 102;
}

.hint-text-above:first-child {
    margin-bottom: 20px;
}

.hint-text-above:last-child {
    margin-bottom: 14px;
}
</style>
