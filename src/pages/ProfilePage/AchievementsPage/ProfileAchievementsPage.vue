<template>
    <div class="page-content">
        <loader v-if="loading" />
        <section v-else class="achievements-content">
            <div class="achievements-scroll">
                <ProfileUserCard
                    :user="userProfile"
                    :is-can-add-to-friends="isCanAddToFriends"
                    avatar-size="lg"
                    @update:user="refetchUser"
                />

                <section class="achievement-list">
                    <template v-if="achievementsList.length > 0">
                        <article
                            v-for="item in achievementsList"
                            :key="item.id"
                            class="achievement-card"
                            :class="`achievement-card--${item.color || item.tone}`"
                        >
                            <img
                                v-if="item.type === 'premium'"
                                :src="PremiumBg"
                                class="achievement-card__bg"
                                alt=""
                                aria-hidden="true"
                            />
                            <div class="achievement-card__content">
                                <h3 class="achievement-card__title">{{ item.label }}</h3>
                                <p class="achievement-card__date">{{ item.achieved_at }}</p>
                            </div>
                            <img
                                class="achievement-card__image"
                                :class="{ 'achievement-card__image--keychain': item.image === GirlKeychain }"
                                :src="item.image"
                                alt=""
                                aria-hidden="true"
                            />
                        </article>
                    </template>

                    <div v-else class="empty-state">
                        <img
                            src="@/assets/Di_avatar/girl-img2.webp"
                            alt=""
                            aria-hidden="true"
                            class="empty-state__img"
                        />
                        <p class="empty-state__text">{{ emptyTitle }}</p>
                    </div>
                </section>
            </div>
        </section>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';

import ProfileUserCard from '@/shared/ui/ProfileUserCard.vue';
import Loader from '@/shared/components/Loader.vue';

import GirlPlanet from '@/assets/Di_avatar/girl_with_planet.svg';
import GirlKeychain from '@/assets/Di_avatar/girl_with_keychain.webp';
import GirlWithCards from '@/assets/Di_avatar/girl-with-cards.webp';
import GirlWithAchive from '@/assets/Di_avatar/girl-img2.webp';
import PremiumBg from '@/assets/img/premium_bg.svg';

const route = useRoute();
const userStore = useUserStore();

const userProfile = ref({});
const loading = ref(false);

const currentUser = computed(() => userStore.getCurrentUser());
const isOwnProfile = computed(
    () => currentUser.value?.id?.toString() === route.params.id?.toString()
);
const isCanAddToFriends = computed(() => !userProfile.value.is_friend);
const emptyTitle = computed(() =>
    isOwnProfile.value ? 'У вас пока нет достижений' : 'У пользователя пока нет достижений'
);

const achievementPalette = ['peach', 'pink', 'blue', 'sky'];
const achievementImagePalette = [GirlPlanet, GirlKeychain, GirlWithCards];
const achievementVisualByType = {
    planet_level: { color: 'blue', image: GirlPlanet },
    words_per_day: { color: 'pink', image: GirlKeychain },
    category_completed: { color: 'peach', image: GirlWithCards },
    premium: { color: 'premium', image: GirlWithAchive },
};

const mapAchievementsWithColor = (achievements = []) => {
    const typeVisualMap = { ...achievementVisualByType };
    let nextColorIndex = 0;
    let nextImageIndex = 0;

    return achievements.map((achievement) => {
        const type = achievement?.type;

        if (type && !typeVisualMap[type]) {
            typeVisualMap[type] = {
                color: achievementPalette[nextColorIndex % achievementPalette.length],
                image: achievementImagePalette[nextImageIndex % achievementImagePalette.length],
            };
            nextColorIndex += 1;
            nextImageIndex += 1;
        }

        const color = type
            ? typeVisualMap[type].color
            : achievementPalette[nextColorIndex++ % achievementPalette.length];

        const image = type
            ? typeVisualMap[type].image
            : achievementImagePalette[nextImageIndex++ % achievementImagePalette.length];

        return {
            ...achievement,
            color,
            tone: color,
            image,
        };
    });
};

const achievementsList = computed(() => {
    const list = Array.isArray(userProfile.value?.achievements)
        ? userProfile.value.achievements
        : [];
    return list.sort((a, b) => {
        if (a.type === 'premium') return -1;
        if (b.type === 'premium') return 1;
        return 0;
    });
});

const refetchUser = async () => {
    userProfile.value =
        currentUser.value.id == route.params.id
            ? currentUser.value
            : await userStore.getUserById(route.params.id);

    userProfile.value.achievements = Array.isArray(userProfile.value?.achievements)
        ? mapAchievementsWithColor(userProfile.value.achievements)
        : [];
};

onMounted(async () => {
    loading.value = true;
    if (route.params.id) {
        await refetchUser();
    }
    loading.value = false;
});
</script>

<style scoped lang="scss">
.achievements-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
}

.achievements-scroll {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    padding-top: 8px;
    gap: 16px;
}

.achievement-list {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    gap: 12px;
    padding-bottom: 150px;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        width: 0;
    }
}

.empty-state {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 12px;
    padding-bottom: 80px;

    &__img {
        width: 168px;
        height: auto;
    }

    &__text {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        line-height: 1.3;
        color: #311d5d;
    }
}

.achievement-card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 20px;
    padding: 7px;
    min-height: 118px;
    overflow: hidden;

    &__content {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-right: 95px;
    }

    &__title {
        margin: 0;
        font-size: 16px;
        font-weight: 800;
        line-height: 1.2;
        color: #311d5d;
    }

    &__date {
        font-size: 14px;
        font-weight: 500;
        color: #262060;
    }

    &__image {
        position: absolute;
        z-index: 1;
        right: 2px;
        bottom: -100%;
        transform: translateY(-50%);
        width: 110px;
        height: 160px;
        object-fit: contain;
        object-position: center;
        pointer-events: none;

        &--keychain {
            bottom: -125%;
        }
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

    &--premium {
        background: #ffb453cc;
    }

    &__bg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        pointer-events: none;
        border-radius: inherit;
    }
}
</style>
