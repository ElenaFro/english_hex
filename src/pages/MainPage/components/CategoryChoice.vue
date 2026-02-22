<template>
    <div class="container" :class="randomClass" @click="goToLearningPage">
        <button type="button" class="nav-arrow">
            <img class="nav-arrow__img" src="@/assets/img/nav-arrow_icon.svg" alt="" />
        </button>
        <div class="category-img">
            <img :src="img_url" alt="" />
        </div>
        <p class="category-name">{{ sectionName }}</p>
        <div class="statusa-bar">
            <div class="statusa-bar__active">
                <img :src="locked ? closedLockIcon : openLockIcon" alt="" />
                <div class="status-circle">
                    <StatusCircle :percent="3" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import StatusCircle from './StatusCircle.vue';
import closedLockIcon from '@/assets/img/closed-lock_icon.svg';
import openLockIcon from '@/assets/img/open-lock_icon.svg';
import subtract1 from '@/assets/categori/Subtract_1.svg';
import subtract2 from '@/assets/categori/Subtract_2.svg';
import subtract3 from '@/assets/categori/Subtract_3.svg';
import subtract4 from '@/assets/categori/Subtract_4.svg';
import { computed, ref, onMounted } from 'vue';

const props = defineProps({
    id: Number,
    sectionName: String,
    imgUrl: String,
    progress: Boolean,
    locked: Boolean,
});

const router = useRouter();
const classList = ['image_1', 'image_2', 'image_3', 'image_4'];
const randomClass = ref('');

onMounted(() => {
    const index = Math.floor(Math.random() * classList.length);
    randomClass.value = classList[index];
});

const goToLearningPage = () => {
    router.push({ name: 'learning', params: { id: props.id }, query: { name: props.sectionName } });
};

const img_url = computed(
    () => `${import.meta.env.VITE_STORAGE_URI}/${props.id}/images/${props.imgUrl}`
);

const checkedProgress = computed(() => (props.progress ? 100 : 0)); // логику просчета добавить после бэка
</script>

<style la scoped>
.container {
    display: flex;
    flex-direction: column;
    /* justify-content: end; */
    justify-content: flex-end;
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 15px;
    padding: 19px 14px 13px;
    background-position: center !important;
    background-repeat: no-repeat;
    background-size: cover;
    cursor: pointer;
}

.category-img {
    padding-bottom: 17px;
}

.category-name {
    font-size: 16px;
    font-weight: 700;
    line-height: 100%;
    color: rgba(38, 32, 96, 1);
    padding-bottom: 16px;
    max-width: 100px;
    overflow-x: hidden;
}

.nav-arrow {
    width: 50px;
    height: 70px;
    position: absolute;
    background-color: transparent;
    padding: 0;
    border: 0;
    border-radius: 400px;
    transform: translate(0%, -50%);
    top: 50%;
    left: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.statusa-bar {
    width: 120px;
    height: 56px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    display: flex;
    justify-content: center;
    padding: 11px 5px;
}

.statusa-bar__active {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
}

.statusa-bar__active img {
    width: 16px;
    height: 16px;
}

.status-circle {
    width: 33px;
    height: 33px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.image_1 {
    background-image: url('@/assets/categori/Subtract_1.svg');
}

.image_2 {
    background-image: url('@/assets/categori/Subtract_2.svg');
}

.image_3 {
    background-image: url('@/assets/categori/Subtract_3.svg');
}

.image_4 {
    background-image: url('@/assets/categori/Subtract_4.svg');
}
</style>
