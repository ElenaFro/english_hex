const GUEST_TOKEN_KEY = 'guest_token';

/**
 * Гостевой токен онбординга. Живёт от POST /onboarding/start до успешной регистрации,
 * после чего бэк его гасит и все ручки онбординга по нему отвечают 409.
 */
export function getGuestToken() {
    try {
        return localStorage.getItem(GUEST_TOKEN_KEY);
    } catch (e) {
        return null;
    }
}

export function setGuestToken(token) {
    if (!token) return;

    try {
        localStorage.setItem(GUEST_TOKEN_KEY, String(token));
    } catch (e) {
        // ignore
    }
}

export function clearGuestToken() {
    try {
        localStorage.removeItem(GUEST_TOKEN_KEY);
    } catch (e) {
        // ignore
    }
}
