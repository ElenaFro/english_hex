<template>
    <div class="main-container">
        <div class="content-container"></div>
        <section v-if="!loading">
            <p class="content-container__title">Восстановление пароля</p>
            <form class="login-form" @submit.prevent>
                <input v-model="email" type="email" placeholder="Укажите Email привязанный к аккаунту"
                    class="login-form__input-field">
                <button class="button button--purple button--big" @click="sendRecoverEmail">
                    Продолжить
                </button>
                <button class="login-form__link" @click="$emit('change-component', 'LoginForm')">
                    Вернуться обратно
                </button>
            </form>
        </section>

        <loader v-if="loading" />
    </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth';
import { ref } from 'vue';
import loader from '../Loader.vue';

const emit = defineEmits(['change-component'])
const email = ref()
const loading = ref(false)

async function sendRecoverEmail() {
    loading.value = true
    if (email.value) await useAuthStore().recoverPassword(email.value).then((response) => {
        if (response.message) emit('change-component', 'PasswordRecovConfirm')
    }).catch((error) => alert(error))
    else alert('Email is empty')
    loading.value = false;
}


</script>

<style scoped>
.login-form__input-field {
    margin-bottom: 12px;
}

.button {
    margin-bottom: 24px;
}
</style>