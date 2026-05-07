<template>
    <div class="page-content">
        <div class="scroll-container subscriptions-scroll">
            <article class="plan-card">
                <div class="plan-card__body">
                    <h2 class="plan-card__title">Базовая версия</h2>
                    <ul class="plan-card__features">
                        <li>4 категории карточек</li>
                        <li>Колода из 15 карточек</li>
                        <li>Без обновлений контента</li>
                        <li>Есть реклама</li>
                    </ul>
                </div>
                <div class="plan-card__footer">
                    <button class="plan-btn" type="button" @click="goToMain">Начать</button>
                </div>
            </article>

            <article class="plan-card plan-card--pro">
                <div class="plan-card__body">
                    <h2 class="plan-card__title">Продвинутая версия</h2>
                    <ul class="plan-card__features">
                        <li>12+ категорий</li>
                        <li>Колода из 40 карточек</li>
                        <li>Без рекламы</li>
                        <li>Новые карточки каждый месяц</li>
                        <li>Новые карточки каждый месяц</li>
                    </ul>
                </div>
                <div class="plan-card__footer">
                    <button class="plan-btn" type="button" @click="goToPro">Подробнее</button>
                </div>
            </article>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToMain = () => router.push({ name: 'mainPage' });
const goToPro = () => router.push({ name: 'subscriptionPro' });
</script>

<style scoped lang="scss">
.subscriptions-scroll {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 10px;
}

.plan-card {
    background: #262060;
    border-radius: 20px;
    padding: 20px 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    &__body {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    &__title {
        color: #ffffff;
        font-size: 20px;
        font-weight: 800;
        line-height: 1.2;
        margin: 0;
    }

    &__features {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;

        li {
            color: #ffffff;
            font-size: 16px;
            font-weight: 400;
            line-height: 1.4;
            padding-left: 18px;
            position: relative;

            &::before {
                content: '•';
                position: absolute;
                left: 0;
                color: #ffffff;
            }
        }
    }

    &__footer {
        display: flex;
        justify-content: flex-end;
    }
}

.plan-btn {
    background: transparent;
    border: 2px solid #ffffff;
    border-radius: 20px;
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    font-family: Mulish, sans-serif;
    padding: 8px 28px;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    &:active {
        background: rgba(255, 255, 255, 0.2);
    }
}
</style>
