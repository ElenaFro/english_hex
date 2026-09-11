import apiClient from './axios';

/**
 * Все ручки онбординга работают без авторизации, по гостевому токену.
 * _guest  — подставить заголовок X-Guest-Token (см. src/api/axios.js).
 * _silent — не разлогинивать и не уводить на /error/* при ошибке; отклоняется
 *           исходной ошибкой axios, поэтому у вызывающего кода есть error.response.status.
 */
const guestRequest = () => ({ _guest: true, _silent: true });

/**
 * Открыли стартовую страницу. Бэк заводит гостевую сессию и сам пишет событие
 * start_page_open, поэтому звать нужно именно на открытии, а не по кнопке «Начать».
 * @returns {Promise} { guest_token, next_step }
 */
export const startOnboarding = () => apiClient.post('/onboarding/start', null, guestRequest());

/**
 * Весь контент онбординга одним запросом: два видео истории, три слова и список ролей.
 * @returns {Promise} { story, words, roles, next_step }
 */
export const getOnboardingContent = () => apiClient.get('/onboarding/content', guestRequest());

/**
 * Отметить слово выученным. Повторный вызов по тому же слову счётчик не задваивает.
 * @param {number|string} cardId — id из content.words
 * @returns {Promise} { words_completed, sector_completed, next_step }
 */
export const completeOnboardingWord = (cardId) =>
    apiClient.post(`/onboarding/words/${cardId}/complete`, null, guestRequest());

/**
 * Пропустить историю и перейти к выбору роли.
 * @returns {Promise} { next_step }
 */
export const skipOnboarding = () => apiClient.post('/onboarding/skip', null, guestRequest());

/**
 * Сохранить выбранную роль. Значение только из content.roles[].value, иначе 422.
 * @param {string} learningGoal — value выбранной роли
 * @returns {Promise} { learning_goal, next_step }
 */
export const selectOnboardingRole = (learningGoal) =>
    apiClient.post('/onboarding/role', { learning_goal: learningGoal }, guestRequest());

/**
 * Ответ про возраст. needs_adult: true — по макету между этим экраном и регистрацией
 * показываем «Ди нужен взрослый»; next_step в обоих случаях registration.
 * @param {boolean} is14Plus
 * @returns {Promise} { is_14_plus, needs_adult, next_step }
 */
export const checkOnboardingAge = (is14Plus) =>
    apiClient.post('/onboarding/age-check', { is_14_plus: is14Plus }, guestRequest());

/**
 * Состояние гостевой сессии — чтобы после перезагрузки вернуть человека на его шаг.
 * @returns {Promise} { guest_token, next_step, words_total, words_completed, sector_completed,
 *                      skipped, learning_goal, is_14_plus, needs_adult }
 */
export const getOnboardingState = () => apiClient.get('/onboarding/state', guestRequest());

/**
 * Отправить пачку событий воронки. Максимум 50 за раз.
 * @param {Array<{name: string, event_uid?: string, occurred_at?: string, payload?: object}>} events
 * @returns {Promise} { accepted }
 */
export const sendOnboardingEvents = (events) =>
    apiClient.post('/onboarding/events', { events }, guestRequest());
