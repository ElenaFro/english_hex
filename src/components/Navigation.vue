<template>
    <nav class="navigation-bar">
        <RouterLink
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            class="nav-item"
            :class="{ active: isActive(item) }"
        >
            <img :src="item.icon" class="nav-icon" alt="item.label" />
        </RouterLink>
    </nav>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();

const navItems = [
    {
        name: 'mainPage',
        path: '/',
        icon: 'src/assets/icons/navBarIcon/Home.svg',
    },
    {
        name: 'addCategories',
        path: '/addCategories',
        icon: 'src/assets/icons/navBarIcon/Plus.svg',
    },
    {
        name: 'rating',
        path: '/rating',
        icon: 'src/assets/icons/navBarIcon/Raiting.png',
    },
    {
        name: 'profile',
        path: '/profile',
        icon: 'src/assets/icons/navBarIcon/Profile.svg',
    },
];

const isActive = (item) => {
    const isRouteInNav = navItems.some((navItem) => navItem.path === route.path);
    if (!isRouteInNav) {
        return item.name === 'mainPage';
    }
    return route.path === item.path;
};
</script>

<style scoped>
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
    z-index: 500;
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
    width: 24px;
    height: 24px;
}

.nav-label {
    font-size: 0.75rem;
    margin-top: 0.25rem;
}
</style>
