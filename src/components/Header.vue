<template>
    <div v-if="!isDailyRewardPage" class="header-bar">
        <template v-if="isHomePage || isGameWordTwinkle || myPlanet">
            <div ref="starRef" class="header-star" :class="overlayClass" @click="goToMyPlanet">
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
        <!-- <template v-else-if="">
            <span @click="goToMyPlanet" class="header-star">
                {{ totalStars }}
                <img
                    src="@/assets/icons/navBarIcon/star.svg"
                    class="header-star-left"
                    alt="Звезда"
                />
            </span>
        </template> -->
        <template v-else>
            <button @click="goBack" class="header-item-button">
                <img
                    src="@/assets/icons/navBarIcon/arrow_left.svg"
                    class="header-icon-left"
                    alt="Назад"
                />
            </button>
        </template>
        <p class="header-title">{{ currentTitle }}</p>
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
        <template v-if="isGamePlanetPage">
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

    <teleport to="body">
        <div v-if="isShowStarHint" class="hint-overlay" @click="closeStarHint">
            <div class="previous-container" :style="highlightStyle">
                <span class="previous-container_text"
                    >Получай больше звезд и развивай свою планету!</span
                >
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { defineProps } from 'vue';
import { useUserStore } from '@/stores/user';
import Bell from '@/assets/icons/navBarIcon/Bell.svg';
import BellUnread from '@/assets/icons/navBarIcon/Bell_unread.svg';
import { useElementPosition } from '@/shared/composables/useElementPosition';

const router = useRouter();
const userStore = useUserStore();
const currentNotifications = computed(() => userStore.notifications);

const currentUser = computed(() => userStore.getCurrentUser());
const totalStars = computed(() => currentUser.value.rating);
const props = defineProps(['lives']);
const starRef = ref(null);
const isShowStarHint = ref(false);

const { calculatePositionDelayed, getPositionStyle } = useElementPosition(starRef, {
    autoUpdate: true,
    watchResize: true,
});

const overlayClass = computed(() => ({ 'index-up': isShowStarHint.value }));

const highlightStyle = computed(() => getPositionStyle({ top: 58, width: 110, left: 77 }));

const isGamePlanetPage = computed(() => route.path === '/planetAttackPage');

const isGameWordTwinkle = computed(() => route.path === '/wordTwinkleResult');

const myPlanet = computed(() => route.path === '/myPlanet');

const isShowStarOverview = computed(() => userStore.isShowStarOverview);

const hasUnreadNotify = computed(() =>
    currentNotifications.value?.find((notify) => notify.was_read === false)
);

const headerItemsRight = computed(() => [
    {
        name: 'notifications',
        path: '/notifications',
        icon: hasUnreadNotify.value ? BellUnread : Bell,
    },
]);

const currentTitle = ref(' ');
const route = useRoute();

function goBack() {
    window.history.back();
}

const goToMyPlanet = () => {
    if (!currentUser.value.ever_played_game) return;
    router.push({ path: '/myPlanet' });
};
const isHomePage = computed(() => route.fullPath === '/');

const closeStarHint = () => {
    isShowStarHint.value = false;
    userStore.switchStarOverview(false);
};

const gameRoutes = ['games', 'planetGame', 'wordTwinkle', 'wordTwinkleGame', 'constellationGame'];

const isDailyRewardPage = computed(() => route.name === 'DailyReward');

watch(
    () => route.path,
    () => {
        if (gameRoutes.includes(route.name)) {
            currentTitle.value = 'Игры';
        } else {
            switch (route.name) {
                case 'profile':
                    currentTitle.value = 'Профиль';
                    break;
                case 'rating':
                    currentTitle.value = 'Рейтинг';
                    break;
                case 'notifications':
                    currentTitle.value = 'Уведомления';
                    break;
                case 'createNotification':
                    currentTitle.value = 'Уведомления';
                    break;
                case 'addCategories':
                    currentTitle.value = 'Редактирование';
                    break;
                case 'editCategory':
                    currentTitle.value = 'Редактирование';
                    break;
                case 'learning':
                    currentTitle.value = route.query.name;
                    break;
                case 'planetAttackPage':
                    currentTitle.value = '';
                    break;
                default:
                    currentTitle.value = ' ';
                    break;
            }
        }
    },
    { immediate: true }
);

watch(
    () => route.name,
    (newVal) => {
        if (isShowStarOverview.value && newVal === 'myPlanet') {
            isShowStarHint.value = true;
            calculatePositionDelayed();
        }
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
}

.header-star {
    background-color: #ffffff;
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
    z-index: 502;
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
    font-size: 28px;
    font-weight: 800;
    line-height: 35px;
    margin-top: 13px;
}

.live-icon {
    width: 23.8px;
    height: 22.2px;
}

.previous-container {
    position: absolute;
    z-index: 104;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    cursor: pointer;
    width: 300px;

    &_text {
        color: #fff;
        text-align: center;
        margin-top: 22px;
        max-width: 300px;
    }

    &_icon {
        width: 30px;
    }
}
</style>
