<template>
    <div  class="add-page">
		<AddCategories />
	</div>
</template>
<script setup>
import AddCategories from '@/components/AddCategories.vue'
</script>
<style scoped lang="scss">
.add-page {
    height: 100vh;
    width: 100vw; 
    max-width: 414px; 
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, #e0e7ff, #a3bffa);
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;

}
</style>