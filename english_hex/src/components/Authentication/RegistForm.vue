<template>
    <div class="main-container">
        <div class="content-container">
            <div class="authorization-toggle">
                <button class="authorization-toggle__select-button" 
                :class="{ active: mode === 'login' }" 
                @click="$emit('change-component', 'LoginForm')"
                >
                    Вход
                </button>
                <button class="authorization-toggle__select-button" 
                :class="{ active: mode === 'register' }" 
                @click="switchToRegist"
                >
                    Регистрация
                </button>
            </div>
            <p class="content-container__title">Заполните данные</p>
            <form class="login-form" action="" @submit.prevent="passwordVerif">
                <input
                    v-model="nick"
                    type="text" 
                    placeholder="Ник"
                    :class="{
                        'login-form__input-field':true,
                        'login-form__input-field--error': inputError
                    }"
                />
                <input
                    v-model="email"
                    type="email" 
                    placeholder="email"
                    :class="{
                        'login-form__input-field':true,
                        'login-form__input-field--error': inputError
                    }"
                />
                <input  
                    v-model="password"
                    type="password" 
                    placeholder="Пароль"
                    :class="{
                        'login-form__input-field':true,
                        'login-form__input-field--error': inputError
                    }"
                />
                <div class="login-form__agreement-container">
                    <button class="login-form__link" 
                    @click="$emit('change-component', 'PrivacyPolicy')"
                    >
                    Политика конфиденциальности
                    </button>
                    <button class="login-form__link"
                    @click="$emit('change-component', 'UserAgreem')"
                    >
                    Пользовательское соглашение
                    </button>
                    <label class="login-form__agreement-checkbox">
                        <input type="checkbox">
                        <span class="checkbox"></span>
                        <span class="text">
                            Я подтверждаю, что ознакомлен и согласен c политикой конфиденциальности и пользовательским соглашением
                        </span>
                    </label>
                
                </div>
                <button 
                type="submit" 
                class="button button--purple button--big "
                >
                Зарегистрироваться
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const nick = ref('')
const email = ref('')
const password = ref('')
const inputError = ref(false)
const emit = defineEmits(['change-component'])

const emailVerif = () => {

}

const passwordVerif = () => {
    const symbols = /[A-Za-z0-9]/.test(password.value)
    const onlyLatin = /^[A-Za-z0-9]+$/.test(password.value)

    if (!password.value.trim()) {
    inputError.value = true
    alert('Поле заполнено некорректно')
    return
    } if (password.value.length < 8 || password.value.length > 30 ) {
        inputError.value = true
        alert('Пароль должен содержать от 8 до 30 символов')
        return
    } if (password.value.includes(' ')) {
        inputError.value = true
        alert('Пароль не должен содержать пробелов')
        return
    } if (!symbols) {
        inputError.value = true
        alert('Пароль должен содержать хотя бы одну латинскую букву или цифру')
        return
    } if (!onlyLatin) {
        inputError.value = true
        alert('Пароль может содержать только латинские буквы и цифры')
        return
    } else {
        inputError.value = false
        emit('change-component', 'RegistConfirm')
    }
}
</script>

<style scoped>
.login-form__agreement-container {
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-bottom: 25px;
    margin-top: 24px;
}

.login-form__link {
    font-size: 12px;
    font-weight: 400;
    line-height: 120%;
    letter-spacing: 0em;
    text-decoration: underline;
    color: rgba(255, 255, 255, 1);
}

.login-form__agreement-checkbox {
    margin-top: 10px;
    font-size: 10px;
    font-weight: 400;
    line-height: 100%;
    letter-spacing: 0em;
    color: rgba(38, 32, 96, 1);
    display: flex;
    align-items: center;
    gap: 22px;
    position: relative;
    user-select: none;
    -webkit-tap-highlight-color: transparent; /* убирает серую подсветку при нажатии */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

.login-form__agreement-checkbox input {
    opacity: 0;
    position: absolute;
    width: 18px;
    height: 18px;
    z-index: 100;
    margin: 0;
}

.checkbox {
    width: 18px;
    height: 18px;
    box-sizing: border-box;
    display: flex;
    flex-shrink: 0;
    border:2px solid rgba(38, 32, 96, 1);
    border-radius: 4px;
    background-color: rgb(255, 255, 255);
    position: relative;
}

.login-form__agreement-checkbox input:checked + .checkbox {
    background-color: rgba(38, 32, 96, 1);
}

.login-form__agreement-checkbox input:checked + .checkbox::after {
    content: '';
    position: relative;
    background: url('@/assets/img/check_mark.svg');
    background-repeat: no-repeat;
    background-size: cover;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 11px;
    height: 11px;
}
</style>