<template>
    <div class="page-content">
        <div class="scroll-container achievements-scroll">
            <ProfileUserCard
                :name="displayName"
                :rating="displayRating"
                :gender="displayGender"
                :profile-id="profileId"
                avatar-size="lg"
            />

            <section class="achievement-list">
                <article
                    v-for="item in achievementsList"
                    :key="item.id"
                    class="achievement-card"
                    :class="`achievement-card--${item.tone}`"
                >
                    <div class="achievement-card__content">
                        <h3 class="achievement-card__title">{{ item.title }}</h3>
                        <p class="achievement-card__date">{{ item.date }}</p>
                    </div>
                    <img
                        class="achievement-card__image"
                        :src="item.image"
                        alt=""
                        aria-hidden="true"
                    />
                </article>
            </section>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';

import ProfileUserCard from '@/pages/ProfilePage/components/ProfileUserCard.vue';

import GirlPlanet from '@/assets/Di_avatar/girl_with_planet.svg';
import GirlThinking from '@/assets/Di_avatar/girl_thinking.webp';
import GirlKeychain from '@/assets/Di_avatar/girl_with_keychain.webp';
import GirlFlag from '@/assets/Di_avatar/girl_with_flag.svg';

const props = defineProps({
    userId: { type: [String, Number], default: null },
    userName: { type: String, default: '' },
    userRating: { type: Number, default: null },
    userGender: { type: String, default: '' },
    achievements: { type: Array, default: () => [] },
});

const route = useRoute();
const userStore = useUserStore();
const currentUser = computed(() => userStore.getCurrentUser());

const profileId = computed(
    () => props.userId ?? route.params.id ?? route.query.id ?? currentUser.value?.id ?? null
);

const displayName = computed(() => props.userName || currentUser.value?.name || 'Пользователь');
const displayRating = computed(() => props.userRating ?? currentUser.value?.rating ?? 0);
const displayGender = computed(() => props.userGender || currentUser.value?.gender || '');

const fallbackAchievements = [
    {
        id: 1,
        title: 'Успешно прошел колоду “Животные”',
        date: '14.11.2025',
        tone: 'peach',
        image: GirlKeychain,
    },
    {
        id: 2,
        title: 'Изучил 60 новых слов за день',
        date: '14.11.2025',
        tone: 'pink',
        image: GirlThinking,
    },
    {
        id: 3,
        title: 'Достиг нового уровня планеты',
        date: '13.11.2025',
        tone: 'blue',
        image: GirlPlanet,
    },
    {
        id: 4,
        title: 'Успешно прошел колоду “Одежда”',
        date: '09.11.2025',
        tone: 'sky',
        image: GirlFlag,
    },
];

const achievementsList = computed(() =>
    props.achievements?.length ? props.achievements : fallbackAchievements
);
</script>

<style scoped lang="scss">
.achievements-scroll {
    padding-top: 8px;
    gap: 16px;
}

.achievement-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.achievement-card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 20px;
    padding: 12px;
    min-height: 118px;
    overflow: hidden;

    &__content {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-right: 126px;
    }

    &__title {
        margin: 0;
        font-size: 18px;
        font-weight: 800;
        line-height: 1.3;
        color: #311d5d;
    }

    &__date {
        font-size: 14px;
        font-weight: 500;
        color: #262060;
    }

    &__image {
        position: absolute;
        right: 8px;
        bottom: -46px;
        width: 106px;
        height: auto;
        pointer-events: none;
    }

    &--peach {
        background: #f6b390;
    }

    &--pink {
        background: #ff98a5;
    }

    &--blue {
        background: #79bbfb;
    }

    &--sky {
        background: #9bd5ff;
    }
}
</style>
