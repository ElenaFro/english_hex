<template>
    <section class="page-container d-pa-30">
        <section class="page-container__header">
            <p class="page-container__header_game">Атака планеты</p>
            <p class="page-container__describe_game">{{ describeGame }}</p>
            <p class="page-container__message">{{ message }}</p>
            <button class="action-button" @click="goToGamePage">Начать</button>
        </section>
        <section class="image-section">
            <div class="image-container">
                <img src="@/assets/img/Games/метеор.png" alt="meteor" class="meteor" />
                <img src="@/assets/img/Games/Планета.png" alt="planet" class="planet" />
            </div>
        </section>
    </section>
</template>
<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const describeGame = 'Спасите планету от метеоритной атаки';
const message =
    'Отвечайте на вопросы правильно, чтобы остановить приближение метеорита. За каждую ошибку он подлетает ближе. 5 ошибок — и планета будет разрушена. Максимальная награда — 50 звёзд. За каждую ошибку вычитается 5 звёзд.';

const goToGamePage = () => {
    router.push({ name: 'planetAttackPage', query: { id: route.query.id } });
};
</script>
<style scoped lang="scss">
.page-container {
    overflow: visible;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &__header_game {
        display: flex;
        flex-direction: column;
        width: 100%;
        font-size: 26px;
        font-weight: 800;
        line-height: 100%;
        text-align: start;
        color: #311d5d;
        margin-bottom: 8px;
        margin-top: 16px;
        letter-spacing: 0%;
        text-align: center;
        p {
            margin-bottom: 0;
        }
    }
    &__describe_game {
        font-weight: 800;
        font-size: 22px;
        line-height: 100%;
        letter-spacing: 0%;
        font-family: Mulish;
        text-align: center;
        color: #311d5d;
        margin-top: 12px;
    }
    &__message {
        font-weight: 500;
        font-size: 18px;
        line-height: 100%;
        letter-spacing: 0%;

        color: #262060;
        margin-bottom: 30px;
        margin-top: 12px;
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
    align-items: center;
}

.meteor {
    position: absolute;
    right: -104px;
    top: 50%;
    transform: translateY(-140%);
}

.image-section {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding-bottom: 120px;
    flex: 1;
}

.action-button {
    width: 107px !important;
    padding: 9px 24px;
    line-height: 22px;
}
</style>
