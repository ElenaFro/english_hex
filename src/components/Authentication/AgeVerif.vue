<template>
    <div class="main-container">
        <div class="content-container">
            <div class="message-block">
                <h1 class="message-block__title">Вам исполнилось 14 лет?</h1>
                <p class="message-block__text">
                    Мы заботимся о комфорте и&nbsp;безопасности наших пользователей, поэтому
                    приложение доступно с 14 лет. Если тебе меньше, пригласите родителей подключить
                    доступ
                </p>
                <div class="button-container button-container--column">
                    <button @click="goToNext" class="button button--purple">
                        Да, мне есть 14 лет
                    </button>
                    <button @click="goToNext" class="button button--purple">Мне нет 14 лет</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['change-component']);

function goToNext() {
    localStorage.setItem('ageVerified', 'true');
    emit('change-component', 'RegistForm');
}
</script>

<style scoped>
.message-block__title {
    align-self: flex-start;
}

.message-block__text {
    margin-bottom: 16px;
}
</style>
