<template>
    <div class="main-container">
        <div class="content-container">
            <section v-if="!loading">
                <div class="authorization-toggle">
                    <button class="authorization-toggle__select-button" :class="{ active: mode === 'login' }"
                        @click="$emit('change-component', 'LoginForm')">
                        Вход
                    </button>
                    <button class="authorization-toggle__select-button" :class="{ active: mode === 'register' }"
                        @click="switchToRegist">
                        Регистрация
                    </button>
                </div>
                <p class="content-container__title">{{ titleText }}</p>
                <section v-if="!confirmEmailSend">
                    <form class="login-form" @submit.prevent="formValidator">
                        <input v-model="nick" type="text" placeholder="Ник" :class="{
                            'login-form__input-field': true,
                            'login-form__input-field--error': nickError
                        }" />
                        <p v-if="nickError" class="login-form__error-text">Поле заполнено некорректно</p>
                        <input v-model="email" type="email" placeholder="email" :class="{
                            'login-form__input-field': true,
                            'login-form__input-field--error': emailError
                        }" />
                        <p v-if="emailError" class="login-form__error-text">Поле заполнено некорректно</p>
                        <div class="login-form__input-container">
                            <input v-model="password" placeholder="Пароль" :type="showPassword ? 'text' : 'password'"
                                :class="{
                                    'login-form__input-field': true,
                                    'login-form__input-field--error': passwordError
                                }" />
                            <button type="button" class="show-password-button" @click="togglePassword">
                                <img class="show-password-button__visibility"
                                    :src="showPassword ? visibilityIcon : visibilityOffIcon" alt="">
                            </button>
                        </div>
                        <p v-if="passwordError" class="login-form__error-text">Поле заполнено некорректно</p>
                        <div class="agreement-container">
                            <button :class="{
                                'agreement-container__link': true,
                                'agreement-container__link--visited': checkVisited
                            }" @click=handleClick>
                                Политика конфиденциальности
                            </button>
                            <button class="agreement-container__link" @click="$emit('change-component', 'UserAgreem')">
                                Пользовательское соглашение
                            </button>
                            <label class="agreement-container__agreement-checkbox">
                                <input type="checkbox" v-model="agreementCheckbox">
                                <span class="checkbox"></span>
                                <span class="text">
                                    Я подтверждаю, что ознакомлен и согласен c политикой конфиденциальности и
                                    пользовательским
                                    соглашением
                                </span>
                            </label>
                        </div>
                        <button type="submit" class="button button--purple button--big">
                            Зарегистрироваться
                        </button>
                    </form>
                </section>
                <section v-else class="confirmText">
                    {{ confirmText }}
                </section>
            </section>

            <loader v-if="loading" />

        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import visibilityIcon from '@/assets/img/visibility_icon.svg'
import visibilityOffIcon from '@/assets/img/visibility_off_icon.svg'
import { useAuthStore } from '../../stores/auth'
import loader from '../loader.vue'

const nick = ref('')
const email = ref('')
const password = ref('')
const nickError = ref(false)
const emailError = ref(false)
const passwordError = ref(false)
const showPassword = ref(false)
const agreementCheckbox = ref(false)
const checkVisited = ref(false)
const confirmEmailSend = ref(false)
const loading = ref(false)
const mode = ref('register')
const emit = defineEmits(['change-component'])

const togglePassword = () => {
    showPassword.value = !showPassword.value
}

const handleClick = () => {
    checkVisited.value = true
    emit('change-component', 'PrivacyPolicy')
}

const confirmText = 'На указанный email будет отправлена ссылка для подтверждения регистрации — перейдите по ней, чтобы завершить процесс.'

const switchToRegist = () => {
    mode.value = 'register'
}

const titleText = computed(() => confirmEmailSend.value ? 'Подтверждение регистрации' : 'Заполните данные')

const formValidator = () => {
    const symbols = /[A-Za-z0-9]/
    const invalidSymbols = /[<>{}()[],;:\/"*[/]]/

    if (!nick.value.trim()) {
        nickError.value = true
    } else {
        nickError.value = false
    }

    if (!email.value.trim()) {
        emailError.value = true
        return
    } if (email.value.length < 8 || email.value.length > 30) {
        emailError.value = true
        return
    } if (email.value.includes(' ')) {
        emailError.value = true
        return
    } if (invalidSymbols.test(email.value)) {
        emailError.value = true
        return
    } if (!email.value.includes('@')) {
        emailError.value = true
        return
    } if (!symbols.test(email.value)) {
        emailError.value = true
        return
    } else {
        emailError.value = false
    }

    if (!password.value.trim()) {
        passwordError.value = true
        return
    } if (password.value.length < 8 || password.value.length > 30) {
        passwordError.value = true
        return
    } if (password.value.includes(' ')) {
        passwordError.value = true
        return
    } if (!symbols.test(password.value)) {
        passwordError.value = true
        return
    } else {
        passwordError.value = false
    }

    if (!passwordError.value && !emailError.value && !nickError.value && agreementCheckbox.value) {
        login();
    }
}

async function login() {
    loading.value = true;
    await useAuthStore().register(nick.value, email.value, password.value, agreementCheckbox.value).then((response) => {
        if (response?.message) {
            response?.message?.includes('send to email') ? confirmEmailSend.value = true : alert('Что то пошло не так, попробуйте еще раз')
        }
    }).catch((error) => alert(error))
    loading.value = false;
}
</script>

<style scoped>
.button {
    font-weight: 400;
}

.confirmText {
    font-size: 16px;
    font-weight: 400;
    color: #262060;
    width: 100%;
    max-height: 140px;
    background-color: #F8F5FF;
    padding: 20px 25px;
    border-radius: 20px;
    line-height: 100%;
}
</style>