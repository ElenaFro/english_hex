<template>
    <section class="page-container d-pa-30">
        <section class="page-container__header">
            <p>Поздравляю!</p>
            <p>{{ headerTopic }}</p>
        </section>
        <section class="page-container__message">
            <p>{{ message }}</p>
        </section>
        <section class="page-container__game-list">
            <div v-for="item in gameList" :key="item.id" class="page-container__game-card">
                <p>{{ item.name }}</p>
                <button class="page-container__game-card-btn" @click="goToGame(item)">Начать</button>
            </div>
        </section>
        <section class="mainPageResirect-section">
            <button class="action-button" @click="openPopup = true">Вернуться на главную</button>
        </section>
    </section>

    <defaultPopup :isVisible="openPopup" :title="popupTitle" :message="popupMessage" @confirm="redirectToMain"
        @close="openPopup = false" />
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import defaultPopup from '@/components/popups/defaultPopup.vue';

const router = useRouter();

const openPopup = ref(false)
const headerTopic = 'Ты изучил тему «Животные»';
const message = 'Чтобы закрепить полученые знания — выбирай игру и продолжай покорять английский без потерь'

const popupTitle = ' Уже уходите?';
const popupMessage = 'Вы завершили обучение «Животные», вам будут начислены 20 звезд, если вы не хотите увеличить награду подтвердите выбор, если хотите поднять рейтинг вернитесь к игре!';

const gameList = ref([
    {
        id: 1,
        name: 'Атака планеты',
        path: 'planetGame',
    },
    {
        id: 2,
        name: 'Созвездие слов',
        path: 'constellationGame',
    },
    {
        id: 3,
        name: 'Мерцание слов',
        path: 'flickerGame',
    }
])
const goToGame = (item) => {
    router.push({ name: item.path })
}

const redirectToMain = () => {
    router.push({ name: 'mainPage' })
}
</script>
<style scoped lang="scss">
.page-container {
    overflow: auto;

    &__header {
        display: flex;
        flex-direction: column;
        width: 100%;
        font-size: 24px;
        font-weight: 700;
        line-height: 140%;
        text-align: start;
        color: #311D5D;
        margin-bottom: 8px;

        p {
            margin-bottom: 0;
        }
    }

    &__message {
        font-size: 20px;
        font-weight: 400;
        line-height: 120%;
        color: #262060;
        margin-bottom: 20px;
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

.mainPageResirect-section {
    display: flex;
    justify-content: start;
    align-self: start;
    padding-bottom: 200px;
}
</style>
