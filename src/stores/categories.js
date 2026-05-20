import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '../api/axios';
import { push } from 'notivue';

export const useCategoriesStore = defineStore('categories', () => {
    const categories = ref([]);
    const selectedCategory = ref({});
    const favoriteCards = ref([]);
    const pendingAchievement = ref(null);

    async function getCategories() {
        const token = localStorage.getItem('access_token');
        if (!token) return;

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
            const response = await apiClient.patch(`/category/finish/${id}`);
            return response.data;
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
            const response = await apiClient.get(`/rating/get-rating-for-category/${id}`);
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
            const formData = new FormData();
            Object.entries(card).forEach(([key, value]) => {
                if (value === undefined || value === null) return;
                formData.append(key, value);
            });
            const response = await apiClient.post(`/admin/card/create/${categoryId}`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function updateCard(card) {
        try {
            const formData = new FormData();

            Object.entries(card).forEach(([key, value]) => {
                if (key === 'id') return;
                if (value === undefined || value === null) return;
                formData.append(key, value);
            });

            const response = await apiClient.post(`/admin/card/update/${card.id}`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function getGameTasks(categoryId) {
        const tasks = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const response = await apiClient.get('/phrase-galaxy-sentences/get', {
                params: { category_id: categoryId, page },
            });
            const data = response.data;
            tasks.push(...(data.data ?? []));
            hasMore = Boolean(data.next_page_url);
            page++;
        }

        return tasks;
    }

    async function createGameTask(categoryId, task) {
        try {
            const response = await apiClient.post(
                '/phrase-galaxy-sentences/create',
                {
                    sentence_en: task.sentence_en,
                    sentence_ru: task.sentence_ru,
                    correct_answer: task.correct_answer,
                    wrong_answers: task.wrong_answers,
                    audio: task.audio,
                    category_id: categoryId,
                },
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function updateGameTask(task) {
        try {
            const response = await apiClient.post(
                `/phrase-galaxy-sentences/update/${task.id}`,
                {
                    sentence_en: task.sentence_en,
                    sentence_ru: task.sentence_ru,
                    correct_answer: task.correct_answer,
                    wrong_answers: task.wrong_answers,
                    audio: task.audio instanceof File ? task.audio : undefined,
                },
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function deleteGameTask(id) {
        try {
            const response = await apiClient.delete(`/phrase-galaxy-sentences/delete/${id}`);
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

    async function finishCard(id) {
        try {
            await apiClient.patch(`/card/finish/${id}`);
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
        pendingAchievement,
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
        getGameTasks,
        createGameTask,
        updateGameTask,
        deleteGameTask,
        finishCard,
        addCardInFavorite,
        deleteCardFromFavorite,
        searchFavorite,
    };
});
