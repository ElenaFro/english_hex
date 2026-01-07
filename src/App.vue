<template>
    <div>
        <RouterView />
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { useUserStore } from './stores/user';
onMounted(async () => {
    const userStore = useUserStore();
    if (userStore.token) {
        await userStore.fetchUser();
        await userStore.getUserRole();
    }
});
</script>
