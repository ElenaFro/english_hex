<template>
    <div class="page-content" :class="{ lesson_padding: activeComponent.__name === 'LessonsPage' }">
        <div :class="{ bg_image: activeComponent.__name === 'LessonsPage' }">
            <component :is="activeComponent" @switch-component="switchComponent" />
        </div>
        <Popup />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import StartLerning from '../components/Learning/StartLerning.vue';
import LessonsPage from '../components/Learning/LessonsPage.vue';
import Popup from '../components/popups/defaultPopup.vue';

const activeComponent = ref(StartLerning);

function switchComponent() {
    activeComponent.value = LessonsPage;
}
</script>

<style scoped>
.page-content {
    padding-top: 28px;
    padding-bottom: 35px;
}
.lesson_padding {
    padding: 26px 0;
}

.bg_image {
    width: 100%;
    background-image: url('@/assets/lesson/lesson_card_bg.svg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    max-height: 430px;
    z-index: 100;
}
</style>
