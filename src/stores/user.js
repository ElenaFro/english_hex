import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '../api/axios';

export const useUserStore = defineStore('user', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')) || null);
    const token = ref(localStorage.getItem('access_token') || null);
    const isAuthenticated = ref(!!localStorage.getItem('access_token'));
    const isSubscribed = ref(null);
    const notifications = ref([]);

    const getCurrentUser = () => {
        return user.value;
    };

    async function register(name, email, password, confirm_agreement) {
        const response = await apiClient.post('/registration', {
            email: email,
            password: password,
            name: name,
            confirm_agreement: confirm_agreement,
        });
        return response.data;
    }

    async function login(email, password) {
        try {
            const response = await apiClient.post('/login', {
                email: email,
                password: password,
            });
            const { access_token: newToken } = response.data;
            token.value = newToken;
            isAuthenticated.value = true;
            localStorage.setItem('access_token', newToken);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async function logout() {
        token.value = null;
        user.value = null;
        isAuthenticated.value = false;
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    }

    async function recoverPassword(email) {
        const response = await apiClient.patch('/send-restore-code', {
            email: email,
        });
        return response.data;
    }

    async function fetchUser() {
        if (!token.value) return;
        try {
            const response = await apiClient.get('/profile/get');
            user.value = response.data;
            localStorage.setItem('user', JSON.stringify(response.data));
            isAuthenticated.value = true;
        } catch (error) {
            console.error('Fetch user error:', error);
            logout();
        }
    }

    async function checkUserSubscribe() {
        if (!token.value) return;
        try {
            const response = await apiClient.get('/push/is-subscribe');
            isSubscribed.value = response.data.push_subscription;
            console.log(response);
        } catch (error) {
            console.error('Fetch subscribe error:', error);
        }
    }

    async function getRaiting() {
        if (!token.value) return;
        try {
            const response = await apiClient.get('/rating/get');
            return response.data;
        } catch (error) {
            console.error('Get rating error:', error);
            throw error;
        }
    }

    async function markFirstGame() {
        if (!token.value) return;
        try {
            await apiClient.patch('/profile/update', {
                ever_played_game: true,
            });
            await fetchUser();
        } catch (error) {
            console.error(error);
        }
    }

    async function addRatingToGame(categoryId, gameName, count) {
        if (!token.value) return;
        try {
            await apiClient.patch('/rating/add-rating-to-game', {
                categoryId: categoryId,
                game: gameName,
                rating: count,
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function addRatingToCategory(categoryId) {
        if (!token.value) return;
        try {
            await apiClient.patch('/rating/add-rating-to-category', {
                categoryId: categoryId,
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function getUserNotifications() {
        if (!token.value) return;
        try {
            const response = await apiClient.get('/notification/get');
            notifications.value = response.data.notifications;
        } catch (error) {
            console.error('Fetch notifications error:', error);
        }
    }

    async function markReadNotifications(ids) {
        if (!token.value) return;
        try {
            await apiClient.patch('/notification/mark-as-read', {
                notification_ids: ids,
            });
            await getUserNotifications();
        } catch (error) {
            console.error(error);
        }
    }

    return {
        user,
        token,
        isAuthenticated,
        isSubscribed,
        notifications,
        register,
        login,
        logout,
        getCurrentUser,
        recoverPassword,
        fetchUser,
        getRaiting,
        markFirstGame,
        addRatingToGame,
        addRatingToCategory,
        getUserNotifications,
        markReadNotifications,
        checkUserSubscribe,
    };
});
