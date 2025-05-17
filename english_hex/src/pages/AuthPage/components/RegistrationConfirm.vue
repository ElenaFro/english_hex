<template>
    <q-card class="auth-card q-pa-md">
        <q-card-section>
            <q-tabs v-model="mode" dense class="q-mb-md" active-color="purple" indicator-color="purple">
                <q-tab name="login" label="Вход" @click="$emit('change-component', 'LoginForm')" />
                <q-tab name="register" label="Регистрация" @click="switchToRegist" />
            </q-tabs>

            <div class="text-h6 q-mb-md">Подтверждение регистрации</div>
            <q-card-section class="message-block q-pa-md">
                <p class="text-body1 message-text">
                    На указанный email будет отправлена ссылка для подтверждения регистрации — перейдите по ней, чтобы
                    завершить процесс.
                </p>
            </q-card-section>

            <q-btn flat label="Вернуться к входу" color="purple" class="full-width"
                @click="$emit('change-component', 'LoginForm')" />
        </q-card-section>
    </q-card>
</template>

<script setup>
import { ref } from 'vue'

const mode = ref('register')

const switchToRegist = () => {
    mode.value = 'register'
}
</script>

<style scoped>
.auth-card {
    width: 100%;
    max-width: 400px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.message-block {
    background: #f5f5f5;
    border-radius: 4px;
}

.message-text {
    font-size: 18px;
    font-weight: 500;
}

.full-width {
    width: 100%;
}
</style>