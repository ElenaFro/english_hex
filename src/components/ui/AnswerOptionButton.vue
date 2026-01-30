<template>
    <button
        type="button"
        class="answer-option"
        :class="[
            sizeClass,
            state === 'wrong' ? 'answer-option--wrong' : '',
            state === 'correct' ? 'answer-option--correct' : '',
        ]"
        :disabled="disabled"
        @click="$emit('click')"
    >
        <slot />
    </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    state: {
        type: String,
        default: 'default',
        validator: (v) => ['default', 'wrong', 'correct'].includes(v),
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: 'md',
        validator: (v) => ['sm', 'md'].includes(v),
    },
});

defineEmits(['click']);

const sizeClass = computed(() => (props.size === 'sm' ? 'answer-option--sm' : 'answer-option--md'));
</script>

<style scoped lang="scss">
.answer-option {
    width: 100%;
    border-radius: 16px;
    font-weight: 700;
    border: 2px solid #262060;
    background-color: #ffffff;
    color: #262060;
    cursor: pointer;

    &:disabled {
        cursor: default;
        opacity: 1; // keep identical visual style across browsers
    }
}

.answer-option--sm {
    height: 40px;
    padding: 8px 14px;
    font-size: 16px;
    line-height: 1.2;
}

.answer-option--md {
    height: 44px;
    padding: min(2dvh, 8px) min(10dvw, 24px);
    font-size: 18px;
    line-height: 1.2;
}

.answer-option--wrong {
    border: 0;
    background-color: #881717;
    color: #ffffff;
}

.answer-option--correct {
    border: 0;
    background-color: #31af40;
    color: #ffffff;
}
</style>

