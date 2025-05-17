<template>
  	<div class="main-container">
    	<div class="content-container">
			<div class="authorization-toggle">
				<button 
				class="authorization-toggle__select-button" 
				:class="{ active: mode === 'login' }"
				@click="switchToLogin">
					Вход
				</button>
				<button 
				class="authorization-toggle__select-button" 
				:class="{ active: mode === 'register' }"
				@click="$emit('change-component', 'RegistForm')">
					Регистрация
				</button>
				</div>

    		<div v-if="step === 'email'" class="login-form">
        		<p class="content-container__title">Укажи свой email</p>
				<div class="login-form__input-container">
					<input ref="emailInput" v-model="email" type="email" placeholder="Начните ввод" :class="{
					'login-form__input-field': true,
					'login-form__input-field--error': inputError
					}" />
				</div>
        		<button @click="emailVerif" class="button button--purple button--big">Продолжить</button>
        		<button class="login-form__link" @click="$emit('change-component', 'PasswordRecov')">Забыли пароль?</button>
      		</div>

			<div v-if="step === 'password'" class="login-form">
				<p class="content-container__title">Укажи свой пароль</p>
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
				<button class="button button--purple button--big" @click="login">Продолжить</button>
			</div>
		</div>
  	</div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import visibilityIcon from '@/assets/img/visibility_icon.svg'
import visibilityOffIcon from '@/assets/img/visibility_off_icon.svg'

const router = useRouter()

const step = ref('email')
const email = ref('')
const password = ref('')
const mode = ref('login')
const inputError = ref(false)
const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const switchToLogin = () => {
	step.value = 'email'
	mode.value = 'login'
}

const emailVerif = () => {
	inputError.value = false
	step.value = 'password'
}

const login = ()=>{
	router.push({name: 'mainPage'})
}
</script>

<style scoped>
.login-form__input-container {
	margin-bottom: 12px;
}

.button {
	margin-bottom: 24px;
}
</style>