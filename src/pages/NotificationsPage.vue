<template>
    <div class="notification-page">
        <Notification />
    </div>
</template>
<script setup>
import Notification from '@/components/Notification.vue';
</script>
<style scoped lang="scss">
.notification-page {
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
</style>
