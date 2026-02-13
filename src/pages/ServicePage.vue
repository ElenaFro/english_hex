<template>
    <div class="main-container">
        <div class="content-container">
            <img src="@/assets/Di_avatar/girl_service.webp" alt="Di" class="avatar" />
            <div class="service-dialog">
                <h1 class="service-dialog__title">Упс</h1>
                <p class="service-dialog__subtitle">
                    Пока вы это читаете, мы делаем сервис удобнее. Ждите обновлений — они уже в
                    пути.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup></script>

<style scoped lang="scss">
.service-dialog {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #fff;
    border-radius: 20px;
    width: 326px;
    height: 171px;
    padding: 32px 18px 18px;

    &__subtitle {
        font-weight: 400;
        font-size: 18px;
        line-height: 120%;
    }

    &__title {
        text-align: center;
        color: #311d5d;
        font-weight: 700;
        font-size: 22px;
    }
}

.avatar {
    position: absolute;
    top: -226px;
}
</style>
