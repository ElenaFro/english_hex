<template>
    <div v-if="isVisible" class="popup-overlay" @click.self="closePopup">
        <div class="popup-content">
            <button class="close-button" @click="closePopup">×</button>
            <h2 v-if="title" class="popup-title">{{ title }}</h2>
            <p v-if="message" class="popup-message">{{ message }}</p>
            <slot name="content"></slot>
            <div class="popup-actions">
                <slot name="actions">
                    <button v-if="cancelText" class="cancel-button" @click="closePopup">
                        {{ cancelText }}
                    </button>
                    <button v-if="confirmText" class="confirm-button" @click="confirmAction">
                        {{ confirmText }}
                    </button>
                </slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
    isVisible: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: "",
    },
    message: {
        type: String,
        default: "",
    },
    confirmText: {
        type: String,
        default: "Подтвердить",
    },
    cancelText: {
        type: String,
        default: "Отмена",
    },
});

const emit = defineEmits(["update:isVisible", "confirm", "close"]);

const localVisible = ref(props.isVisible);

watch(
    () => props.isVisible,
    (newValue) => {
        localVisible.value = newValue;
    }
);

const closePopup = () => {
    localVisible.value = false;
    emit("update:isVisible", false);
    emit("close");
};

const confirmAction = () => {
    emit("confirm");
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
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
}

.popup-content {
    background: #fff;
    border-radius: 20px;
    padding: 20px;
    padding-top: 46px;
    width: 90%;
    max-width: 315px;
    min-height: 186px;
    position: relative;
    color: #311d5d;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.popup-title {
    margin: 0 0 10px 0;
    font-size: 22px;
    font-weight: 700;
}

.popup-message {
    margin: 0 0 20px 0;
    font-size: 16px;
    font-weight: 400;
}

.close-button {
    position: absolute;
    top: -2px;
    right: 10px;
    background: none;
    border: none;
    font-size: 38px;
    color: #262060;
    cursor: pointer;
}

.popup-actions {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.confirm-button {
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

.cancel-button {
    padding: 12px 24px;
    border: 2px solid #262060;
    border-radius: 20px;
    background: transparent;
    color: #262060;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.cancel-button:hover {
    background-color: #f6f6fe;
}
</style>