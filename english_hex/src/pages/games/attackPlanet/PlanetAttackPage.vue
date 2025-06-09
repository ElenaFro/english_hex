<template>
		<div class="">
			<component 
			:is="activeComponent" 
			@switch-component="switchComponent" 
			/>
			<!-- <Popup /> -->
		</div>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import AttackPlanetGame from '@/components/AttackPlanet/AttackPlanetGame.vue';
import AttackPlanetResult from '@/components/AttackPlanet/AttackPlanetResult.vue';
import AttackPlanetLoss from '@/components/AttackPlanet/AttackPlanetLoss.vue';
import AttackPlanetWin from '@/components/AttackPlanet/AttackPlanetWin.vue';
const activeComponent = ref(markRaw(AttackPlanetGame));

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

// const activeComponent = ref(AttackPlanetGame);

// function switchComponent(componentName) {
//     switch (componentName) {
//         case 'AttackPlanetResult':
//             activeComponent.value = AttackPlanetResult;
//             break;
//         case 'AttackPlanetLoss':
//             activeComponent.value = AttackPlanetLoss;
//             break;
//         case 'AttackPlanetWin':
//             activeComponent.value = AttackPlanetWin;
//             break;
//         default:
//             activeComponent.value = AttackPlanetGame;
//             break;
//     }
// }
</script>

<style scoped>
.page-content {
	padding-top: 28px;
}
</style>