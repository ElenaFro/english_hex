<template>
    <div>
        <component :is="componentsMap[currentComponent]" @change-component="switchComponent" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Salution from '@/components/Authentication/Salution.vue';
import AgeVerif from '@/components/Authentication/AgeVerif.vue';
import LoginForm from '@/components/Authentication/LoginForm.vue';
import PasswordRecov from '@/components/Authentication/PasswordRecov.vue';
import RegistForm from '@/components/Authentication/RegistForm.vue';
import RegistConfirm from '@/components/Authentication/RegistConfirm.vue';
import PasswordRecovConfirm from '@/components/Authentication/PasswordRecovConfirm.vue';
import UserAgreem from '@/components/Authentication/UserAgreem.vue';
import PrivacyPolicy from '@/components/Authentication/PrivacyPolicy.vue';
import Onboarding from '@/components/Authentication/Onboarding.vue';
import OnboardingGame from '@/components/Authentication/OnboardingGame.vue';
import OnboardingStartSolutionGame from '@/components/Authentication/OnboardingStartSolutionGame.vue';

const currentComponent = ref(null);

const componentsMap = {
    Salution,
    AgeVerif,
    LoginForm,
    PasswordRecov,
    RegistForm,
    RegistConfirm,
    PasswordRecovConfirm,
    UserAgreem,
    PrivacyPolicy,
    Onboarding,
    OnboardingGame,
    OnboardingStartSolutionGame,
};

const switchComponent = (componentName) => {
    currentComponent.value = componentName;
};

onMounted(() => {
    const salutionShown = localStorage.getItem('salutionShown');
    const ageVerified = localStorage.getItem('ageVerified');

    if (!salutionShown) {
        currentComponent.value = 'Salution';
    } else if (!ageVerified) {
        currentComponent.value = 'AgeVerif';
    } else {
        currentComponent.value = 'LoginForm';
    }
});
</script>

<style></style>
