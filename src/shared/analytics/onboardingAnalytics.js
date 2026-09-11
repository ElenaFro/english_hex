import { sendOnboardingEvents } from '@/api/onboarding';
import { getGuestToken } from '@/shared/utils/guestToken';

const QUEUE_STORAGE_KEY = 'onboarding_events_queue';
const ONCE_STORAGE_KEY = 'onboarding_events_once';
const FLUSH_DELAY_MS = 3000;
const MAX_EVENTS_PER_REQUEST = 50;
const MAX_QUEUE_LENGTH = 200;

/** Шесть событий воронки, которые по контракту обязан слать фронт. */
export const FRONT_EVENTS = Object.freeze({
    STORY_STARTED: 'story_started',
    HELP_DI_CLICKED: 'help_di_clicked',
    FIRST_WORD_STARTED: 'first_word_started',
    REGISTRATION_STARTED: 'registration_started',
    FIRST_SESSION_COMPLETED: 'first_session_completed',
    PLANET_OPENED: 'planet_opened',
});

const ALLOWED_EVENTS = new Set(Object.values(FRONT_EVENTS));

/**
 * Эти семь бэк пишет сам, обрабатывая обычные запросы онбординга.
 * Отправка с фронта — 422 и задвоенная воронка, поэтому режем на клиенте.
 */
const BACKEND_OWNED_EVENTS = new Set([
    'start_page_open',
    'first_word_completed',
    '3_words_completed',
    'planet_first_sector_restored',
    'role_selected',
    'age_confirmed',
    'registration_completed',
]);

let queue = readQueue();
let sentOnce = readSentOnce();
let flushTimer = null;
let flushing = false;
let listenersAttached = false;

function readQueue() {
    try {
        const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
}

function readSentOnce() {
    try {
        const raw = localStorage.getItem(ONCE_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return new Set(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
        return new Set();
    }
}

function writeSentOnce() {
    try {
        if (!sentOnce.size) {
            localStorage.removeItem(ONCE_STORAGE_KEY);
            return;
        }
        localStorage.setItem(ONCE_STORAGE_KEY, JSON.stringify([...sentOnce]));
    } catch (e) {
        // ignore
    }
}

function writeQueue() {
    try {
        if (!queue.length) {
            localStorage.removeItem(QUEUE_STORAGE_KEY);
            return;
        }
        localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    } catch (e) {
        // ignore
    }
}

/**
 * uid генерируется один раз при создании события и хранится вместе с ним.
 * Если генерировать при отправке, ретрай после обрыва сети задвоит запись в воронке.
 */
function createEventUid() {
    try {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
    } catch (e) {
        // ignore
    }

    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/** Клиентское время в ISO 8601 со смещением — как в примере контракта (2026-09-03T10:15:04+05:00). */
function toIsoWithOffset(date) {
    const pad = (value) => String(Math.abs(value)).padStart(2, '0');
    const offsetMinutes = -date.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? '+' : '-';

    return (
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
        `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
        `${sign}${pad(Math.trunc(offsetMinutes / 60))}:${pad(offsetMinutes % 60)}`
    );
}

function scheduleFlush() {
    if (flushTimer) return;

    flushTimer = setTimeout(() => {
        flushTimer = null;
        flushOnboardingEvents();
    }, FLUSH_DELAY_MS);
}

/**
 * Положить событие в очередь. Наружу ничего не бросает: аналитика не должна ломать флоу.
 * @param {string} name — имя из FRONT_EVENTS
 * @param {object} [payload] — произвольные детали, например { card_id: 109 }
 */
export function trackEvent(name, payload) {
    if (BACKEND_OWNED_EVENTS.has(name)) {
        console.warn(`Событие "${name}" пишет бэк сам, с фронта его слать нельзя`);
        return;
    }

    if (!ALLOWED_EVENTS.has(name)) {
        console.warn(`Неизвестное событие онбординга: "${name}"`);
        return;
    }

    const event = {
        name,
        event_uid: createEventUid(),
        occurred_at: toIsoWithOffset(new Date()),
    };

    if (payload && typeof payload === 'object') {
        event.payload = payload;
    }

    queue.push(event);

    if (queue.length > MAX_QUEUE_LENGTH) {
        queue = queue.slice(-MAX_QUEUE_LENGTH);
    }

    writeQueue();

    if (queue.length >= MAX_EVENTS_PER_REQUEST) {
        flushOnboardingEvents();
        return;
    }

    scheduleFlush();
}

/**
 * Положить событие, которое должно случиться один раз за гостевую сессию.
 * Иначе перезагрузка экрана задваивает шаг воронки.
 * @param {string} name — имя из FRONT_EVENTS
 * @param {object} [payload]
 */
export function trackEventOnce(name, payload) {
    if (sentOnce.has(name)) return;

    sentOnce.add(name);
    writeSentOnce();
    trackEvent(name, payload);
}

/**
 * Отправить накопленное пачками не больше 50 событий.
 * Любая ошибка проглатывается — очередь остаётся и уйдёт со следующим флашем.
 */
export async function flushOnboardingEvents() {
    if (flushing || !queue.length) return;
    // До ответа /onboarding/start токена ещё нет — копим, но не шлём.
    if (!getGuestToken()) return;

    if (flushTimer) {
        clearTimeout(flushTimer);
        flushTimer = null;
    }

    flushing = true;

    try {
        while (queue.length) {
            const batch = queue.slice(0, MAX_EVENTS_PER_REQUEST);
            await sendOnboardingEvents(batch);

            const sent = new Set(batch.map((event) => event.event_uid));
            queue = queue.filter((event) => !sent.has(event.event_uid));
            writeQueue();
        }
    } catch (error) {
        // 409 — гостевой токен погашен регистрацией, досылать уже некуда.
        if (error?.response?.status === 409) {
            clearEventsQueue();
        }
    } finally {
        flushing = false;
    }
}

/** Сбросить очередь — после успешной регистрации досылать нечего и некуда. */
export function clearEventsQueue() {
    queue = [];
    sentOnce = new Set();
    writeSentOnce();

    if (flushTimer) {
        clearTimeout(flushTimer);
        flushTimer = null;
    }

    writeQueue();
}

/**
 * Досылает то, что осталось с прошлой сессии, и вешает досыл на уход со страницы.
 * Зовётся один раз при открытии стартовой страницы.
 */
export function initOnboardingAnalytics() {
    if (!listenersAttached && typeof document !== 'undefined') {
        listenersAttached = true;

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                flushOnboardingEvents();
            }
        });

        window.addEventListener('pagehide', () => {
            flushOnboardingEvents();
        });
    }

    flushOnboardingEvents();
}
