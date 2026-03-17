<template>
    <RouterView v-if="!isRootProfile" />

    <div v-else class="profile-root">
        <div class="profile-page">
            <div class="profile-hero" aria-hidden="true">
                <img class="profile-hero__img" :src="profileHeroImg" alt="" />
            </div>

            <div class="page-content profile-page__content">
                <div class="scroll-container profile-scroll">
                    <ProfileUserCard :user="currentUser" />

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

                    <button class="profile-subscription" type="button" @click="goToSubscriptions">
                        Моя подписка
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

import dictionaryImg from '@/assets/Di_avatar/girl-with-cards.webp';
import profileHeroImg from '@/assets/Di_avatar/girl-img2.webp';
import achievementsIcon from '@/assets/icons/achievement.svg';
import ProfileUserCard from '@/shared/ui/ProfileUserCard.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const isRootProfile = computed(() => route.name === 'profile');

onMounted(() => {
    userStore.setHeaderTitle('Профиль');
});

const currentUser = computed(() => userStore.getCurrentUser());
const userName = computed(() => currentUser.value?.name || '—');
const userStars = computed(() => currentUser.value?.rating ?? 0);
const goToDictionary = () => router.push({ name: 'dictionary' });
const goToAchievements = () =>
    router.push({ name: 'profileAchievements', params: { id: currentUser.value.id } });
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
    top: -16px;
    left: 52%;
    transform: translateX(-50%);
    width: 200px;
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
