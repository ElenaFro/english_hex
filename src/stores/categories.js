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

    async function createCategory(category) {
        try {
            const response = await apiClient.post('/admin/category/create', {
                params: {
                    english_name: category.english_name,
                    description: category.description,
                    category_photo: category.category_photo,
                },
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function updateCategory(category) {
        try {
            const response = await apiClient.post(`/admin/category/update/${category.id}`, {
                params: {
                    english_name: category.english_name,
                    description: category.description,
                    category_photo: category.category_photo,
                },
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function deleteCategory(id) {
        try {
            const response = await apiClient.delete(`/admin/category/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function createCard(categoryId, card) {
        try {
            const response = await apiClient.post(`/admin/card/create/${categoryId}`, {
                params: {
                    word: card.word,
                    translation_word: card.translation_word,
                    card_photo: card.card_photo,
                    video: card.video,
                    audio: card.audio,
                },
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function updateCard(card) {
        try {
            const response = await apiClient.post(`/admin/card/update/${card.id}`, {
                params: {
                    word: card.word,
                    translation_word: card.translation_word,
                    card_photo: card.card_photo,
                    video: card.video,
                    audio: card.audio,
                },
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function deleteCard(id) {
        try {
            const response = await apiClient.delete(`/admin/card/delete/${id}`);
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
        createCategory,
        updateCategory,
        deleteCategory,
        createCard,
        updateCard,
        deleteCard,
    };
});
