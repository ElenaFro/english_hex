<template>
    <div class="header-bar">
    <RouterLink
      v-for="item in headerItemsLeft"
      :key="item.name"
      :to="item.path"
      class="header-item"
      :class="{ active: $route.path === item.path }"
    >
      <img :src="item.icon" class="header-icon" :alt="item.name" />
    </RouterLink>
    <h1 class="header-title">{{ currentTitle }}</h1>
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

const headerItemsLeft = [
    {
        name: "left",
        path: "/",
        icon: 'src/assets/icons/navBarIcon/arrow_left.svg',
    },
];
const headerItemsRight = [
    {
        name: "addCategories",
        path: "/addCategories",
        icon: 'src/assets/icons/navBarIcon/Bell.svg',
    },
];

const currentTitle = ref(" "); // Заголовок по умолчанию
const route = useRoute(); // Получаем текущий маршрут

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
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    width: 90%;
    max-width: 480px;
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

.header-item:hover {
    background-color: rgba(255, 255, 255, 0);
}

.header-item.active {
    border-bottom: 1px solid #ffffff;
}

.header-icon {
    width: 24px;
    height: 24px;
}

.header-label {
    font-size: 0.75rem;
    margin-top: 0.25rem;
}
.header-title {
    color: #ffff;
}
</style>