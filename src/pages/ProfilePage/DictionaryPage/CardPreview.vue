<template>
    <div class="page-content">
        <img class="like" :src="currentLikeIcon" alt="like" @click="switchLike" />

        <div class="bg_image">
            <div class="scroll-container">
                <CardFlip
                    ref="cardFlipRef"
                    :cards="cards"
                    :currentCardIndex="currentCardIndex"
                    :activeComponent="activeComponent"
                    :onTransitionEnd="handleTransitionEnd"
                    :getVideoUrl="getVideoUrl"
                    :getAudioUrl="getAudioUrl"
                    @video-ended="onVideoEnded"
                />
            </div>
        </div>
    </div>
</template>
<script setup>
import CardFlip from '@/shared/components/CardFlip.vue';
import { useCategoriesStore } from '@/stores/categories';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import likeDisabled from '@/assets/icons/like_disabled.svg';
import likeEnabled from '@/assets/icons/like_enabled.svg';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const categoryStore = useCategoriesStore();
const cardFlipRef = ref(null);
const isLikeEnabled = ref(false);
const cards = ref([]);
const currentCardIndex = ref(0);
const activeComponent = ref('VideoPage');
const selectedCategory = computed(() => categoryStore.selectedCategory);

onMounted(async () => {
    await categoryStore.getCategoryById(route.query.categoryId);
    const currentCard = await categoryStore.getCardById(route.params.id);
    cards.value.push(currentCard);
    useUserStore().setHeaderTitle(selectedCategory.value?.name);
});

const currentLikeIcon = computed(() => {
    if (isLikeEnabled.value) return likeEnabled;
    else return likeDisabled;
});

const handleTransitionEnd = () => {
    if (activeComponent.value === 'VideoPage') {
        currentCardIndex.value = (currentCardIndex.value + 1) % cards.value.length;
        isTransitioning.value = false;
    }
};

const onVideoEnded = () => {
    if (activeComponent.value === 'VideoPage') {
        activeComponent.value = 'WordPage';
    }
    // if (activeComponent.value === 'WordPage') {
    //     activeComponent.value = 'VideoPage';
    //     cardFlipRef.value.replayVideo();
    // }
};

const switchLike = () => {
    isLikeEnabled.value = !isLikeEnabled.value;
};

const getVideoUrl = (card) => {
    if (!card || !card.id || !card.video) return '';
    return `${import.meta.env.VITE_STORAGE_URI}/${selectedCategory.value.id}/cards/${card.id}/video/${card.video}`;
};

const getAudioUrl = (card) => {
    if (!card || !card.id || !card.audio) return '';
    return `${import.meta.env.VITE_STORAGE_URI}/${selectedCategory.value.id}/cards/${card.id}/audio/${card.audio}`;
};
</script>

<style scoped>
.page-content {
    position: relative;
    padding: 26px 0;
}

.bg_image {
    width: 100%;
    background-image: url('@/assets/lesson/lesson_card_bg.svg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    max-height: 430px;
    z-index: 99;
}

.scroll-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100dvh;
    box-sizing: border-box;
    overflow: hidden;
}

.like {
    position: absolute;
    right: 3%;
    top: 2%;
    width: 43px;
    cursor: pointer;
    z-index: 100;
}
</style>
