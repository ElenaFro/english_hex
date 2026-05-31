// Хранилище звёзд за пройденные категории обучения, которые ещё не начислены на сервере.
// Раньше в localStorage лежало плоское число earnedStars без привязки к категории,
// из-за чего на странице планеты звёзды зачислялись только за одну (последнюю) категорию,
// а накопленные за остальные категории сгорали. Теперь храним карту { categoryId: stars },
// чтобы на планете начислить рейтинг за КАЖДУЮ категорию.

const STORAGE_KEY = 'pendingCategoryStars';
// Плоский ключ оставляем синхронизированным для Header (MainLayout) и GameMainPage.
const LEGACY_KEY = 'earnedStars';
const STARS_PER_CATEGORY = 20;

export function readPendingCategoryStars() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') return parsed;
        }
    } catch {
        /* повреждённый JSON — игнорируем */
    }
    return {};
}

export function sumPendingStars(pending) {
    return Object.values(pending).reduce((sum, value) => sum + Number(value || 0), 0);
}

export function addPendingCategoryStars(categoryId, stars = STARS_PER_CATEGORY) {
    if (categoryId == null) return;
    const pending = readPendingCategoryStars();
    pending[categoryId] = stars;
    persistPendingCategoryStars(pending);
}

export function persistPendingCategoryStars(pending) {
    if (!pending || Object.keys(pending).length === 0) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LEGACY_KEY);
        return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
    localStorage.setItem(LEGACY_KEY, String(sumPendingStars(pending)));
}

export { STARS_PER_CATEGORY };
