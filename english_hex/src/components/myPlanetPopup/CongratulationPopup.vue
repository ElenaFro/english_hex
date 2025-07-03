<template>
    <div class="popup-overlay">
        <div class="popup-content">
            <div class="image-container">
                <img src="@/assets/Di_avatar/girl_head.png" alt="girl" class="girl" />
            </div>
            <h2 class="popup-title" :class="titleMargin">Поздравляю!</h2>
            <p class="popup-message">Вы успешно завершили первую колоду. Теперь вы можете создать свою планету и продвигать её, зарабатывая звезды в каждой игре!</p>
            <slot name="content"></slot>
            <div class="popup-actions">
                <slot name="actions">
                    <button class="confirm-button" @click="goToNext">
                        Дальше <img src="@/assets/icons/arrow_right.svg" alt="arrow_right">
                    </button>
                </slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    isVisible: { type: Boolean, default: false },
    title: { type: String, default: '' },
    message: { type: String, default: '' },
});

const emit = defineEmits([ "next" ]);

const goToNext = () => {
	emit('next', 'toPlanet')
}

const titleMargin = computed(() => (props.message ? 'd-mb-12' : 'd-mb-30'));

</script>

<style scoped>
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.popup-content {
    background: #fff;
    border-radius: 20px;
    padding: 20px;
    padding-top: 32px;
    padding-bottom: 35px;
    width: 90%;
    max-width: 315px;
    position: relative;
    color: #311d5d;
    text-align: center;
}

.popup-title {
    font-size: 22px;
    font-weight: 700;
}

.popup-message {
    font-size: 18px;
    font-weight: 400;
    line-height: 120%;
    text-align: left;
    margin-bottom: 30px;
}

.confirm-button {
    display: flex;
    gap: 12px;
    padding: 12px 24px;
    border: none;
    border-radius: 20px;
    background: #262060;
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.confirm-button:hover {
    background-color: #262567;
}

.image-container {
    position: absolute;
    top: -160px;
    left: 20%;
}
</style>
