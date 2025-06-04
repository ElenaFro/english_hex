<template>
    <div class="main-container">
        <div class="content-container">
            <div class="authorization-toggle">
                <button class="authorization-toggle__select-button" :class="{ active: mode === 'login' }"
                    @click="switchToLogin">
                    Вход
                </button>
                <button class="authorization-toggle__select-button" :class="{ active: mode === 'register' }"
                    @click="$emit('change-component', 'RegistForm')">
                    Регистрация
                </button>
            </div>

            <div v-if="step === 'email'" class="login-form">
                <p class="content-container__title">Укажи свой email</p>
                <input ref="emailInput" v-model="email" type="email" placeholder="Начните ввод" :class="{
                    'login-form__input-field': true,
                    'login-form__input-field--error': inputError
                }" />
                <button @click="emailVerif" class="button button--purple button--big">Продолжить</button>
                <button class="login-form__link" @click="$emit('change-component', 'PasswordRecov')">Забыли
                    пароль?</button>
            </div>

            <div v-if="step === 'password'" class="login-form">
                <p class="content-container__title">Укажи свой пароль</p>
                <input v-model="password" type="password" placeholder="Начните ввод" :class="{
                    'login-form__input-field': true,
                    'login-form__input-field--error': inputError
                }" />
                <button class="button button--purple button--big" @click="login">Войти</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const step = ref('email')
const email = ref('')
const password = ref('')
const mode = ref('login')
const inputError = ref(false)

const switchToLogin = () => {
    step.value = 'email'
    mode.value = 'login'
}

const emailVerif = () => {
    inputError.value = false
    step.value = 'password'
}

const login = async () => {
    await useAuthStore().login(email.value, password.value).then(
        await useAuthStore().fetchUser()
    );
}
</script>

<style scoped>
.login-form__input-field {
    margin-bottom: 12px;
}

.button {
    margin-bottom: 24px;
}
</style>