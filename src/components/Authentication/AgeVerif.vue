<template>
    <div class="main-container auth-age">
        <div class="auth-age__inner">
            <img class="auth-age__girl" src="@/assets/Di_avatar/girl_thinking.webp" alt="" />

            <div class="auth-age__card">
                <div class="auth-age__text">
                    <h1 class="auth-age__title">Кто будет играть?</h1>
                    <div class="auth-age__description">
                        <p>Приложение с 14 лет.</p>
                        <p>Подключиться раньше можно только с родителями</p>
                    </div>
                </div>

                <div class="auth-age__actions">
                    <button
                        class="button button--purple auth-age__button"
                        type="button"
                        :disabled="saving"
                        @click="confirmAge(true)"
                    >
                        Я сам
                    </button>
                    <button
                        class="button button--purple auth-age__button"
                        type="button"
                        :disabled="saving"
                        @click="confirmAge(false)"
                    >
                        Мне нет 14 лет
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useOnboardingFlow } from '@/shared/composables/useOnboardingFlow';

const emit = defineEmits(['change-component']);
const { onboarding, goToStep } = useOnboardingFlow(emit);

const saving = ref(false);

/**
 * next_step в обоих случаях registration; разводит только needs_adult — на него
 * смотрит goToStep и показывает промежуточный экран «Ди нужен взрослый».
 */
const confirmAge = async (is14Plus) => {
    if (saving.value) return;
    saving.value = true;

    try {
        await onboarding.checkAge(is14Plus);
        goToStep();
    } finally {
        saving.value = false;
    }
};
</script>

<style scoped lang="scss">
// Геометрия и типографика — из макета, кадр 375×812:
// Ди 190×287 @ (8, 158), карточка 326×238 @ top 403, кнопки в строку с gap 25.
.auth-age {
    // Ди и карточка — одна композиция в потоке, центрированная по вертикали:
    // абсолютный `top` в процентах от высоты разводил их на высоком экране.
    &__inner {
        width: 100%;
        max-width: 420px;
        min-height: 100dvh;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        // В макете композиция чуть выше центра кадра (Ди на 158 из 812) —
        // компенсируем 7.4px паддингом снизу.
        padding-bottom: 3.95%;
    }

    &__girl {
        position: relative;
        margin-left: 2.1%;
        width: 50.6%;
        height: auto;
        z-index: 1;
    }

    &__card {
        position: relative;
        // Нахлёст карточки на Ди — 48.4px при ширине 375 (макет: низ Ди 451,
        // верх карточки 403). Процент считается от ШИРИНЫ, не от высоты.
        margin: -12.9% auto 0;
        z-index: 2;
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
    }

    &__title {
        margin: 0;
        width: 100%;
        text-align: center;
        color: #311d5d;
        font-size: 20px;
        font-weight: 700;
        line-height: 1.2;
    }

    &__description {
        width: 100%;
        color: #262060;
        font-size: 18px;
        font-weight: 400;
        line-height: 1.2;

        p {
            margin: 0;
        }
    }

    &__actions {
        display: flex;
        align-items: center;
        // В макете кнопки 84 + 181 с зазором 25 ровно заполняют 290px контента карточки.
        // Наш текст рендерится чуть шире, поэтому раскладываем по краям, а зазор — минимум.
        justify-content: space-between;
        gap: 12px;
    }

    // Кнопки — глобальная .button--purple (#262060, radius 16, 18px/600), как в макете.
    &__button {
        height: 40px;
        white-space: nowrap;

        &:disabled {
            opacity: 0.7;
        }
    }
}
</style>
