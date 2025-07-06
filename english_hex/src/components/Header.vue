<template>
    <div class="header-bar">
        <template v-if="isHomePage">
            <span @click="goToMyPlanet" class="header-star">
                {{ earnedStars }}
                <img
                    src="@/assets/icons/navBarIcon/star.svg"
                    class="header-star-left"
                    alt="Звезда"
                />
            </span>
        </template>

        <template v-else-if="isGamePlanetPage">
            <span class="header-live">
                <span v-for="index in lives" :key="index" class="live-icon">
                    <img src="@/assets/icons/navBarIcon/live.svg" class="header-live-left" alt="Жизнь" />
                </span>
            </span>
        </template>
        <template v-else-if="isGameWordTwinkle || myPlanet">
            <span @click="goToMyPlanet" class="header-star">
                {{ earnedStars }}
                <img
                    src="@/assets/icons/navBarIcon/star.svg"
                    class="header-star-left"
                    alt="Звезда"
                />
            </span>
        </template> 
        <template v-else>
            <button @click="goBack" class="header-item-button">
                <img src="@/assets/icons/navBarIcon/arrow_left.svg" class="header-icon-left" alt="Назад" />
            </button>
        </template>
        <p class="header-title">{{ currentTitle }}</p>
        <RouterLink v-for="item in headerItemsRight" :key="item.name + '-right'" :to="item.path" class="header-item"
            :class="{ active: $route.path === item.path }">
            <img v-if="!route.fullPath.includes('games') && !route.fullPath.includes('planetAttackPage')"
                :src="item.icon" class="header-icon" :alt="item.name" />
        </RouterLink>
        <template v-if="isGamePlanetPage">
            <span class="header-star">
                {{ earnedStars }} <img src="@/assets/icons/navBarIcon/star.svg" class="header-star-left" alt="Звезда" />
            </span>
        </template>
    </div>

</template>

<script setup>
import { RouterLink } from 'vue-router';
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { defineProps } from 'vue';
import { useUserStore } from '@/stores/user';

const router = useRouter();

const currentUser = computed(() => useUserStore().getCurrentUser());
const earnedStars = computed(() => currentUser.value.rating);
const props = defineProps(['lives']);

const isGamePlanetPage = computed(() => route.path === '/planetAttackPage'); 

const isGameWordTwinkle = computed(() => route.path === '/wordTwinkleResult');

const myPlanet = computed(() => route.path === '/myPlanet');

const headerItemsRight = [
    {
        name: "notifications",
        path: "/notifications",
        icon: 'src/assets/icons/navBarIcon/Bell.svg',
    },
];

const currentTitle = ref(" ");
const route = useRoute();

function goBack() {
    window.history.back();
}

const goToMyPlanet = () => {
    router.push({ path: '/myPlanet', query: { earnedStars: earnedStars.value } });
};
const isHomePage = computed(() => route.fullPath === '/');

// onMounted(async () => {
// 	try {
// 		const res = await axios.get('/test.json')
// 		learningSections.value = res.data
// 	} catch {
// 		console.error(err)
// 	}
// })

watch(() => route.path, () => {
    switch (route.name) {
        case 'profile':
            currentTitle.value = "Профиль";
            break;
        case 'rating':
            currentTitle.value = "Рейтинг";
            break;
        case 'notifications':
            currentTitle.value = "Уведомления";
            break;
        case 'addCategories':
            currentTitle.value = "Редактирование";
            break;
        case 'games':
            currentTitle.value = "Игры";
            break;
        case 'planetGame':
            currentTitle.value = "Игры";
            break;
        case 'planetAttackPage':
            currentTitle.value = "";
            break;
		case 'wordTwinkle':
            currentTitle.value = "Игры";
            break;
		case 'wordTwinkleGame':
            currentTitle.value = "Игры";
            break;
        case 'learning':
            currentTitle.value = route.query.name;
            break;
        default:
            currentTitle.value = " ";
            break;
    }
}, { immediate: true });
</script>

<style scoped>
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
</style>