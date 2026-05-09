<template>
    <teleport to="body">
        <div v-if="isVisible" class="achievement-overlay">
            <div class="achievement-card">
                <h2 class="achievement-card__title">{{ achievement.title }}</h2>
                <p class="achievement-card__desc">{{ achievement.description }}</p>
                <button class="achievement-card__btn" @click="emit('close')">Продолжить</button>
                <img
                    class="achievement-card__girl"
                    src="@/assets/Di_avatar/girl_with_keychain.webp"
                    alt=""
                />
            </div>
        </div>
    </teleport>
</template>

<script setup>
defineProps({
    isVisible: { type: Boolean, default: false },
    achievement: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['close']);
</script>

<style scoped>
.achievement-overlay {
    position: fixed;
    z-index: 298;
    display: flex;
    align-items: flex-end;
    justify-content: center;
}

.achievement-card {
    position: relative;
    background: #fff;
    border-radius: 20px;
    padding: 20px 12px;
    width: 100%;
    max-width: 317px;
    overflow: visible;
    margin-top: 10dvh;
}

.achievement-card__title {
    font-size: 22px;
    font-weight: 700;
    color: #311d5d;
    margin: 0 0 12px;
    text-align: center;
    line-height: 1.2;
}

.achievement-card__desc {
    font-size: 18px;
    font-weight: 400;
    color: #311d5d;
    line-height: 120%;
    margin: 0 0 24px;
}

.achievement-card__btn {
    background: #262060;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    border: none;
    border-radius: 16px;
    padding: 9px 24px;
    cursor: pointer;
    transition: opacity 0.2s;
}

.achievement-card__btn:active {
    opacity: 0.8;
}

.achievement-card__girl {
    position: absolute;
    right: min(-1dvw, -20px);
    top: min(16dvh, 140px);
    width: min(51dvw, 170px);
    pointer-events: none;
}
</style>
