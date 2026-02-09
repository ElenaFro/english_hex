<template>
    <div class="page-content users-menu">
        <div class="scroll-container users-menu__scroll">
            <p class="users-menu__lead">Следи за успехами!</p>

            <button class="users-card users-card--rating" type="button" @click="goToRating">
                <img :src="ratingAvatar" class="girl-with-achiv" alt="girl" />

                <div class="users-card__info">
                    <p class="users-card__title">Мой рейтинг</p>
                    <p class="users-card__text">Сюда надо текст посмотреть место</p>
                </div>
            </button>

            <p class="users-menu__section-title">Мои друзья</p>

            <button class="users-card users-card--friends" type="button" @click="goToFriends">
                <img class="users-card__friends-img" :src="friendsAvatar" alt="" />

                <p class="users-card__friends-text">{{ friendsText }}</p>
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

import ratingAvatar from '@/assets/Di_avatar/girl_with_achive.svg';
import friendsAvatar from '@/assets/Di_avatar/girl-img2.webp';

const router = useRouter();
const userStore = useUserStore();

const goToRating = () => router.push({ name: 'rating' });
const goToFriends = () => {
    const pageName = userStore.isTeacher ? 'classes' : 'friends';
    router.push({ name: pageName });
};
const friendsText = computed(() =>
    userStore.isTeacher
        ? 'Посмотри что нового у\u00A0твоих учеников'
        : 'Посмотри что нового у\u00A0твоих друзей'
);

onMounted(() => {
    userStore.setHeaderTitle('Пользователи');
});

onBeforeUnmount(() => {
    userStore.setHeaderTitle(null);
});
</script>

<style scoped lang="scss">
.users-menu__lead {
    margin-left: 10px;
    font-size: 26px;
    font-weight: 800;
    line-height: 1.2;
    color: #311d5d;
    font-family: 'Mulish', 'extra-bold';
    margin-bottom: 16px;
}

.girl-with-achiv {
    margin-top: 13px;
}

.users-menu__section-title {
    margin: 26px 10px 10px;
    font-size: 22px;
    font-weight: 800;
    color: #311d5d;
}

.users-card {
    width: 100%;
    border: none;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 14px 16px;
    text-align: left;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 136px;
    min-height: 136px;
}

.users-card--rating {
    background: #f6b390;
    gap: 12px;
}

.users-card__info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-width: 220px;
}

.users-card__title {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    color: #311d5d;
}

.users-card__text {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
    line-height: 1.2;
}

.users-card__avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.users-card--friends {
    flex-direction: column;
    min-height: 355px;
    padding: 18px 18px 20px;
    background: #262060;
}

.users-card__friends-text {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    line-height: 1.3;
    color: #ffffff;
    z-index: 1;
    text-align: flex-start;
}

.users-card__friends-img {
    margin: 33px auto 30px;
    width: 200px;
    height: auto;
    pointer-events: none;
}
</style>
