<template>
    <div class="relative all">
        <img src="@/assets/img/Games/метеор_small.png" alt="meteor" class="meteor">
        <section class="page-container">
            
            <section class="image-section_game">
                <div class="image-container">
                    <img src="@/assets/img/Games/Планеты_big.png" alt="planet" class="planet">
                </div>
            </section> 
            <section class="page-container__game">
                <p class="question">?</p>
                <img src="@/assets/img/Games/sound.svg" alt="sound" class="sound1">
            </section> 
            <section class="page-container__button">
                <div class="line">
                    <button class="answer-button" @click="sendAnswer">Лебедь</button>
                    <button class="answer-button" @click="sendAnswer">Конь</button>
                </div>
                <div class="line">
                    <button class="answer-button" @click="sendAnswer">Щука</button>
                    <button class="answer-button" @click="sendAnswer">Собака</button>
                </div>
            </section>      
        </section>
    </div>
</template>
<script setup>

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
        // width:100%;
        // max-width: 414px;
        // height: calc(100vh - 550px);
        // max-height: 238px;
        height: 183px;
        background-color: #FFFFFF;
        border-radius: 20px;
        border: 3px solid #262060;
        margin-left: 30px;
        margin-right: 30px; 
        color: #311D5D;
       
    }
        &__button {
            width:100vw;
            max-width: 414px;
            margin-left: 30px;
            margin-right: 30px; 
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 93px;
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
    width: calc(50vw - 42.5px);
    border-radius: 16px;
    font-weight: 700;
    font-size: 18px;
    line-height: 120%;
    letter-spacing: 0%;
}
.line {
    display: flex;
    max-width: 354px;
    gap: 25px;
    margin-left: 30px;
    margin-right: 30px; 
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
@media (min-width: 415px) {
    .all, .meteor, .layout {
       overflow: visible; 
    }
}
@media (max-height: 700px) {
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
</style>
