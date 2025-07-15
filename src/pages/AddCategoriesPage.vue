<template>
    <div class="add-page">
        <!-- <AddCategories /> -->
        <AddCategoriesPopup v-if="openPopup" :title="titlePopup" :message="messagePopup" />
    </div>
</template>
<script setup>
// import AddCategories from '@/components/AddCategories.vue'
import { ref, onMounted } from 'vue';
import AddCategoriesPopup from '@/components/popups/AddCategoriesPopup.vue';
const openPopup = ref(false);

onMounted(() => {
    openPopup.value = true;
});
const titlePopup = 'Упс, что-то не так';
const messagePopup = 'Данная функция временно недоступна, ждите дальнейших обновлений!';
</script>
<style scoped lang="scss">
.add-page {
    height: 100vh;
    width: 100vw;
    max-width: 414px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
}
</style>
