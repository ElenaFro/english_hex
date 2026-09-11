const ABSOLUTE_URL_PATTERN = /^(https?:|blob:|data:)/i;

/**
 * Собрать абсолютный URL к файлу в сторадже.
 * Онбординг отдаёт пути относительно корня стораджа — `categories/2/video/Sun.mp4`.
 * Абсолютные ссылки (в том числе blob:/data:) и пути от корня домена возвращаются как есть,
 * поэтому хелпер безопасно звать и для уже готовых story.intro_video / story.outro_video.
 * @param {string} path — путь из ответа API
 * @returns {string} абсолютный URL либо пустая строка, если пути нет
 */
export function buildStorageUrl(path) {
    if (!path) return '';

    const value = String(path).trim();
    if (!value) return '';
    if (ABSOLUTE_URL_PATTERN.test(value) || value.startsWith('/')) return value;

    return `${import.meta.env.VITE_STORAGE_GALAXY_URI}/${value}`;
}
