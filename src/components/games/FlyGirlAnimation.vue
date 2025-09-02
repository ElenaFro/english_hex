<template>
    <div class="popup-container">
        <div class="img-container">
            <div
                class="img-container__girl-container"
                :class="{ fly: isFlying }"
                @animationend="goToNextPage"
            >
                <img
                    :src="flyGirl"
                    alt="girl"
                    class="girl-img"
                    @load="onImageLoad"
                    @error="onImageError"
                />
            </div>
            <div class="img-container__planet-container">
                <img
                    class="planet-img"
                    :src="planet"
                    alt="planet"
                    @load="onImageLoad"
                    @error="onImageError"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import flyGirl from '@/assets/img/Games/fly_girl.svg';
import planet from '@/assets/img/planets/planet-img 1.png';

defineEmits(['start']);

const isFlying = ref(false);
const router = useRouter();
const route = useRoute();
const loadedCount = ref(0);

function onImageLoad() {
    loadedCount.value++;
    if (loadedCount.value >= 2) {
        setTimeout(() => {
            isFlying.value = true;
        }, 500);
    }
}

function onImageError(event) {
    console.error('Image failed to load:', event.target.src);
}

function goToNextPage() {
    if (route.query.name && route.query.id) {
        router.push({ name: route.query.name, query: { id: route.query.id, startGame: true } });
    } else {
        console.error('Missing route.query.name or route.query.id');
    }
}

onMounted(() => {
    const images = document.querySelectorAll('.img-container img');
    images.forEach((img) => {
        if (img.complete && img.naturalWidth !== 0) {
            onImageLoad();
        }
    });
});
</script>

<style scoped lang="scss">
html,
body,
#app {
    height: 100%;
    margin: 0;
}

.popup-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    position: relative;

    .img-container {
        position: relative;
        width: 100%;
        height: 100%;

        &__planet-container {
            width: 400px;
            height: 400px;
            position: absolute;
            bottom: -200px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;

            .planet-img {
                width: 100%;
                height: 100%;
                display: block;
            }
        }

        &__girl-container {
            width: 228px;
            height: 350px;
            position: absolute;
            bottom: 70px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1001;

            .girl-img {
                width: 100%;
                height: 100%;
                display: block;
            }

            &.fly {
                animation: flyAway 2s forwards ease-in;
            }
        }
    }

    .debug {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 1002;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 5px;
    }
}

@keyframes flyAway {
    0% {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
    100% {
        transform: translateX(-50%) translateY(-150vh);
        opacity: 0;
    }
}
</style>
