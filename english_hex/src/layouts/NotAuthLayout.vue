<template>
    <q-layout class="layout">
        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<style scoped>
.layout {
    min-height: 100vh;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>