<template>
    <div class="scroll-container">
        <section>
            <div class="img-container">
                <div class="img-stack">
                    <img
                        v-for="(img, index) in previewImages"
                        :key="index"
                        :src="img"
                        class="stack-img"
                        :class="`stack-img--${index}`"
                        alt="card preview"
                    />
                    <div
                        v-for="i in Math.max(0, 3 - previewImages.length)"
                        :key="'ph-' + i"
                        class="stack-img stack-placeholder"
                        :class="`stack-img--${previewImages.length + i - 1}`"
                    />
                </div>
            </div>

            <h1 class="page-content__title">{{ name }}</h1>
            <p class="page-content__text">{{ description }}</p>

            <div class="btn-container">
                <button class="button button--blue" @click="emit('preview-deck')">К колоде</button>
                <button class="button button--blue" @click="emit('preview-game')">К игре</button>
                <button class="button button--blue button--icon" @click="emit('edit')">
                    <img src="@/assets/icons/editPencil.svg" alt="edit" />
                </button>
            </div>

            <button
                class="button button--publish"
                :class="{ 'button--publishing': loading }"
                :style="loading ? { '--progress': progress + '%' } : {}"
                :disabled="loading"
                @click="showConfirm = true"
            >
                <span class="publish-label">
                    {{ loading ? `${Math.round(progress)}%` : 'Опубликовать' }}
                </span>
            </button>
        </section>

        <default-popup
            :is-visible="showConfirm"
            title="Опубликовать категорию?"
            message="После публикации категория станет доступна пользователям."
            confirm-text="Опубликовать"
            @close="showConfirm = false"
            @confirm="onConfirm"
        />
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import DefaultPopup from '@/shared/components/popups/defaultPopup.vue';

const props = defineProps({
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    cards: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    progress: { type: Number, default: 0 },
});

const emit = defineEmits(['preview-deck', 'preview-game', 'edit', 'publish']);

const showConfirm = ref(false);

const onConfirm = () => {
    showConfirm.value = false;
    emit('publish');
};

// Берём превью первых 3 карточек (blob URL или уже загруженный preview)
const previewImages = computed(() =>
    props.cards
        .slice(0, 3)
        .map((c) => c.card_photo_preview)
        .filter(Boolean)
);
</script>

<style scoped lang="scss">
.scroll-container {
    width: 100%;
    padding: 0 20px;
}

.img-container {
    display: flex;
    justify-content: center;
    position: relative;
    padding-bottom: 24px;
}

.img-stack {
    position: relative;
    width: 220px;
    height: 280px;
}

.stack-img {
    position: absolute;
    width: 180px;
    height: auto;
    border-radius: 20px;
    object-fit: cover;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.stack-placeholder {
    background: #2e236d33;
    height: 240px;
}

.stack-img--0 {
    transform: rotate(-10deg) translateX(-30px);
    z-index: 1;
    top: 10px;
    left: -22px;
    opacity: 0.9;
}

.stack-img--1 {
    transform: rotate(5deg) translateX(20px);
    z-index: 2;
    top: 20px;
    right: -20px;
}

.stack-img--2 {
    transform: rotate(0deg);
    z-index: 3;
    top: 50px;
    left: 22px;
}

.page-content__title {
    font-size: 24px;
    font-weight: 700;
    line-height: 100%;
    color: #311d5d;
    margin-bottom: 16px;
    margin-top: 24px;
}

.page-content__text {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #262060;
    margin-bottom: 25px;
}

.btn-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 312px;
}

.button {
    font-family: Mulish;
    font-weight: 600;
    font-size: 18px;
    line-height: 120%;
    border-radius: 16px;
    border: none;
    cursor: pointer;
    padding: 9px 22px;
}

.button--icon {
    width: 65px;
    height: 40px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 16px;
    border: none;
    cursor: pointer;

    img {
        width: 20px;
        height: 20px;
        filter: brightness(10);
    }
}

.button--publish {
    margin-top: 40px;
    padding: 8px 24px;
    font-size: 18px;
    font-weight: 600;
    background: #262060;
    color: #fff;
    line-height: normal;
    width: 100%;
    max-width: 312px;
    position: relative;
    overflow: hidden;
    transition:
        background 0.3s,
        color 0.3s,
        border 0.3s;

    .publish-label {
        position: relative;
        z-index: 1;
        color: #fff;
    }

    // Прогресс-бар режим
    &.button--publishing {
        background: transparent;
        border: 2px solid #262060;
        color: #262060;
        cursor: not-allowed;

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: var(--progress, 0%);
            background: #262060;
            transition: width 0.4s ease;
        }
    }
}
</style>
