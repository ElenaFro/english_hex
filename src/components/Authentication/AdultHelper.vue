<template>
    <div class="main-container adult-helper">
        <div class="adult-helper__inner">
            <img class="adult-helper__girl" src="@/assets/onboarding/di-adult-helper.png" alt="" />

            <div class="adult-helper__card">
                <div class="adult-helper__text">
                    <p class="adult-helper__title">Ди нужен взрослый</p>
                    <p class="adult-helper__description">
                        Позови маму, папу или другого помощника. Вместе вы сможете сохранить
                        планету.
                    </p>
                </div>
                <button
                    class="button button--purple adult-helper__button"
                    type="button"
                    @click="goToRegistration"
                >
                    Дальше
                    <img src="@/assets/img/arrow_icon.svg" alt="arrow" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['change-component']);

// Экран целиком клиентский: бэк про него не знает, next_step у него registration.
// Форму заполнит взрослый, поэтому «Дальше» ведёт на ту же регистрацию.
const goToRegistration = () => {
    emit('change-component', 'RegistForm');
};
</script>

<style scoped lang="scss">
// Геометрия и типографика — из макета, кадр 375×812:
// Ди 178×170 @ (105, 259), карточка 326×238 @ top 403.
.adult-helper {
    // Ди и карточка — одна композиция в потоке, центрированная по вертикали:
    // абсолютный `top` в процентах от высоты разводил их на высоком экране.
    &__inner {
        width: 100%;
        max-width: 420px;
        min-height: 100dvh;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        // В макете эта композиция стоит ниже центра кадра (Ди на 259 из 812).
        // Чистое центрирование подняло бы её на 43px, поэтому компенсируем
        // паддингом: 86.4px при ширине 375 — половина уходит в смещение вниз.
        padding-top: 23.04%;
    }

    &__girl {
        position: relative;
        margin-left: 28%;
        width: 47.5%;
        height: auto;
        z-index: 3;
    }

    &__card {
        position: relative;
        // Нахлёст карточки на Ди — 26.4px при ширине 375 (макет: низ Ди 429,
        // верх карточки 403). Процент считается от ШИРИНЫ, не от высоты.
        margin: -7.04% auto 0;
        z-index: 2;
        display: flex;
        flex-direction: column;
        gap: 30px;
        width: min(86.9%, calc(100% - 24px));
        padding: 34px 18px 32px;
        border-radius: 20px;
        background: #f8f5ff;
        overflow: hidden;
    }

    &__text {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
    }

    &__title {
        margin: 0;
        width: 100%;
        text-align: center;
        color: #311d5d;
        font-size: 20px;
        font-weight: 700;
        line-height: 1.2;
    }

    &__description {
        margin: 0;
        width: 100%;
        color: #262060;
        font-size: 18px;
        font-weight: 400;
        line-height: 1.2;
    }

    // Кнопка — глобальная .button--purple (#262060, radius 16, 18px/600), как в макете.
    &__button {
        align-self: flex-start;
        height: 40px;

        img {
            width: 23.5px;
        }
    }
}
</style>
