<template>
    <div class="relative all">
        <section class="page-container">
            <section class="page-container__result">
                <p  class="result-title">Планета уничтожена.</p>
                <p  class="text-result">Миссия провалена - метеорит достиг цели. Но это еще не конец. Попробуйте снова и улучшите результат!</p>
                <div class="container-result">
                    <p  class="result-title_left">Награда:</p>
                    <div class="result-stars">
                        <p class="result-add-star"> +0</p>
                        <img src="@/assets/icons/navBarIcon/star.svg" class="result-star" alt="Звезда" />
                    </div>
                </div>
                <div class="buttons">
                    <button  class="button button--purple" @click="goToGamePage">
                        Пройти еще раз
                        <img src="@/assets/img/arrow_icon.svg" alt="arrow" />
                    </button>
                    <button class="button button--purple d-mt-12" @click="goToMainPage">
                         Дальше
                         <img src="@/assets/img/arrow_icon.svg" alt="arrow" />
                    </button>
                    
                </div>
            </section> 
        </section>
        <img src="@/assets/Di_avatar/girl_head.png" alt="Di" class="avatar_result"/>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const goToMainPage = () => {
    router.push('/'); // Переходим на главную страницу
};
const goToGamePage = () => {
    window.location.reload();
};
// const resetGameState = () => {
//     // Сбросим состояние игры:
//     lives.value = 5;
//     currentQuestionIndex.value = 0;
//     answers.value = {};
// };
</script>
<style scoped lang="scss">
.page-container{
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: start;
    background-color: transparent;
    width: 100vw; 
    max-width: 414px;  
    gap: 23px;
    margin-top: 10px;
    &__result {
        display: flex;
        flex-direction: column;
        justify-content: center; 
        align-items: center; 
        gap: 12px;
        width:100%;
        max-width: 414px;
        max-height: 422px;
        height: 422px;
        background-color: #FFFFFF;
        border-radius: 20px;
        border: none;
        margin-left: 30px;
        margin-right: 30px; 
        color: #311D5D;
        padding: 20px;
    }
}
.container-result {
    width:100%;
}
.buttons {
    width:100%;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    margin-top: 30px;
}
.button {
    gap: 12px;
}
.result-title {
    font-weight: 700;
    font-size: 22px;
    line-height: 120%;
    letter-spacing: 0%;
    text-align: center;
    color: #311D5D;
}
.result-title_left {
    font-weight: 700;
    font-size: 22px;
    line-height: 120%;
    letter-spacing: 0%;
    text-align: start;
    color: #311D5D;
    width:100%;
}
.text-result {
    font-weight: 400;
    font-size: 18px;
    line-height: 120%;
    letter-spacing: 0%;
}
.result-add-star {
    font-weight: 800;
    font-size: 40px;
    line-height: 100%;
    letter-spacing: 0%;
    vertical-align: middle;
}
.result-star {
    width: 33px;
    height: auto;;
}
.result-stars {
    display: flex;
    width: 100%;
    gap:5px;
}
.avatar_result {
    position: absolute;
    bottom:104px;
    right:10px;
    z-index: 5000;
}

@media (max-height: 755px) {
    .avatar_result {
        width: 50%;
        height: auto;
        bottom:110px;
    }
}

@media (max-height: 715px) {
    .avatar_result {
        width: 40%;
        height: auto;
        bottom:114px;
    }
}

@media (max-height: 665px) {
    .avatar_result {
        width: 35%;
        height: auto;
        bottom:104px;
    }
    .page-container{
        margin-top: 0px;
        padding-top: 0px;
    }
}
@media (max-width: 328px) {
    .button {
        font-size: 16px;
    }
}
</style>
