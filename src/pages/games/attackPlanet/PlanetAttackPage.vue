<template>
    <div>
        <component
            :is="activeComponent"
            @switch-component="switchComponent"
            v-bind="componentProps"
            @update:lives="updateLives"
            @update:earnedStars="updateEarnedStars"
        />
    </div>
</template>

<script setup>
import { ref, markRaw, defineEmits, computed } from 'vue';
import AttackPlanetGame from '@/components/AttackPlanet/AttackPlanetGame.vue';
import AttackPlanetResult from '@/components/AttackPlanet/AttackPlanetResult.vue';
import AttackPlanetLoss from '@/components/AttackPlanet/AttackPlanetLoss.vue';
import AttackPlanetWin from '@/components/AttackPlanet/AttackPlanetWin.vue';

const emit = defineEmits(['update:lives', 'switch-component']);

const activeComponent = ref(markRaw(AttackPlanetLoss));
const lives = ref(5);
const earnedStars = ref(0);

const componentProps = computed(()=>  ({
  lives: lives.value,
  earnedStars: earnedStars.value
}))
const textForAllStarsGiven = `Продолжайте изучение новых слов и\u00A0не\u00A0забывайте возвращаться для закрепления изученных слов!!`;
const titleForAllStarsGiven = `Вы заработали максимальное количество звезд по\u00A0данной игре в\u00A0выбранной категории`;

function switchComponent(componentName) {
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
