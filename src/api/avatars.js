import apiClient from './axios';

/**
 * Получить все аватарки пользователя.
 * Ответ содержит два массива: free (базовые) и premium.
 * Каждый элемент: { image_key, name, type, unlocked, is_default }
 */
export const getAvatars = () => apiClient.get('/avatars/get');

/**
 * Установить аватарку по image_key.
 * @param {string} imageKey — ключ из avatarMap (например, 'cat', 'anime_1')
 */
export const setAvatar = (imageKey) =>
    apiClient.patch('/avatars/set-active', { image_key: imageKey });
