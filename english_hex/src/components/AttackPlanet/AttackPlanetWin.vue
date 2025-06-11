<template>
    <div class="relative all">
        <section class="page-container">
            <section class="page-container__result">
                <p  class="result-title">Планета спасена!</p>
                <p  class="text-result">Все ответы даны правильно. Защитная операция прошла идеально. </p>
                <div class="container-result">
                    <p  class="result-title_left">Награда:</p>
                    <div class="result-stars">
                        <p class="result-add-star"> +50</p>
                        <img src="@/assets/icons/navBarIcon/star.svg" class="result-star" alt="Звезда" />
                    </div>
                </div>
                <div class="buttons">
                    <button class="button button--purple d-mt-12" @click="goToMainPage">
                         Дальше
                         <img src="@/assets/img/arrow_icon.svg" alt="arrow" />
                    </button>
                </div>
            </section> 
        </section>
        <img src="@/assets/Di_avatar/girl_fly_win.png" alt="Di" class="avatar_result"/>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const goToMainPage = () => {
    router.push('/'); // Переходим на главную страницу
};
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
}
.avatar_result {
    position: absolute;
    bottom:124px;
    right:99px;
    z-index: 5000;
}

@media (max-height: 810px) {
    .page-container{
        gap: 18px;
        margin-top: 0px;
        padding-top:10px;
    }
    .avatar_result {
        position: absolute;
        bottom:120px;
        right:99px;
        z-index: 5000;
        width: 45%;
        height: auto;
    }
}
@media (max-height: 768px) {
    .page-container{
        gap: 18px;
        margin-top: 0px;
        padding-top:10px;
    }
    .avatar_result {
        position: absolute;
        bottom:120px;
        right:0px;
        z-index: 5000;
        width: 35%;
        height: auto;
    }
}
@media (max-height: 646px) {
    .avatar_result {
        position: absolute;
        bottom:124px;
        right:0px;
        z-index: 5000;
        width: 30%;
        height: auto;
    }
}

</style>
