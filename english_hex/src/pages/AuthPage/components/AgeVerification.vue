<template>
    <q-card class="auth-card q-pa-md">
        <q-card-section>
            <h1 class="text-h5 q-mb-sm">Вам исполнилось 14 лет?</h1>
            <p class="text-body1 q-mb-md">
                Приложение доступно только пользователям от 14 лет и старше.<br>
                Если вам нет 14, попросите родителя или опекуна помочь с доступом.
            </p>
            <div class="q-gutter-md">
                <q-btn label="Да, мне есть 14 лет" color="purple" unelevated class="full-width"
                    @click="$emit('change-component', 'RegistForm')" />
                <q-btn label="Мне нет 14 лет" color="purple" unelevated class="full-width"
                    @click="$emit('change-component', 'RegistForm')" />
            </div>
        </q-card-section>
    </q-card>
</template>

<script setup>
// Нет дополнительной логики, оставляем пустым
</script>

<style scoped>
.auth-card {
    width: 100%;
    max-width: 400px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.text-h5 {
    align-self: flex-start;
}
</style>