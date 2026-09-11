/**
 * Перевод ошибок API на русский.
 *
 * Бэк — Laravel, и валидация отвечает 422 с английскими текстами:
 * `{ "message": "The email has already been taken.",
 *    "errors": { "email": ["The email has already been taken."] } }`
 * Интерцептор (`src/api/axios.js`) отдаёт в catch именно это тело, поэтому раньше
 * такие сообщения показывались пользователю как есть.
 */

/** Как называть поле в родительном падеже: «Поле <ник> обязательно». */
const FIELD_LABELS = {
    name: 'ник',
    email: 'email',
    password: 'пароль',
    confirm_agreement: 'согласие с условиями',
};

/**
 * Правила разбираются по порядку, первое совпадение выигрывает.
 * Ключ — регулярка по английскому тексту, значение — функция (поле, совпадение) → текст.
 */
const RULES = [
    {
        test: /already been taken/i,
        ru: (field) => {
            if (field === 'email') return 'Пользователь с таким email уже зарегистрирован';
            if (field === 'name') return 'Такой ник уже занят, придумай другой';
            return 'Это значение уже занято';
        },
    },
    {
        // Так Laravel отвечает на вход с несуществующим email (`exists:users`).
        test: /selected .* is invalid/i,
        ru: (field) =>
            field === 'email' ? 'Пользователь с таким email не найден' : 'Недопустимое значение',
    },
    {
        test: /(these credentials do not match|invalid credentials|password is incorrect)/i,
        ru: () => 'Неверный email или пароль',
    },
    {
        test: /access closed, email not confirm/i,
        ru: () => 'Доступ запрещён, подтвердите свой email',
    },
    {
        test: /must be a valid email address/i,
        ru: () => 'Email указан неверно',
    },
    {
        test: /field is required/i,
        ru: (field) => `Заполни поле «${FIELD_LABELS[field] ?? field}»`,
    },
    {
        test: /must be at least (\d+) characters/i,
        ru: (field, match) => `Минимум ${match[1]} символов`,
    },
    {
        test: /must not be greater than (\d+) characters/i,
        ru: (field, match) => `Не больше ${match[1]} символов`,
    },
    {
        test: /must be accepted/i,
        ru: () => 'Нужно принять пользовательское соглашение',
    },
    {
        test: /confirmation does not match/i,
        ru: () => 'Пароли не совпадают',
    },
    {
        // Это кладёт наш же интерцептор, когда ответа от сервера нет вообще.
        test: /^server error$/i,
        ru: () => 'Сервер не отвечает, попробуй ещё раз',
    },
];

/**
 * Перевести одно английское сообщение бэка.
 * @param {string} message
 * @param {string} [field] — поле, к которому относится сообщение (влияет на формулировку)
 * @returns {string|null} русский текст либо null, если правило не нашлось
 */
export function translateApiMessage(message, field) {
    if (!message || typeof message !== 'string') return null;

    for (const rule of RULES) {
        const match = message.match(rule.test);
        if (match) return rule.ru(field, match);
    }

    return null;
}

/**
 * Ошибки по полям из ответа 422, уже по-русски.
 * Непереведённое не пропускаем наружу: показываем общий русский текст,
 * иначе человек снова увидит английскую строку.
 * @param {{errors?: Object}} error — тело ошибки из catch
 * @returns {Object<string, string>} { email: 'Пользователь с таким email...', ... }
 */
export function getFieldErrors(error) {
    const errors = error?.errors;
    if (!errors || typeof errors !== 'object') return {};

    return Object.entries(errors).reduce((result, [field, messages]) => {
        const first = Array.isArray(messages) ? messages[0] : messages;
        const translated = translateApiMessage(first, field);

        result[field] = translated ?? `Проверь поле «${FIELD_LABELS[field] ?? field}»`;
        return result;
    }, {});
}

/**
 * Текст для попапа: перевод общего сообщения, а если его нет — первой ошибки по полю.
 * @param {{message?: string, errors?: Object}} error
 * @param {string} fallback — что показать, если перевести не удалось
 * @returns {string}
 */
export function getApiErrorMessage(error, fallback) {
    // «(and 3 more errors)» Laravel приклеивает к message — по полям текст точнее.
    const fieldErrors = Object.values(getFieldErrors(error));
    if (fieldErrors.length) return fieldErrors[0];

    return translateApiMessage(error?.message) ?? fallback;
}
