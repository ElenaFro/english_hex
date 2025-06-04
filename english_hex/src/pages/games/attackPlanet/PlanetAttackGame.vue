<template>
    <div class="relative">
        <img src="@/assets/img/Games/метеор_small.png" alt="meteor" class="meteor">
        <section class="page-container">
            
            <section class="image-section_game">
                <div class="image-container">
                    <img src="@/assets/img/Games/Планеты_big.png" alt="planet" class="planet">
            </div>
            </section> 
            <section class="page-container__game">
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
        width:100%;
        max-width: 414px;
        height: calc(100vh - 550px);
        max-height: 238px;
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
    justify-content: center; // Центрируем изображения
    align-items: center; // Центрируем изображения по вертикали
}

.meteor {
    position: absolute;
    right: 0px;
    top: -25px; 
    z-index: 3000;
}

.image-sectionn_game{
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
}
.line {
    display: flex;
    max-width: 354px;
    gap: 25px;
    margin-left: 30px;
    margin-right: 30px; 
}
</style>
