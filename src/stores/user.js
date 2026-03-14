import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import apiClient from '../api/axios';

export const useUserStore = defineStore('user', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')) || null);
    const token = ref(localStorage.getItem('access_token') || null);
    const unsubscribed_at = ref(null);

    const isAdmin = ref(null);
    const isTeacher = ref(null);

    const isAuthenticated = ref(!!localStorage.getItem('access_token'));
    const isLoggingIn = ref(false);
    const isSubscribed = ref(null);
    const isShowPlanetOverview = ref(false);
    const installPopupClosed = ref(false);

    const notifications = ref([]);
    const searchUsersPaginator = ref(null);
    const searchedFriends = ref([]);
    const planetSkins = ref(null);

    const currentHeaderTitle = ref(null);

    const currentSearchedUsers = computed(() => searchUsersPaginator.value.data);

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
        isLoggingIn.value = true;
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
        } finally {
            isLoggingIn.value = false;
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
        const requestToken = token.value;
        try {
            const response = await apiClient.get('/profile/get');
            user.value = response.data;
            localStorage.setItem('user', JSON.stringify(response.data));
            isAuthenticated.value = true;
        } catch (error) {
            console.error('Fetch user error:', error);
            const status = error?.response?.status;
            const tokenChanged = token.value !== requestToken;
            const shouldLogout =
                (status === 401 || status === 403) && !tokenChanged && !isLoggingIn.value;

            if (shouldLogout) {
                logout();
            }
        }
    }

    async function getUserRole() {
        if (!token.value) return;
        try {
            const response = await apiClient.get('/is-role');
            isAdmin.value = response.data?.role === 'admin' ? true : false;
            isTeacher.value = response.data?.role === 'teacher' ? true : false;
        } catch (error) {
            console.error('Fetch role error:', error);
        }
    }

    async function checkUserSubscribe() {
        if (!token.value) return;
        try {
            const response = await apiClient.get('/push/is-subscribe');
            isSubscribed.value = response.data.push_subscription;
            if (response.data?.unsubscribed_at)
                unsubscribed_at.value = response.data?.unsubscribed_at;
        } catch (error) {
            console.error('Fetch subscribe error:', error);
        }
    }

    async function unSubscribeUser() {
        if (!token.value) return;
        try {
            const response = await apiClient.get('/push/unsubscribe');
            isSubscribed.value = response.data.push_subscription;
        } catch (error) {
            console.error('Fetch unSubscribe error:', error);
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

    async function sendNotification(form) {
        if (!token.value) return;
        if (!isAdmin.value) return;
        try {
            await apiClient.post('/notification/send-notification', {
                title: form.title,
                message: form.message,
            });
        } catch (error) {
            console.error('Ошибка отправки уведомления', error);
        }
    }

    async function searchUsers(name, page) {
        if (!token.value) return;
        try {
            const response = await apiClient.get('/users/search', {
                params: { q: name, page: page },
            });

            searchUsersPaginator.value = response.data;
        } catch (error) {
            console.error('Fetch users error:', error);
        }
    }

    async function getUserById(id) {
        try {
            const response = await apiClient.get(`users/show/${id}`);

            return response.data;
        } catch (error) {
            console.error('Fetch users error:', error);
        }
    }

    async function searchFriends(name) {
        try {
            const response = await apiClient.get('/friends/get', {
                params: { search: name },
            });

            searchedFriends.value = response.data.data;
        } catch (error) {
            console.error('Fetch users error:', error);
        }
    }

    async function addToFriend(id) {
        try {
            await apiClient.post(`/friends/add/${id}`);
        } catch (error) {
            console.error('Ошибка добавления в друзья', error);
        }
    }

    async function deleteFriend(id) {
        try {
            await apiClient.delete(`/friends/remove/${id}`);
        } catch (error) {
            console.error(error);
        }
    }

    async function getPlanetSkins() {
        try {
            const response = await apiClient.get('/me/planet/skins');

            planetSkins.value = response.data;
        } catch (error) {
            console.error('Fetch users error:', error);
        }
    }

    const switchPlanetOverview = (value) => {
        isShowPlanetOverview.value = value;
    };

    const setHeaderTitle = (value) => {
        currentHeaderTitle.value = value;
    };

    const setInstallPopupClosed = (value) => {
        installPopupClosed.value = value;
    };

    return {
        user,
        token,
        isAuthenticated,
        isLoggingIn,
        isSubscribed,
        notifications,
        unsubscribed_at,
        isAdmin,
        isShowPlanetOverview,
        currentHeaderTitle,
        isTeacher,
        installPopupClosed,
        currentSearchedUsers,
        searchedFriends,
        planetSkins,
        register,
        login,
        logout,
        getCurrentUser,
        getUserById,
        getRaiting,
        getUserNotifications,
        getUserRole,
        recoverPassword,
        fetchUser,
        markFirstGame,
        addRatingToGame,
        addRatingToCategory,
        addToFriend,
        markReadNotifications,
        checkUserSubscribe,
        unSubscribeUser,
        sendNotification,
        switchPlanetOverview,
        setHeaderTitle,
        setInstallPopupClosed,
        searchUsers,
        searchFriends,
        deleteFriend,
        getPlanetSkins,
    };
});
