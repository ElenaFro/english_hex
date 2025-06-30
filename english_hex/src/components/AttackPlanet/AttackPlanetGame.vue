<template>
    
    <div class="relative all">
        <img src="@/assets/img/Games/метеор_small.png" alt="meteor" class="meteor" :style="{ top: meteorTop, right: meteorRight, width: meteorWidth }">
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
            <audio ref="soundRef"></audio>
            <section class="page-container__button"  v-if="currentQuestion.options">
                <div class="line" v-for="(option, index) in currentQuestion.options" :key="index">
                    <button 
                        class="answer-button" 
                        :style="buttonStyles[index]"
                        @click="sendAnswer(option)"
                        :disabled="!isQuestionPlayed"> 
                        {{ option }}
                    </button>
                </div>
            </section>
        </section>
    </div>
</template>
<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue';

const soundRef = ref(null);

const emit = defineEmits(); 
const lives = ref(5); 
const earnedStars = ref(parseInt(localStorage.getItem('earnedStars')) || 0); 

const isQuestionPlayed = ref(false); 

const playSound = () => {
    if (soundRef.value) {
        const audioUrl = `http://62.109.0.225:8000/storage/categories/15/video/${currentQuestion.value.id}/audio/${currentQuestion.value.audio}`;
        soundRef.value.src = audioUrl;
        soundRef.value.currentTime = 0;
        soundRef.value.play();
        isQuestionPlayed.value = true; 
        console.log("audioUrl", audioUrl)
    }
};

const onAudioEnded = () => {
    isQuestionPlayed.value = true; 
    const currentQuestionData = currentQuestion.value;
    resetButtonStyles(currentQuestionData, false); 
};

const currentQuestionIndex = ref(0); 
const questions = ref([]);

async function fetchQuestions() {
    try {
        const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vNjIuMTA5LjAuMjI1OjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzUwNzQzMjE4LCJleHAiOjE3NTg1MTkyMTgsIm5iZiI6MTc1MDc0MzIxOCwianRpIjoiZ21uVFpGM2dKMkVMeU0wcCIsInN1YiI6IjIiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.36MM59TNLhHSVA5zvJhdQQMdcW0gci9hbSkiASLppc0'; // Замените на ваш токен
        const response = await fetch('http://62.109.0.225:8000/api/games/planet-attack/get/15', {
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${token}`, 
            }
        });
        if (!response.ok) {
            throw new Error('Сеть не отвечает');
        }
        const data = await response.json();
        questions.value = data.map(question => ({
            id: question.id,  
            audio: question.audio, 
            correctAnswer: question.correctAnswer,
            options: question.options,
        }));
    } catch (error) {
        console.error('Ошибка при получении вопросов:', error);
    }
}

fetchQuestions();

const buttonStyles = ref({}); 

const resetButtonStyles = (currentQuestionData, disableButtons = false) => {
    currentQuestionData.options.forEach((option, index) => {
        buttonStyles.value[index] = { 
            backgroundColor: '#fff', 
            color: '#262060', 
            border: disableButtons ? '2px solid rgba(118, 118, 118, 0.3)' : '2px solid rgba(49, 29, 93, 1)' 
        }; 
    });
};

const currentQuestion = computed(() => {
       return questions.value[currentQuestionIndex.value] || {}; 
   });

const sendAnswer = (answer) => {
    const currentQuestionData = currentQuestion.value;
    resetButtonStyles(currentQuestionData); 
    if (answer === currentQuestionData.correctAnswer) {
        buttonStyles.value[currentQuestionData.options.indexOf(answer)] = { 
            backgroundColor: '#31AF40', 
            color: '#FFFFFF', 
            border: 'none'
        };
        setTimeout(nextQuestion, 1000); 
    } else {
        buttonStyles.value[currentQuestionData.options.indexOf(answer)] = { 
            backgroundColor: '#881717', 
            color: '#FFFFFF', 
            border: 'none'
        };
        
        lives.value--; 
        console.log('lives.value',lives.value);

        meteorTop.value = `calc(${meteorTop.value} + 2vh)`; 
        meteorRight.value = `${parseInt(meteorRight.value) + 4}px`;  
        meteorWidth.value = `${parseInt(meteorWidth.value) + 6}px`; 

        emit('update:lives', lives.value);
        emit('update:earnedStars', earnedStars.value);
        if (lives.value <= 0) {
            emit('switch-component', 'AttackPlanetLoss');
        }
    }
};

const nextQuestion = () => {
    const currentQuestionData = currentQuestion.value; 
    resetButtonStyles(currentQuestionData, true);
    isQuestionPlayed.value = false; 

    if (lives.value > 0 && currentQuestionIndex.value < questions.value.length - 1) {
        currentQuestionIndex.value++;
    } else if (lives.value === 5 && currentQuestionIndex.value >= questions.value.length - 1) {
        earnedStars.value += 50 ; 
        localStorage.setItem('earnedStars', earnedStars.value);
        emit('update:earnedStars', earnedStars.value);
        emit('switch-component', 'AttackPlanetWin');
    } else if (lives.value > 0 && lives.value < 5 && currentQuestionIndex.value >= questions.value.length - 1) {
        earnedStars.value += (50 - 5 * (5 - lives.value)); 
        localStorage.setItem('earnedStars', earnedStars.value); 
        emit('switch-component', 'AttackPlanetResult');
    } else if (lives.value <= 0) {
        emit('switch-component', 'AttackPlanetLoss');
    }
};

const meteorTop = ref('-25px'); 
const meteorRight = ref('-4px');
const meteorWidth = ref('74px'); 

onMounted(() => {
    if (soundRef.value) {
        soundRef.value.addEventListener('ended', onAudioEnded);
    }
});

import { onBeforeUnmount } from 'vue';

onBeforeUnmount(() => {
    if (soundRef.value) {
        soundRef.value.removeEventListener('ended', onAudioEnded);
    }
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
    padding-top: 20px;
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
    height:auto;
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
    background-color: #fff ;
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
    width: calc(50% - 12.5px); 
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
@media (max-height: 800px) {
    .page-container{
        gap: 18px;
        padding-top: 10px;
    }

}
@media (max-height: 780px) {
    .page-container__game {
        gap: 8px;
        width:163px;
        height: 173px; 
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
@media (max-height: 600px) {
    .planet {
        width: 150px;
        height: auto;
    }
    .page-container__game {
        gap: 5px;
        width:130px;
        height: 135px; 
    }
    .page-container{
        gap: 12px;
    }
    .sound1 {
        width: 28px;
        height: auto;
    }
    .question {
        font-size: 46px;
    }
    .line {
    display: flex;
    width: calc(50% - 6px); 
    margin: 3px; 
    }
}
</style>
