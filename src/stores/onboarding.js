import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import {
    checkOnboardingAge,
    completeOnboardingWord,
    getOnboardingContent,
    getOnboardingState,
    selectOnboardingRole,
    skipOnboarding,
    startOnboarding,
} from '@/api/onboarding';
import { clearGuestToken, getGuestToken, setGuestToken } from '@/shared/utils/guestToken';
import { clearStoryStep, NEXT_STEP, setOnboardingDone } from '@/shared/utils/onboardingSteps';
import { clearEventsQueue } from '@/shared/analytics/onboardingAnalytics';
import { buildStorageUrl } from '@/shared/utils/mediaUrl';

/**
 * Роль «Учить других с помощью DICARDZ». Такой человек регистрируется отдельной
 * учительской ручкой (`POST /registration-teacher`), как было до онбординга, —
 * иначе теряется учительский аккаунт с классами.
 */
export const TEACHER_LEARNING_GOAL = 'teach_others';

export const useOnboardingStore = defineStore('onboarding', () => {
    const guestToken = ref(getGuestToken());
    const nextStep = ref(null);
    const story = ref({ intro_video: '', outro_video: '' });
    const words = ref([]);
    const roles = ref([]);
    const wordsTotal = ref(0);
    const wordsCompleted = ref(0);
    const sectorCompleted = ref(false);
    const skipped = ref(false);
    const learningGoal = ref(null);
    const is14Plus = ref(null);
    const needsAdult = ref(false);
    const contentLoaded = ref(false);
    let contentRequest = null;

    const introVideoUrl = computed(() => buildStorageUrl(story.value?.intro_video));
    const outroVideoUrl = computed(() => buildStorageUrl(story.value?.outro_video));
    // Роль переживает перезагрузку: её возвращает и ответ /role, и GET /state.
    const isTeacherGoal = computed(() => learningGoal.value === TEACHER_LEARNING_GOAL);

    function applyState(data) {
        if (!data) return null;

        if (data.next_step) nextStep.value = data.next_step;
        if (typeof data.words_total === 'number') wordsTotal.value = data.words_total;
        if (typeof data.words_completed === 'number') wordsCompleted.value = data.words_completed;
        if (typeof data.sector_completed === 'boolean')
            sectorCompleted.value = data.sector_completed;
        if (typeof data.skipped === 'boolean') skipped.value = data.skipped;
        if (typeof data.needs_adult === 'boolean') needsAdult.value = data.needs_adult;
        if (data.learning_goal !== undefined) learningGoal.value = data.learning_goal;
        if (data.is_14_plus !== undefined) is14Plus.value = data.is_14_plus;

        return data;
    }

    /** 409 — гостевой токен уже погашен регистрацией, продолжать по нему нечего. */
    function isTokenSpent(error) {
        return error?.response?.status === 409;
    }

    function handleError(message, error) {
        if (isTokenSpent(error)) {
            finishOnboarding();
            return null;
        }

        console.error(message, error);
        return null;
    }

    async function start() {
        try {
            const { data } = await startOnboarding();
            if (data?.guest_token) {
                guestToken.value = data.guest_token;
                setGuestToken(data.guest_token);
            }
            return applyState(data);
        } catch (error) {
            console.error('Ошибка старта онбординга:', error);
            return null;
        }
    }

    async function resume() {
        try {
            const { data } = await getOnboardingState();
            if (data?.guest_token) guestToken.value = data.guest_token;
            return applyState(data);
        } catch (error) {
            // Токен погашен или неизвестен бэку — заводим гостевую сессию заново.
            console.error('Ошибка восстановления состояния онбординга:', error);
            clearGuest();
            return start();
        }
    }

    /** Стартовая точка страницы авторизации: продолжить сессию или завести новую. */
    async function bootstrap() {
        return getGuestToken() ? resume() : start();
    }

    async function loadContent() {
        if (contentLoaded.value) return true;
        // Контент тянут несколько экранов сразу — держим один запрос на всех.
        if (contentRequest) return contentRequest;

        contentRequest = requestContent().finally(() => {
            contentRequest = null;
        });

        return contentRequest;
    }

    async function requestContent() {
        try {
            const { data } = await getOnboardingContent();
            story.value = data?.story ?? { intro_video: '', outro_video: '' };
            words.value = Array.isArray(data?.words) ? data.words : [];
            roles.value = Array.isArray(data?.roles) ? data.roles : [];
            if (!wordsTotal.value) wordsTotal.value = words.value.length;
            applyState(data);
            contentLoaded.value = true;
            return true;
        } catch (error) {
            handleError('Ошибка получения контента онбординга:', error);
            return false;
        }
    }

    async function completeWord(cardId) {
        try {
            const { data } = await completeOnboardingWord(cardId);
            return applyState(data);
        } catch (error) {
            return handleError('Ошибка отметки слова онбординга:', error);
        }
    }

    async function skip() {
        try {
            const { data } = await skipOnboarding();
            skipped.value = true;
            return applyState(data);
        } catch (error) {
            return handleError('Ошибка пропуска онбординга:', error);
        }
    }

    async function selectRole(value) {
        try {
            const { data } = await selectOnboardingRole(value);
            learningGoal.value = data?.learning_goal ?? value;
            return applyState(data);
        } catch (error) {
            return handleError('Ошибка сохранения роли онбординга:', error);
        }
    }

    async function checkAge(value) {
        try {
            const { data } = await checkOnboardingAge(value);
            is14Plus.value = data?.is_14_plus ?? value;
            needsAdult.value = Boolean(data?.needs_adult);
            return applyState(data);
        } catch (error) {
            return handleError('Ошибка проверки возраста в онбординге:', error);
        }
    }

    /**
     * Сбросить гостевую сессию: токен, под-шаг истории и очередь событий.
     * Сама по себе метку «онбординг пройден» не ставит — сюда приходят и по ошибке
     * восстановления состояния, где ставить её было бы неверно.
     */
    function clearGuest() {
        guestToken.value = null;
        nextStep.value = NEXT_STEP.DONE;
        contentLoaded.value = false;
        clearGuestToken();
        clearStoryStep();
        clearEventsQueue();
    }

    /**
     * Онбординг пройден: регистрация прошла (или бэк ответил 409 — токен уже погашен).
     * Метка нужна, чтобы возврат на /auth вёл на вход, а не на новый круг онбординга
     * с лишним start_page_open в воронке.
     */
    function finishOnboarding() {
        setOnboardingDone();
        clearGuest();
    }

    return {
        guestToken,
        nextStep,
        story,
        words,
        roles,
        wordsTotal,
        wordsCompleted,
        sectorCompleted,
        skipped,
        learningGoal,
        is14Plus,
        needsAdult,
        contentLoaded,
        introVideoUrl,
        outroVideoUrl,
        isTeacherGoal,
        bootstrap,
        start,
        resume,
        loadContent,
        completeWord,
        skip,
        selectRole,
        checkAge,
        clearGuest,
        finishOnboarding,
    };
});
