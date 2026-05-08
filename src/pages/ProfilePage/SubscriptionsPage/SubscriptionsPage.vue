<template>
    <div class="page-content">
        <div class="scroll-container subscriptions-scroll">
            <!-- Загрузка -->
            <div v-if="loading" class="sub-skeleton-wrap">
                <div class="sub-skeleton" />
                <div class="sub-skeleton" />
            </div>

            <!-- Активная подписка -->
            <ActiveSubscriptionCard
                v-else-if="subscription?.is_active"
                :subscription="subscription"
                @continue="goToMain"
            />

            <!-- Нет подписки — выбор плана -->
            <template v-else>
                <article class="plan-card">
                    <div class="plan-card__body">
                        <h2 class="plan-card__title">Базовая версия</h2>
                        <ul class="plan-card__features">
                            <li>4 категории карточек</li>
                            <li>Колода из 15 карточек</li>
                            <li>Без обновлений контента</li>
                            <li>Есть реклама</li>
                        </ul>
                    </div>
                    <div class="plan-card__footer">
                        <button class="plan-btn" type="button" @click="goToMain">Начать</button>
                    </div>
                </article>

                <article class="plan-card plan-card--pro">
                    <div class="plan-card__body">
                        <h2 class="plan-card__title">Продвинутая версия</h2>
                        <ul class="plan-card__features">
                            <li>12+ категорий</li>
                            <li>Колода из 40 карточек</li>
                            <li>Без рекламы</li>
                            <li>Новые карточки каждый месяц</li>
                        </ul>
                    </div>
                    <div class="plan-card__footer">
                        <button class="plan-btn" type="button" @click="goToPro">Подробнее</button>
                    </div>
                </article>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentSubscription } from '@/api/subscription';
import ActiveSubscriptionCard from './ActiveSubscriptionCard.vue';

const router = useRouter();

const subscription = ref(null);
const loading = ref(false);

onMounted(async () => {
    loading.value = true;
    try {
        const { data } = await getCurrentSubscription();
        subscription.value = data;
    } catch {
        // 404 или нет подписки — оставляем null, показываем выбор плана
        subscription.value = null;
    } finally {
        loading.value = false;
    }
});

const goToMain = () => router.push({ name: 'mainPage' });
const goToPro = () => router.push({ name: 'subscriptionPro' });
</script>

<style scoped lang="scss">
.subscriptions-scroll {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 10px;
}

/* ── Скелетон ── */
.sub-skeleton-wrap {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.sub-skeleton {
    height: 200px;
    border-radius: 20px;
    background: linear-gradient(90deg, #e8e8f0 25%, #f2f2fa 50%, #e8e8f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

/* ── Карточки планов ── */
.plan-card {
    background: #311d5d;
    border-radius: 20px;
    padding: 20px 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    &__body {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    &__title {
        color: #ffffff;
        font-size: 18px;
        font-weight: 800;
        line-height: 1.2;
        margin: 0;
    }

    &__features {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 9px;
        margin-left: 8px;

        li {
            color: #ffffff;
            font-size: 18px;
            font-weight: 600;
            line-height: 1.2;
            padding-left: 18px;
            position: relative;

            &::before {
                content: '•';
                position: absolute;
                left: 0;
                color: #ffffff;
            }
        }
    }

    &__footer {
        display: flex;
        justify-content: flex-end;
    }
}

.plan-btn {
    background: transparent;
    border: 2px solid #ffffff;
    border-radius: 20px;
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    font-family: Mulish, sans-serif;
    padding: 8px 28px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
}
</style>
