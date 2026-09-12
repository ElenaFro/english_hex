<template>
    <StoryVideoScreen :src="videoUrl" @skip="skipStory" @ended="goNext" />
</template>

<script setup>
import { computed, onMounted } from 'vue';
import StoryVideoScreen from '@/components/Authentication/StoryVideoScreen.vue';
import { useOnboardingFlow } from '@/shared/composables/useOnboardingFlow';

const emit = defineEmits(['change-component']);
const { onboarding, skipStory } = useOnboardingFlow(emit);

const videoUrl = computed(() => onboarding.outroVideoUrl);
let left = false;

const goNext = () => {
    if (left) return;
    left = true;
    emit('change-component', 'OnboardingSectorSaved');
};

onMounted(async () => {
    // После перезагрузки на этом экране контент ещё не загружен.
    await onboarding.loadContent();
    if (!videoUrl.value) goNext();
});
</script>
