import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '../api/axios';

export const useCategoriesStore = defineStore('categories', () => {
    const categories = ref([]);
    const chosedCategory = ref({});

    async function getCategories() {
        try {
            const response = await apiClient.get('/categories');
            categories.value = response.data.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function getChosedCategory(id) {
        try {
            const response = await apiClient.get(`/category/${id}`);
            setChosedCategories(response.data);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function updateComplateCategory(id) {
        try {
            await apiClient.patch(`/category/finish`, { categoryId: id });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    function setChosedCategories(category) {
        chosedCategory.value = category;
    }

    async function getCategoryStars(id) {
        try {
            const response = await apiClient.get('/rating/get-rating-for-category', {
                params: { categoryId: id },
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return {
        categories,
        chosedCategory,
        getCategories,
        setChosedCategories,
        getChosedCategory,
        updateComplateCategory,
        getCategoryStars,
    };
});
