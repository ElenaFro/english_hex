<template>
    <q-card class="auth-card q-pa-md">
        <q-card-section>
            <q-tabs v-model="mode" dense class="q-mb-md" active-color="purple" indicator-color="purple">
                <q-tab name="login" label="Вход" @click="switchToLogin" />
                <q-tab name="register" label="Регистрация" @click="$emit('change-component', 'RegistForm')" />
            </q-tabs>

            <q-form v-if="step === 'email'" class="q-gutter-md">
                <div class="text-subtitle1 q-mb-sm">Укажи свой email</div>
                <q-input v-model="email" type="email" label="Начните ввод" filled :error="inputError"
                    error-message="Некорректный email" required />
                <q-btn label="Продолжить" color="purple" unelevated class="full-width" @click="emailVerif" />
                <q-btn flat label="Забыли пароль?" color="purple" class="full-width"
                    @click="$emit('change-component', 'PasswordRecov')" />
            </q-form>

            <q-form v-if="step === 'password'" class="q-gutter-md">
                <div class="text-subtitle1 q-mb-sm">Укажи свой пароль</div>
                <q-input v-model="password" :type="showPassword ? 'text' : 'password'" label="Пароль" filled
                    :error="passwordError" error-message="Некорректный пароль" required>
                    <template v-slot:append>
                        <q-icon :name="showPassword ? 'visibility' : 'visibility_off'" class="cursor-pointer"
                            @click="togglePassword" />
                    </template>
                </q-input>
                <q-btn label="Продолжить" color="purple" unelevated class="full-width" @click="login" />
            </q-form>
        </q-card-section>
    </q-card>
</template>

<script setup>
import { ref } from 'vue'

const step = ref('email')
const email = ref('')
const password = ref('')
const mode = ref('login')
const inputError = ref(false)
const passwordError = ref(false)
const showPassword = ref(false)

const togglePassword = () => {
    showPassword.value = !showPassword.value
}

const switchToLogin = () => {
    step.value = 'email'
    mode.value = 'login'
}

const emailVerif = () => {
    inputError.value = false
    step.value = 'password'
}

const login = () => {
    passwordError.value = false
    console.log('Логин:', { email: email.value, password: password.value })
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