<template>
    <q-card class="auth-card q-pa-md">
        <q-card-section>
            <div class="text-h6 q-mb-md">Восстановление пароля</div>
            <q-card-section class="message-block q-pa-md">
                <p class="text-body1">
                    На указанный email будет отправлена ссылка для восстановления пароля — перейдите по ней, чтобы
                    завершить процесс.
                </p>
            </q-card-section>
            <q-btn flat label="Вернуться к входу" color="purple" class="full-width"
                @click="emit('change-component', 'LoginForm')" />
        </q-card-section>
    </q-card>
</template>

<script setup>
const emit = defineEmits(['change-component'])
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

.full-width {
    width: 100%;
}
</style>