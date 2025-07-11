<template>
	<div>
		<component :is="componentsMap[currentComponent]" @change-component="switchComponent" />
	</div>
</template>

<script setup>
import { ref } from 'vue'
import Salution from '@/components/Authentication/Salution.vue'
import AgeVerif from '@/components/Authentication/AgeVerif.vue'
import LoginForm from '@/components/Authentication/LoginForm.vue'
import PasswordRecov from '@/components/Authentication/PasswordRecov.vue'
import RegistForm from '@/components/Authentication/RegistForm.vue'
import RegistConfirm from '@/components/Authentication/RegistConfirm.vue'
import PasswordRecovConfirm from '@/components/Authentication/PasswordRecovConfirm.vue'
import UserAgreem from '@/components/Authentication/UserAgreem.vue'
import PrivacyPolicy from '@/components/Authentication/PrivacyPolicy.vue'

const currentComponent = ref('Salution')

const componentsMap = {
	Salution,
	AgeVerif,
	LoginForm,
	PasswordRecov,
	RegistForm,
	RegistConfirm,
	PasswordRecovConfirm,
	UserAgreem,
	PrivacyPolicy
}

const switchComponent = (componentName) => {
	currentComponent.value = componentName
}
</script>

<style>

</style>