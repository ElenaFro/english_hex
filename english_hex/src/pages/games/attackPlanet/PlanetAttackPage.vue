<template>
		<div class="">
			<component 
			:is="activeComponent" 
			@switch-component="switchComponent" 
            :lives="lives"
            :earnedStars="earnedStars" 
            @update:lives="updateLives"
            @update:earnedStars="updateEarnedStars"
			/>
		</div>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import AttackPlanetGame from '@/components/AttackPlanet/AttackPlanetGame.vue';
import AttackPlanetResult from '@/components/AttackPlanet/AttackPlanetResult.vue';
import AttackPlanetLoss from '@/components/AttackPlanet/AttackPlanetLoss.vue';
import AttackPlanetWin from '@/components/AttackPlanet/AttackPlanetWin.vue';
const activeComponent = ref(markRaw(AttackPlanetGame));
const lives = ref(5); // Изначальное количество жизней
const earnedStars = ref(parseInt(localStorage.getItem('earnedStars')) || 0); 

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
        default:
            activeComponent.value = markRaw(AttackPlanetGame);
            break;
    }
}

const updateLives = (newLives) => {
    lives.value = newLives; // Обновляем количество жизней
};
const updateEarnedStars = (newEarnedStars) => {
    earnedStars.value = newEarnedStars; // Обновляем количество звезд
};
</script>

<style scoped>
.page-content {
	padding-top: 28px;
}
</style>