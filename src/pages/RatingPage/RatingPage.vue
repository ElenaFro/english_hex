<template>
    <div class="raiting-page">
        <section class="podium-container">
            <div class="podium-section">
                <div
                    v-for="(user, index) in topUsers"
                    :key="user.id"
                    class="podium-item"
                    :class="`rank-${index + 1} ${user.id === currentUser?.id ? 'active-user' : ''}`"
                    @click="goToProfile(user.id)"
                >
                    <img :src="userImg(user.gender)" class="user-avatar" :alt="user.name" />
                    <div>
                        <span class="name_top">{{ user.name }}</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="user-list">
            <section
                v-for="user in otherUsers"
                :key="user.id"
                class="user-item"
                :class="{ 'active-user': user.id === currentUser?.id }"
                @click="goToProfile(user.id)"
            >
                <div class="user-rank">{{ user.place }}</div>
                <user-card-with-star :user="user" />
            </section>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import maleAvatar from '@/assets/img/DefaultUserAvatar/male.webp';
import femaleAvatar from '@/assets/img/DefaultUserAvatar/female.svg';
import UserCardWithStar from '@/shared/ui/UserCardWithStar.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const raitingData = ref([]);
const currentUser = ref(null);

onMounted(async () => {
    const authStore = useUserStore();
    raitingData.value = await authStore.getRaiting();
    currentUser.value = await authStore.getCurrentUser();
    authStore.setHeaderTitle('Рейтинг');
});

const sortedUsers = computed(() => {
    return [...raitingData.value].sort((a, b) => b.rating - a.rating);
});

const topUsers = computed(() => {
    return sortedUsers.value.slice(0, 3);
});

const otherUsers = computed(() => {
    const topUserIds = topUsers.value.map((user) => user.id);
    return sortedUsers.value.filter((user) => !topUserIds.includes(user.id));
});

const userImg = (gender) => {
    const normalizedGender = gender ? gender.toLowerCase() : '';
    if (normalizedGender === 'male') return maleAvatar;
    else return femaleAvatar;
};

const goToProfile = (userId) => {
    router.push({ name: 'profileAchievements', params: { id: userId } });
};
</script>

<style scoped lang="scss">
.raiting-page {
    height: 100vh;
    width: 100vw;
    max-width: 414px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, #e0e7ff, #a3bffa);
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;

    // @media (min-width: 375px) {
    //     width: 375px;
    // }

    // @media (max-width: 375px) {
    //     width: 100%;
    // }
}

.podium-container {
    width: 100%;
    max-width: 375px;
    height: 370px;
    background: url('@/assets/img/podium-bg.svg') no-repeat center center;
    position: relative;
}

.podium-section {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 100%;
    min-height: 530px;
    position: relative;
}

.podium-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    position: absolute;
    cursor: pointer;
}

.podium-item.rank-1 {
    left: 50%;
    transform: translateX(-50%);
    top: 18px;
}

.podium-item.rank-2 {
    left: 6%;
    top: 30px;
}

.podium-item.rank-3 {
    right: 8%;
    top: 40px;
}

.podium-item.rank-1 .rank-badge {
    background: #ffd700;
    color: #262060;
}

.podium-item.rank-2 .rank-badge {
    background: #c0c0c0;
    color: #262060;
}

.podium-item.rank-3 .rank-badge {
    background: #cd7f32;
    color: #262060;
}

.user-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #ff7e56;
    background-color: #fff;
    padding: 4px;
}

.user-rating {
    font-size: 14px;
    color: #a3bffa;
}

.user-list {
    position: relative;
    width: 100%;
    height: 100%;
    max-width: 400px;
    background: #fff8f5;
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    margin-top: -144px;
    overflow-y: auto;
    padding-bottom: 170px;
    box-sizing: border-box;
}

.user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: 20px;
    cursor: pointer;
}

.user-item:last-child {
    border-bottom: none;
}

.user-rank {
    font-size: 20px;
    font-weight: 400;
    line-height: 25px;
    color: #00000080;
    width: 30px;
    text-align: center;
}

.active-user .user-item-section {
    background: #c6c9fe;

    :deep(.user-name) {
        color: #2e0c77;
    }

    :deep(.user-stars) {
        color: #2e0c77;
    }
}

.name_top {
    color: #262060;
    display: flex;
    flex-direction: row;
    white-space: nowrap;
    max-width: 130px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    font-weight: 600;
    line-height: 100%;
}
</style>
