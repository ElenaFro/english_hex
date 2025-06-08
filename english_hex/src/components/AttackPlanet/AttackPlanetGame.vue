<template>
    <div class="relative all">
        <img src="@/assets/img/Games/метеор_small.png" alt="meteor" class="meteor">
        <section class="page-container">
            
            <section class="image-section_game">
                <div class="image-container">
                    <img src="@/assets/img/Games/Планеты_big.png" alt="planet" class="planet">
                </div>
            </section> 
            <button class="page-container__game" @click="playSound">
                <p class="question">?</p>
                <img src="@/assets/img/Games/sound.svg" alt="sound" class="sound1">
            </button> 
            <audio ref="soundRef" :src="currentQuestion.audio"></audio>
            <section class="page-container__button"  v-if="currentQuestion.options">
                <div class="line" v-for="(option, index) in currentQuestion.options" :key="index">
                    <button 
                        class="answer-button" 
                        :style="{ backgroundColor: getButtonColor(option) }" 
                        @click="sendAnswer(option)">
                        {{ option }}
                    </button>
                </div>
            </section>
        </section>
    </div>
</template>
<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue';

import soundUrl from "@/assets/audio/sound.mp3";
import soundUrl2 from "@/assets/audio/run.mp3";
const soundRef = ref(null);

const emit = defineEmits(); 
const lives = ref(5); // Количество жизней
const currentQuestionIndex = ref(0); // Индекс текущего вопроса
const questions = ref([
    {
        audio: soundUrl,
        correctAnswer: 'Утка',
        options: ['Утка', 'Конь', 'Щука', 'Собака'], // Варианты ответов
    },
        {
        audio: soundUrl2,
        correctAnswer: 'Бег',
        options: ['Корова', 'Сметана', 'Локоть', 'Бег'], // Варианты ответов
    },
    // Добавьте другие вопросы
]);

const answers = ref({}); // Хранение состояния кнопок
const currentQuestion = computed(() => {
       return questions.value[currentQuestionIndex.value] || {}; // Возвращаем пустой объект, если вопрос не найден
   });

const sendAnswer = (answer) => {
    const currentQuestionData = currentQuestion.value;

    if (answer === currentQuestionData.correctAnswer) {
        answers.value[answer] = '#31AF40'; // Установить цвет кнопки в зеленый
        
        setTimeout(nextQuestion, 2000); // Переход к следующему вопросу через 1 секунду
    } else {
        answers.value[answer] = '#881717'; // Установить цвет кнопки в красный
        lives.value--; // Уменьшить количество жизней
            if (lives.value > 0 && currentQuestionIndex.value >= questions.value.length) {
                console.log('Resultlives.value',lives.value);
            setTimeout(() => {
                 emit('switch-component', 'AttackPlanetResult');
            }, 3000);
        }
        if (lives.value <= 0) {
            console.log('Loss lives.value',lives.value);
            setTimeout(() => {
                 emit('switch-component', 'AttackPlanetLoss');
            }, 3000);
        }
    }
};

const nextQuestion = () => {
    currentQuestionIndex.value++;
    if (lives.value == 5 && currentQuestionIndex.value >= questions.value.length) {
        console.log('Win lives.value',lives.value);
        // Эмитируем событие для переключения компонента
        emit('switch-component', 'AttackPlanetWin');
    }  else {
      if (lives.value < 5 && currentQuestionIndex.value >= questions.value.length) {
        console.log('lives.value',lives.value);
        // Эмитируем событие для переключения компонента
        emit('Result switch-component', 'AttackPlanetResult');
        } 
    } 
};

const getButtonColor = (answer) => {
    return answers.value[answer] || 'white'; // Вернуть цвет кнопки или белый по умолчанию
};

const playSound = () => {
	if (soundRef.value) {
		soundRef.value.currentTime = 0
		soundRef.value.play()
	}
}

onMounted(() => {
    // Здесь можно подгрузить вопросы с сервера
});
</script>
<style scoped lang="scss">
.page-container{
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: transparent;
    width: 100vw; 
    max-width: 414px;  
    gap: 23px;
    &__game {
        display: flex;
        flex-direction: column;
        justify-content: center; 
        align-items: center; 
        gap: 10px;
        width:173px;
        height: 183px;
        background-color: #FFFFFF;
        border-radius: 20px;
        border: 3px solid #262060;
        margin-left: 30px;
        margin-right: 30px; 
        color: #311D5D;
       
    }
        &__button {
            display: flex;
            flex-wrap: wrap; 
            margin: -5px; 
        }
}

.image-container {
    display: flex;
    justify-content: center; 
    align-items: center; 
}

.meteor {
    position: absolute;
    width:74px;
    height:94px;
    right: -4px;
    top: -25px; 
    z-index: 3000;
}

.image-section_game{
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center; 
    align-items: center;
}

.answer-button {
    background-color: #fff !important;
    padding: 9px 24px;
    line-height: 22px;
    color: #262060;
    width: 100%; 
    padding: 9px 24px; 
    border-radius: 16px;
    font-weight: 700;
    font-size: 18px;
    line-height: 120%;
    letter-spacing: 0%;
}
.line {
    display: flex;
    width: calc(50% - 12.5px); /* Устанавливаем ширину для 2 столбиков с учетом отступов */
    margin: 5px; 
}
.question {
    font-weight: 800;
    font-size: 71px;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;
    vertical-align: middle;
}
.sound1 {
    width: 43px;
    height: auto;
}
.sound0 {
    border : none;
    background-color: transparent;
}
@media (min-width: 415px) {
    .all, .meteor, .layout {
       overflow: visible; 
    }
}
@media (max-height: 740px) {
    .page-container__game {
        gap: 8px;
        width:143px;
        height: 153px; 
    }
    .question {
        font-size: 60px;
    }
    .page-container{
        gap: 18px;
    }
    .sound1 {
        width: 38px;
        height: auto;
    }
    .planet {
        width: 200px;
        height: auto;
    }
    .page-container__button {
        margin-bottom: 93px;
    }
}
@media (max-height: 668px) {
    .planet {
        width: 180px;
        height: auto;
    }
    .page-container__game {
        gap: 7px;
        width:140px;
        height: 140px; 
    }
    .page-container{
        gap: 16px;
    }
    .sound1 {
        width: 34px;
        height: auto;
    }
}
@media (max-height: 568px) {
    .planet {
        width: 160px;
        height: auto;
    }
    .page-container__game {
        gap: 5px;
        width:140px;
        height: 140px; 
    }
    .page-container{
        gap: 12px;
    }
    .sound1 {
        width: 30px;
        height: auto;
    }
    .question {
        font-size: 50px;
    }
    .line {
    display: flex;
    width: calc(50% - 6px); /* Устанавливаем ширину для 2 столбиков с учетом отступов */
    margin: 3px; 
}
}
</style>
