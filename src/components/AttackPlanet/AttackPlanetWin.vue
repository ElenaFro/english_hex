<template>
    <div class="relative all">
        <section class="page-container">
            <section class="page-container__result">
                <p class="result-title">Планета спасена!</p>
                <p class="text-result">
                    Все ответы даны правильно. Защитная операция прошла идеально.
                </p>
                <div class="container-result">
                    <p class="result-title_left">Награда:</p>
                    <div class="result-stars">
                        <p class="result-add-star">+50</p>
                        <img
                            src="@/assets/icons/navBarIcon/star.svg"
                            class="result-star"
                            alt="Звезда"
                        />
                    </div>
                </div>
                <div class="buttons">
                    <button class="button button--purple d-mt-12" @click="goToPlanet">
                        Дальше
                        <img src="@/assets/img/arrow_icon.svg" alt="arrow" />
                    </button>
                </div>
                <img src="@/assets/Di_avatar/girl_fly_win.png" alt="Di" class="avatar_result" />
            </section>
        </section>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const goToPlanet = () => {
    router.push({ name: 'myPlanet', query: { earnedStars: 50, gameSource: 'planet_attack' } });
};
</script>
<style scoped lang="scss">
.page-container {
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: transparent;
    width: 100vw;
    max-width: 414px;
    gap: 23px;
    margin-top: 10px;
    &__result {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        width: 100%;
        max-width: 414px;
        max-height: 422px;
        height: 422px;
        background-color: #ffffff;
        border-radius: 20px;
        border: none;
        margin-left: 30px;
        margin-right: 30px;
        color: #311d5d;
        padding: 20px;
    }
}
.container-result {
    width: 100%;
}
.buttons {
    width: 100%;
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
    color: #311d5d;
}
.result-title_left {
    font-weight: 700;
    font-size: 22px;
    line-height: 120%;
    letter-spacing: 0%;
    text-align: start;
    color: #311d5d;
    width: 100%;
    margin-bottom: 12px;
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
    height: auto;
}
.result-stars {
    display: flex;
    width: 100%;
    gap: 5px;
}
.avatar_result {
    position: absolute;
    bottom: -210px;
    right: 21%;
    z-index: 500;
}

@media (max-height: 810px) {
    .page-container {
        gap: 18px;
        margin-top: 0px;
        padding-top: 10px;
    }
}
@media (max-height: 768px) {
    .page-container {
        gap: 18px;
        margin-top: 0px;
        padding-top: 10px;
    }
}
</style>
