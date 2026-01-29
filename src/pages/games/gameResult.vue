<template>
    <loader v-if="loading" />
    <div v-else class="page-content">
        <div :class="wrong <= 5 ? 'img-container' : 'img-container-loss'">
            <img
                v-if="wrong <= 5"
                class="img-container__passed-img"
                src="@/assets/img/girl-img2.png"
                alt=""
            />
            <img v-else class="img-container__loss-img" src="@/assets/img/girl-lost.svg" alt="" />
        </div>
        <div class="result-popup">
            <h1 class="result-popup__header">{{ resultHeader }}</h1>
            <p class="result-popup__text">{{ resultText }}</p>
            <p class="result-popup__const-text">Награда:</p>
            <div class="stars-container">
                <p class="stars-container__prize">+{{ totalStars }}</p>
                <img
                    height="41px"
                    width="41px"
                    src="@/assets/img/star-img.svg"
                    alt=""
                    class="stars-container__stars-img"
                />
            </div>
            <div class="button-container">
                <button @click="repeatGame" v-if="showButton" class="button button--purple">
                    {{ buttonText }}
                    <img src="@/assets/img/arrow_icon.svg" />
                </button>
                <button @click="goToMainPage" class="button button--purple">
                    Дальше
                    <img src="@/assets/img/arrow_icon.svg" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
//vue
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Loader from '@/components/Loader.vue';
//stores
import { useUserStore } from '@/stores/user';
import { useCategoriesStore } from '@/stores/categories';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const wrong = Number(route.query.wrong);
const currentUser = useUserStore().user;
const headerPerfect = 'Превосходный результат!';
const textPerfect =
    'Все ответы верны. Внимание и визуальная память на отличном уровне. Так держать!';
const headerPassed = 'Задание выполнено';
const textPassed =
    'Были допущены небольшие ошибки - это часть процесса обучения. Продолжай в том же духе.';
const headerLoss = 'Задание не завершено';
const textLoss =
    'Не стоит расстраиваться - каждая ошибка приближает к успеху. Рекомендую повторить попытку.';
const textAllStarsGiven =
    'Вы заработали максимальное количество звезд по данной категории в этой игре';
const buttonText = ref('');
const buttonPassed = 'Пройти еще раз';
const buttonLoss = 'Попробовать еще раз';
const stars = ref(0);
const maxStarsForGame = ref(50);
const fromGame = route.query.from;
const gameSource = route.query.gameSource;

const categoryId = computed(() => route.query.id || useCategoriesStore().chosedCategory.id);

onMounted(async () => {
    loading.value = true;
    if (categoryId.value) {
        const currentStarsForCategory = await useCategoriesStore().getCategoryStars(
            categoryId.value
        );
        const currentStars = maxStarsForGame.value - currentStarsForCategory?.[gameSource];
        maxStarsForGame.value = currentStars < 0 ? 0 : currentStars;
    }
    loading.value = false;
});

const resultHeader = computed(() => {
    if (wrong <= 2) {
        return headerPerfect;
    }
    if (wrong <= 5) {
        return headerPassed;
    } else {
        return headerLoss;
    }
});

const resultText = computed(() => {
    if (maxStarsForGame.value === 0) return textAllStarsGiven;
    if (wrong <= 2) {
        return textPerfect;
    }
    if (wrong <= 5) {
        return textPassed;
    } else {
        return textLoss;
    }
});

const showButton = computed(() => {
    if (maxStarsForGame.value === 0) return false;
    if (wrong <= 4 && wrong !== 0) {
        buttonText.value = buttonPassed;
        return true;
    }
    if (wrong > 4) {
        buttonText.value = buttonLoss;
        return true;
    } else {
        return false;
    }
});

const totalStars = computed(() => {
    const stars = 50 - 5 * wrong;
    return stars <= maxStarsForGame.value ? stars : maxStarsForGame.value;
});

const repeatGame = () => {
    router.push({ name: fromGame, query: { startGame: true } });
};

const goToMainPage = () => {
    if (totalStars.value <= 0)
        return router.push({
            name: 'games',
            query: { id: useCategoriesStore().chosedCategory?.id },
        });
    router.push({
        name: 'myPlanet',
        query: { earnedStars: totalStars.value, gameSource: gameSource },
    });
};
</script>

<style scoped lang="scss">
.page-content {
    background-color: transparent;
    align-items: center;

    .img-container {
        position: absolute;
        z-index: 200;

        &__passed-img {
            width: 204px;
            height: 204px;
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translate(-50%);
        }

        &__loss-img {
            width: 274px;
            height: 411px;
            position: fixed;
            top: 0px;
            left: 50%;
            transform: translate(-50%);
            z-index: 2000;
        }
    }

    .img-container-loss {
        z-index: 0;
    }

    .result-popup {
        position: relative;
        width: 326px;
        height: 422px;
        background-color: #ffffff;
        border-radius: 20px;
        padding: 39px 18px 34px;
        margin-top: 30px;
        display: flex;
        flex-direction: column;
        z-index: 100;

        &__header {
            font-size: 22px;
            font-weight: 700;
            line-height: 120%;
            margin-bottom: 12px;
            text-align: center;
            color: #311d5d;
        }

        &__text {
            font-size: 18px;
            font-weight: 400;
            line-height: 120%;
            color: #262060;
            margin-bottom: 12px;
        }

        &__const-text {
            font-size: 22px;
            font-weight: 700;
            line-height: 120%;
            color: #311d5d;
            margin-bottom: 12px;
        }

        .stars-container {
            display: flex;
            align-items: center;
            gap: 3px;
            margin-bottom: 30px;

            &__prize {
                font-size: 40px;
                font-weight: 800;
                line-height: 100%;
                color: #311d5d;
            }
        }

        .button-container {
            display: flex;
            flex-direction: column;
            gap: 12px;

            .button {
                gap: 12px;
            }
        }
    }
}
</style>
