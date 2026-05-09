import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getCurrentSubscription } from '@/api/subscription';

export const useSubscriptionStore = defineStore('subscription', () => {
    const subscription = ref(null);
    const fetched = ref(false);

    const hasActiveSubscription = computed(() => !!subscription.value?.is_active);

    const fetch = async () => {
        if (fetched.value) return;
        try {
            const { data } = await getCurrentSubscription();
            subscription.value = data;
        } catch {
            subscription.value = null;
        } finally {
            fetched.value = true;
        }
    };

    // Сбросить кеш (например, после успешной оплаты)
    const invalidate = () => {
        fetched.value = false;
        subscription.value = null;
    };

    return { subscription, hasActiveSubscription, fetch, invalidate };
});
