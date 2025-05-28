<template>
    <div class="layout">
        <Header />
        <RouterView />
        <Navigation />
    </div>
</template>
<script setup>
import Navigation from '../components/Navigation.vue';
import Header from '../components/Header.vue';
</script>

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
</style>
