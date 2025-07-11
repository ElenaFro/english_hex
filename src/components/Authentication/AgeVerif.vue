<template>
    <div class="main-container">
        <div class="content-container">
            <div class="message-block">
                <h1 class="message-block__title">Вам исполнилось 14 лет?</h1>
                <p class="message-block__text">Приложение доступно только пользователям от 14 лет и старше.<br>
                    Если вам нет 14, попросите родителя или опекуна помочь с доступом.
                </p>
                <div class="button-container button-container--column">
                    <button @click="$emit('change-component', 'RegistForm')" class="button button--purple">
                        Да, мне есть 14 лет
                    </button>        
                    <button @click="$emit('change-component', 'RegistForm')" class="button button--purple">
                        Мне нет 14 лет
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.message-block__title {
    align-self: flex-start;
}

.message-block__text {
    margin-bottom: 16px;
}
</style>