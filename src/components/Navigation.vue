<template>
    <nav v-if="!isDailyRewardPage" class="navigation-bar">
        <RouterLink
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            class="nav-item"
            :class="{ active: isActive(item) }"
        >
            <img
                :ref="(el) => setProfileIconRef(el, item)"
                :src="item.icon"
                class="nav-icon"
                :alt="item.label"
            />
        </RouterLink>
    </nav>
    <teleport to="body">
        <div v-if="isShowSubscribeHint" class="hint-overlay" @click="closeSubscribeHint">
            <div class="subscribe-container" :style="highlightStyle">
                <div class="subscribe-container__wrapper">
                    <span class="subscribe-container_text"
                        >Больше возможностей ждут тебя! <br />
                        Оформи подписку в разделе<br />
                        «Профиль»</span
                    >
                    <img
                        class="subscribe-container_icon"
                        src="@/assets/onboarding/arrow_down.svg"
                        alt="arrow"
                    />
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router';
import HomeIcon from '@/assets/icons/navBarIcon/Home.svg';
import GameIcon from '@/assets/icons/navBarIcon/game.svg';
import RatingIcon from '@/assets/icons/navBarIcon/Raiting.png';
import ProfileIcon from '@/assets/icons/navBarIcon/Profile.svg';
import { computed, ref, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { useElementPosition } from '@/shared/composables/useElementPosition';

const route = useRoute();
const userStore = useUserStore();

const isShowSubscribeHint = ref(false);
const profileBtnRef = ref(null);

const navItems = [
    {
        name: 'mainPage',
        path: '/',
        icon: HomeIcon,
    },
    {
        name: 'allGames',
        path: '/allGames',
        icon: GameIcon,
    },
    {
        name: 'users',
        path: '/users',
        icon: RatingIcon,
    },
    {
        name: 'profile',
        path: '/profile',
        icon: ProfileIcon,
    },
];

const { calculatePositionDelayed, getPositionStyle } = useElementPosition(profileBtnRef, {
    autoUpdate: true,
    watchResize: true,
});

function showSubscribeHint() {
    if (!isShowSubscribeHint.value) {
        calculatePositionDelayed();
        isShowSubscribeHint.value = true;
    }
}

const highlightStyle = computed(() => getPositionStyle({ top: -194, left: -259, width: 121 }));

const isActive = (item) => {
    if (route.path.startsWith('/profile')) return item.path === '/profile';
    if (route.path.startsWith('/allGames')) return item.path === '/allGames';
    if (route.path.startsWith('/users')) return item.path === '/users';
    if (route.path === '/') return item.path === '/';
    return item.path === '/';
};

const isDailyRewardPage = computed(() => route.name === 'DailyReward');

const setProfileIconRef = (el, item) => {
    if (item.name === 'profile') {
        profileBtnRef.value = el;
    }
};

const closeSubscribeHint = () => {
    isShowSubscribeHint.value = false;
    useUserStore().markAsShowHint('profile_hint');
};

watch(
    () => userStore.installPopupClosed,
    async (isClosed) => {
        if (!isClosed) return;
        const isSubscribeHintShowed = useUserStore().hintsArray.profile_hint;
        if (!isSubscribeHintShowed) {
            showSubscribeHint();
        }

        // userStore.setInstallPopupClosed(false);
    }
);
</script>

<style scoped lang="scss">
.navigation-bar {
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #262060;
    border-radius: 30px;
    padding: 6px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    z-index: 299;
    width: 90%;
    max-width: 315px;
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #ffffff;
    text-decoration: none;
    padding: 0.5rem;
    transition: background-color 0.2s;
}

.nav-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
    border-bottom: 1px solid #ffffff;
}

.nav-icon {
    width: auto;
    height: min(3dvh, 24px);
}

.nav-label {
    font-size: 0.75rem;
    margin-top: 0.25rem;
}

.subscribe-container {
    position: absolute;
    z-index: 104;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    cursor: pointer;
    width: 300px;

    &__wrapper {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
    }

    &_text {
        color: #fff;
        text-align: center;
        margin: 0 auto;
        margin-bottom: 40px;
        width: 314px;
        margin-right: 30px;
    }

    &_icon {
        width: 60px;
        margin-right: 44px;
        transform: scaleX(-1);
    }
}
</style>
