<template>
    <div class="raiting-page">
        <section class="podium-container">
            <div class="podium-section">
                <div v-for="(user, index) in topUsers" :key="user.id" class="podium-item"
                    :class="`rank-${index + 1} ${user.id === currentUser?.id ? 'active-user' : ''}`">
                    <img src="@/assets/img/DefaultUserAvatar/male.svg" class="user-avatar" :alt="user.name" />
                    <div>
                        <span class="name_top">{{ user.name }}</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="user-list">
            <section v-for="user in otherUsers" :key="user.id" class="user-item"
                :class="{ 'active-user': user.id === currentUser?.id }">
                <div class="user-rank">{{ user.rank }}</div>
                <section class="user-item-section">
                    <img src="@/assets/img/DefaultUserAvatar/male.svg" class="user-avatar-small" :alt="user.name" />
                    <span class="user-name">{{ user.name }}</span>
                    <div class="user-info">
                        <span class="user-stars">{{ user.rating }}</span>
                        <img src="@/assets/icons/yelow_star.svg" class="star_class" />
                    </div>
                </section>
            </section>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const raitingData = ref([]);
const currentUser = ref(null);

onMounted(async () => {
    const authStore = useAuthStore();
    raitingData.value = await authStore.getRaiting();
    currentUser.value = await authStore.getCurrentUser();
});

const sortedUsers = computed(() => {
    return [...raitingData.value]
        .sort((a, b) => b.rating - a.rating)
        .map((user, index) => ({
            ...user,
            rank: index + 1,
        }));
});

const topUsers = computed(() => {
    return sortedUsers.value.slice(0, 3);
});

const otherUsers = computed(() => {
    const topUserIds = topUsers.value.map((user) => user.id);
    return sortedUsers.value
        .filter((user) => !topUserIds.includes(user.id))
        .sort((a, b) => a.rank - b.rank);
});
</script>

<style scoped lang="scss">
.raiting-page {
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, #e0e7ff, #a3bffa);
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;

    @media (min-width: 375px) {
        width: 375px;
    }

    @media (max-width: 375px) {
        width: 100%;
    }
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
    border: 1px solid #FF7E56;
    padding: 4px;
}

.user-info {
    text-align: center;
    display: flex;
    justify-content: flex-end;
    column-gap: 10px;
}

.user-name {
    display: flex;
    flex-direction: row;
    white-space: nowrap;
    max-width: 130px;
    width: 130px;
    text-align: start;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 16px;
    font-weight: 600;
    align-items: start;
    color: #4700B580;
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
    background: #FFF8F5;
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

.user-item-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border: 2px solid #4700B580;
    background: #FFF;
    border-radius: 20px;
    gap: 17px;
    width: 100%;
}

.user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: 20px;
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

.user-avatar-small {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
}

.user-stars {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #4700B580;
}

.star_class img {
    display: flex !important;
    justify-content: end !important;
    width: 25px;
    height: 25px;
}

.active-user .user-item-section {
    background: #C6C9FE;

    :deep(.user-name) {
        color: #2E0C77;
    }

    :deep(.user-stars) {
        color: #2E0C77;
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