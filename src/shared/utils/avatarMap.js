import maleDefault from '@/assets/avatars/male_default.svg';
import femaleDefault from '@/assets/avatars/female_default.svg';
import cat from '@/assets/avatars/cat.svg';
import parrot from '@/assets/avatars/parrot.svg';
import fish from '@/assets/avatars/fish.svg';
import dragon from '@/assets/avatars/dragon.svg';
import maleAstronaut from '@/assets/avatars/male_astronaut.svg';
import femaleAstronaut from '@/assets/avatars/female_astronaut.svg';
import boyAstronaut from '@/assets/avatars/boy_astronaut.svg';
import girlAstronaut from '@/assets/avatars/girl_astronaut.svg';
import trees from '@/assets/avatars/trees.svg';
import mountains from '@/assets/avatars/mountains.svg';
import rivers from '@/assets/avatars/rivers.svg';
import stars from '@/assets/avatars/stars.svg';
import clouds from '@/assets/avatars/clouds.svg';
import anime1 from '@/assets/avatars/anime_1.svg';
import anime2 from '@/assets/avatars/anime_2.svg';
import anime3 from '@/assets/avatars/anime_3.svg';
import anime4 from '@/assets/avatars/anime_4.svg';
import locked from '@/assets/avatars/locked_avatar.svg';

/**
 * Словарь image_key → импортированный asset.
 * Используется везде, где нужно отобразить аватарку по ключу из БД.
 */
export const avatarMap = {
    male_default: maleDefault,
    female_default: femaleDefault,
    cat,
    parrot,
    fish,
    dragon,
    male_astronaut: maleAstronaut,
    female_astronaut: femaleAstronaut,
    boy_astronaut: boyAstronaut,
    girl_astronaut: girlAstronaut,
    trees,
    mountains,
    rivers,
    stars,
    clouds,
    anime_1: anime1,
    anime_2: anime2,
    anime_3: anime3,
    anime_4: anime4,
};

/** Fallback для заблокированных / неизвестных ключей */
export const lockedAvatarSrc = locked;

/**
 * Возвращает src аватарки по image_key из БД.
 * Если ключ не найден — возвращает иконку замка.
 * @param {string|null|undefined} imageKey
 * @returns {string}
 */
export const getAvatarSrc = (imageKey) => avatarMap[imageKey] ?? locked;

/**
 * Возвращает src аватарки для объекта пользователя.
 * Приоритет: user.avatar.image_key → фоллбэк по полу → male_default.
 * @param {{ avatar?: { image_key?: string }, gender?: string }|null} user
 * @returns {string}
 */
export const getUserAvatarSrc = (user) => {
    const key = user?.avatar?.avatar_key;
    if (key && avatarMap[key]) return avatarMap[key];
    return user?.gender === 'female' ? avatarMap.female_default : avatarMap.male_default;
};
