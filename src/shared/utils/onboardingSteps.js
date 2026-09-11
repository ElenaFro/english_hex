const STORY_STEP_KEY = 'onboarding_story_step';
const ONBOARDING_DONE_KEY = 'onboarding_done';

/**
 * Отметка «этот человек онбординг уже прошёл». Нужна потому, что гостевой токен
 * живёт только до регистрации: без метки зарегистрировавшийся (а равно и вышедший
 * из аккаунта) при следующем заходе на /auth получал новую гостевую сессию,
 * заново проходил онбординг и писал в воронку второй start_page_open.
 * Метка живёт в этом браузере — в новом онбординг покажется снова.
 */
export function isOnboardingDone() {
    try {
        return localStorage.getItem(ONBOARDING_DONE_KEY) === '1';
    } catch (e) {
        return false;
    }
}

export function setOnboardingDone() {
    try {
        localStorage.setItem(ONBOARDING_DONE_KEY, '1');
    } catch (e) {
        // ignore
    }
}

/** Шаги, которыми управляет бэк через поле next_step. */
export const NEXT_STEP = Object.freeze({
    WORDS: 'words',
    ROLE: 'role',
    AGE_CHECK: 'age_check',
    REGISTRATION: 'registration',
    DONE: 'done',
});

/**
 * Экраны истории внутри шага words. Бэк про них не знает — это клиентская
 * последовательность, поэтому её место запоминаем локально.
 */
const STORY_STEPS = [
    'Salution',
    'OnboardingIntroVideo',
    'OnboardingHero',
    'OnboardingSectorDanger',
    'OnboardingCardsLesson',
];

export function getStoryStep() {
    try {
        const value = localStorage.getItem(STORY_STEP_KEY);
        return STORY_STEPS.includes(value) ? value : null;
    } catch (e) {
        return null;
    }
}

export function setStoryStep(componentName) {
    if (!STORY_STEPS.includes(componentName)) return;

    try {
        localStorage.setItem(STORY_STEP_KEY, componentName);
    } catch (e) {
        // ignore
    }
}

export function clearStoryStep() {
    try {
        localStorage.removeItem(STORY_STEP_KEY);
    } catch (e) {
        // ignore
    }
}

/**
 * Экран, соответствующий next_step из ответа бэка.
 * Экран «Ди нужен взрослый» серверу неизвестен: next_step там registration в обоих случаях,
 * разводит только needs_adult.
 * @param {string} nextStep
 * @param {{ needsAdult?: boolean }} [options]
 * @returns {string} имя компонента из componentsMap в AuthPage
 */
export function componentForStep(nextStep, { needsAdult = false } = {}) {
    switch (nextStep) {
        case NEXT_STEP.ROLE:
            return 'RoleChoice';
        case NEXT_STEP.AGE_CHECK:
            return 'AgeVerif';
        case NEXT_STEP.REGISTRATION:
            return needsAdult ? 'AdultHelper' : 'RegistForm';
        case NEXT_STEP.DONE:
            return 'LoginForm';
        case NEXT_STEP.WORDS:
        default:
            return 'Salution';
    }
}

/**
 * Экран, с которого открывается страница: шаг с бэка, а внутри words — запомненный
 * локально экран истории.
 * @param {{ nextStep?: string, wordsCompleted?: number, needsAdult?: boolean }} state
 * @returns {string} имя компонента
 */
export function resolveStartComponent({ nextStep, wordsCompleted = 0, needsAdult = false } = {}) {
    if (!nextStep || nextStep === NEXT_STEP.WORDS) {
        if (wordsCompleted > 0) return 'OnboardingCardsLesson';
        return getStoryStep() ?? 'Salution';
    }

    return componentForStep(nextStep, { needsAdult });
}
