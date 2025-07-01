<template>
    <div v-if="isVisible" class="popup-overlay" @click.self="closePopup">
        <div class="popup-content">
            <div class="image-container">
                <img src="@/assets/Di_avatar/girl_head.png" alt="girl" class="girl" />
            </div>
            <h2 v-if="title" class="popup-title" :class="titleMargin">{{ title }}</h2>
            <p v-if="message" class="popup-message">{{ message }}</p>
            <slot name="content"></slot>
            <div class="popup-actions">
                <slot name="actions">
                    <button class="confirm-button" @click="confirmAction">
                        Дальше <img src="@/assets/icons/arrow_right.svg" alt="arrow_right" />
                    </button>
                </slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
    isVisible: { type: Boolean, default: false },
    title: { type: String, default: '' },
    message: { type: String, default: '' },
});

const emit = defineEmits(['update:isVisible', 'confirm', 'close']);

const localVisible = ref(props.isVisible);

const titleMargin = computed(() => (props.message ? 'd-mb-12' : 'd-mb-30'));

watch(
    () => props.isVisible,
    (newValue) => {
        localVisible.value = newValue;
    }
);

const closePopup = () => {
    localVisible.value = false;
    emit('update:isVisible', false);
    emit('close');
};

const confirmAction = () => {
    emit('confirm');
    closePopup();
};
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
    text-align: center;
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
