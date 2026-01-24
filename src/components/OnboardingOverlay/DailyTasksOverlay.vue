<template>
    <teleport to="body">
        <div class="overlay">
            <div class="highlight" :style="highlightStyle"></div>

            <div class="tooltip">
                {{ text }}
                <button @click="$emit('close')">Понятно</button>
            </div>
        </div>
    </teleport>
</template>
<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    targetSelector: String,
    text: String,
});

const highlightStyle = ref({});

onMounted(() => {
    const el = document.querySelector(props.targetSelector);
    if (!el) return;

    const rect = el.getBoundingClientRect();

    highlightStyle.value = {
        top: rect.top + 'px',
        left: rect.left + 'px',
        width: rect.width + 'px',
        height: rect.height + 'px',
    };
});
</script>
<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
}

.highlight {
    position: absolute;
    border-radius: 20px;
    background: transparent;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6);
    border: 2px solid #ffc736;
    pointer-events: none;
}

.tooltip {
    position: fixed;
    left: 16px;
    right: 16px;
    bottom: 80px;
    background: #fff;
    color: #262060;
    padding: 16px;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 500;
}

.tooltip button {
    margin-top: 12px;
    width: 100%;
    height: 36px;
    border-radius: 12px;
    border: none;
    background: #6c63ff;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
}
</style>
