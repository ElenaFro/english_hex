<template>
    <section class="page-container d-pa-30">
        <Loader v-if="loading" />
        <section v-else>
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
                    <button class="page-container__game-card-btn" @click="goToGame(item)">
                        Начать
                    </button>
                </div>
            </section>
            <section class="mainPageResirect-section">
                <button class="action-button" @click="goMainButton">Вернуться на главную</button>
            </section>
        </section>
    </section>

    <defaultPopup
        :isVisible="openPopup"
        :title="popupTitle"
        :message="popupMessage"
        @confirm="goToPlanet"
        @close="openPopup = false"
    />
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import defaultPopup from '@/components/popups/defaultPopup.vue';
import Loader from '@/components/Loader.vue';
import { useCategoriesStore } from '@/stores/categories';

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const hasEarnedStars = localStorage.getItem('earnedStars');
const category = ref(useCategoriesStore().chosedCategory);
onMounted(async () => {
    if (!category.value?.name) {
        await useCategoriesStore().getChosedCategory(route.query.id);
        category.value = useCategoriesStore().chosedCategory;
    }
    loading.value = false;
});

const openPopup = ref(false);
const headerTopic = computed(() => `Ты изучил тему ${category.value?.name}`);
const message =
    'Чтобы закрепить полученые знания — выбирай игру и продолжай покорять английский без потерь';

const popupTitle = ' Уже уходите?';
const popupMessage = computed(
    () =>
        `Вы завершили обучение ${category.value?.name}, вам будут начислены 20 звезд, если вы не хотите увеличить награду подтвердите выбор, если хотите поднять рейтинг вернитесь к игре!`
);

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
        path: 'wordTwinkle',
    },
]);
const goToGame = (item) => {
    router.push({ name: item.path, query: { id: category.value.id } });
};

const goToPlanet = () => {
    router.push({ name: 'myPlanet' });
};

const goMainButton = () => {
    if (hasEarnedStars) return (openPopup.value = true);
    router.push({ name: 'mainPage' });
};
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
        color: #311d5d;
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
        border: none;
        padding: 4px 22px;
        height: 35px;
        font-size: 18px;
        font-weight: 600;
        line-height: 120%;
        color: #262060;
    }
}

.mainPageResirect-section {
    display: flex;
    justify-content: flex-start;
    align-self: start;
    padding-bottom: 200px;
}
</style>
