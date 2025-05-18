<template>
    <div class="header-bar">
    <!-- <RouterLink
      v-for="item in headerItemsLeft"
      :key="item.name"
      :to="item.path"
      class="header-item"
      :class="{ active: $route.path === item.path }"
    >
      <img :src="item.icon" class="header-icon" :alt="item.name" />
    </RouterLink> -->
    <button @click="goBack" class="header-item-button">
      <img src="@/assets/icons/navBarIcon/arrow_left.svg" class="header-icon" alt="Назад" />
    </button>
    <p class="header-title">{{ currentTitle }}</p>
    <RouterLink
      v-for="item in headerItemsRight"
      :key="item.name + '-right'"
      :to="item.path"
      class="header-item"
      :class="{ active: $route.path === item.path }"
    >
      <img :src="item.icon" class="header-icon" :alt="item.name" />
    </RouterLink>
  </div>

</template>

<script setup>
import { RouterLink } from "vue-router";
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

// const headerItemsLeft = [
//     {
//         name: "left",
//         path: "/",
//         icon: 'src/assets/icons/navBarIcon/arrow_left.svg',
//     },
// ];
const headerItemsRight = [
    {
        name: "notifications",
        path: "/notifications",
        icon: 'src/assets/icons/navBarIcon/Bell.svg',
    },
];

const currentTitle = ref(" "); // Заголовок по умолчанию
const route = useRoute(); // Получаем текущий маршрут
// Функция для возврата на предыдущую страницу
function goBack() {
  window.history.back();
}

watch(() => route.path, (newPath) => {
    switch (newPath) {
        case '/profile':
            currentTitle.value = "Профиль";
            break;
        case '/raiting':
             currentTitle.value = "Рейтинг";
            break;
        default:
            currentTitle.value = " "; // Заголовок по умолчанию
            break;
    }        
}, { immediate: true });
</script>

<style scoped>
.header-bar {
    position: fixed;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: transparent;
    border-radius: 30px;
    padding: 0.5rem 1rem;
    z-index: 1000;
    width: 90%;
    max-width: 375px;
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
    background-color: rgba(255, 255, 255, 0)!important;
}
.header-item:hover {
    background-color: rgba(255, 255, 255, 0)!important;
}

/* .header-item.active {
    border-bottom: 1px solid #ffffff;
} */

.header-icon {
    width: 32px;
    height: 32px;
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
}
</style>