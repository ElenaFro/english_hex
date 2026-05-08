<template>
    <div v-if="!isDailyRewardPage" class="header-bar" :class="{ 'header-bar--light': isLightPage }">
        <template v-if="isHomePage || isGameWordTwinkle || myPlanet || isPaymentResultPage">
            <div class="header-star" @click="goToMyPlanet">
                <span>{{ totalStars }}</span>
                <img
                    src="@/assets/icons/navBarIcon/star.svg"
                    class="header-star-left"
                    alt="Звезда"
                />
            </div>
        </template>

        <template v-else-if="isGamePlanetPage">
            <span class="header-live">
                <span v-for="index in lives" :key="index" class="live-icon">
                    <img
                        src="@/assets/icons/navBarIcon/live.svg"
                        class="header-live-left"
                        alt="Жизнь"
                    />
                </span>
            </span>
        </template>
        <template v-else>
            <button @click="goBack" class="header-item-button">
                <img
                    :src="isLightPage ? arrowDark : arrowLight"
                    class="header-icon-left"
                    alt="Назад"
                />
            </button>
        </template>
        <p ref="titleEl" class="header-title">{{ currentTitle }}</p>
        <template v-if="isLightPage">
            <button
                class="header-item-button header-close-btn"
                @click="router.push({ name: 'profile' })"
            >
                <img src="@/assets/img/close_icon.svg" class="header-icon-close" alt="Закрыть" />
            </button>
        </template>
        <template v-else>
            <RouterLink
                v-for="item in headerItemsRight"
                :key="item.name + '-right'"
                :to="item.path"
                class="header-item"
                :class="{ active: $route.path === item.path }"
            >
                <img
                    v-if="
                        !route.fullPath.includes('games') &&
                        !route.fullPath.includes('planetAttackPage')
                    "
                    :src="item.icon"
                    class="header-icon"
                    :alt="item.name"
                />
            </RouterLink>
        </template>
        <template v-if="isGamePlanetPage || isEditPlanetPage">
            <span class="header-star">
                {{ totalStars }}
                <img
                    src="@/assets/icons/navBarIcon/star.svg"
                    class="header-star-left"
                    alt="Звезда"
                />
            </span>
        </template>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { defineProps } from 'vue';
import { useUserStore } from '@/stores/user';
import Bell from '@/assets/icons/navBarIcon/Bell.svg';
import BellUnread from '@/assets/icons/navBarIcon/Bell_unread.svg';
import arrowLight from '@/assets/icons/navBarIcon/arrow_left.svg';
import arrowDark from '@/assets/icons/arrow-left.svg';

const router = useRouter();
const userStore = useUserStore();
const currentNotifications = computed(() => userStore.notifications);

const currentUser = computed(() => userStore.getCurrentUser());
const totalStars = computed(() => currentUser.value.rating);
const props = defineProps(['lives']);

const titleEl = ref(null);
const TITLE_BASE_PX = 28;
const TITLE_MIN_PX = 18;

const fitTitle = async () => {
    await nextTick();

    const el = titleEl.value;
    if (!el) return;

    el.style.fontSize = `${TITLE_BASE_PX}px`;

    // Если текст шире контейнера — уменьшаем размер шрифта.
    // scrollWidth учитывает реальную ширину текста, clientWidth — доступную ширину блока.
    let fontSize = TITLE_BASE_PX;
    while (el.scrollWidth > el.clientWidth && fontSize > TITLE_MIN_PX) {
        fontSize -= 1;
        el.style.fontSize = `${fontSize}px`;
    }
};

