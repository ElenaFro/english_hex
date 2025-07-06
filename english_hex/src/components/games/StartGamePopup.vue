<template>
    <section class="page-container d-pa-30">
        <section class="page-container__header">
            <p class="page-container__header_game">{{ title }}</p>
            <p class="page-container__subtitle_game">{{ subtitle }}</p>
            <p class="page-container__message">{{ message }}</p>
            <button class="action-button" @click="start">Начать</button>

        </section>
        <section class="image-section">
            <div class="image-container">
                <img src="@/assets/Di_avatar/girl_head.png" alt="girl" class="girl">
            </div>
        </section>
    </section>

</template>
<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    message: { type: String, default: '' },
    routerPath: { type: String, default: '' },

})

const emit = defineEmits(['start'])

const router = useRouter();

const start = () => {
    emit('start')
};

</script>
<style scoped lang="scss">
.page-container {
    overflow: visible;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100dvh;

    &__header_game {
        display: flex;
        flex-direction: column;
        width: 100%;
        font-size: 26px;
        font-weight: 800;
        line-height: 100%;
        text-align: start;
        color: #311D5D;
        margin-bottom: 24px;
        margin-top: 16px;
        letter-spacing: 0%;
        text-align: center;

        p {
            margin-bottom: 0;
        }
    }

    &__subtitle_game {
        font-weight: 800;
        font-size: 22px;
        line-height: 100%;
        letter-spacing: 0%;
        font-family: Mulish;
        text-align: center;
        color: #311D5D;
        margin-top: 12px;
        margin-bottom: 20px;
    }

    &__message {
        font-weight: 500;
        font-size: 24px;
        line-height: 100%;
        letter-spacing: 0%;

        color: #262060;
        margin-bottom: 30px;
    }

    &__game-list {
        display: flex;
        flex-direction: column;
        row-gap: 15px;
        width: 100%;
        margin-bottom: 25px;
    }

    &__game-card {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 16px;
        background-color: #262060;
        color: #fff;
        border-radius: 20px;
        align-items: center;

        p {
            margin-bottom: 0;
            font-size: 20px;
            font-weight: 700;
            line-height: 100%;
        }
    }

    &__game-card-btn {
        background-color: #fff;
        border-radius: 16px;
        padding: 4px 22px;
        height: 35px;
        font-size: 18px;
        font-weight: 600;
        line-height: 120%;
        color: black;
    }
}

.image-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: end;
}

.image-section {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: end;
    margin-right: 20px;
    margin-bottom: 64px;
}

.action-button {
    width: 107px !important;
    padding: 9px 24px;
    line-height: 22px;
}
</style>
