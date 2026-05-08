<template>
    <div class="result-page">
        <div class="result-outer">
            <img
                src="@/assets/img/sad-girl-img.png"
                alt=""
                class="result-avatar"
                aria-hidden="true"
            />
            <div class="result-card">
                <h1 class="result-card__title">Что-то пошло не так</h1>
                <p class="result-card__text">
                    Оплата не прошла. Попробуй ещё раз или выбери другой способ оплаты.
                </p>
                <button
                    class="result-card__btn"
                    type="button"
                    @click="router.push({ name: 'subscriptionPro' })"
                >
                    Попробовать снова
                    <img src="@/assets/img/arrow_icon.svg" alt="" aria-hidden="true" />
                </button>
                <button
                    class="result-card__btn result-card__btn--outline"
                    type="button"
                    @click="router.push({ name: 'mainPage' })"
                >
                    На главную
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
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
    top: -170px;
    left: 50%;
    transform: translateX(-50%);
    width: 270px;
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
    z-index: 2;

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
        margin-top: 8px;
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
        box-sizing: border-box;

        img {
            width: 20px;
            height: auto;
        }

        &:hover {
            opacity: 0.9;
        }

        &--outline {
            background: transparent;
            border: 2px solid #262060;
            color: #262060;
            margin-top: 0;
            justify-content: center;

            &:hover {
                background: rgba(38, 32, 96, 0.05);
                opacity: 1;
            }
        }
    }
}
</style>
