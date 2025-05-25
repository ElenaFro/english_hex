<template>
    <div class="main-container">
		<PrivacyPolicy 
		v-show="currentComponent === 'policy'" 
		@change-component="currentComponent = $event" 
		/>
		<UserAgreem 
		v-show="currentComponent === 'agreem'" 
		@change-component="currentComponent = $event" 
		/>
        <div class="content-container" v-if="currentComponent === 'regist'">
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
            <p class="content-container__title">Заполните данные</p>
            <form class="login-form" action="" @submit.prevent="formValidator">
                <input
                    v-model="nick"
                    type="text" 
                    placeholder="Ник"
                    :class="{
                        'login-form__input-field':true,
                        'login-form__input-field--error': nickError
                    }"
                />
				<p v-if="nickError" class="login-form__error-text">Поле заполнено некорректно</p>
                <input
                    v-model="email"
                    type="email" 
                    placeholder="email"
                    :class="{
                        'login-form__input-field':true,
                        'login-form__input-field--error': emailError
                    }"
                />
				<p v-if="emailError" class="login-form__error-text">Поле заполнено некорректно</p>
                <div class="login-form__input-container">
					<input  
                    v-model="password"
                    placeholder="Пароль"
					:type="showPassword ? 'text' : 'password'"
                    :class="{
                        'login-form__input-field':true,
                        'login-form__input-field--error': passwordError
                    }"
                	/>
					<button type="button" class="show-password-button" @click="togglePassword">
						<img class="show-password-button__visibility" 
						:src="showPassword ? visibilityIcon : visibilityOffIcon" alt="">
					</button>
				</div>
				<p v-if="passwordError" class="login-form__error-text">Поле заполнено некорректно</p>
                <div class="agreement-container">
                    <button
					type="button" 
					:class="{
						'agreement-container__link':true,
						'agreement-container__link--visited': checkVisited
					}"
                    @click="currentComponent = 'policy'"
                    >
                    Политика конфиденциальности
                    </button>
                    <button 
					type="button"
					class="agreement-container__link"
                    @click="currentComponent = 'agreem'"
                    >
                    Пользовательское соглашение
                    </button>
                    <label class="agreement-container__agreement-checkbox">
                        <input type="checkbox" v-model="agreementCheckbox">
                        <span class="checkbox"></span>
                        <span class="text">
                            Я подтверждаю, что ознакомлен и согласен c политикой конфиденциальности и пользовательским соглашением
                        </span>
                    </label>
                </div>
                <button 
                type="submit" 
                class="button button--purple button--big "
                >
                Зарегистрироваться
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import visibilityIcon from '@/assets/img/visibility_icon.svg'
import visibilityOffIcon from '@/assets/img/visibility_off_icon.svg'
import PrivacyPolicy from '@/components/Authentication/PrivacyPolicy.vue'
import UserAgreem from '@/components/Authentication/UserAgreem.vue'

const nick = ref('')
const email = ref('')
const password = ref('')
const nickError = ref(false)
const emailError = ref(false)
const passwordError = ref(false)
const showPassword = ref(false)
const agreementCheckbox = ref(false)
const checkVisited = ref (false)
const currentComponent = ref('regist')
const mode = ref('register')
const emit = defineEmits(['change-component'])

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleClick = () => {
	checkVisited.value = true
	emit('change-component', 'PrivacyPolicy')
}

const switchToRegist = () => {
	mode.value = 'register'
}

//Валидатор форм
const formValidator = () => {
	const symbols = /[A-Za-z0-9]/
	const invalidSymbols = /[<>{}()[],;:\/"*[/]]/

	//Проверка поля ввода ника
	if (!nick.value.trim()) {
		nickError.value = true
	} else {
		nickError.value = false
	}

	//Проверка поля ввода почты
	if (!email.value.trim()) {
		emailError.value = true
		return
	} if (email.value.length < 8 || email.value.length > 30 ) {
		emailError.value = true
		return
	} if (email.value.includes(' ')) {
		emailError.value = true
		return
	} if (invalidSymbols.test(email.value)) {
		emailError.value = true
		return
	} if (!email.value.includes('@')) {
		emailError.value = true
		return
	} if (!symbols.test(email.value)) {
		emailError.value = true
		return
	} else {
		emailError.value = false
	}

	//Проверка поля ввода пароля
	if (!password.value.trim()) {
		passwordError.value = true
		return
	} if (password.value.length < 8 || password.value.length > 30 ) {
		passwordError.value = true
		return
	} if (password.value.includes(' ')) {
		passwordError.value = true
		return
	} if (!symbols.test(password.value)) {
		passwordError.value = true
		return
	} else {
		passwordError.value = false
	}
}
</script>

<style scoped>
.button {
	font-weight: 400;
}
</style>	