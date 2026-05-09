<template>
    <div class="result-page">
        <div class="result-outer">
            <img
                src="@/assets/Di_avatar/girl-img2.webp"
                alt=""
                class="result-avatar"
                aria-hidden="true"
            />
            <div class="result-card">
                <h1 class="result-card__title">Поздравляю!</h1>
                <p class="result-card__text">
                    Подписка активирована! Теперь тебе доступны все категории и игры.
                </p>
                <button
                    class="result-card__btn"
                    type="button"
                    @click="router.push({ name: 'mainPage' })"
                >
                    Начать изучение
                    <img src="@/assets/img/arrow_icon.svg" alt="" aria-hidden="true" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useSubscriptionStore } from '@/stores/subscription';

const router = useRouter();
useSubscriptionStore().invalidate(); // сбрасываем кеш — подписка стала активной
</script>

<style scoped lang="scss">
.result-page {
    flex: 1;
    width: 100vw;
    max-width: 414px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    overflow: hidden;
}

.result-outer {
    position: relative;
    width: 100%;
}

.result-avatar {
    position: absolute;
    top: -140px;
    left: 50%;
    transform: translateX(-50%);
    width: 170px;
    height: auto;
    z-index: 1;
}

.result-card {
    position: relative;
    background: #ffffff;
    border-radius: 20px;
    padding: 32px 18px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
    box-sizing: border-box;

    &__title {
        margin: 0;
        font-size: 22px;
        font-weight: 700;
        color: #311d5d;
        line-height: 1.2;
        align-self: center;
    }

    &__text {
        margin: 0;
        font-size: 18px;
        font-weight: 400;
        color: #311d5d;
        line-height: 1.4;
    }

    &__btn {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 30px;
        background: #262060;
        border: none;
        border-radius: 16px;
        color: #ffffff;
        font-size: 18px;
        font-weight: 600;
        line-height: 1.2;
        font-family: Mulish, sans-serif;
        padding: 9px 24px;
        cursor: pointer;
        transition: opacity 0.15s;

        img {
            width: 20px;
            height: auto;
            color: #ffffff;
        }

        &:hover {
            opacity: 0.9;
        }
    }
}
</style>
