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
import { useRouter } from 'vue-router';
import Loader from '@/shared/components/Loader.vue';
import { useGamesStore } from '@/stores/games';
import { useUserStore } from '@/stores/user';
import ConstellationGame from '@/components/ConstellationGame/ConstellationGame.vue';
import WordTwinkleGame from '@/components/wordTwinkle/wordTwinkleGame.vue';
import AttackPlanetGame from '@/components/AttackPlanet/AttackPlanetGame.vue';
import GalaxyPhrasesGame from '@/pages/games/galaxyPhrases/components/GalaxyPhrasesGame.vue';

const router = useRouter();
const gamesStore = useGamesStore();
const userStore = useUserStore();

const loading = ref(true);
const groups = ref([]);
const activeGroupIndex = ref(0);
const totalCorrect = ref(0);

const normalizeGameKey = (value) => (value || '').toString().toLowerCase();

const groupBySequence = (items) => {
    const result = [];
    let current = null;

    for (const item of items) {
        const key = normalizeGameKey(item?.game);
        if (!current || current.game !== key) {
            current = { game: key, items: [] };
            result.push(current);
        }
        current.items.push(item);
    }

    return result;
};

const splitConstellationGroups = (groupsList, chunkSize = 4) => {
    const result = [];
    let buffer = [];

    const flushBufferToPrevious = () => {
        if (!buffer.length) return;
        const last = result[result.length - 1];
        if (last && last.game === 'constellation') {
            last.items.push(...buffer);
            buffer = [];
        }
    };

    for (const group of groupsList) {
        if (group.game === 'constellation') {
            buffer.push(...(group.items || []));
            while (buffer.length >= chunkSize) {
                result.push({
                    game: 'constellation',
                    items: buffer.slice(0, chunkSize),
                });
                buffer = buffer.slice(chunkSize);
            }
            continue;
        }

        // Перед не-констелляцией пытаемся приклеить остаток к предыдущей констелляции
        flushBufferToPrevious();
        result.push(group);
    }

    // Хвост: если есть куда приклеить — приклеиваем, иначе оставляем как есть
    if (buffer.length) {
        const last = result[result.length - 1];
        if (last && last.game === 'constellation') {
            last.items.push(...buffer);
        } else {
            result.push({ game: 'constellation', items: buffer });
        }
    }

    return result;
};

const gameComponentMap = {
    constellation: ConstellationGame,
    flickering: WordTwinkleGame,
    'flickering-words': WordTwinkleGame,
    'word-twinkle': WordTwinkleGame,
    wordtwinkle: WordTwinkleGame,
    planet_attack: AttackPlanetGame,
    'planet-attack': AttackPlanetGame,
    attackplanet: AttackPlanetGame,
    galaxy_phrases: GalaxyPhrasesGame,
    'galaxy-phrases': GalaxyPhrasesGame,
    galaxyphrases: GalaxyPhrasesGame,
};

const activeGroup = computed(() => groups.value[activeGroupIndex.value] || null);
const activeComponent = computed(() =>
    activeGroup.value ? gameComponentMap[activeGroup.value.game] : null
);

const activeKey = computed(() => `${activeGroupIndex.value}-${activeGroup.value?.game || 'empty'}`);

const activeProps = computed(() => {
    if (!activeGroup.value) return {};
    const items = activeGroup.value.items;

    switch (activeGroup.value.game) {
        case 'constellation':
            return { items, isInfinity: true };
        case 'flickering':
        case 'flickering-words':
        case 'word-twinkle':
        case 'wordtwinkle':
        case 'planet_attack':
        case 'planet-attack':
        case 'attackplanet':
        case 'galaxy_phrases':
        case 'galaxy-phrases':
        case 'galaxyphrases':
            return { questions: items, isInfinity: true };
        default:
            return { isInfinity: true };
    }
});

const handleFinish = async (payload = {}) => {
    const correctCount = Number(payload.correctCount ?? 0);
    totalCorrect.value += Number.isFinite(correctCount)
        ? correctCount
        : (activeGroup.value?.items?.length ?? 0);

    if (activeGroupIndex.value < groups.value.length - 1) {
        activeGroupIndex.value += 1;
        return;
    }

    try {
        await gamesStore.finishInfinityMode(totalCorrect.value);
    } catch (error) {
        console.error(
            'Ошибка отправки прогресса бесконечного режима',
            error
        );
    }

    router.push({ name: 'DailyReward' });
};

onMounted(async () => {
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
        groups.value = splitConstellationGroups(groupBySequence(filtered), 4);
    } catch (error) {
        console.error('Ошибка загрузки бесконечного режима', error);
        groups.value = [];
    } finally {
        loading.value = false;
    }
});

onBeforeUnmount(() => {
    userStore.setHeaderTitle(null);
});
</script>

<style scoped>
.infinity-game {
    min-height: 100dvh;
}

.infinity-game__empty {
    margin-top: 32px;
    text-align: center;
    color: #ffffff;
    font-weight: 600;
}
</style>

