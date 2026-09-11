<template>
    <div class="main-container auth-sector">
        <div class="auth-sector__inner">
            <button class="auth-sector__skip" type="button" @click="skipStory">Пропустить</button>

            <img class="auth-sector__girl" src="@/assets/onboarding/di-sector-danger.png" alt="" />

            <div class="auth-sector__message">
                <p class="auth-sector__text">
                    Первый сектор почти разрушен. Чтобы вернуть его к жизни, нужно вернуть 3 слова.
                </p>
                <button
                    class="button button--purple auth-sector__button"
                    type="button"
                    @click="goNext"
                >
                    Помочь Ди
                    <img src="@/assets/img/arrow_icon.svg" alt="arrow" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useOnboardingFlow } from '@/shared/composables/useOnboardingFlow';
import { FRONT_EVENTS, trackEventOnce } from '@/shared/analytics/onboardingAnalytics';

const emit = defineEmits(['change-component']);
const { skipStory } = useOnboardingFlow(emit);

const goNext = () => {
    trackEventOnce(FRONT_EVENTS.HELP_DI_CLICKED);
    emit('change-component', 'OnboardingCardsLesson');
};
</script>

<style scoped lang="scss">
// Геометрия и типографика — из макета, кадр 375×812:
// Ди 277×290 @ (83, 174), карточка 326×217 @ top 435.
.auth-sector {
    // Ди и карточка — одна композиция в потоке, центрированная по вертикали.
    // Раньше обе были абсолютными с `top` в процентах от высоты, а размеры — от ширины,
    // поэтому на высоком экране карточка отрывалась от Ди (нахлёст 28.7 при 812,
    // 3.5 при 890, −31.9 при 1000), а на низком Ди тонула в карточке на 110px.
    &__inner {
        width: 100%;
        max-width: 420px;
        min-height: 100dvh;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
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

    &__girl {
        position: relative;
        margin-left: 22.1%;
        width: 73.9%;
        z-index: 2;
    }

    &__message {
        position: relative;
        // Нахлёст карточки на Ди — 28.7px при ширине 375 (в макете 29). Процент здесь
        // считается от ШИРИНЫ контейнера, поэтому нахлёст не зависит от высоты экрана.
        margin: -7.65% auto 0;
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
        margin: 0;
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
