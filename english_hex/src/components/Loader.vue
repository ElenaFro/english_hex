<template>
    <div class="loader-overlay">
        <svg class="loader" :width="size" :height="size" :style="{ width: size + 'px', height: size + 'px' }">
            <circle class="loader-spinner" :cx="size / 2" :cy="size / 2" :r="radius" :stroke="spinnerColor"
                :stroke-width="strokeWidth" fill="none" stroke-linecap="round" :stroke-dasharray="dashArray"
                :stroke-dashoffset="dashOffset" />
        </svg>
        <slot>
            <span v-if="showText" class="loader-text">Загрузка...</span>
        </slot>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    size: {
        type: Number,
        default: 50,
    },
    spinnerColor: {
        type: String,
        default: "#FCB258",
    },
    strokeWidth: {
        type: Number,
        default: 4,
    },
    showText: {
        type: Boolean,
        default: false,
    },
});

const radius = computed(() => (props.size - props.strokeWidth) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const dashArray = computed(() => `${circumference.value * 0.75} ${circumference.value * 0.25}`);
const dashOffset = computed(() => circumference.value * 0.125); 
</script>

<style scoped>
.loader-overlay {
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 900;
    flex-direction: column;
    gap: 10px;
}

.loader {
    transform-origin: center;
    animation: spin 1.2s linear infinite;
}

.loader-text {
    color: #311d5d;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
}

.loader-spinner {
    stroke: v-bind(spinnerColor) !important;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>