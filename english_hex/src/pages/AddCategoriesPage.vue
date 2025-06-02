<template>
    <div  class="add-page">
		<!-- <AddCategories /> -->
<AddCategoriesPopup v-if="openPopup" :title="titlePopup" :message="messagePopup" :sound-mp3="SoundForPopup"
		@close="closePopup" @arrow-click="closePopup" />
	</div>
</template>
<script setup>
import AddCategories from '@/components/AddCategories.vue'
import { ref, onMounted } from 'vue';
import AddCategoriesPopup from '@/components/popups/AddCategoriesPopup.vue';
import SoundForPopup from '@/assets/audio/helloFromDi.mp3'
const loading = ref(true);
const openPopup = ref(false);

onMounted(() => {
	loading.value = false;
	openPopup.value = true;
})

const closePopup = () => {
	opePopup.value = !openPopup.value
}
const titlePopup = 'Упс, что-то не так';
const messagePopup = 'Данная функция временно недоступна, ждите дальнейших обновлений!';
</script>
<style scoped lang="scss">
.add-page {
    height: 100vh;
    width: 100vw; 
    max-width: 414px; 
    display: flex;
    flex-direction: column;
    align-items: center;
    // background: linear-gradient(135deg, #e0e7ff, #a3bffa);
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
}
</style>