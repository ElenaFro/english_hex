<template>
    <button :type="type" :disabled="isDisabled" :aria-busy="loading" @click="handleClick">
        <Loader v-if="loading" :size="loaderSize" :spinner-color="loaderColor" />
        <span v-else class="flex">
            <p :class="labelClass">{{ label }}</p>
            <img v-if="icon" :src="icon" alt="" class="base-button__icon" />
        </span>
    </button>
</template>

<script setup>
import { computed } from 'vue';
import Loader from '@/shared/components/Loader.vue';

const props = defineProps({
    type: {
        type: String,
        default: 'button',
    },
    label: {
        type: String,
        default: 'Продолжить',
    },
    loading: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    loaderSize: {
        type: Number,
        default: 20,
    },
    loaderColor: {
        type: String,
        default: '#FCB258',
    },
    labelClass: {
        type: String,
        default: '',
    },
    icon: {
        type: String,
        default: null,
    },
});

const emit = defineEmits(['click']);

const isDisabled = computed(() => props.disabled || props.loading);

const handleClick = (event) => {
    if (isDisabled.value) return;
    emit('click', event);
};
</script>
<style scoped lang="scss">
.base-button {
    &__icon {
        margin-left: 10px;
    }
}
</style>
