<template>
    <div class="main-container">
        <div class="content-container">
            <div class="authorization-toggle">
                <button
                    class="authorization-toggle__select-button"
                    :class="{ active: mode === 'login' }"
                    @click="$emit('change-component', 'LoginForm')"
                >
                    Вход
                </button>
                <button
                    class="authorization-toggle__select-button"
                    :class="{ active: mode === 'register' }"
                    @click="switchToRegist"
                >
                    Регистрация
                </button>
            </div>
            <p class="content-container__title">Подтверждение регистрации</p>
            <div class="message-block message-block--shadow">
                <div class="message-block__text">
                    На указанный email будет отправлена ссылка для подтверждения регистрации —
                    перейдите по ней, чтобы завершить процесс.
                </div>
            </div>
        </div>
    </div>
</template>

<script setup></script>

<style scoped>
.message-block {
    padding: 19px 7px 26px 27px;
}

.message-block__text {
    font-size: 18px;
    font-weight: 500;
}
</style>
