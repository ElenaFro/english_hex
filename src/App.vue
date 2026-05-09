<template>
    <div>
        <div v-if="isAppLoading" class="app-loading">
            <Loader :size="56" spinner-color="#FCB258" />
        </div>
        <template v-else>
            <RouterView />
        </template>
        <Notivue v-slot="item" :style="{ '--nv-z': '4000' }">
            <Notification :item="item" />
        </Notivue>
    </div>
</template>
<script setup>
import { onMounted, watch, ref } from 'vue';
import { useUserStore } from './stores/user';
import { useRouter, useRoute } from 'vue-router';
import { Notivue, Notification } from 'notivue';
import { shouldShowDailyReward } from '@/shared/utils/dailyReward';
import Loader from '@/shared/components/Loader.vue';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const isAppLoading = ref(false);

const maybeShowDailyReward = async () => {
    if (!userStore.isAuthenticated) return;
    if (userStore.isLoggingIn) return;
    if (route.path.startsWith('/auth')) return;
    if (route.name === 'DailyReward') return;
    const everPlayedGame = userStore.user?.ever_played_game;
    if (!everPlayedGame) return;
    const dailyStreak = userStore.user?.daily_streak ?? null;
    if (!shouldShowDailyReward(dailyStreak, everPlayedGame)) return;
    await router.push({ name: 'DailyReward' });
};

onMounted(async () => {
    if (userStore.token && !userStore.isLoggingIn) {
        isAppLoading.value = true;
        try {
            await userStore.fetchUser();
            await userStore.getUserRole();
            await maybeShowDailyReward();
        } finally {
            isAppLoading.value = false;
        }
    }
});

watch(
    () => userStore.user,
    async () => {
        // вотч только для обновлений после первоначальной загрузки
        // не перенаправляем если идёт инициализация приложения
        if (isAppLoading.value) return;
        await maybeShowDailyReward();
    }
);
</script>

<style>
:root {
    --nv-z: 4000;
}

.app-loading {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
        url('/src/assets/img/background_stars.png'),
        linear-gradient(
            to top,
            rgba(235, 182, 105, 1),
            rgba(200, 153, 116, 1),
            rgba(161, 119, 128, 1),
            rgba(129, 93, 124, 1),
            rgba(93, 70, 117, 1),
            rgba(57, 43, 88, 1),
            rgba(43, 32, 64, 1),
            rgba(30, 22, 41, 1),
            rgba(26, 20, 36, 1),
            rgba(25, 19, 33, 1)
        );
    background-size: contain;
    background-position: top;
    background-repeat: no-repeat;
    z-index: 9999;
}
</style>
