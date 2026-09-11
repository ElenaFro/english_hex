<template>
    <div class="main-container auth-planet-story">
        <div class="auth-planet-story__scene">
            <button class="auth-planet-story__skip" type="button" @click="skipStory">
                Пропустить
            </button>

            <div class="auth-planet-story__popup">
                <div class="auth-planet-story__text">
                    <h2 class="auth-planet-story__title">Ты — наш герой!</h2>
                    <p class="auth-planet-story__message">
                        Я знала, что ты придёшь! Теперь это и твоя планета.
                    </p>
                </div>
                <button
                    class="button button--purple auth-planet-story__button"
                    type="button"
                    @click="goNext"
                >
                    Жми дальше
                    <img src="@/assets/icons/arrow_right.svg" alt="arrow" />
                </button>
            </div>

            <div class="img-container">
                <div class="img-container__girl-container">
                    <img src="@/assets/img/girl-flag.png" alt="" class="girl-img" />
                </div>
                <div class="img-container__planet-container">
                    <img class="planet-img" src="@/assets/img/planets/planet-img 1.png" alt="" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useOnboardingFlow } from '@/shared/composables/useOnboardingFlow';

const emit = defineEmits(['change-component']);
const { skipStory } = useOnboardingFlow(emit);

const goNext = () => {
    emit('change-component', 'OnboardingSectorDanger');
};
</script>

<style scoped lang="scss">
// Геометрия и типографика — из макета, кадр 375×812:
// карточка 326×217 @ top 198, Ди 247×431 @ (125, 370), планета 408×406 @ (-20, 709).
.auth-planet-story {
    &__scene {
        width: 100%;
        max-width: 420px;
        min-height: 100dvh;
        position: relative;
        overflow: hidden;
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

    &__popup {
        position: absolute;
        top: 24.4%;
        left: 50%;
        transform: translateX(-50%);
        z-index: 4;
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

    &__message {
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

    // «Ди на планете» — одна композиция, а не два независимо позиционированных куска:
    // раньше top у обоих считался в процентах от высоты сцены, а размеры — от ширины,
    // поэтому на высоком экране планета уезжала из-под ног (при 1000px зазор уже 36px).
    // Теперь это блок 375×442 из макета (от макушки Ди до низа кадра), прибитый к низу:
    // взаимное положение фигуры и планеты зафиксировано в процентах от него.
    .img-container {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        // Ширину ограничиваем ещё и высотой экрана (442/812 кадра ⇒ 46.15dvh),
        // иначе на низком экране ноги уходят за нижний край.
        width: min(100%, 46.15dvh);
        margin-inline: auto;
        aspect-ratio: 375 / 442;
        pointer-events: none;

        &__girl-container {
            position: absolute;
            left: 33.3%;
            top: 0;
            width: 66%;
            z-index: 5;

            .girl-img {
                width: 100%;
                height: auto;
            }
        }

        &__planet-container {
            position: absolute;
            left: -5.3%;
            // 338.6 / 442 — расстояние от макушки Ди до верха планеты в макете.
            top: 76.6%;
            width: 108.8%;
            z-index: 1;

            .planet-img {
                width: 100%;
                height: auto;
            }
        }
    }
}
</style>
