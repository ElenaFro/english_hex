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
const DAILY_REWARD_LAST_SHOWN_KEY = 'daily_reward_last_shown';

const getLocalDateKey = () => {
    const now = new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const shouldShowDailyReward = (dailyStreak) => {
    if (!dailyStreak) return false;
    const rewardGranted = Boolean(dailyStreak.reward_granted_today);
    if (rewardGranted) return false;
    const lastShown = localStorage.getItem(DAILY_REWARD_LAST_SHOWN_KEY);
    return lastShown !== getLocalDateKey();
};

const markDailyRewardShown = () => {
    localStorage.setItem(DAILY_REWARD_LAST_SHOWN_KEY, getLocalDateKey());
};

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const maybeShowDailyReward = async () => {
    if (!userStore.isAuthenticated) return;
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
