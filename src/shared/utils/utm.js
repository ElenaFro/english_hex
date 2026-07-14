const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const UTM_STORAGE_KEY = 'utm_params';

export function captureUtmParams(query) {
    if (!query) return;

    const utm = {};
    let hasAny = false;

    for (const key of UTM_KEYS) {
        const raw = query[key];
        const value = Array.isArray(raw) ? raw[0] : raw;

        if (value) {
            utm[key] = String(value).slice(0, 255);
            hasAny = true;
        }
    }

    if (hasAny) {
        try {
            localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
        } catch (e) {
            // ignore
        }
    }
}

export function getUtmParams() {
    try {
        const raw = localStorage.getItem(UTM_STORAGE_KEY);

        if (!raw) return null;

        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (e) {
        return null;
    }
}

export function clearUtmParams() {
    try {
        localStorage.removeItem(UTM_STORAGE_KEY);
    } catch (e) {
        // ignore
    }
}