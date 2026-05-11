<template>
    <add-categories updating />
</template>
<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AddCategories from '@/components/CreateCategory/AddCategories.vue';
import { useCategoriesStore } from '@/stores/categories';

const route = useRoute();
const categoryStore = useCategoriesStore();
const currentCategory = computed(() => categoryStore.selectedCategory);

onMounted(async () => {
    try {
        if (!currentCategory.value?.id) {
            await categoryStore.getCategoryById(route.params.id);
        }
    } catch (error) {
        console.error(error);
    }
});
</script>
