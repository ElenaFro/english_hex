<template>
    <div class="container" @click="goToCreateCategoryPage"></div>
</template>

<script setup>
//vue
import { useRouter } from 'vue-router';

const router = useRouter();

const goToCreateCategoryPage = () => {
    router.push({ name: 'addCategories' });
};
</script>

<style la scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 15px;
    padding: 19px 14px 13px;
    background-position: center !important;
    background-repeat: no-repeat;
    cursor: pointer;
    background-image: url('@/assets/categori/add_card.svg');
}
</style>
