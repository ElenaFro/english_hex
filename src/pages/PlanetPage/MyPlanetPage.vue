<template>
    <CongratulationPopup v-if="dataLoaded && !popupShowed && !everPlayedGame" @next="handlePopup" />
    <myNewPlanetPopup v-if="showNewPlanet" @goToMain="handlePopup" />
    <goToMainPopup v-if="showGoToMain" />
    <div class="page-content">
        <div v-if="myPlanet" class="content-container">
            <div class="img-container" @click="goToEditPlanet">
                <img
                    ref="planetRef"
                    :src="planetImg"
                    alt=""
                    class="img-container__planet-img"
                    :class="overlayClass"
                />
            </div>
            <div
                v-if="earnedStars"
                class="stars-container"
                :class="{ 'animate-fly': animateStars }"
                @animationend="handleAnimationEnd"
            >
                <p class="stars-container__stars">+{{ earnedStars }}</p>
                <img class="stars-container__star-img" src="@/assets/img/star-img.svg" alt="" />
            </div>
        </div>
    </div>

    <teleport to="body">
        <div v-if="isShowPlanetHint" class="hint-overlay" @click="closePlanetHint">
            <div class="planet-hint-text" :style="highlightStyle">
                Получай больше звезд и развивай свою планету!
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CongratulationPopup from '@/components/myPlanetPopup/CongratulationPopup.vue';
import myNewPlanetPopup from '@/components/myPlanetPopup/myNewPlanetPopup.vue';
import goToMainPopup from '@/components/myPlanetPopup/goToMainPopup.vue';
import { useUserStore } from '@/stores/user';
import { useCategoriesStore } from '@/stores/categories';
import { usePlanetStore } from '@/stores/planet';
import { useElementPosition } from '@/shared/composables/useElementPosition';

const router = useRouter();
const route = useRoute();

const popupShowed = ref(false);
const myPlanet = ref(false);
const showNewPlanet = ref(false);
const showGoToMain = ref(false);
const everPlayedGame = ref(null);
const dataLoaded = ref(false);
const animateStars = ref(false);
const currentUser = useUserStore().user;
const userStore = useUserStore();
const planetStore = usePlanetStore();
const selectedCategory = useCategoriesStore().selectedCategory;
const localStorageStars = Number(localStorage.getItem('earnedStars') ?? 0);
const gameSource = ref(route.query.gameSource);
const earnedStars = ref(0);
const queryStars = ref(0);

const planetRef = ref(null);
const isShowPlanetHint = ref(false);
const isShowPlanetOverview = computed(() => userStore.isShowPlanetOverview);

const { getPositionStyle, calculatePositionDelayed } = useElementPosition(planetRef, {
    autoUpdate: true,
    watchResize: true,
    watchScroll: true,
});

const highlightStyle = computed(() => getPositionStyle({ top: 250, width: 149, left: 110 }));

const overlayClass = computed(() => ({ 'index-up': isShowPlanetHint.value }));

const closePlanetHint = () => {
    isShowPlanetHint.value = false;
    userStore.switchStarOverview(false);
};

onMounted(async () => {
    try {
        await planetStore.getPlanetSkins();
        queryStars.value = route.query.earnedStars || 0;
        earnedStars.value = Number(queryStars.value) + localStorageStars;

        everPlayedGame.value = currentUser.ever_played_game;
        myPlanet.value = everPlayedGame.value;
    } catch (error) {
        console.error('Error in onMounted:', error);
    } finally {
        dataLoaded.value = true;
    }

    if (earnedStars.value) {
        animateStars.value = true;
        if (gameSource.value) {
            await userStore.addRatingToGame(
                selectedCategory.id ?? route.query.id,
                gameSource.value,
                localStorageStars ? earnedStars.value - localStorageStars : earnedStars.value
            );
        }
        if (localStorageStars) {
            await userStore.addRatingToCategory(selectedCategory.id);
            if (localStorageStars) localStorage.removeItem('earnedStars');
        }
    }

    if (isShowPlanetOverview.value && route.name === 'myPlanet') {
        isShowPlanetHint.value = true;
        await nextTick();
        calculatePositionDelayed();
    }
});

watch(
    () => route.name,
    async (newName) => {
        if (isShowPlanetOverview.value && newName === 'myPlanet') {
            isShowPlanetHint.value = true;
            await nextTick();
            calculatePositionDelayed();
        }
    }
);

const handlePopup = (action) => {
    if (action === 'toPlanet') {
        popupShowed.value = true;
        showNewPlanet.value = true;
    } else if (action === 'goToMain') {
        showNewPlanet.value = false;
        myPlanet.value = true;
        setTimeout(() => {
            animateStars.value = true;
        }, 500);
    }
};

const handleAnimationEnd = async () => {
    try {
        const afterFirstGame = everPlayedGame.value;
        if (!afterFirstGame) showGoToMain.value = true;
        userStore.fetchUser();
        const query = { ...route.query };
        delete query.earnedStars;
        router.push({ query });
        if (!currentUser.ever_played_game) {
            userStore.markFirstGame();
            localStorage.setItem('markFirstGame', true);
        }
    } catch (error) {
        console.error('Failed to update user stars:', error);
    }
};

const planetImages = import.meta.glob('@/assets/planets/*.svg', {
    eager: true,
    import: 'default',
});

const resolvePlanetImage = (skinKey) => {
    const normalizedKey = (skinKey ?? 'planet_default').replace(/\.svg$/i, '');
    const match = Object.entries(planetImages).find(([path]) =>
        path.endsWith(`/${normalizedKey}.svg`)
    );
    return match ? match[1] : planetImages['/src/assets/planets/planet_default.svg'];
};

const planetImg = computed(() => resolvePlanetImage(planetStore.selectedSkin));

const goToEditPlanet = () => {
    router.push({ name: 'editPlanet' });
};
</script>

<style scoped lang="scss">
.page-content {
    background-color: transparent;
    align-items: center;
    padding-block: 0;

    .content-container {
        margin-top: 126px;

        .img-container {
            margin-bottom: 15px;
            cursor: pointer;
        }

        .img-container__planet-img {
            border-radius: 50%;
            object-fit: cover;
            display: block;
            position: relative;
            width: 225px;
        }

        .stars-container {
            display: flex;
            align-items: center;
            gap: 3px;

            &__stars {
                font-size: 50px;
                font-weight: 800;
                line-height: 100%;
                color: #ffffff;
            }

            &__star-img {
                width: 35px;
                height: 35px;
            }

            &.animate-fly {
                animation: flyUp 4s ease-out forwards;
            }
        }
    }
}

.planet-hint-text {
    position: fixed;
    z-index: 503;
    color: #fff;
    text-align: center;
    width: 300px;
    transform: translateX(-50%);
    pointer-events: none;
}

@keyframes flyUp {
    0% {
        transform: translate(0, 0);
        opacity: 1;
    }
    100% {
        transform: translate(-100px, -500px);
        opacity: 0;
    }
}
</style>
