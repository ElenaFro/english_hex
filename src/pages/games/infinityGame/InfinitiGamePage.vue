<template>
    <section class="infinity-game">
        <Loader v-if="loading" />
        <template v-else>
            <component
                v-if="activeComponent"
                :is="activeComponent"
                :key="activeKey"
                v-bind="activeProps"
                @finish="handleFinish"
            />
            <div v-else class="infinity-game__empty">Нет заданий для бесконечного режима</div>
        </template>
    </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import Loader from '@/shared/components/Loader.vue';
import { useGamesStore } from '@/stores/games';
import { useUserStore } from '@/stores/user';
import ConstellationGame from '@/components/ConstellationGame/ConstellationGame.vue';
import WordTwinkleGame from '@/components/wordTwinkle/wordTwinkleGame.vue';
import GalaxyPhrasesGame from '@/pages/games/galaxyPhrases/components/GalaxyPhrasesGame.vue';

const router = useRouter();
const gamesStore = useGamesStore();
const userStore = useUserStore();

const loading = ref(true);
const groups = ref([]);
const activeGroupIndex = ref(0);
const totalCorrect = ref(0);
const totalSeconds = ref(0);
const isFinished = ref(false);
const cameFromDailyReward = ref(false);

const normalizeGameKey = (value) => (value || '').toString().toLowerCase();

const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

const buildInterleavedGroups = (items, constellationChunkSize = 4) => {
    const byType = {};
    for (const item of items) {
        const key = normalizeGameKey(item?.game);
        if (!byType[key]) byType[key] = [];
        byType[key].push(item);
    }

    const buckets = [];

    const constellations = byType['constellation'] || [];
    if (constellations.length) {
        const groups = [];
        for (let i = 0; i < constellations.length; i += constellationChunkSize) {
            groups.push({ game: 'constellation', items: constellations.slice(i, i + constellationChunkSize) });
        }
        buckets.push({ game: 'constellation', groups: shuffle(groups) });
    }

    for (const [game, gameItems] of Object.entries(byType)) {
        if (game === 'constellation') continue;
        buckets.push({ game, groups: shuffle(gameItems.map((item) => ({ game, items: [item] }))) });
    }

    // Round-robin: каждый тип получает ход поочерёдно
    shuffle(buckets);
    const result = [];

    while (buckets.some((b) => b.groups.length > 0)) {
        for (const bucket of buckets) {
            if (bucket.groups.length > 0) {
                result.push(bucket.groups.shift());
            }
        }
    }

    return result;
};

const gameComponentMap = {
    constellation: ConstellationGame,
    flickering: WordTwinkleGame,
    phrase_galaxy: GalaxyPhrasesGame,
};

const activeGroup = computed(() => groups.value[activeGroupIndex.value] || null);
const activeComponent = computed(() =>
    activeGroup.value ? gameComponentMap[activeGroup.value.game] : null
);

const activeKey = computed(() => `${activeGroupIndex.value}-${activeGroup.value?.game || 'empty'}`);

const activeProps = computed(() => {
    if (!activeGroup.value) return {};
    const items = activeGroup.value.items;
    const initialSeconds = totalSeconds.value;

    switch (activeGroup.value.game) {
        case 'constellation':
            return { items, isInfinity: true, initialSeconds };
        case 'flickering':
        case 'phrase_galaxy':
            return { questions: items, isInfinity: true, initialSeconds };
        default:
            return { isInfinity: true, initialSeconds };
    }
});

const saveProgress = async () => {
    if (isFinished.value || totalCorrect.value === 0) return;
    isFinished.value = true;
    try {
        await gamesStore.finishInfinityMode(totalCorrect.value);
    } catch (error) {
        console.error('Ошибка сохранения прогресса при выходе', error);
    }
};

const saveProgressBeforeUnload = () => {
    if (isFinished.value || totalCorrect.value === 0) return;
    const token = localStorage.getItem('access_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    fetch('https://dicardz.com/api/games/infinity-mode/finish', {
        method: 'POST',
        headers,
        body: JSON.stringify({ words_repeated: totalCorrect.value }),
        keepalive: true,
    });
};

onBeforeRouteLeave(async (to, from, next) => {
    await saveProgress();
    if (cameFromDailyReward.value && to.name !== 'DailyReward') {
        next({ name: 'DailyReward' });
    } else {
        next();
    }
});

const handleFinish = async (payload = {}) => {
    const correctCount = Number(payload.correctCount ?? 0);
    totalCorrect.value += Number.isFinite(correctCount)
        ? correctCount
        : (activeGroup.value?.items?.length ?? 0);
    totalSeconds.value = Number(payload.finalSeconds ?? totalSeconds.value);

    if (activeGroupIndex.value < groups.value.length - 1) {
        activeGroupIndex.value += 1;
        return;
    }

    isFinished.value = true;
    let rewardState = null;
    try {
        const result = await gamesStore.finishInfinityMode(totalCorrect.value);
        const reward = result?.reward;
        if (reward?.type === 'avatars') {
            rewardState = {
                avatarKeys: reward.avatars?.map((a) => a.image_key) ?? null,
            };
        }
    } catch (error) {
        console.error('Ошибка отправки прогресса бесконечного режима', error);
    }

    router.push({ name: 'DailyReward', state: { avatarReward: rewardState } });
};

onMounted(async () => {
    window.addEventListener('beforeunload', saveProgressBeforeUnload);
    cameFromDailyReward.value = Boolean(window.history.state?.fromDailyReward);
    userStore.setHeaderTitle('Бесконечный режим');
    loading.value = true;
    try {
        const data = await gamesStore.getInfinityMode();
        const list = Array.isArray(data) ? data : [];
        const filtered = list.filter((item) => {
            const key = normalizeGameKey(item?.game);
            return Boolean(gameComponentMap[key]);
        });
        if (filtered.length !== list.length) {
            console.warn('Infinity mode: неизвестные типы игр', list);
        }
        groups.value = buildInterleavedGroups(filtered, 4);
    } catch (error) {
        console.error('Ошибка загрузки бесконечного режима', error);
        groups.value = [];
    } finally {
        loading.value = false;
    }
});

onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', saveProgressBeforeUnload);
    userStore.setHeaderTitle(null);
});
</script>

<style scoped>
.infinity-game {
    min-height: 100dvh;
    width: 100%;
}

.infinity-game__empty {
    margin-top: 32px;
    text-align: center;
    color: #ffffff;
    font-weight: 600;
}
</style>
