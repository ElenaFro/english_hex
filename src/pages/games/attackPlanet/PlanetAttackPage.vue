<template>
    <div>
        <component
            :is="activeComponent"
            @switch-component="switchComponent"
            v-bind="componentProps"
            @update:lives="updateLives"
            @update:earnedStars="updateEarnedStars"
        />
        <defaultPopup
            :isVisible="showExitWarning"
            title="Выйти из игры?"
            message="Прогресс не сохранится, а заработанные звёзды сгорят."
            @confirm="confirmExit"
            @close="cancelExit"
        />
    </div>
</template>

<script setup>
import { ref, markRaw, defineEmits, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AttackPlanetGame from '@/components/AttackPlanet/AttackPlanetGame.vue';
import AttackPlanetResult from '@/components/AttackPlanet/AttackPlanetResult.vue';
import AttackPlanetLoss from '@/components/AttackPlanet/AttackPlanetLoss.vue';
import AttackPlanetWin from '@/components/AttackPlanet/AttackPlanetWin.vue';
import defaultPopup from '@/shared/components/popups/defaultPopup.vue';
import { useEarnedStarsGuard } from '@/shared/composables/useEarnedStarsGuard';

const route = useRoute();
const router = useRouter();
const emit = defineEmits(['update:lives', 'switch-component']);

const activeComponent = ref(markRaw(AttackPlanetGame));
const lives = ref(5);
const earnedStars = ref(0);

// Предупреждаем при выходе во время активной игры (прогресс) и на экранах
// победы/результата (earnedStars > 0), пока звёзды не начислены на планете.
// На экранах проигрыша/уже-начислено терять нечего. В бесконечном (allCategories)
// режиме звёзды не начисляются — попап не показываем.
const { showExitWarning, confirmExit, cancelExit } = useEarnedStarsGuard(
    () =>
        route.query.allCategories !== 'true' &&
        (activeComponent.value === AttackPlanetGame || earnedStars.value > 0)
);

const componentProps = computed(() => ({
    lives: lives.value,
    earnedStars: earnedStars.value,
}));
const textForAllStarsGiven = `Продолжайте изучение новых слов и\u00A0не\u00A0забывайте возвращаться для закрепления изученных слов!!`;
const titleForAllStarsGiven = `Вы заработали максимальное количество звезд по\u00A0данной игре в\u00A0выбранной категории`;

function switchComponent(componentName, wrongCount = 0) {
    if (route.query.allCategories === 'true') {
        router.push({
            name: 'gameResult',
            query: {
                wrong: wrongCount,
                from: 'planetAttackPage',
                gameSource: 'planet_attack',
                allCategories: 'true',
            },
        });
        return;
    }
    switch (componentName) {
        case 'AttackPlanetResult':
            activeComponent.value = markRaw(AttackPlanetResult);
            break;
        case 'AttackPlanetLoss':
            activeComponent.value = markRaw(AttackPlanetLoss);
            break;
        case 'AttackPlanetWin':
            activeComponent.value = markRaw(AttackPlanetWin);
            break;
        case 'AttackPlanetAllStarsGiven':
            activeComponent.value = markRaw(AttackPlanetResult);
            componentProps.value.title = titleForAllStarsGiven;
            componentProps.value.text = textForAllStarsGiven;
            break;
        default:
            activeComponent.value = markRaw(AttackPlanetGame);
            break;
    }
}

const updateLives = (newLives) => {
    lives.value = newLives;
    emit('update:lives', newLives);
};
const updateEarnedStars = (newEarnedStars) => {
    earnedStars.value = newEarnedStars;
};
</script>

<style scoped>
.page-content {
    padding-top: 28px;
}
</style>
