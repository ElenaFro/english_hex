import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '../api/axios';
import { push } from 'notivue';

export const useCategoriesStore = defineStore('categories', () => {
    const categories = ref([]);
    const selectedCategory = ref({});
    const favoriteCards = ref([]);

    async function getCategories() {
        try {
            const response = await apiClient.get('/categories');
            categories.value = response.data.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function getCategoryById(id) {
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
        selectedCategory.value = category;
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
            const response = await apiClient.post(
                '/admin/category/create',
                {
                    name: category.name,
                    description: category.description,
                    category_photo: category.category_photo,
                },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function updateCategory(category) {
        try {
            const response = await apiClient.post(
                `/admin/category/update/${category.id}`,
                {
                    name: category.name,
                    description: category.description,
                    category_photo: category.category_photo,
                },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
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

    async function getCardById(id) {
        try {
            const response = await apiClient.get(`/card/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function createCard(categoryId, card) {
        try {
            const response = await apiClient.post(
                `/admin/card/create/${categoryId}`,
                {
                    word: card.word,
                    translation_word: card.translation_word,
                    card_photo: card.card_photo,
                    video: card.video,
                    audio: card.audio,
                },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function updateCard(card) {
        try {
            const response = await apiClient.post(
                `/admin/card/update/${card.id}`,
                {
                    word: card.word,
                    translation_word: card.translation_word,
                    card_photo: card.card_photo,
                    video: card.video,
                    audio: card.audio,
                },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
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

    async function getFavoriteCards() {
        try {
            const response = await apiClient.get('/favorite/show');

            favoriteCards.value = response.data.data;
        } catch (error) {
            console.error('Fetch notifications error:', error);
        }
    }

    async function addCardInFavorite(cardId) {
        try {
            const response = await apiClient.post('/favorite/add', { card_id: cardId });
            push.success({ message: 'Карточка добавлена в избранные' });
            getFavoriteCards();
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function deleteCardFromFavorite(id) {
        try {
            const response = await apiClient.delete('/favorite/delete/', {
                params: {
                    card_id: id,
                },
            });
            await getFavoriteCards();
            push.success({ message: 'Карточка удалена из избранных' });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function searchFavorite(name) {
        try {
            const response = await apiClient.get('/favorite/search', {
                params: { request: name },
            });

            favoriteCards.value = response.data.data;
        } catch (error) {
            console.error('Fetch role error:', error);
        }
    }

    return {
        categories,
        selectedCategory,
        favoriteCards,
        getCategories,
        setChosedCategories,
        getCategoryById,
        getFavoriteCards,
        updateComplateCategory,
        getCategoryStars,
        createCategory,
        updateCategory,
        deleteCategory,
        getCardById,
        createCard,
        updateCard,
        deleteCard,
        addCardInFavorite,
        deleteCardFromFavorite,
        searchFavorite,
    };
});
