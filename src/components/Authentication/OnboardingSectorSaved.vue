<template>
    <div class="main-container auth-saved">
        <div class="auth-saved__inner">
            <button class="auth-saved__skip" type="button" @click="skipStory">Пропустить</button>

            <img
                class="auth-saved__planet"
                src="@/assets/onboarding/sector-restored-planet.svg"
                alt=""
            />

            <div class="auth-saved__message">
                <div class="auth-saved__text">
                    <p class="auth-saved__title">Первый сектор спасен!</p>
                    <p class="auth-saved__description">
                        Ты восстановил первый сектор! Это лишь старт. Что дальше?
                    </p>
                </div>
                <button
                    class="button button--purple auth-saved__button"
                    type="button"
                    @click="goToStep()"
                >
                    Хочу узнать
                    <img src="@/assets/img/arrow_icon.svg" alt="arrow" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useOnboardingFlow } from '@/shared/composables/useOnboardingFlow';

const emit = defineEmits(['change-component']);
const { goToStep, skipStory } = useOnboardingFlow(emit);
</script>

<style scoped lang="scss">
// Геометрия и типографика — из макета, кадр 375×812 (узел 5152:51, экран в потоке):
// иллюстрация 330×395 @ (13, 136), карточка 326×217 @ top 421.
.auth-saved {
    // Планета и карточка — одна композиция в потоке, центрированная по вертикали:
    // абсолютный `top` в процентах от высоты разводил их на высоком экране
    // (нахлёст 110px при 812 превращался в зазор при 1100+).
    &__inner {
        width: 100%;
        max-width: 420px;
        min-height: 100dvh;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        // В макете композиция стоит выше центра кадра (планета на 136 из 812).
        // Чистое центрирование опустило бы её на 18.7px — компенсируем паддингом,
        // половина которого уходит в смещение вверх.
        padding-bottom: 9.97%;
    }

    &__skip {
        position: absolute;
        top: 19px;
        right: 19px;
        z-index: 5;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 132px;
        height: 31px;
        border: 0;
        border-radius: 16px;
        padding: 0 24px;
        background: rgba(211, 206, 255, 0.2);
        color: #ffffff;
        font-size: 18px;
        font-weight: 600;
        line-height: 1.2;
    }

    &__planet {
        position: relative;
        margin-left: 3.5%;
        width: 88%;
        z-index: 2;
    }

    &__message {
        position: relative;
        // Нахлёст карточки на планету — 110px при ширине 375 (макет: низ планеты 531,
        // верх карточки 421). Процент считается от ШИРИНЫ, поэтому от высоты не зависит.
        margin: -29.33% auto 0;
        z-index: 3;
        display: flex;
        flex-direction: column;
        gap: 30px;
        width: min(86.9%, calc(100% - 24px));
        padding: 34px 18px 32px;
        border-radius: 20px;
        background: #f8f5ff;
        overflow: hidden;
    }

    &__text {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        line-height: 1.2;
    }

    &__title {
        margin: 0;
        width: 100%;
        text-align: center;
        color: #311d5d;
        font-size: 22px;
        font-weight: 700;
        line-height: 1.2;
    }

    &__description {
        margin: 0;
        width: 100%;
        color: #262060;
        font-size: 18px;
        font-weight: 400;
        line-height: 1.2;
    }

    // Кнопка — глобальная .button--purple (#262060, radius 16, 18px/600), как в макете.
    &__button {
        align-self: flex-start;
        height: 40px;

        img {
            width: 23.5px;
        }
    }
}
</style>
