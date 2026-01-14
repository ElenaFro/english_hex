<template>
    <div v-if="isVisible" class="popup-overlay" @click.self="closePopup">
        <div class="popup-content" :class="popupPaddings" :style="paddingClass">
            <button class="close-button" @click="closePopup">×</button>
            <h2 v-if="title" class="popup-title" :class="titleClasses">{{ title }}</h2>
            <p v-if="message" class="popup-message" :class="messageClass">{{ message }}</p>
            <slot name="content"></slot>
            <div class="popup-actions">
                <slot name="actions">
                    <button v-if="confirmText" :loading="loading" class="confirm-button" @click="confirmAction">
                        <loader v-if="loading" size="20"/>
                        <span v-else>{{ confirmText }}</span>
                    </button>
                </slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import loader from '@/components/Loader.vue';

const props = defineProps({
    isVisible: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: '',
    },
    message: {
        type: String,
        default: '',
    },
    confirmText: {
        type: String,
        default: 'Продолжить',
    },
    paddingClass: {
        type: String,
        default: '',
    },
    titleLeft: {
        type: Boolean,
        default: false,
    },
    messageLeft: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:isVisible', 'confirm', 'close']);

const localVisible = ref(props.isVisible);

const titleClasses = computed(() => {
    const classes = {
        'd-mb-12': props.message,
        'd-mb-30': !props.message,
        textLeft: props.titleLeft,
    };
    return classes;
});

const messageClass = computed(() => (props.messageLeft ? 'textLeft' : ''));

const popupPaddings = computed(() => (!props.paddingClass ? 'defaultPaddings' : ''));

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
    backdrop-filter: blur(20px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.popup-content {
    background: #fff;
    border-radius: 20px;
    width: 90%;
    max-width: 315px;
    position: relative;
    color: #311d5d;
    text-align: center;
}

.defaultPaddings {
    padding: 20px;
    padding-top: 46px;
    padding-bottom: 35px;
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
    min-width: 161px;
}

.confirm-button:hover {
    background-color: #262567;
}

.textLeft {
    text-align: left;
}
</style>
