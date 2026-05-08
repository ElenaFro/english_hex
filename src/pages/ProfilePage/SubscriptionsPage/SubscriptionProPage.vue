<template>
    <div class="page-content plan-page-content">
        <div class="scroll-container plan-scroll">

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

            <!-- Выбор плана -->
            <template v-else>
                <h1 class="plan-title">Выбери удобный план</h1>

                <div v-if="loadingPlans" class="plans-loading">
                    <span v-for="i in 4" :key="i" class="plan-skeleton" />
                </div>

                <div v-else class="plans-list">
                    <div
                        v-for="plan in plans"
                        :key="plan.id"
                        class="plan-item"
                        :class="{ 'plan-item--has-badge': plan.is_popular }"
                    >
                        <span v-if="plan.is_popular" class="plan-item__badge">
                            Лучшее предложение
                        </span>
                        <button
                            class="plan-option"
                            :class="{
                                'plan-option--selected': selectedPlanId === plan.id,
                                'plan-option--best':
                                    plan.is_popular && selectedPlanId === plan.id,
                            }"
                            type="button"
                            @click="selectedPlanId = plan.id"
                        >
                            <span class="plan-option__label">{{ formatLabel(plan) }}</span>
                            <span v-if="selectedPlanId === plan.id" class="plan-option__check">
                                ✓
                            </span>
                        </button>
                    </div>
                </div>

                <p v-if="error" class="error-text">{{ error }}</p>

                <div class="subscribe-wrap">
                    <button
                        class="subscribe-btn"
                        type="button"
                        :disabled="!selectedPlanId || loadingPlans || isLoading"
                        @click="pay"
                    >
                        {{ isLoading ? 'Подождите...' : 'Оформить подписку' }}
                    </button>
                </div>

                <div class="character-wrap">
                    <img
                        src="@/assets/Di_avatar/girl-with-card.svg"
                        alt=""
                        class="character-img"
                        aria-hidden="true"
                    />
                </div>
            </template>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { getPlans, initiateSubscription, getCurrentSubscription } from '@/api/subscription';

const router = useRouter();

// ─── Планы ────────────────────────────────────────────────────────────────────

const plans = ref([]);
const loadingPlans = ref(false);
const selectedPlanId = ref(null);

const formatLabel = (plan) => {
    const disc = plan.discount > 0 ? ` (-${plan.discount}%)` : '';
    return `${plan.name} = ${plan.price} руб${disc}`;
};

onMounted(async () => {
    loadingPlans.value = true;
    try {
        const { data } = await getPlans();
        plans.value = data;
        const popular = data.find((p) => p.is_popular);
        selectedPlanId.value = popular?.id ?? data[0]?.id ?? null;
    } catch {
        error.value = 'Не удалось загрузить планы. Попробуйте позже.';
    } finally {
        loadingPlans.value = false;
    }
});

// ─── Поллинг ──────────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 4000;
const MAX_POLL_MS = 7 * 60 * 1000;

const isWaiting = ref(false);
let pollTimer = null;
let pollStart = 0;

const resolveStatus = (data) => {
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
    isWaiting.value = false;
    if (status === 'success') {
        router.replace({ name: 'paymentSuccess' });
    } else if (status === 'failed') {
        router.replace({ name: 'paymentFail' });
    } else {
        error.value = 'Платёж отменён или отклонён.';
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
        // временные ошибки — продолжаем
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

const cancelWaiting = () => {
    stopPolling();
    isWaiting.value = false;
};

onUnmounted(stopPolling);

// ─── Инициация оплаты ─────────────────────────────────────────────────────────

const isLoading = ref(false);
const error = ref('');

const pay = async () => {
    if (!selectedPlanId.value) return;
    error.value = '';
    isLoading.value = true;
    try {
        const { data } = await initiateSubscription(selectedPlanId.value);
        window.open(data.payment_url, '_blank');
        isWaiting.value = true;
        startPolling();
    } catch (e) {
        error.value = e?.message || 'Не удалось создать платёж. Попробуйте позже.';
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped lang="scss">
.page-content.plan-page-content {
    padding-top: 0;
}
.plan-page-content {
    border-radius: 0 !important;
}

.plan-title {
    margin: 0 0 16px;
    font-size: 24px;
    font-weight: 800;
    color: #311d5d;
    line-height: 1.2;
}

.plan-scroll {
    gap: 12px;
    padding-top: 4px;
}

.plans-list {
    display: flex;
    flex-direction: column;
    gap: 17px;
}

.plans-loading {
    display: flex;
    flex-direction: column;
    gap: 17px;
}

.plan-skeleton {
    display: block;
    height: 54px;
    border-radius: 15px;
    background: linear-gradient(90deg, #e8e8f0 25%, #f2f2fa 50%, #e8e8f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.plan-item {
    position: relative;

    &--has-badge {
        margin-top: 8px;
    }

    &__badge {
        position: absolute;
        top: -14px;
        left: 14px;
        background: #fec737;
        color: #ffffff;
        font-size: 12px;
        font-weight: 700;
        border-radius: 20px;
        padding: 4px 14px;
        white-space: nowrap;
        z-index: 1;
    }
}

.plan-option {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    border-radius: 15px;
    padding: 17px;
    cursor: pointer;
    box-sizing: border-box;
    border: 2px solid #d4d4e8;
    transition: border-color 0.15s;

    &--selected {
        border-color: #311d5d;
    }

    &--best {
        background: #311d5d;
        border-color: #311d5d;

        span {
            color: #ffffff;
        }
    }

    &__label {
        font-size: 15px;
        font-weight: 600;
        color: #311d5d;
    }

    &__check {
        font-size: 14px;
        font-weight: 800;
        color: #311d5d;
    }
}

.error-text {
    font-size: 14px;
    color: #d32f2f;
    margin: 0;
}

.subscribe-wrap {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.subscribe-btn {
    background: #ffffff;
    border: 2px solid #311d5d;
    border-radius: 24px;
    color: #311d5d;
    font-size: 18px;
    font-weight: 600;
    font-family: Mulish, sans-serif;
    line-height: 120%;
    padding: 9px 24px;
    cursor: pointer;
    transition: background-color 0.15s;

    &:disabled {
        opacity: 0.4;
        cursor: default;
    }

    &:not(:disabled):hover {
        background: rgba(49, 29, 93, 0.05);
    }
}

.character-wrap {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
}

.character-img {
    width: 180px;
    height: auto;
    object-fit: contain;
}

/* ── Waiting ── */
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

    &:hover {
        background: rgba(49, 29, 93, 0.05);
    }
}
</style>
