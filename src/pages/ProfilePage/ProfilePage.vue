<template>
    <RouterView v-if="!isRootProfile" />

    <div v-else class="profile-root">
        <div class="profile-page">
            <div class="profile-hero" aria-hidden="true">
                <img class="profile-hero__img" :src="profileHeroImg" alt="" />
            </div>

            <div class="page-content profile-page__content">
                <div class="scroll-container profile-scroll">
                    <section class="profile-card">
                        <div class="profile-card__avatar">
                            <img :src="avatarIcon" alt="" class="profile-card__avatar-img" />
                        </div>

                        <div class="profile-card__info">
                            <p class="profile-card__name">{{ userName }}</p>
                            <div class="profile-card__stars">
                                <span class="profile-card__stars-value">{{ userStars }}</span>
                                <img
                                    class="profile-card__stars-icon"
                                    :src="yellowStarIcon"
                                    alt=""
                                />
                            </div>
                        </div>
                    </section>

                    <section class="profile-tiles">
                        <button
                            class="profile-tile profile-tile--dictionary"
                            type="button"
                            @click="goToDictionary"
                        >
                            <span class="profile-tile__title">Мой словарь</span>
                            <img
                                class="profile-tile__img profile-tile__img--dictionary"
                                :src="dictionaryImg"
                                alt=""
                                aria-hidden="true"
                            />
                        </button>

                        <button
                            class="profile-tile profile-tile--achievements"
                            type="button"
                            @click="goToAchievements"
                        >
                            <span class="profile-tile__title">Достижения</span>
                            <div class="profile-tile__icon" aria-hidden="true">
                                <img :src="achievementsIcon" alt="achievementsIcon" />
                            </div>
                        </button>

                        <button
                            class="profile-tile profile-tile--settings"
                            type="button"
                            @click="goToProfileEdit"
                        >
                            <span class="profile-tile__title">Настройки профиля</span>
                        </button>
                    </section>

                    <button
                        class="profile-subscription"
                        type="button"
                        @click="goToSubscriptions"
                    >
                        Моя подписка
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

import BoyIcon from '@/assets/img/DefaultUserAvatar/male.svg';
import GirlIcon from '@/assets/img/DefaultUserAvatar/female.svg';
import dictionaryImg from '@/assets/Di_avatar/girl-with-cart.webp';
import profileHeroImg from '@/assets/Di_avatar/girl-img2.webp';
import yellowStarIcon from '@/assets/icons/yelow_star.svg';
import achievementsIcon from '@/assets/icons/achievement.svg';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const isRootProfile = computed(() => route.name === 'profile');

const currentUser = computed(() => userStore.getCurrentUser());
const userName = computed(() => currentUser.value?.name || '—');
const userStars = computed(() => currentUser.value?.rating ?? 0);
const avatarIcon = computed(() => (currentUser.value?.gender === 'male' ? BoyIcon : GirlIcon));

const goToDictionary = () => router.push({ name: 'dictionary' });
const goToAchievements = () => router.push({ name: 'profileAchievements' });
const goToProfileEdit = () => router.push({ name: 'profileEdit' });
const goToSubscriptions = () => router.push({ name: 'profileSubscriptions' });
</script>

<style scoped lang="scss">
.profile-root {
    width: 100%;
    display: flex;
    justify-content: center;
    height: 100dvh;
}

.profile-page {
    position: relative;
    overflow: visible;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.profile-page__content {
    margin-top: 146px;
}

.profile-hero {
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 210px;
    pointer-events: none;
    z-index: 1;

    &__img {
        width: 100%;
        height: auto;
        display: block;
    }
}

.profile-scroll {
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
    min-height: 0;
    padding-top: 12px;
}

.profile-card {
    display: grid;
    grid-template-columns: 105px 1fr;
    align-items: center;
    gap: 20px;
    border-radius: 20px;
    z-index: 2;

    &__avatar {
        width: 105px;
        height: 105px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &__avatar-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    &__name {
        margin: 0;
        font-size: 26px;
        font-weight: 800;
        line-height: 1.1;
        color: #311d5d;
    }

    &__stars {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        margin-top: 6px;
    }

    &__stars-value {
        font-size: 20px;
        font-weight: 700;
        line-height: 1;
        color: #262060;
    }

    &__stars-icon {
        width: 25px;
        height: 25px;
    }
}

.profile-tiles {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: 97px 76px;
    column-gap: 12px;
    row-gap: 8px;
}

.profile-tile {
    border: none;
    border-radius: 18px;
    padding: 14px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    max-height: 182px;
    max-width: 171px;
    text-align: center;

    &__title {
        font-size: 20px;
        font-weight: 800;
        line-height: 1.1;
        color: #311d5d;
        max-width: 9.5em;
    }

    &__icon {
        align-self: center;
    }
}

.profile-tile--dictionary {
    grid-row: 1 / span 2;
    background: #f6b390;
}

.profile-tile--achievements {
    background: #79bbfb;
    max-height: 97px;
}

.profile-tile--settings {
    background: #ff98a5;
    max-height: 76px;
}

.profile-tile__img--dictionary {
    position: absolute;
    right: 2px;
    bottom: -14px;
    width: 154px;
    height: auto;
    pointer-events: none;
}

.profile-subscription {
    width: 100%;
    border: none;
    border-radius: 15px;
    padding: 16px;
    background: #262060;
    color: #ffffff;
    font-size: 20px;
    font-weight: 600;
    line-height: 1;
}
</style>
