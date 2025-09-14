<template>
    <div v-if="isAdmin">
        <add-categories />
    </div>
    <div v-else class="add-page">
        <AddCategoriesPopup v-if="openPopup" :title="titlePopup" :message="messagePopup" />
    </div>
</template>
<script setup>
//vue
import { ref, onMounted, computed } from 'vue';
//components
import AddCategoriesPopup from '@/components/popups/AddCategoriesPopup.vue';
import AddCategories from '@/components/AddCategories.vue';
//stores
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const openPopup = ref(false);
const isAdmin = computed(() => userStore.isAdmin);

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
