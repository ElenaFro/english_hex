<template>
    <div class="layout">
        <Header :lives="lives" :earnedStars="earnedStars" />
        <RouterView @update:lives="updateLives" @update:earnedStars="updateEarnedStars" />
        <Navigation />
    </div>
</template>

<script setup>
import Navigation from '../components/Navigation.vue';
import Header from '../components/Header.vue';
import { ref } from 'vue';
const lives = ref(5); 

const earnedStars = ref(parseInt(localStorage.getItem('earnedStars')) || 0); 

const updateLives = (newLives) => {
    lives.value = newLives; // Обновляем количество жизней
};
const updateEarnedStars = (newStars) => {
       earnedStars.value = newStars;
} 

</script>

import { ref } from 'vue';
<style lang="scss">
html,
body {
    margin: 0;
    padding: 0;
    height: 100vh;
    overflow: hidden;
}

body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}
@media (min-width: 415px) {
    .layout {
       overflow: visible; 
    }
}
</style>
