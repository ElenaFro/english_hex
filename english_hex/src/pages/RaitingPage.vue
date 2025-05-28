<template>
    <div class="raiting-page">
        <section class="podium-container">
            <div class="podium-section">
                <div v-for="(user, index) in topUsers" :key="user.id" class="podium-item" :class="`rank-${index + 1}`">
                    <img :src="user.avatar" class="user-avatar" :alt="user.nik_name" />
                    <div>
                        <span class="user-nik_name">{{ user.nik_name }}</span>

                    </div>
                </div>
            </div>
        </section>

        <section class="user-list">
            <section v-for="user in userList" :key="user.id" class="user-item">
                <div class=" user-rank">{{ user.rank }}
                </div>
                <section class="user-item-section">
                    <img :src="user.avatar" class="user-avatar-small" :alt="user.nik_name" />
                    <span class="user-nik_name">{{ user.nik_name }}</span>
                    <div class="user-info">
                        <span class="user-stars">{{ user.stars }} </span> <img src="@/assets/icons/yelow_star.svg"
                            class="star_class" />
                    </div>
                </section>
            </section>
        </section>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";


const users = ref([
    {
        id: 1,
        nik_name: "Алексей",
        avatar: new URL("@/assets/img/DefaultUserAvatar/black.svg", import.meta.url).href,
        rating: 1500,
        stars: 5,
    },
    {
        id: 2,
        nik_name: "Мария",
        avatar: new URL("@/assets/img/DefaultUserAvatar/black.svg", import.meta.url).href,
        rating: 1400,
        stars: 4,
    },
    {
        id: 3,
        nik_name: "Дмитрий",
        avatar: new URL("@/assets/img/DefaultUserAvatar/black.svg", import.meta.url).href,
        rating: 1300,
        stars: 4,
    },
    {
        id: 4,
        nik_name: "Екатерина",
        avatar: new URL("@/assets/img/DefaultUserAvatar/black.svg", import.meta.url).href,
        rating: 1200,
        stars: 3,
    },
    {
        id: 5,
        nik_name: "Иван",
        avatar: new URL("@/assets/img/DefaultUserAvatar/black.svg", import.meta.url).href,
        rating: 1100,
        stars: 3,
    },
    {
        id: 6,
        nik_name: "Ольга",
        avatar: new URL("@/assets/img/DefaultUserAvatar/black.svg", import.meta.url).href,
        rating: 1000,
        stars: 2,
    },
    {
        id: 7,
        nik_name: "Сергей",
        avatar: new URL("@/assets/img/DefaultUserAvatar/black.svg", import.meta.url).href,
        rating: 900,
        stars: 2,
    },
]);

const currentUserReitingWithNeighbour = ref([
    {
        id: 98,
        nik_name: "Алексей",
        avatar: new URL("@/assets/img/DefaultUserAvatar/black.svg", import.meta.url).href,
        rating: 1500,
        stars: 5,
    },
    {
        id: 99,
        nik_name: "Мария",
        avatar: new URL("@/assets/img/DefaultUserAvatar/black.svg", import.meta.url).href,
        rating: 1400,
        stars: 4,
    },
    {
        id: 100,
        nik_name: "Дмитрий",
        avatar: new URL("@/assets/img/DefaultUserAvatar/black.svg", import.meta.url).href,
        rating: 1300,
        stars: 4,
    },
]);

const userList = computed(() => otherUsers.value.concat(currentUserReitingWithNeighbour.value))
const curentUser = (id) => {
    userList.value.find((user) => user.id === id)

}

const sortedUsers = computed(() => {
    return [...users.value]
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
    return sortedUsers.value.slice(3);
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

    @media (min-width:375px) {
        width: 375px;
    }

    @media (max-width:375px) {
        width: 100%;
    }
}

.podium-container {
    width: 100%;
    max-width: 375px;
    height: 370px;
    background: url("@/assets/img/podium-bg.svg") no-repeat center center;
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
    gap: 3px;
    position: absolute;
}

.podium-item.rank-1 {
    left: 50%;
    transform: translateX(-50%);
    top: 18px;
}

.podium-item.rank-2 {
    left: 10%;
    top: 30px;
}

.podium-item.rank-3 {
    right: 10%;
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
    width: 100%;
    justify-content: flex-end;
    column-gap: 10px;
}

.user-nik_name {
    display: flex;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    align-items: center;
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
    gap: 10px;
    padding: 6px;
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
    color: #a3bffa;
}

.star_class img {
    display: flex !important;
    justify-content: end !important;
    width: 25px;
    height: 25px;
}
</style>