<template>
    <q-card class="auth-card q-pa-md">
        <q-card-section>
            <div class="text-h6 q-mb-md">Восстановление пароля</div>
            <q-form @submit="handleSubmit" class="q-gutter-md">
                <q-input v-model="email" type="email" label="Укажите Email привязанный к аккаунту" filled
                    :error="inputError" error-message="Пожалуйста, введите корректный email" required />
                <q-btn type="submit" label="Продолжить" color="purple" unelevated class="full-width" />
                <q-btn flat label="Вернуться обратно" color="purple" class="full-width"
                    @click="emit('change-component', 'LoginForm')" />
            </q-form>
        </q-card-section>
    </q-card>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['change-component'])

const email = ref('')
const inputError = ref(false)

const handleSubmit = () => {
    inputError.value = !email.value.includes('@')
    if (!inputError.value) {
        console.log('Восстановление пароля для:', email.value)
        emit('change-component', 'PasswordRecovConfirm')
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