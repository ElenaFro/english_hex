<template>
    <q-card class="auth-card q-pa-md">
        <q-card-section>
            <q-tabs v-model="mode" dense class="q-mb-md" active-color="purple" indicator-color="purple">
                <q-tab name="login" label="Вход" @click="emit('change-component', 'LoginForm')" />
                <q-tab name="register" label="Регистрация" @click="switchToRegist" />
            </q-tabs>

            <div class="text-h6 q-mb-md">Заполните данные</div>

            <q-form @submit="handleSubmit" class="q-gutter-md">
                <q-input v-model="nick" type="text" label="Ник" filled :error="nickError"
                    error-message="Поле заполнено некорректно" :rules="[val => !!val.trim() || 'Поле обязательно']" />
                <q-input v-model="email" type="email" label="Email" filled :error="emailError"
                    error-message="Поле заполнено некорректно" :rules="emailRules" />
                <q-input v-model="password" :type="showPassword ? 'text' : 'password'" label="Пароль" filled
                    :error="passwordError" error-message="Поле заполнено некорректно" :rules="passwordRules">
                    <template v-slot:append>
                        <q-icon :name="showPassword ? 'visibility' : 'visibility_off'" class="cursor-pointer"
                            @click="togglePassword" />
                    </template>
                </q-input>

                <div class="q-gutter-sm">
                    <q-btn flat :color="checkVisited ? 'grey' : 'purple'" label="Политика конфиденциальности"
                        @click="handleClick" />
                    <q-btn flat color="purple" label="Пользовательское соглашение"
                        @click="emit('change-component', 'UserAgreem')" />
                    <q-checkbox v-model="agreementCheckbox"
                        label="Я подтверждаю, что ознакомлен и согласен c политикой конфиденциальности и пользовательским соглашением" />
                </div>

                <q-btn type="submit" label="Зарегистрироваться" color="purple" unelevated class="full-width"
                    :disable="!agreementCheckbox" />
            </q-form>
        </q-card-section>
    </q-card>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['change-component'])

const nick = ref('')
const email = ref('')
const password = ref('')
const nickError = ref(false)
const emailError = ref(false)
const passwordError = ref(false)
const showPassword = ref(false)
const agreementCheckbox = ref(false)
const checkVisited = ref(false)
const mode = ref('register')

const togglePassword = () => {
    showPassword.value = !showPassword.value
}

const handleClick = () => {
    checkVisited.value = true
    emit('change-component', 'PrivacyPolicy')
}

const switchToRegist = () => {
    mode.value = 'register'
}

const emailRules = [
    val => !!val.trim() || 'Поле обязательно',
    val => (val.length >= 8 && val.length <= 30) || 'Длина от 8 до 30 символов',
    val => !val.includes(' ') || 'Пробелы не допускаются',
    // eslint-disable-next-line no-useless-escape
    val => !/[<>(){},;:\/"*[\]]/.test(val) || 'Недопустимые символы',
    val => val.includes('@') || 'Email должен содержать @',
    val => /[A-Za-z0-9]/.test(val) || 'Требуются латинские буквы или цифры'
]

const passwordRules = [
    val => !!val.trim() || 'Поле обязательно',
    val => (val.length >= 8 && val.length <= 30) || 'Длина от 8 до 30 символов',
    val => !val.includes(' ') || 'Пробелы не допускаются',
    val => /[A-Za-z0-9]/.test(val) || 'Требуются латинские буквы или цифры'
]

const handleSubmit = () => {
    if (!nickError.value && !emailError.value && !passwordError.value && agreementCheckbox.value) {
        console.log('Регистрация:', { nick: nick.value, email: email.value, password: password.value })
        emit('change-component', 'RegistConfirm')
    }
}
</script>

<style scoped>
.auth-card {
    width: 100%;
    max-width: 400px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.full-width {
    width: 100%;
}
</style>