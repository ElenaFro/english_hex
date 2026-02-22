<template>
    <teleport to="body">
        <div v-if="isVisible" class="popup-overlay" @click.self="closePopup">
            <div class="popup-card">
                <h2 class="popup-title">Выбери чем заселить планету</h2>
                <p class="popup-subtitle">
                    Учти, что выбор нельзя будет поменять после подтверждения
                </p>

                <div class="popup-price">
                    <span>{{ starsCost }}</span>
                    <img src="@/assets/icons/yelow_star.svg" alt="star" />
                </div>

                <div class="planet-options">
                    <button
                        v-for="(planet, index) in planetImages"
                        :key="`planet-${index}`"
                        type="button"
                        class="planet-option"
                        :class="{ active: selectedIndex === index }"
                        @click="selectedIndex = index"
                    >
                        <img :src="planet" alt="planet" />
                    </button>
                </div>

                <button type="button" class="confirm-button" @click="confirmSelection">
                    <span class="text-white">Установить</span>
                    <img src="@/assets/icons/arrow_right.svg" alt="arrow" />
                </button>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    isVisible: {
        type: Boolean,
        default: false,
    },
    starsCost: {
        type: Number,
        default: 0,
    },
    planetImages: {
        type: Array,
        default: () => [],
    },
    initialSelectedIndex: {
        type: Number,
        default: 0,
    },
});

const emit = defineEmits(['close', 'confirm']);
const selectedIndex = ref(props.initialSelectedIndex);

watch(
    () => props.initialSelectedIndex,
    (value) => {
        selectedIndex.value = value;
    }
);

watch(
    () => props.isVisible,
    (isVisible) => {
        if (isVisible) selectedIndex.value = props.initialSelectedIndex;
    }
);

const closePopup = () => {
    emit('close');
};

const confirmSelection = () => {
    emit('confirm', {
        selectedIndex: selectedIndex.value,
        selectedImage: props.planetImages[selectedIndex.value] ?? null,
    });
};
</script>

<style scoped lang="scss">
.popup-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(2px);
    z-index: 1002;
}

.popup-card {
    width: 315px;
    max-width: calc(100vw - 20px);
    min-height: 343px;
    border-radius: 24px;
    background: #f3f1fb;
    padding: 28px 15px 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.popup-title {
    margin: 0 0 9px;
    color: #311d5d;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.2;
}

.popup-subtitle {
    margin: 0 0 9px;
    color: #2d2368;
    font-weight: 400;
    font-size: 18px;
    line-height: 1.2;
}

.popup-price {
    margin: 0 auto;
    margin-bottom: 9px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #2d2368;
    font-size: 20px;
    font-weight: 700;

    img {
        width: 25px;
        height: 25px;
    }
}

.planet-options {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 24px;
}

.planet-option {
    position: relative;
    height: 84px;
    border: 2px solid #262060;
    border-radius: 21px;
    background: #fff;
    overflow: hidden;
    cursor: pointer;

    img {
        position: absolute;
        width: 110%;
        left: 0;
        bottom: -46%;
    }

    &.active {
        border-color: green;
    }
}

.confirm-button {
    border: none;
    border-radius: 16px;
    background: #262060;
    color: #fff;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    padding: 9px 24px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;

    img {
        width: 24px;
        height: 24px;
    }
}
</style>
