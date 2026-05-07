<template>
    <div class="page-content plan-page-content">
        <div class="scroll-container payment-scroll">
            <h1 class="payment-title">Выбрать способ оплаты</h1>

            <div class="payment-methods">
                <button
                    v-for="method in paymentMethods"
                    :key="method.id"
                    class="payment-option"
                    :class="{ 'payment-option--selected': selectedMethod === method.id }"
                    type="button"
                    @click="selectedMethod = method.id"
                >
                    <span
                        class="radio"
                        :class="{ 'radio--active': selectedMethod === method.id }"
                    ></span>
                    <img :src="method.logo" :alt="method.id" class="payment-option__logo" />
                </button>
            </div>

            <div class="plan-summary">
                <p class="plan-summary__row">
                    <span class="plan-summary__label">Выбранный план:</span>
                    {{ currentPlan.label }}
                </p>
                <p class="plan-summary__row">
                    <span class="plan-summary__label">Цена:</span>
                    {{ currentPlan.price }}
                </p>
                <div class="plan-summary__row plan-summary__auto" @click="autoRenew = !autoRenew">
                    <span class="radio" :class="{ 'radio--active': autoRenew }"></span>
                    <span>Автопродление</span>
                </div>
            </div>

            <div class="advantages">
                <p class="advantages__title">Преимущества:</p>
                <ul class="advantages__list">
                    <li>Все категории</li>
                    <li>Без рекламы</li>
                    <li>Новые обновления</li>
                </ul>
            </div>

            <button class="button button--blue" type="button">Оплатить</button>
            <p class="legal-text">
                Оплачивая, вы соглашаетесь с
                <a href="#" class="legal-text__link">Условиями использования</a>
                и
                <a href="#" class="legal-text__link">Политикой конфиденциальности</a>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import spbLogo from '@/assets/icons/pay-system/spb.svg';
import paypalLogo from '@/assets/icons/pay-system/Paypal_icon.svg';

const route = useRoute();

const selectedMethod = ref('sbp');
const autoRenew = ref(true);

const paymentMethods = [
    { id: 'sbp', logo: spbLogo },
    { id: 'paypal', logo: paypalLogo },
];

const plans = {
    month_1: { label: '1 месяц', price: '299 руб' },
    month_3: { label: '3 месяца', price: '799 руб' },
    month_6: { label: '6 месяцев', price: '1199 руб' },
    year_1: { label: '1 год', price: '1599 руб' },
};

const currentPlan = computed(() => plans[route.query.plan] ?? plans.month_6);
</script>

<style scoped lang="scss">
.page-content.plan-page-content {
    padding-top: 0;
}

.plan-page-content {
    border-radius: 0 !important;
}

.payment-scroll {
    padding-top: 4px;
    gap: 16px;
}

.payment-title {
    font-size: 24px;
    font-weight: 800;
    color: #311d5d;
    line-height: 1.2;
}

.payment-methods {
    display: flex;
    flex-direction: column;
    gap: 17px;
}

.payment-option {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 14px;
    background: #ffffff;
    border: 2px solid #311d5d;
    border-radius: 15px;
    padding: 14px 23px;
    cursor: pointer;
    transition: border-color 0.15s;
    box-sizing: border-box;

    &__logo {
        display: flex;
        align-items: center;
    }
}

.radio {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #311d5d;
    box-sizing: border-box;
    transition: box-shadow 0.15s;

    &--active {
        background: #311d5d;
        box-shadow: inset 0 0 0 2px #ffffff;
    }

    &--sm {
        width: 18px;
        height: 18px;
    }
}

.plan-summary {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 18px;

    &__row {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
        color: #311d5d;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    &__label {
        font-weight: 700;
    }

    &__auto {
        margin-top: 2px;
        cursor: pointer;
        user-select: none;
    }
}

.advantages {
    &__title {
        margin: 0 0 6px;
        font-size: 18px;
        font-weight: 700;
        color: #311d5d;
        line-height: 1.2;
    }

    &__list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;

        li {
            font-size: 18px;
            font-weight: 600;
            color: #311d5d;
            padding-left: 28px;
            position: relative;

            &::before {
                content: '✓';
                position: absolute;
                left: 0;
                color: #311d5d;
                font-weight: 800;
            }
        }
    }
}

.pay-btn {
    width: 100%;
    background: #311d5d;
    border: none;
    border-radius: 24px;
    color: #ffffff;
    font-size: 18px;
    font-weight: 700;
    font-family: Mulish, sans-serif;
    padding: 14px;
    cursor: pointer;
    transition: opacity 0.15s;
    margin-top: 12px;

    &:hover {
        opacity: 0.9;
    }

    &:active {
        opacity: 0.8;
    }
}

.legal-text {
    font-size: 12px;
    font-weight: 400;
    color: #311d5d;
    line-height: 1.4;

    &__link {
        color: #311d5d;
        text-decoration: underline;
    }
}
</style>
