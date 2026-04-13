<template>
    <div>
        <component :is="componentsMap[currentComponent]" @change-component="switchComponent" />
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
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
const route = useRoute();
const REFERRAL_CODE_STORAGE_KEY = 'referral_code';

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

const persistReferralCode = (rawCode) => {
    const code = Array.isArray(rawCode) ? rawCode[0] : rawCode;
    if (!code) return;
    localStorage.setItem(REFERRAL_CODE_STORAGE_KEY, String(code));
};

onMounted(() => {
    persistReferralCode(route.query.referral_code);

    const salutionShown = localStorage.getItem('salutionShown');
    const ageVerified = localStorage.getItem('ageVerified');
    const onboardingCompleted = localStorage.getItem('onboardingComplete');

    if (!salutionShown) {
        currentComponent.value = 'Salution';
    } else if (!onboardingCompleted) {
        currentComponent.value = 'Onboarding';
    } else if (!ageVerified) {
        currentComponent.value = 'AgeVerif';
    } else {
        currentComponent.value = 'LoginForm';
    }
});

watch(
    () => route.query.referral_code,
    (referralCode) => {
        persistReferralCode(referralCode);
    }
);
</script>

<style></style>
