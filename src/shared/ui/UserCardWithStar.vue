<template>
    <section class="user-item-section">
        <img :src="userImg(user.gender)" class="user-avatar-small" :alt="user.name" />
        <span class="user-name">{{ user.name }}</span>
        <div class="user-info">
            <span class="user-stars">{{ user.rating }}</span>
            <img src="@/assets/icons/yelow_star.svg" class="star_class" />
        </div>
    </section>
</template>

<script setup>
import maleAvatar from '@/assets/img/DefaultUserAvatar/male.webp';
import femaleAvatar from '@/assets/img/DefaultUserAvatar/female.svg';

defineProps({
    user: { type: Object, required: true },
});
const userImg = (gender) => {
    const normalizedGender = gender ? gender.toLowerCase() : '';
    if (normalizedGender === 'male') return maleAvatar;
    else return femaleAvatar;
};
</script>

<style scoped lang="scss">
.user-item-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border: 2px solid #4700b580;
    background: #fff;
    border-radius: 20px;
    gap: 17px;
    width: 100%;
    cursor: pointer;
}

.user-avatar-small {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
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
    color: #4700b580;
}

.user-stars {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #4700b580;
}

.user-info {
    text-align: center;
    display: flex;
    justify-content: flex-end;
    column-gap: 10px;
}

.star_class img {
    display: flex !important;
    justify-content: end !important;
    width: 25px;
    height: 25px;
}
</style>
