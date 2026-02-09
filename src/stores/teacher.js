import { defineStore } from 'pinia';
import { computed } from 'vue';
import apiClient from '../api/axios';
import { useUserStore } from './user';

export const useTeacherStore = defineStore('teacher', () => {
    const userStore = useUserStore();
    const isTeacher = computed(() => userStore.isTeacher);

    async function createClass(form) {
        try {
            if (isTeacher.value) {
                const response = await apiClient.post('/classes/store', {
                    title: form.title,
                    grade: form.grade,
                });
                return response.data;
            }
        } catch (error) {
            console.error(error);
            throw new Error();
        }
    }

    // async function login(email, password) {
    //     try {
    //         const response = await apiClient.post('/login', {
    //             email: email,
    //             password: password,
    //         });
    //         const { access_token: newToken } = response.data;
    //         token.value = newToken;
    //         isAuthenticated.value = true;
    //         localStorage.setItem('access_token', newToken);
    //         return response.data;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async function logout() {
    //     token.value = null;
    //     user.value = null;
    //     isAuthenticated.value = false;
    //     localStorage.removeItem('access_token');
    //     localStorage.removeItem('user');
    // }

    // async function recoverPassword(email) {
    //     const response = await apiClient.patch('/send-restore-code', {
    //         email: email,
    //     });
    //     return response.data;
    // }

    // async function fetchUser() {
    //     if (!token.value) return;
    //     try {
    //         const response = await apiClient.get('/profile/get');
    //         user.value = response.data;
    //         localStorage.setItem('user', JSON.stringify(response.data));
    //         isAuthenticated.value = true;
    //     } catch (error) {
    //         console.error('Fetch user error:', error);
    //         logout();
    //     }
    // }

    // async function getUserRole() {
    //     if (!token.value) return;
    //     try {
    //         const response = await apiClient.get('/is-role');
    //         isAdmin.value = response.data?.role === 'admin' ? true : false;
    //     } catch (error) {
    //         console.error('Fetch role error:', error);
    //         logout();
    //     }
    // }

    // async function checkUserSubscribe() {
    //     if (!token.value) return;
    //     try {
    //         const response = await apiClient.get('/push/is-subscribe');
    //         isSubscribed.value = response.data.push_subscription;
    //         if (response.data?.unsubscribed_at)
    //             unsubscribed_at.value = response.data?.unsubscribed_at;
    //     } catch (error) {
    //         console.error('Fetch subscribe error:', error);
    //     }
    // }

    // async function unSubscribeUser() {
    //     if (!token.value) return;
    //     try {
    //         const response = await apiClient.get('/push/unsubscribe');
    //         isSubscribed.value = response.data.push_subscription;
    //     } catch (error) {
    //         console.error('Fetch unSubscribe error:', error);
    //     }
    // }

    // async function getRaiting() {
    //     if (!token.value) return;
    //     try {
    //         const response = await apiClient.get('/rating/get');
    //         return response.data;
    //     } catch (error) {
    //         console.error('Get rating error:', error);
    //         throw error;
    //     }
    // }

    // async function markFirstGame() {
    //     if (!token.value) return;
    //     try {
    //         await apiClient.patch('/profile/update', {
    //             ever_played_game: true,
    //         });
    //         await fetchUser();
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // async function addRatingToGame(categoryId, gameName, count) {
    //     if (!token.value) return;
    //     try {
    //         await apiClient.patch('/rating/add-rating-to-game', {
    //             categoryId: categoryId,
    //             game: gameName,
    //             rating: count,
    //         });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // async function addRatingToCategory(categoryId) {
    //     if (!token.value) return;
    //     try {
    //         await apiClient.patch('/rating/add-rating-to-category', {
    //             categoryId: categoryId,
    //         });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // async function getUserNotifications() {
    //     if (!token.value) return;
    //     try {
    //         const response = await apiClient.get('/notification/get');
    //         notifications.value = response.data.notifications;
    //     } catch (error) {
    //         console.error('Fetch notifications error:', error);
    //     }
    // }

    // async function markReadNotifications(ids) {
    //     if (!token.value) return;
    //     try {
    //         await apiClient.patch('/notification/mark-as-read', {
    //             notification_ids: ids,
    //         });
    //         await getUserNotifications();
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // async function sendNotification(form) {
    //     if (!token.value) return;
    //     if (!isAdmin.value) return;
    //     try {
    //         await apiClient.post('/notification/send-notification', {
    //             title: form.title,
    //             message: form.message,
    //         });
    //     } catch (error) {
    //         console.error('Ошибка отправки уведомления', error);
    //     }
    // }

    return { createClass };
});
