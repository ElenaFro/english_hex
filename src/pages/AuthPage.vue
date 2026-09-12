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
import OnboardingIntroVideo from '@/components/Authentication/OnboardingIntroVideo.vue';
import OnboardingHero from '@/components/Authentication/OnboardingHero.vue';
import OnboardingSectorDanger from '@/components/Authentication/OnboardingSectorDanger.vue';
import OnboardingCardsLesson from '@/components/Authentication/OnboardingCardsLesson.vue';
import OnboardingOutroVideo from '@/components/Authentication/OnboardingOutroVideo.vue';
import OnboardingSectorSaved from '@/components/Authentication/OnboardingSectorSaved.vue';
import RoleChoice from '@/components/Authentication/RoleChoice.vue';
import AdultHelper from '@/components/Authentication/AdultHelper.vue';
import { useOnboardingStore } from '@/stores/onboarding';
import {
    isOnboardingDone,
    resolveStartComponent,
    setStoryStep,
} from '@/shared/utils/onboardingSteps';
import { initOnboardingAnalytics } from '@/shared/analytics/onboardingAnalytics';

const currentComponent = ref(null);
const route = useRoute();
const onboarding = useOnboardingStore();
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
    OnboardingIntroVideo,
    OnboardingHero,
    OnboardingSectorDanger,
    OnboardingCardsLesson,
    OnboardingOutroVideo,
    OnboardingSectorSaved,
    RoleChoice,
    AdultHelper,
};

const switchComponent = (componentName) => {
    currentComponent.value = componentName;
    // Экраны истории сервер не различает — запоминаем место внутри шага words сами.
    setStoryStep(componentName);
};

const persistReferralCode = (rawCode) => {
    const code = Array.isArray(rawCode) ? rawCode[0] : rawCode;
    if (!code) return;
    localStorage.setItem(REFERRAL_CODE_STORAGE_KEY, String(code));
};

onMounted(async () => {
    persistReferralCode(route.query.referral_code);

    // Онбординг здесь уже проходили: показываем вход и НЕ зовём /onboarding/start —
    // иначе каждый возврат (после регистрации, после выхода из аккаунта) заводил бы
    // новую гостевую сессию и писал в воронку лишний start_page_open.
    if (isOnboardingDone()) {
        currentComponent.value = 'LoginForm';
        return;
    }

    // Событие start_page_open бэк пишет сам при POST /onboarding/start, поэтому запрос идёт
    // на открытии страницы, а не по кнопке «Начать» — иначе потеряется верх воронки.
    await onboarding.bootstrap();
    initOnboardingAnalytics();

    currentComponent.value = resolveStartComponent({
        nextStep: onboarding.nextStep,
        wordsCompleted: onboarding.wordsCompleted,
        sectorCompleted: onboarding.sectorCompleted,
        needsAdult: onboarding.needsAdult,
    });

    onboarding.loadContent();
});

watch(
    () => route.query.referral_code,
    (referralCode) => {
        persistReferralCode(referralCode);
    }
);
</script>

<style></style>
