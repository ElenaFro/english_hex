<template>
    <div class="page-content" :class="{ lesson_padding: activeComponent.__name === 'LessonsPage' }">
        <img
            ref="likeRef"
            v-if="showLike"
            class="like"
            :class="overlayClass"
            :src="currentLikeIcon"
            alt="like"
            @click="switchLike"
        />

        <div :class="{ bg_image: activeComponent.__name === 'LessonsPage' }">
            <component
                ref="componentRef"
                :is="activeComponent"
                @switch-component="switchComponent"
                @show-like-hint="setHintShowing"
                @like-changed="setLikeValue"
            />
        </div>
        <Popup />
    </div>

    <teleport to="body">
        <div v-if="isShowLikeHint" class="hint-overlay" @click="closeLikeHintShowing">
            <div class="like-container" :style="highlightStyle">
                <div class="like-container_wrapper">
                    <img
                        class="like-container_icon"
                        src="@/assets/onboarding/arrow_top.svg"
                        alt="arrow"
                    />
                </div>
                <span class="like-container_text"
                    >Нажми на сердце, чтобы сохранить в избранное, слова можно просмотреть в
                    Профиле</span
                >
            </div>

            <img
                class="like"
                :src="currentLikeIcon"
                alt="like"
                :style="likeHighlightStyle"
                @click="switchLike"
            />
        </div>
    </teleport>
</template>

<script setup>
import { computed, ref } from 'vue';
import StartLearning from '../components/Learning/StartLearning.vue';
import LessonsPage from '../components/Learning/LessonsPage.vue';
import Popup from '../components/popups/defaultPopup.vue';
import likeDisabled from '@/assets/icons/like_disabled.svg';
import likeEnabled from '@/assets/icons/like_enabled.svg';
import likeWhite from '@/assets/icons/like_white.svg';
import { useElementPosition } from '@/shared/composables/useElementPosition';

const activeComponentName = ref('start-learning');
const isLikeEnabled = ref(false);
const isLikeHintShowed = ref(!!localStorage.getItem('like_hint_shown'));
const isShowLikeHint = ref(false);
const likeRef = ref(null);
const componentRef = ref(null);

const activeComponent = computed(() => components[activeComponentName.value]);

const components = {
    'start-learning': StartLearning,
    'lessons-page': LessonsPage,
};

const { calculatePositionDelayed, getPositionStyle } = useElementPosition(likeRef, {
    autoUpdate: true,
    watchResize: true,
});

const highlightStyle = computed(() => getPositionStyle({ top: 66, left: -281, width: 210 }));

const { calculatePositionDelayed: calculateLikePosition, getPositionStyle: getLikePosition } =
    useElementPosition(likeRef, {
        autoUpdate: true,
        watchResize: true,
    });

const likeHighlightStyle = computed(() => getLikePosition());

function switchComponent() {
    activeComponentName.value = 'lessons-page';
}

const showLike = computed(() => activeComponentName.value === 'lessons-page');

const overlayClass = computed(() => ({ 'index-up': isShowLikeHint.value }));

const currentLikeIcon = computed(() => {
    if (isShowLikeHint.value) return likeWhite;
    if (isLikeEnabled.value) return likeEnabled;
    else return likeDisabled;
});

const switchLike = () => {
    if (isLikeEnabled.value) {
        componentRef.value.updateLike(false);
    } else {
        componentRef.value.updateLike(true);
    }
};

const setHintShowing = () => {
    if (isLikeHintShowed.value) return;
    calculatePositionDelayed();
    calculateLikePosition();
    isShowLikeHint.value = true;
    localStorage.setItem('like_hint_shown', 'true');
};

const closeLikeHintShowing = () => {
    isShowLikeHint.value = false;
};

const setLikeValue = (value) => {
    isLikeEnabled.value = value;
};
</script>

<style scoped lang="scss">
.page-content {
    padding-top: 28px;
    padding-bottom: 35px;
    position: relative;
}
.lesson_padding {
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

.like {
    position: absolute;
    right: 3%;
    top: 2%;
    width: 43px;
    cursor: pointer;
    z-index: 100;
}

.like-container {
    position: absolute;
    z-index: 104;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    cursor: pointer;
    width: 300px;

    &_text {
        color: #fff;
        text-align: center;
        margin-top: 22px;
        max-width: 300px;
    }

    &_wrapper {
        width: 314px;
        display: flex;
        justify-content: end;
        margin-right: 30px;
        position: relative;
    }

    &_icon {
        width: 113px;
        position: absolute;
        top: -30px;
        right: 48px;
    }
}
</style>
