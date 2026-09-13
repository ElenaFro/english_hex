<template>
    <div class="auth-story-screen">
        <button class="auth-story-screen__skip" type="button" @click="onSkip">Пропустить</button>

        <div class="auth-story-screen__video-wrap" @click="playWithSound">
            <video
                v-if="src"
                ref="videoRef"
                class="auth-story-screen__video"
                :src="src"
                playsinline
                preload="auto"
                @playing="onPlaying"
                @ended="onEnded"
                @error="onEnded"
            ></video>

            <!-- Без звука автоплей пустили, со звуком — нет: звук включается нажатием. -->
            <p v-if="soundBlocked" class="auth-story-screen__sound-hint">
                <img src="@/assets/onboarding/tap-hand.svg" alt="" />
                Нажми, чтобы включить звук
            </p>

            <!-- Автоплей не пустили совсем — ролик запускается нажатием. -->
            <div v-if="tapRequired" class="auth-story-screen__coach">
                <img
                    class="auth-story-screen__coach-hand"
                    src="@/assets/onboarding/tap-hand.svg"
                    alt=""
                />
                <p class="auth-story-screen__coach-text">Нажми, чтобы посмотреть видео</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue';

/**
 * Полноэкранное видео истории онбординга (интро и аутро).
 * По макету кнопки «Дальше» нет: ролик доигрывает, и экран переключается сам.
 * Битый или недоступный ролик тоже отдаёт ended, чтобы не запирать человека на чёрном экране.
 */
defineProps({
    src: { type: String, default: '' },
});

const emit = defineEmits(['skip', 'ended', 'playing']);

const videoRef = ref(null);
// Ролик идёт без звука — подсказка «нажми, чтобы включить звук».
const soundBlocked = ref(false);
// Автоплей не пустили совсем — ролик стоит до нажатия.
const tapRequired = ref(false);

const onSkip = () => emit('skip');
const onPlaying = () => emit('playing');
const onEnded = () => emit('ended');

const isNotAllowed = (error) => error?.name === 'NotAllowedError';

/**
 * Звук без жеста браузеры пускают только при «активации» страницы: переход с кнопки
 * «Начать» её даёт, перезагрузка — нет. Поэтому по порядку: со звуком, затем без звука
 * с подсказкой, затем ждём нажатия (iOS в энергосбережении не пускает и без звука).
 */
const autoplay = async (video) => {
    video.muted = false;

    try {
        await video.play();
        return;
    } catch (error) {
        // AbortError и прочее — ролик сменили или размонтировали, это не отказ автоплея.
        if (!isNotAllowed(error) || videoRef.value !== video) return;
    }

    video.muted = true;

    try {
        await video.play();
        soundBlocked.value = true;
    } catch (error) {
        if (isNotAllowed(error) && videoRef.value === video) tapRequired.value = true;
    }
};

/** Нажатие — это жест, в нём play() со звуком разрешён везде. Показываем ролик с начала. */
const playWithSound = () => {
    const video = videoRef.value;
    if (!video || (!soundBlocked.value && !tapRequired.value)) return;

    soundBlocked.value = false;
    tapRequired.value = false;
    video.muted = false;
    video.currentTime = 0;
    video.play().catch(() => {});
};

watch(videoRef, (video) => {
    if (video) autoplay(video);
});

onBeforeUnmount(() => {
    videoRef.value?.pause();
});
</script>

<style scoped lang="scss">
// Размеры и цвета — из макета (кадр 375×812).
.auth-story-screen {
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
    min-height: 100dvh;
    position: relative;
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

    // Подсказки про звук в макете видео-экранов нет — стиль взят с чипа «Пропустить».
    &__sound-hint {
        position: absolute;
        left: 50%;
        bottom: 86px;
        transform: translateX(-50%);
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 8px;
        width: max-content;
        max-width: calc(100% - 32px);
        margin: 0;
        padding: 8px 16px;
        border-radius: 16px;
        background: rgba(211, 206, 255, 0.2);
        color: #ffffff;
        font-size: 16px;
        font-weight: 600;
        line-height: 1.2;
        text-align: center;
        pointer-events: none;

        img {
            flex-shrink: 0;
            width: 24px;
            height: 24px;
        }
    }

    // Как coach-mark на первой карточке урока.
    &__coach {
        position: absolute;
        inset: 0;
        z-index: 2;
        background: rgba(0, 0, 0, 0.8);
    }

    &__coach-hand {
        position: absolute;
        left: 45.3%;
        top: 46.4%;
        width: 35px;
        height: 35px;
    }

    &__coach-text {
        position: absolute;
        left: 50%;
        top: 53.4%;
        transform: translateX(-50%);
        width: 83.7%;
        margin: 0;
        color: #ffffff;
        font-size: 18px;
        font-weight: 600;
        line-height: 1.2;
        text-align: center;
    }
}
</style>