onMounted(async () => {
    // На reload у vue-router route.name может быть пустым до готовности роутера,
    // поэтому ждём isReady и только потом синхронизируем заголовок.
    await router.isReady();
    updateTitleFromRoute();
    fitTitle();
    window.addEventListener('resize', fitTitle, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener('resize', fitTitle);
});

const isLightPage = computed(() => route.name === 'subscriptionPro');
const isPaymentResultPage = computed(() => ['paymentSuccess', 'paymentFail'].includes(route.name));

const isGamePlanetPage = computed(() => route.path === '/planetAttackPage');
const isEditPlanetPage = computed(() => route.path === '/editPlanet');

const isGameWordTwinkle = computed(() => route.path === '/wordTwinkleResult');

const myPlanet = computed(() => route.path === '/myPlanet');

const hasUnreadNotify = computed(() =>
    currentNotifications.value?.find((notify) => notify.was_read === false)
);

const headerItemsRight = computed(() => {
    if (isEditPlanetPage.value) return [];

    return [
        {
            name: 'notifications',
            path: '/notifications',
            icon: hasUnreadNotify.value ? BellUnread : Bell,
        },
    ];
});

const currentTitle = ref(' ');
const route = useRoute();

const gameExitRoutes = new Set([
    'planetGame',
    'planetAttackPage',
    'wordTwinkle',
    'wordTwinkleGame',
    'constellationGame',
    'galaxyPhrasesGame',
    'infinityGame',
    'gameResult',
    'flyAnimation',
]);

function goBack() {
    if (gameExitRoutes.has(route.name)) {
        router.push({ name: 'games' });
        return;
    }
    router.back();
}

const goToMyPlanet = () => {
    if (!currentUser.value.ever_played_game) return;
    router.push({ path: '/myPlanet' });
};
const isHomePage = computed(() => route.fullPath === '/');

const gameRoutes = [
    'games',
    'planetGame',
    'wordTwinkle',
    'wordTwinkleGame',
    'constellationGame',
    'galaxyPhrasesGame',
    'infinityGame',
];

const isDailyRewardPage = computed(() => route.name === 'DailyReward');

const routeMetaTitle = computed(() => {
    const matched = route.matched ?? [];
    for (let i = matched.length - 1; i >= 0; i -= 1) {
        const title = matched[i]?.meta?.title;
        if (typeof title === 'string') return title;
    }
    return null;
});

const updateTitleFromRoute = () => {
    if (gameRoutes.includes(route.name)) {
        currentTitle.value = 'Игры';
    } else if (route.name === 'learning') {
        currentTitle.value = route.query.name || '';
    } else {
        const metaTitle = routeMetaTitle.value;
        currentTitle.value = typeof metaTitle === 'string' ? metaTitle : ' ';
    }

    const storeTitle = userStore.currentHeaderTitle;
    if (storeTitle && storeTitle.trim() !== '') {
        currentTitle.value = storeTitle;
    }
};

watch(
    () => route.name,
    () => {
        updateTitleFromRoute();
    },
    { immediate: true }
);

watch(
    () => route.fullPath,
    () => {
        updateTitleFromRoute();
    },
    { immediate: true }
);

watch(
    () => userStore.currentHeaderTitle,
    (newTitle) => {
        if (newTitle && newTitle.trim() !== '') {
            currentTitle.value = newTitle;
        } else {
            updateTitleFromRoute();
        }
    },
    { immediate: true }
);

watch(
    () => currentTitle.value,
    () => {
        fitTitle();
    }
);
</script>

<style scoped lang="scss">
.header-bar {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: transparent;
    padding-block: 0% 24px;
    padding-left: 20px;
    padding-right: 20px;
    width: 100%;
    max-width: 414px;

    &--light {
        background-color: rgba(246, 246, 254, 1);
    }
}

.header-star {
    background-color: #fff3ed;
    display: flex;
    width: 84px;
    height: 42px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    font-family: Mulish;
    font-weight: 700;
    font-size: 20px;
    line-height: 100%;
    letter-spacing: 0%;
    padding-left: 13px;
    padding-bottom: 0px;
    align-items: center;
    cursor: pointer;
    z-index: 500;
}

.header-live {
    background-color: #ffffff;
    display: flex;
    width: 155px;
    height: 42px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    padding-left: 8px;
    padding-right: 3px;
    padding-bottom: 0px;
    align-items: center;
    gap: 5px;
}

.header-star-left {
    width: 21px;
    height: 21px;
    padding-left: 2px;
    padding-bottom: 2px;
}

.header-live-left {
    width: 23.85px;
    height: 22.19px;
}

.header-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #ffffff;
    text-decoration: none;
    padding: 0;
    transition: background-color 0.2s;
}

.header-item-button {
    background-color: transparent;
    border-width: 0px !important;
    padding: 0;
}

.header-item-button:hover {
    background-color: rgba(255, 255, 255, 0) !important;
}

.header-item:hover {
    background-color: rgba(255, 255, 255, 0) !important;
}

.header-icon {
    width: 32px;
    height: 32px;
    margin-top: 13px;
}
.header-icon-close {
    width: 20px;
    height: 20px;
    margin-top: 13px;
}

.header-icon-left {
    width: 29px;
    height: 29px;
    margin-top: 13px;
}

.header-label {
    font-size: 0.75rem;
    margin-top: 0.25rem;
}

.header-title {
    color: #ffff;
    font-weight: 800;
    line-height: 35px;
    margin-top: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.live-icon {
    width: 23.8px;
    height: 22.2px;
}
</style>
