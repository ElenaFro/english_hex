<template>
    <div class="page-content plan-page-content">
        <div class="scroll-container plan-scroll">
            <h1 class="plan-title">Выбери удобный план</h1>
            <div class="plans-list">
                <div
                    v-for="plan in plans"
                    :key="plan.id"
                    class="plan-item"
                    :class="{ 'plan-item--has-badge': plan.badge }"
                >
                    <span v-if="plan.badge" class="plan-item__badge">{{ plan.badge }}</span>
                    <button
                        class="plan-option"
                        :class="{ 'plan-option--best': plan.badge }"
                        type="button"
                        @click="selectedPlan = plan.id"
                    >
                        <span class="plan-option__label">{{ plan.label }}</span>
                        <span v-if="selectedPlan === plan.id" class="plan-option__check">✓</span>
                    </button>
                </div>
            </div>

            <div class="subscribe-wrap">
                <button class="subscribe-btn" type="button" @click="goToPayment">
                    Оформить подписку
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
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedPlan = ref('month_6');

const goToPayment = () =>
    router.push({ name: 'subscriptionPayment', query: { plan: selectedPlan.value } });

const plans = [
    { id: 'month_1', label: '1 месяц = 299 руб' },
    { id: 'month_3', label: '3 месяца = 799 руб (-20%)' },
    { id: 'month_6', label: '6 месяцев = 1199 руб (-40%)' },
    { id: 'year_1', label: '1 год = 1599 руб (-50%)', badge: 'Лучшее предложение' },
];
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
    transition: border-color 0.15s;
    box-sizing: border-box;
    border: 2px solid #311d5d;

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

    &--best {
        background: #311d5d;
    }

    &--best > span {
        color: #ffffff;
    }
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

    &:hover {
        background: rgba(49, 29, 93, 0.05);
    }

    &:active {
        background: rgba(49, 29, 93, 0.1);
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
</style>
