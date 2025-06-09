<template>
    <div class="layout">
         <Header :lives="lives" />
        <RouterView @update:lives="lives = $event"  />
        <Navigation />
    </div>
</template>

<script setup>
import Navigation from '../components/Navigation.vue';
import Header from '../components/Header.vue';
import { ref } from 'vue';
const lives = ref(5); 
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
