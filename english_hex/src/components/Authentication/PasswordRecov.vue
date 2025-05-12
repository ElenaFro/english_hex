<template>
    <div class="main-container">
        <div class="content-container"></div>
        <p class="content-container__title">Восстановление пароля</p>
        <form action="" class="login-form">
            <input type="email" 
            placeholder="Укажите Email привязанный к аккаунту" 
            class="login-form__input-field"
            >
            <button class="button button--purple button--big" 
            @click="$emit('change-component', 'PasswordRecovConfirm')"
            >
            Продолжить
            </button>
            <button class="login-form__link" 
            @click="$emit('change-component', 'LoginForm')"
            >
            Вернуться обратно
            </button>
        </form>
    </div>
</template>

<script setup>

</script>

<style scoped>
.login-form__input-field {
    margin-bottom: 12px;
}

.button {
	margin-bottom: 24px;
}
</style>