<template>
    <div class="auth-story-screen">
        <button class="auth-story-screen__skip" type="button" @click="goNext">Пропустить</button>

        <div class="auth-story-screen__video-wrap">
            <video
                v-if="videoUrl && !videoFailed"
                ref="videoRef"
                class="auth-story-screen__video"
                :src="videoUrl"
                autoplay
                playsinline
                @playing="onPlaying"
                @ended="goNext"
                @error="onVideoError"
            ></video>
            <p v-else class="auth-story-screen__video-title">Тут будет видео</p>
        </div>

        <!--
            По макету на экране видео кнопки «Дальше» нет: ролик доигрывает и экран
            переключается сам. Показываем её, пока ролик не пошёл, — иначе, пока видео
            грузится или отдаёт 404, уйти с экрана было бы некуда.
        -->
        <button
            v-if="showFallbackButton"
            class="button button--purple auth-story-screen__button"
            type="button"
            @click="goNext"
        >
            Дальше
            <img src="@/assets/img/arrow_icon.svg" alt="arrow" />
        </button>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useOnboardingStore } from '@/stores/onboarding';
import { FRONT_EVENTS, trackEventOnce } from '@/shared/analytics/onboardingAnalytics';

const emit = defineEmits(['change-component']);
const onboarding = useOnboardingStore();

const videoRef = ref(null);
const storyStartSent = ref(false);
// Видео истории пока не залито — показываем плейсхолдер и когда ссылка отдаёт 404.
const videoFailed = ref(false);
const videoPlaying = ref(false);

const videoUrl = computed(() => onboarding.introVideoUrl);
// Кнопку прячем только когда ролик реально пошёл: пока он грузится (а сейчас ещё и
// отдаёт 404 несколько секунд) уходить со экрана было бы некуда.
const showFallbackButton = computed(() => !videoPlaying.value);

const stopVideo = () => {
    videoRef.value?.pause();
};

const onVideoError = () => {
    videoFailed.value = true;
    videoPlaying.value = false;
};

/**
 * story_started — по контракту в момент реального старта воспроизведения,
 * а не показа экрана, поэтому событие висит на @playing.
 */
const onPlaying = () => {
    videoPlaying.value = true;
    if (storyStartSent.value) return;
    storyStartSent.value = true;
    trackEventOnce(FRONT_EVENTS.STORY_STARTED);
};

/**
 * «Пропустить» здесь означает «пропустить видео»: по макету стрелка ведёт
 * на следующий экран истории, а не к выбору роли, поэтому бэк не дёргаем.
 */
const goNext = () => {
    stopVideo();
    emit('change-component', 'OnboardingHero');
};

onMounted(() => {
    onboarding.loadContent();
});

onBeforeUnmount(stopVideo);
</script>

<style scoped lang="scss">
// Размеры и цвета — из макета (кадр 375×812), см. ревью «сверка онбординга с макетами».
.auth-story-screen {
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
    min-height: 100dvh;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 18px 16px 86px;
    overflow: hidden;

    &__skip {
        position: absolute;
        top: 19px;
        right: 19px;
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 132px;
        height: 31px;
        border: 0;
        border-radius: 16px;
        padding: 0 24px;
        background: rgba(211, 206, 255, 0.2);
        color: #ffffff;
        font-size: 18px;
        font-weight: 600;
        line-height: 1.2;
    }

    &__video-wrap {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.18);
    }

    &__video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.78;
    }

    &__video-title {
        position: absolute;
        // 338 / 812 — верх текста в макете.
        top: 41.6%;
        left: 50%;
        transform: translateX(-50%);
        width: 84.3%;
        max-width: 100%;
        margin: 0;
        color: #ffffff;
        font-size: 70px;
        font-weight: 700;
        line-height: 1.2;
        text-align: center;
    }

    &__button {
        align-self: flex-start;
        z-index: 2;
        min-width: 118px;

        img {
            width: 23px;
        }
    }
}
</style>
