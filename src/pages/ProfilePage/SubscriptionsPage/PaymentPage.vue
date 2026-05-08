<template>
    <div class="page-content plan-page-content">
        <div class="scroll-container payment-scroll">

            <!-- Ожидание подтверждения оплаты -->
            <template v-if="isWaiting">
                <div class="waiting-block">
                    <div class="waiting-spinner" />
                    <p class="waiting-title">Ожидаем подтверждения оплаты</p>
                    <p class="waiting-hint">
                        Окно оплаты открыто в новой вкладке. После оплаты эта страница обновится
                        автоматически.
                    </p>
                    <button class="cancel-btn" type="button" @click="cancelWaiting">Отмена</button>
                </div>
            </template>

            <!-- Форма выбора способа оплаты -->
            <template v-else>
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
                        {{ currentPlan?.name ?? '—' }}
                    </p>
                    <p class="plan-summary__row">
                        <span class="plan-summary__label">Цена:</span>
                        {{ currentPlan ? `${currentPlan.price} руб` : '—' }}
                    </p>
                    <div
                        class="plan-summary__row plan-summary__auto"
                        @click="autoRenew = !autoRenew"
                    >
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

                <p v-if="error" class="error-text">{{ error }}</p>

                <button
                    class="button button--blue"
                    type="button"
                    :disabled="isLoading || !currentPlan"
                    @click="pay"
                >
                    {{ isLoading ? 'Подождите...' : 'Оплатить' }}
                </button>

                <p class="legal-text">
                    Оплачивая, вы соглашаетесь с
                    <a href="#" class="legal-text__link">Условиями использования</a>
                    и
                    <a href="#" class="legal-text__link">Политикой конфиденциальности</a>
                </p>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPlans, getCurrentSubscription, initiateSubscription } from '@/api/subscription';
import spbLogo from '@/assets/icons/pay-system/spb.svg';
import paypalLogo from '@/assets/icons/pay-system/Paypal_icon.svg';

const route = useRoute();
const router = useRouter();

const selectedMethod = ref('sbp');
const autoRenew = ref(true);
const isLoading = ref(false);
const isWaiting = ref(false);
const error = ref('');

const plans = ref([]);
const currentPlan = computed(
    () => plans.value.find((p) => p.id === Number(route.query.plan_id)) ?? null,
);

const paymentMethods = [
    { id: 'sbp', logo: spbLogo },
    { id: 'paypal', logo: paypalLogo },
];

onMounted(async () => {
    try {
        const { data } = await getPlans();
        plans.value = data;
    } catch {
        error.value = 'Не удалось загрузить данные плана.';
    }
});

// ─── Поллинг ──────────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 4000;
const MAX_POLL_MS = 7 * 60 * 1000; // 7 минут

let pollTimer = null;
let pollStart = 0;

const resolveStatus = (data) => {
    // Если бэкенд добавит поле status — приоритетно его
    if (data.status) {
        if (data.status === 'active') return 'success';
        if (data.status === 'failed') return 'failed';
        if (data.status === 'cancelled' || data.status === 'order_denied') return 'cancelled';
    }
    if (data.is_active) return 'success';
    return 'pending';
};

const handlePollResult = (status) => {
    stopPolling();
    if (status === 'success') {
        router.replace({ name: 'paymentSuccess' });
    } else if (status === 'failed') {
        router.replace({ name: 'paymentFail' });
    } else {
        // cancelled / order_denied — возвращаем на выбор плана
        router.push({ name: 'subscriptionPro' });
    }
};

const poll = async () => {
    if (Date.now() - pollStart > MAX_POLL_MS) {
        stopPolling();
        isWaiting.value = false;
        error.value = 'Время ожидания истекло. Попробуйте снова.';
        return;
    }
    try {
        const { data } = await getCurrentSubscription();
        const status = resolveStatus(data);
        if (status !== 'pending') handlePollResult(status);
    } catch {
        // временные ошибки игнорируем, продолжаем поллинг
    }
};

const startPolling = () => {
    pollStart = Date.now();
    pollTimer = setInterval(poll, POLL_INTERVAL_MS);
};

const stopPolling = () => {
    if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
    }
};

onUnmounted(stopPolling);

// ─── Инициализация оплаты ─────────────────────────────────────────────────────

const pay = async () => {
    if (!currentPlan.value) return;
    error.value = '';
    isLoading.value = true;
    try {
        const { data } = await initiateSubscription(currentPlan.value.id);
        window.open(data.payment_url, '_blank');
        isWaiting.value = true;
        startPolling();
    } catch (e) {
        error.value = e?.message || 'Не удалось создать платёж. Попробуйте позже.';
    } finally {
        isLoading.value = false;
    }
};

const cancelWaiting = () => {
    stopPolling();
    isWaiting.value = false;
};
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
        height: 28px;
        width: auto;
        object-fit: contain;
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

.error-text {
    font-size: 14px;
    color: #d32f2f;
    margin: 0;
}

.button--blue {
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

    &:disabled {
        opacity: 0.4;
        cursor: default;
    }

    &:not(:disabled):hover {
        opacity: 0.9;
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

/* ── Waiting state ── */
.waiting-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 40px 0;
    text-align: center;
}

.waiting-spinner {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 4px solid rgba(49, 29, 93, 0.15);
    border-top-color: #311d5d;
    animation: spin 0.9s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.waiting-title {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    color: #311d5d;
    line-height: 1.3;
}

.waiting-hint {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: #311d5d;
    opacity: 0.7;
    line-height: 1.5;
    max-width: 280px;
}

.cancel-btn {
    background: transparent;
    border: 2px solid #311d5d;
    border-radius: 24px;
    color: #311d5d;
    font-size: 16px;
    font-weight: 600;
    font-family: Mulish, sans-serif;
    padding: 10px 32px;
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover {
        background: rgba(49, 29, 93, 0.05);
    }
}
</style>
