<template>
    <StoryVideoScreen :src="videoUrl" @skip="goNext" @ended="goNext" @playing="onPlaying" />
</template>

<script setup>
import { computed, onMounted } from 'vue';
import StoryVideoScreen from '@/components/Authentication/StoryVideoScreen.vue';
import { useOnboardingStore } from '@/stores/onboarding';
import { FRONT_EVENTS, trackEventOnce } from '@/shared/analytics/onboardingAnalytics';

const emit = defineEmits(['change-component']);
const onboarding = useOnboardingStore();

const videoUrl = computed(() => onboarding.introVideoUrl);
let storyStartSent = false;
let left = false;

/**
 * story_started — по контракту в момент реального старта воспроизведения,
 * а не показа экрана, поэтому событие висит на @playing.
 */
const onPlaying = () => {
    if (storyStartSent) return;
    storyStartSent = true;
    trackEventOnce(FRONT_EVENTS.STORY_STARTED);
};

/**
 * «Пропустить» здесь означает «пропустить видео»: по макету стрелка ведёт
 * на следующий экран истории, а не к выбору роли, поэтому бэк не дёргаем.
 */
const goNext = () => {
    if (left) return;
    left = true;
    emit('change-component', 'OnboardingHero');
};

onMounted(async () => {
    await onboarding.loadContent();
    // Контент не пришёл или ролика нет — показывать нечего, идём дальше по истории.
    if (!videoUrl.value) goNext();
});
</script>
