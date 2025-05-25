<template>
    <div>
        <Header />
		<AddCategories v-if="user"/>
        <NotAddCategories v-if="admin"/>
	</div>
</template>
<script setup>
import AddCategories from '@/components/AddCategories.vue'
import Header from '@/components/Header.vue'
import { ref } from 'vue';
const admin = ref(false);
const user = ref(true);
</script>
<style scoped>
</style>