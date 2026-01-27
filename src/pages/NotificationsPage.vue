<template>
    <div class="notification-page">
        <Notification />
        <button v-if="isAdmin" @click="goToCreateNotify" class="button button--blue">
            Новое уведомление
        </button>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import Notification from '@/components/Notification.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const isAdmin = computed(() => userStore.isAdmin);

const router = useRouter();

const goToCreateNotify = () => {
    router.push({ name: 'createNotification' });
};
</script>
<style scoped lang="scss">
.notification-page {
    position: relative;
    height: 100vh;
    width: 100vw;
    max-width: 414px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f6f6fe;
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
}

.button {
    position: absolute;
    right: 4%;
    bottom: 15%;
}
</style>
