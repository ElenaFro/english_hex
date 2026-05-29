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
        subscription.value = null;
    } finally {
        loading.value = false;
    }

    if (!subscription.value?.is_active) {
        router.replace({ name: 'subscriptionPro' });
    }
});

const goToMain = () => router.push({ name: 'mainPage' });
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
</style>
