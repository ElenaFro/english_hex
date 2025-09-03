```vue
<template>
    <div class="main-container">
        <section class="content-container" v-if="!loading">
            <div class="authorization-toggle">
                <button
                    class="authorization-toggle__select-button"
                    :class="{ active: mode === 'login' }"
                    @click="$emit('change-component', 'LoginForm')"
                >
                    Вход
                </button>
                <button
                    class="authorization-toggle__select-button"
                    :class="{ active: mode === 'register' }"
                    @click="switchToRegist"
                >
                    Регистрация
                </button>
            </div>
            <p class="content-container__title">{{ titleText }}</p>
            <section v-if="!confirmEmailSend">
                <form class="login-form" @submit.prevent="formValidator">
                    <input
                        v-model.trim="nick"
                        type="text"
                        placeholder="Введите ник"
                        :class="{
                            'login-form__input-field': true,
                            'login-form__input-field--error': nickError,
                        }"
                    />
                    <p v-if="nickError" class="login-form__error-text">
                        {{ nickErrorText }}
                    </p>
                    <input
                        v-model.trim="email"
                        type="email"
                        placeholder="example@domain.com"
                        :class="{
                            'login-form__input-field': true,
                            'login-form__input-field--error': emailError,
                        }"
                    />
                    <p v-if="emailError" class="login-form__error-text">
                        {{ emailErrorText }}
                    </p>
                    <div class="login-form__input-container">
                        <input
                            v-model.trim="password"
                            placeholder="Введите пароль"
                            :type="showPassword ? 'text' : 'password'"
                            :class="{
                                'login-form__input-field': true,
                                'login-form__input-field--error': passwordError,
                            }"
                        />
                        <button type="button" class="show-password-button" @click="togglePassword">
                            <img
                                class="show-password-button__visibility"
                                :src="showPassword ? visibilityIcon : visibilityOffIcon"
                                alt="Toggle visibility"
                            />
                        </button>
                    </div>
                    <p v-if="passwordError" class="login-form__error-text">
                        {{ passwordErrorText }}
                    </p>
                    <div class="agreement-container">
                        <button
                            :class="{
                                'agreement-container__link': true,
                                'agreement-container__link--visited': checkVisited,
                            }"
                            @click="handleClick"
                        >
                            Политика конфиденциальности
                        </button>
                        <button
                            class="agreement-container__link"
                            @click="$emit('change-component', 'UserAgreem')"
                        >
                            Пользовательское соглашение
                        </button>
                        <label
                            class="agreement-container__agreement-checkbox"
                            :class="{
                                'agreement-container__agreement-checkbox--error': agreementError,
                            }"
                        >
                            <input type="checkbox" v-model="agreementCheckbox" />
                            <span class="checkbox"></span>
                            <span class="text">
                                Я подтверждаю, что ознакомлен и согласен c политикой
                                конфиденциальности и пользовательским соглашением
                            </span>
                        </label>
                        <p v-if="agreementError" class="login-form__error-text">
                            {{ agreementErrorText }}
                        </p>
                    </div>
                    <button type="submit" class="button button--purple button--big">
                        Зарегистрироваться
                    </button>
                </form>
            </section>
            <section v-else class="confirmText">
                {{ confirmText }}
            </section>
        </section>
        <loader v-if="loading" />
    </div>

    <default-popup
        :is-visible="showPopup"
        title="Ошибка"
        :message="errorMessage"
        @confirm="showPopup = !showPopup"
        @close="showPopup = !showPopup"
    />
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import visibilityIcon from '@/assets/img/visibility_icon.svg';
import visibilityOffIcon from '@/assets/img/visibility_off_icon.svg';
import { useUserStore } from '../../stores/user';
import loader from '@/components/Loader.vue';
import defaultPopup from '../popups/defaultPopup.vue';

const nick = ref('');
const email = ref('');
const password = ref('');
const nickError = ref(false);
const emailError = ref(false);
const passwordError = ref(false);
const agreementError = ref(false);
const nickErrorText = ref('');
const emailErrorText = ref('');
const passwordErrorText = ref('');
const agreementErrorText = ref('');
const showPassword = ref(false);
const agreementCheckbox = ref(false);
const checkVisited = ref(false);
const confirmEmailSend = ref(false);
const loading = ref(false);
const showPopup = ref(false);
const errorMessage = ref(null);

const mode = ref('register');
const emit = defineEmits(['change-component']);

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const handleClick = () => {
    checkVisited.value = true;
    emit('change-component', 'PrivacyPolicy');
};

const confirmText =
    'На указанный email будет отправлена ссылка для подтверждения регистрации — перейдите по ней, чтобы завершить процесс.';

const switchToRegist = () => {
    mode.value = 'register';
};

const titleText = computed(() =>
    confirmEmailSend.value ? 'Подтверждение регистрации' : 'Заполните данные'
);

watch(nick, (newVal) => {
    if (!newVal.trim()) {
        nickError.value = true;
        nickErrorText.value = 'Поле ник не может быть пустым';
    } else {
        nickError.value = false;
        nickErrorText.value = '';
    }
});

watch(email, (newVal) => {
    const emailRegex = /^(?=.*[A-Za-z])[A-Za-z0-9@._-]{8,30}$/;
    const invalidSymbols = /[<>{}()[],;:\/\"\[\]\s]/;
    if (!newVal.trim()) {
        emailError.value = true;
        emailErrorText.value = 'Поле email не может быть пустым';
    } else if (newVal.length < 8 || newVal.length > 30) {
        emailError.value = true;
        emailErrorText.value = 'Email должен быть от 8 до 30 символов';
    } else if (!emailRegex.test(newVal) || !newVal.includes('@')) {
        emailError.value = true;
        emailErrorText.value = 'Email должен содержать @ и хотя бы одну букву';
    } else if (invalidSymbols.test(newVal)) {
        emailError.value = true;
        emailErrorText.value = 'Email содержит недопустимые символы';
    } else {
        emailError.value = false;
        emailErrorText.value = '';
    }
});

watch(password, (newVal) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9.!]{8,30}$/;
    if (!newVal.trim()) {
        passwordError.value = true;
        passwordErrorText.value = 'Поле пароль не может быть пустым';
    } else if (newVal.length < 8 || newVal.length > 30) {
        passwordError.value = true;
        passwordErrorText.value = 'Пароль должен быть от 8 до 30 символов';
    } else if (!passwordRegex.test(newVal) || newVal.includes(' ')) {
        passwordError.value = true;
        passwordErrorText.value =
            'Пароль должен содержать хотя бы одну заглавную латинскую букву и одну цифру, без пробелов';
    } else {
        passwordError.value = false;
        passwordErrorText.value = '';
    }
});

watch(agreementCheckbox, (newVal) => {
    if (!newVal) {
        agreementError.value = true;
        agreementErrorText.value = 'Необходимо согласиться с условиями';
    } else {
        agreementError.value = false;
        agreementErrorText.value = '';
    }
});

const formValidator = () => {
    let isValid = true;

    if (!nick.value.trim()) {
        nickError.value = true;
        nickErrorText.value = 'Поле ник не может быть пустым';
        isValid = false;
    } else {
        nickError.value = false;
        nickErrorText.value = '';
    }

    const emailRegex = /^(?=.*[A-Za-z])[A-Za-z0-9@._-]{8,30}$/;
    const invalidSymbols = /[<>{}()[],;:\/\"\[\]\s]/;
    if (!email.value.trim()) {
        emailError.value = true;
        emailErrorText.value = 'Поле email не может быть пустым';
        isValid = false;
    } else if (email.value.length < 8 || email.value.length > 30) {
        emailError.value = true;
        emailErrorText.value = 'Email должен быть от 8 до 30 символов';
        isValid = false;
    } else if (!emailRegex.test(email.value) || !email.value.includes('@')) {
        emailError.value = true;
        emailErrorText.value = 'Email должен содержать @ и хотя бы одну букву';
        isValid = false;
    } else if (invalidSymbols.test(email.value)) {
        emailError.value = true;
        emailErrorText.value = 'Email содержит недопустимые символы';
        isValid = false;
    } else {
        emailError.value = false;
        emailErrorText.value = '';
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9.!]{8,30}$/;
    if (!password.value.trim()) {
        passwordError.value = true;
        passwordErrorText.value = 'Поле пароль не может быть пустым';
        isValid = false;
    } else if (password.value.length < 8 || password.value.length > 30) {
        passwordError.value = true;
        passwordErrorText.value = 'Пароль должен быть от 8 до 30 символов';
        isValid = false;
    } else if (!passwordRegex.test(password.value) || password.value.includes(' ')) {
        passwordError.value = true;
        passwordErrorText.value =
            'Пароль должен содержать хотя бы одну латинскую заглавную букву и одну цифру, без пробелов';
        isValid = false;
    } else {
        passwordError.value = false;
        passwordErrorText.value = '';
    }

    if (!agreementCheckbox.value) {
        agreementError.value = true;
        agreementErrorText.value = 'Необходимо согласиться с условиями';
        isValid = false;
    } else {
        agreementError.value = false;
        agreementErrorText.value = '';
    }

    if (isValid) {
        login();
    }
};

async function login() {
    loading.value = true;
    try {
        const response = await useUserStore().register(
            nick.value,
            email.value,
            password.value,
            agreementCheckbox.value
        );
        if (response?.message?.includes('Success registration')) {
            confirmEmailSend.value = true;
        } else {
            errorMessage.value = 'Что-то пошло не так, попробуйте еще раз';
            showPopup.value = true;
        }
    } catch (error) {
        errorMessage.value = error.message || 'Ошибка при регистрации';
        showPopup.value = true;
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.button {
    font-weight: 400;
}

.confirmText {
    font-size: 16px;
    font-weight: 400;
    color: #262060;
    width: 100%;
    max-height: 140px;
    background-color: #f8f5ff;
    padding: 20px 25px;
    border-radius: 20px;
    line-height: 100%;
}

.login-form__input-field--error {
    border-color: #d61414;
}

.login-form__error-text {
    color: #ffffff;
    font-size: 12px;
    margin-top: 5px;
}

.agreement-container__agreement-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
}

.agreement-container__agreement-checkbox--error .checkbox {
    border-color: #fa3e3e;
}

.checkbox {
    width: 18px;
    height: 18px;
    border-radius: 3px;
    display: inline-block;
    position: relative;
}

.checkbox::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 5px;
    width: 6px;
    height: 10px;
    border: solid #262060;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    display: none;
}

.agreement-container__agreement-checkbox input:checked ~ .checkbox::after {
    display: block;
    top: 55%;
    left: 58%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width: 15px;
    height: 15px;
}

.agreement-container__link {
    color: #ffffff;
    text-decoration: underline;
    cursor: pointer;
}

.agreement-container__link--visited {
    color: #262060;
}
</style>
