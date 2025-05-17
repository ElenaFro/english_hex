<template>
    <q-page class="flex flex-center bg-grey-1 bg">
        <component :is="componentsMap[currentComponent]" @change-component="switchComponent" />
    </q-page>
</template>

<script setup>
import { ref } from 'vue'
import Salution from './components/FirstSalution.vue'
import AgeVerification from './components/AgeVerification.vue'
import LoginForm from './components/LoginForm.vue'
import PasswordRecover from './components/PasswordRecover.vue'
import RegistrationForm from './components/RegistrationForm.vue'
import RegistrationConfirm from './components/RegistrationConfirm.vue'
import PasswordRecoveringConfirm from './components/PasswordRecoveringConfirm.vue'
import UserAgreement from './components/UserAgreement.vue'
import PrivacyPolicy from './components/PrivacyPolicy.vue'

const currentComponent = ref('Salution')

const componentsMap = {
    Salution,
    AgeVerification,
    LoginForm,
    PasswordRecover,
    RegistrationForm,
    RegistrationConfirm,
    PasswordRecoveringConfirm,
    UserAgreement,
    PrivacyPolicy
}

const switchComponent = (componentName) => {
    currentComponent.value = componentName
}
</script>

<style>
.bg {
    background-image: url('src\assets\background.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
</style>