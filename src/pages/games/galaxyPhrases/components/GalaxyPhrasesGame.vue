<template>
    <div></div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { onMounted, onUnmounted } from 'vue';

const userStore = useUserStore();

onMounted(() => {
    userStore.setHeaderTitle('Контекст');
});

onUnmounted(()=>{
    userStore.setHeaderTitle(null)
})
</script>
