<template>
    <div class="page-content">
        <search-input
            placeholder="Введи имя пользователя"
            @search="console.log($event)"
            enable-auto-search
        />

        <div v-if="friends.length === 0" class="empty-state">
            <img src="@/assets/img/empty-friends.webp" alt="girl" class="empty-state__img" />
            <p class="empty-state__text">У тебя пока нет друзей, найдите же их скорее</p>
        </div>

        <section v-else>
            <p class="friends-menu__section-title">Мои друзья</p>
            <div class="friends-list">
                <div v-for="friend in friends" :key="friend.id" class="friends-item">
                    <user-card-with-star :user="friend" @click="goToUserProfile(friend.id)" />
                    <button class="friends-item__delete-btn" @click="removeFriend(friend.id)">
                        <img
                            src="@/assets/icons/delete_icon.svg"
                            alt="Удалить"
                            class="friends-item__delete-icon"
                        />
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SearchInput from '@/shared/ui/SearchInput.vue';
import UserCardWithStar from '@/shared/ui/UserCardWithStar.vue';
import { useUserStore } from '@/stores/user';
import { push } from 'notivue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const friends = ref([
    { id: 8, name: 'odilbek_arziev', rating: 145, gender: 'male', place: 1 },
    { id: 2, name: 'fdgbvbhgf', rating: 0, gender: 'male', place: 2 },
    { id: 3, name: 'gfhfghsfgh', rating: 0, gender: 'male', place: 3 },
    { id: 4, name: 'dfgsdfg', rating: 0, gender: 'male', place: 4 },
    { id: 5, name: 'TestAndrew', rating: 0, gender: 'male', place: 5 },
    { id: 6, name: 'Марина', rating: 0, gender: 'female', place: 6 },
    { id: 7, name: 'odilbek', rating: 0, gender: 'male', place: 7 },
    { id: 9, name: 'Ovrono', rating: 0, gender: 'male', place: 8 },
    { id: 12, name: 'Mark_lebovski', rating: 0, gender: 'male', place: 11 },
]);

const removeFriend = async (id) => {
    try {
        // await userStore.removeFriendById(id);
        push.success({
            message: 'Друг успешно удален',
        });
    } catch (error) {
        push.error({
            message: 'Не удалось удалить друга',
        });
    }
};

const goToUserProfile = (userId) => {
    router.push({ name: 'profileAchievements', params: { id: userId } });
};
</script>
<style scoped lang="scss">
.empty-state {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 60px;

    &__img {
        width: min(61dvw, 297px);
        height: auto;
        margin-bottom: 18px;
    }

    &__text {
        font-size: 30px;
        color: #262060;
        font-weight: 800;
        line-height: normal;
        max-width: 260px;
    }
}

.friends-menu {
    &__section-title {
        margin: 5px 0 19px;
        font-size: 22px;
        font-weight: 800;
        color: #311d5d;
    }
}

.friends-list {
    max-height: 78dvh;
    overflow-y: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    padding-bottom: 60px;
}

.friends-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    border-radius: 12px;
}

.friends-item__delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    margin-left: 7px;
    border: 2px solid #262060;
    border-radius: 20px;
    padding: 15px 19px;
}

.friends-item__delete-icon {
    width: 25px;
    height: 25px;
    transition: transform 0.2s;
}

.friends-item__delete-btn:hover .dictionary-item__delete-icon {
    transform: scale(1.2);
}

:deep(.user-item-section) {
    border-color: #311d5d;

    .user-name {
        color: #311d5d;
    }

    .user-stars {
        color: #311d5d;
    }
}
</style>
