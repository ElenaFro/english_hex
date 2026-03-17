<template>
    <div>
        <RouterView />
        <Notivue v-slot="item" style="z-index: 1000 !important">
            <Notification :item="item" />
        </Notivue>
    </div>
</template>
<script setup>
import { onMounted, watch } from 'vue';
import { useUserStore } from './stores/user';
import { useRouter, useRoute } from 'vue-router';
import { Notivue, Notification } from 'notivue';
import { shouldShowDailyReward, markDailyRewardShown } from '@/shared/utils/dailyReward';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const maybeShowDailyReward = async () => {
    if (!userStore.isAuthenticated) return;
    if (route.path.startsWith('/auth')) return;
    const dailyStreak = userStore.user?.daily_streak ?? null;
    if (!shouldShowDailyReward(dailyStreak)) return;
    if (route.name === 'DailyReward') {
        markDailyRewardShown();
        return;
    }
    markDailyRewardShown();
    await router.push({ name: 'DailyReward' });
};

onMounted(async () => {
    if (userStore.token && !userStore.isLoggingIn) {
        await userStore.fetchUser();
        await userStore.getUserRole();
        await maybeShowDailyReward();
    }
});

watch(
    () => userStore.user,
    async () => {
        await maybeShowDailyReward();
    }
);
</script>
