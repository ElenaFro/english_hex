<template>
    <div class="auth-story-screen">
        <button class="auth-story-screen__skip" type="button" @click="skipStory">Пропустить</button>

        <div class="auth-story-screen__video-wrap">
            <video
                v-if="videoUrl && !videoFailed"
                ref="videoRef"
                class="auth-story-screen__video"
                :src="videoUrl"
                autoplay
                playsinline
                @playing="videoPlaying = true"
                @ended="goNext"
                @error="onVideoError"
            ></video>
            <p v-else class="auth-story-screen__video-title">Тут будет видео</p>
        </div>

        <!-- Кнопки «Дальше» в макете нет: ролик доигрывает и экран меняется сам.
             Показываем её, пока ролик не пошёл, — иначе, пока видео грузится или
             отдаёт 404, уйти с экрана было бы некуда. -->
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
import { computed, onBeforeUnmount, ref } from 'vue';
import { useOnboardingFlow } from '@/shared/composables/useOnboardingFlow';

const emit = defineEmits(['change-component']);
const { onboarding, skipStory } = useOnboardingFlow(emit);

const videoRef = ref(null);
// Видео истории пока не залито — показываем плейсхолдер и когда ссылка отдаёт 404.
const videoFailed = ref(false);
const videoPlaying = ref(false);
const videoUrl = computed(() => onboarding.outroVideoUrl);
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

const goNext = () => {
    stopVideo();
    emit('change-component', 'OnboardingSectorSaved');
};

onBeforeUnmount(stopVideo);
</script>

<style scoped lang="scss">
// Размеры и цвета — из макета (кадр 375×812).
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
