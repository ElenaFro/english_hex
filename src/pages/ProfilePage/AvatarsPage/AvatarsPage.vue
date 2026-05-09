<template>
    <div class="page-content">
        <div class="avatar-preview">
            <div class="avatar-wrapper">
                <img :src="currentAvatarSrc" class="avatar" alt="User avatar" />
            </div>
        </div>

        <Loader v-if="avatarsLoading" />
        <div v-else class="avatars-scroll">
            <section class="avatar-edit-card">
                <p class="avatar-edit-card__title">Базовые</p>
                <div class="avatar-grid avatar-grid--basic">
                    <button
                        v-for="item in freeAvatarsList"
                        :key="item.image_key"
                        type="button"
                        class="avatar-tile"
                        :class="{ 'avatar-tile--selected': currentAvatarKey === item.image_key }"
                        :disabled="!item.is_unlocked || avatarSaving"
                        :aria-label="item.name"
                        @click="selectAvatar(item.id, item.image_key)"
                    >
                        <img
                            class="avatar-tile__img"
                            :src="item.is_unlocked ? getAvatarSrc(item.image_key) : lockedIcon"
                            alt=""
                        />
                    </button>
                </div>
            </section>

            <section class="avatar-edit-card">
                <p class="avatar-edit-card__title">Премиум</p>
                <div class="avatar-grid">
                    <button
                        v-for="item in premiumAvatarsList"
                        :key="item.image_key"
                        type="button"
                        class="avatar-tile"
                        :class="{ 'avatar-tile--selected': currentAvatarKey === item.image_key }"
                        :disabled="!item.is_unlocked || avatarSaving"
                        :aria-label="item.name"
                        @click="selectAvatar(item.id, item.image_key)"
                    >
                        <img
                            class="avatar-tile__img"
                            :src="item.is_unlocked ? getAvatarSrc(item.image_key) : lockedIcon"
                            alt=""
                        />
                    </button>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import {
    getAvatarSrc,
    getUserAvatarSrc,
    lockedAvatarSrc as lockedIcon,
} from '@/shared/utils/avatarMap';
import { getAvatars, setAvatar } from '@/api/avatars';
import Loader from '@/shared/components/Loader.vue';

const userStore = useUserStore();

const avatarsLoading = ref(false);
const avatarSaving = ref(false);
const freeAvatarsList = ref([]);
const premiumAvatarsList = ref([]);
const currentAvatarKey = ref(null);
const currentAvatarSrc = computed(() =>
    currentAvatarKey.value
        ? getAvatarSrc(currentAvatarKey.value)
        : getUserAvatarSrc(userStore.getCurrentUser())
);

const loadAvatars = async () => {
    avatarsLoading.value = true;
    try {
        const { data } = await getAvatars();
        freeAvatarsList.value = data.avatars?.basic ?? [];
        premiumAvatarsList.value = data.avatars?.premium ?? [];
        currentAvatarKey.value = data.current_avatar?.image_key ?? null;
    } catch (e) {
        console.error('Ошибка загрузки аватарок:', e);
    } finally {
        avatarsLoading.value = false;
    }
};

const selectAvatar = async (avatarId, imageKey) => {
    if (avatarSaving.value || currentAvatarKey.value === imageKey) return;
    avatarSaving.value = true;
    try {
        await setAvatar(avatarId);
        currentAvatarKey.value = imageKey;
        userStore.fetchUser();
    } catch (e) {
        console.error('Ошибка смены аватарки:', e);
    } finally {
        avatarSaving.value = false;
    }
};

onMounted(loadAvatars);
</script>

<style scoped lang="scss">
.avatar-preview {
    display: flex;
    justify-content: flex-start;
    padding: 8px 0 20px;
}

.avatar-wrapper {
    position: relative;
    height: 150px;
    width: 150px;
    border-radius: 50%;
    border: 3px solid #262060;
}

.avatar {
    object-fit: cover;
    object-position: top;
    border-radius: 50%;
    width: 100%;
    height: 100%;
}

.avatars-scroll {
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
    padding-bottom: 120px;
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }
}

.avatar-edit-card {
    &__title {
        margin: 0 0 12px 0;
        font-size: 22px;
        font-weight: 800;
        line-height: 1.1;
        color: #311d5d;
    }
}

.avatar-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    background: #262060;
    border-radius: 20px;
    padding: 18px;

    &--basic {
        max-height: 180px;
        overflow-y: auto;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }
    }
}

.avatar-tile {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    padding: 0;
    border: 2px solid transparent;
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease,
        transform 0.06s ease;

    &:active:not(:disabled) {
        transform: scale(0.95);
    }

    &--selected {
        border-color: #79bbfb;
        box-shadow: 0 0 0 3px rgba(121, 187, 251, 0.35);
    }

    &:disabled {
        cursor: default;
        opacity: 0.7;
    }

    &__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top;
        border-radius: 50%;
        display: block;
    }
}
</style>
