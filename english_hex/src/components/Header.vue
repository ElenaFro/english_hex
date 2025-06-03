<template>
    <div class="header-bar">
        <template v-if="isHomePage">
            <span class="header-star">
                {{ earnedStars }} <img src="@/assets/icons/navBarIcon/star.svg" class="header-star-left" alt="Звезда" />
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
            <img v-if="!route.fullPath.includes('games')" :src="item.icon" class="header-icon" :alt="item.name" />
        </RouterLink>
    </div>

</template>

<script setup>
import { RouterLink } from "vue-router";
import { ref, watch, computed  } from 'vue';
import { useRoute} from 'vue-router';

// const headerItemsLeft = [
//     {
//         name: "left",
//         path: "/",
//         icon: 'src/assets/icons/navBarIcon/arrow_left.svg',
//     },
// ];

const earnedStars = ref(0); // Здесь вы можете динамически изменять количество звезд
const isHomePage = computed(() => route.path === '/'); // Проверяем, находимся ли мы на главной странице

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

watch(() => route.path, (newPath) => {
    switch (newPath) {
        case '/profile':
            currentTitle.value = "Профиль";
            break;
        case '/rating':
            currentTitle.value = "Рейтинг";
            break;
        case '/notifications':
            currentTitle.value = "Уведомления";
            break;
        case '/addCategories':
            currentTitle.value = "Редактирование";
            break;
        case '/games':
            currentTitle.value = "Игры";
            break;
        case '/planetattack_games':
            currentTitle.value = "Игры";
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
.header-star-left {
    width: 21px;
    height: 21px;
    padding-left: 2px;
    padding-bottom: 2px;
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
</style>