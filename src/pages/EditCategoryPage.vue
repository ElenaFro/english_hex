<template>
    <div v-if="isAdmin">
        <add-categories updating />
    </div>
</template>
<script setup>
//vue
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
//components
import AddCategories from '@/components/CreateCategory/AddCategories.vue';
//stores
import { useUserStore } from '@/stores/user';
import { useCategoriesStore } from '@/stores/categories';

const route = useRoute();
const userStore = useUserStore();
const categoryStore = useCategoriesStore();
const currentCategory = computed(() => categoryStore.chosedCategory);

const isAdmin = computed(() => userStore.isAdmin);

onMounted(async () => {
    try {
        if (!currentCategory.value?.id) {
            await categoryStore.getChosedCategory(route.params.id);
        }
    } catch (error) {
        console.error(error);
    }
});
</script>
