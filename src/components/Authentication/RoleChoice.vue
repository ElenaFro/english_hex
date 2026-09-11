<template>
    <div class="role-choice">
        <div class="role-choice__character">
            <img src="@/assets/Di_avatar/girl_thinking.webp" alt="" class="role-choice__girl" />
            <div class="role-choice__bubble">
                <p class="role-choice__bubble-text">
                    Почти готово.<br />Как ты будешь мне помогать?
                </p>
            </div>
        </div>

        <Loader v-if="loading" class="role-choice__loader" />

        <div v-else class="role-choice__answers">
            <button
                v-for="option in options"
                :key="option.value"
                class="role-choice__answer"
                type="button"
                :disabled="saving"
                @click="selectRole(option.value)"
            >
                {{ option.label }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import Loader from '@/shared/components/Loader.vue';
import { useOnboardingFlow } from '@/shared/composables/useOnboardingFlow';

const emit = defineEmits(['change-component']);
const { onboarding, goToStep } = useOnboardingFlow(emit);

const loading = ref(true);
const saving = ref(false);

// Роли не хардкодим: показываем label из content.roles, обратно шлём value.
const options = computed(() => onboarding.roles);

const selectRole = async (value) => {
    if (saving.value) return;
    saving.value = true;

    try {
        await onboarding.selectRole(value);
        goToStep();
    } finally {
        saving.value = false;
    }
};

onMounted(async () => {
    await onboarding.loadContent();
    loading.value = false;
});
</script>

<style scoped lang="scss">
// Геометрия и типографика — из макета, кадр 375×812:
// Ди 190×287 @ (8, 158), пузырь-текст 151px @ (201, 100),
// список ответов 321px @ top 390, карточка ответа p-20 / radius 20 / текст 20px.
.role-choice {
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
    min-height: 100dvh;
    position: relative;
    // По вертикали не режем: на низком экране композиция (661px) выше вьюпорта,
    // и её нужно проскроллить, а не обрезать.
    overflow-x: hidden;
    // Пузырь, Ди и список ответов — одна композиция, центрированная по вертикали:
    // у всех трёх `top`/`bottom` считались в процентах от высоты, а размеры — от ширины,
    // поэтому на высоком экране они разъезжались.
    display: flex;
    flex-direction: column;
    justify-content: center;

    // Блок «пузырь + Ди»: от верха пузыря (78) до низа Ди (450.8) в кадре 375×812.
    &__character {
        position: relative;
        width: 100%;
        aspect-ratio: 375 / 372.8;
        pointer-events: none;
    }

    &__girl {
        position: absolute;
        left: 2.1%;
        // (158 − 78) / 372.8 — Ди ниже верха пузыря на 80px в макете.
        top: 21.46%;
        width: 50.6%;
        height: auto;
    }

    &__bubble {
        position: absolute;
        left: 45.6%;
        top: 0;
        width: 47.7%;
        // 109 / 372.8 — высота пузыря из макета относительно блока композиции.
        min-height: 29.24%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 18px;
        border-radius: 50%;
        background: #ffffff;
        text-align: center;

        // Хвостик пузыря: два кружка под ним, как в макете (23×14 и 17×12).
        &::before,
        &::after {
            content: '';
            position: absolute;
            border-radius: 50%;
            background: #ffffff;
        }

        &::before {
            width: 23px;
            height: 14px;
            left: -5px;
            bottom: -20px;
        }

        &::after {
            width: 17px;
            height: 12px;
            left: -22px;
            bottom: -34px;
        }
    }

    &__bubble-text {
        margin: 0;
        color: #311d5d;
        font-size: 16px;
        font-weight: 700;
        line-height: 1.2;
    }

    &__loader {
        position: absolute;
        left: 50%;
        bottom: 20%;
        transform: translateX(-50%);
    }

    &__answers {
        position: relative;
        // Нахлёст списка ответов на блок «пузырь + Ди» — 60.8px при ширине 375
        // (макет: низ Ди 450.8, верх списка 390). Процент — от ШИРИНЫ, не от высоты.
        margin: -16.21% auto 0;
        display: flex;
        flex-direction: column;
        gap: 15px;
        width: min(85.6%, calc(100% - 30px));
        z-index: 2;
    }

    &__answer {
        width: 100%;
        border: 0;
        border-radius: 20px;
        padding: 20px;
        background: #f8f5ff;
        color: #311d5d;
        text-align: left;
        font-size: 20px;
        font-weight: 700;
        line-height: 1.2;
        cursor: pointer;
    }
}
</style>
