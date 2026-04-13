<template>
    <div class="main-container">
        <div class="content-container">
            <p class="content-container__title">Восстановление пароля</p>

            <form v-if="!isSuccess" class="login-form" @submit.prevent="submitReset">
                <div class="login-form__input-container">
                    <input
                        v-model="password"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="Введите новый пароль"
                        class="login-form__input-field"
                    />
                    <button type="button" class="show-password-button" @click="togglePassword">
                        <img
                            class="show-password-button__visibility"
                            :src="showPassword ? visibilityIcon : visibilityOffIcon"
                            alt=""
                        />
                    </button>
                </div>

                <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

                <b-button
                    class="button button--purple button--big"
                    :loading="loading"
                    label="Сохранить пароль"
                    label-class="text-white"
                    @click="submitReset"
                />
            </form>

            <div v-else class="message-block message-block--shadow">
                <p class="message-block__text">
                    Пароль успешно изменен. Теперь вы можете войти в аккаунт с новым паролем.
                </p>
                <button class="button button--purple button--big success-btn" @click="goToAuth">
                    Перейти ко входу
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import BButton from '@/shared/components/BaseButton.vue';
import visibilityIcon from '@/assets/img/visibility_icon.svg';
import visibilityOffIcon from '@/assets/img/visibility_off_icon.svg';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const password = ref('');
const loading = ref(false);
const isSuccess = ref(false);
const showPassword = ref(false);
const errorMessage = ref('');

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const goToAuth = async () => {
    await router.push({ name: 'AuthPage' });
};

const submitReset = async () => {
    errorMessage.value = '';

    const token = String(route.params.token || '');
    const nextPassword = String(password.value || '').trim();

    if (!token) {
        errorMessage.value = 'Ссылка недействительна: отсутствует токен восстановления.';
        return;
    }

    if (!nextPassword) {
        errorMessage.value = 'Введите новый пароль.';
        return;
    }

    loading.value = true;
    try {
        await userStore.restorePassword(token, nextPassword);
        isSuccess.value = true;
    } catch (error) {
        errorMessage.value = error?.message || 'Не удалось изменить пароль. Попробуйте снова.';
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.login-form__input-container {
    margin-bottom: 12px;
}

.error-text {
    color: #ff4d4f;
    font-size: 14px;
    margin: 0 0 12px 0;
}

.button {
    margin-bottom: 24px;
}

.success-btn {
    margin-top: 16px;
    margin-bottom: 0;
}
</style>
