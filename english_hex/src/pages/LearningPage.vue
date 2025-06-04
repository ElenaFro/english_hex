<template>
		<div class="page-content">
			<component 
			:is="activeComponent" 
			@switch-component="switchComponent" 
			/>
			<Popup />
		</div>
</template>

<script setup>
import { ref } from 'vue'
import StartLerning from '../components/Learning/StartLerning.vue';
import LessonsPage from '../components/Learning/LessonsPage.vue';
import Popup from '../components/popups/defaultPopup.vue';

const activeComponent = ref(StartLerning)

function switchComponent () {
	activeComponent.value = LessonsPage
}

</script>

<style scoped>
.page-content {
	padding-top: 28px;
}
</style>