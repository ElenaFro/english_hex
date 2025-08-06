<template>
    <CongratulationPopup v-if="dataLoaded && !popupShowed && !everPlayedGame" @next="handlePopup" />
    <myNewPlanetPopup v-if="showNewPlanet" @goToMain="handlePopup" />
    <goToMainPopup v-if="showGoToMain" />
    <div class="page-content">
        <div v-if="myPlanet" class="content-container">
            <div class="img-container">
                <img :src="planetImg" alt="" class="img-container__planet-img" />
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CongratulationPopup from '@/components/myPlanetPopup/CongratulationPopup.vue';
import myNewPlanetPopup from '@/components/myPlanetPopup/myNewPlanetPopup.vue';
import goToMainPopup from '@/components/myPlanetPopup/goToMainPopup.vue';
import planet0 from '@/assets/img/planets/planet-img 0.png';
import planet1 from '@/assets/img/planets/planet-img 1.png';
import planet2 from '@/assets/img/planets/planet-img 2.png';
import planet3 from '@/assets/img/planets/planet-img 3.png';
import planet4 from '@/assets/img/planets/planet-img 4.png';
import { useUserStore } from '@/stores/user';

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
const earnedStars = ref(Number(route.query.earnedStars) ?? null);
const totalStars = ref(currentUser.rating);

onMounted(async () => {
    try {
        everPlayedGame.value = currentUser.ever_played_game;
        myPlanet.value = everPlayedGame.value;
    } catch (error) {
        console.error(error);
    } finally {
        dataLoaded.value = true;
    }
    if (earnedStars.value) {
        animateStars.value = true;
    }
});

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
        await userStore.updateUserStars(earnedStars.value);
        console.log('currentUser', currentUser);
        if (!currentUser.ever_played_game) {
            userStore.markFirstGame();
            localStorage.setItem('markFirstGame', true);
        }
        if (!afterFirstGame)
            setTimeout(() => {
                showGoToMain.value = true;
            }, 500);
    } catch (error) {
        console.error('Failed to update user stars:', error);
    }
};

const planetImg = computed(() => {
    if (everPlayedGame.value === false) {
        return planet0;
    } else {
        if (totalStars.value < 100) return planet1;
        if (totalStars.value >= 100 && totalStars.value < 200) return planet2;
        if (totalStars.value >= 200 && totalStars.value < 300) return planet3;
        return planet4;
    }
});
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
                animation: flyUp 6s ease-out forwards;
            }
        }
    }
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
