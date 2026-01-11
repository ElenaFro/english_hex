<template>
    <div>
        <RouterView />
        <Notivue v-slot="item">
            <Notification :item="item" />
        </Notivue>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { useUserStore } from './stores/user';
import { Notivue, Notification } from 'notivue';
onMounted(async () => {
    const userStore = useUserStore();
    if (userStore.token) {
        await userStore.fetchUser();
        await userStore.getUserRole();
    }
});
</script>
