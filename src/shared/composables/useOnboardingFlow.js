import { useOnboardingStore } from '@/stores/onboarding';
import { componentForStep } from '@/shared/utils/onboardingSteps';

/**
 * Общая навигация экранов онбординга: переходы считает бэк через next_step,
 * фронт только переводит шаг в имя компонента.
 * @param {Function} emit — emit компонента с событием 'change-component'
 */
export function useOnboardingFlow(emit) {
    const onboarding = useOnboardingStore();

    /** Перейти на экран текущего (или переданного) шага. */
    const goToStep = (step) => {
        const target = componentForStep(step ?? onboarding.nextStep, {
            needsAdult: onboarding.needsAdult,
        });
        emit('change-component', target);
    };

    /**
     * «Пропустить» на экранах истории. Бэк шаги не блокирует, но запрос нужен,
     * чтобы в воронке было видно, сколько людей пропускает историю.
     */
    const skipStory = async () => {
        await onboarding.skip();
        goToStep();
    };

    return { onboarding, goToStep, skipStory };
}
