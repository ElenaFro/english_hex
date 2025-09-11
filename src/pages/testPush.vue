<template>
    <subscribe-push-notify :is-visible="subscribePopup" @close-popup="closeSubscribePopup" />
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import SubscribePushNotify from '@/components/popups/SubscribePushNotify.vue';

const userStore = useUserStore();
const subscribePopup = ref(false);

onMounted(async () => {
    if (userStore.isSubscribed === null) await userStore.checkUserSubscribe();
    subscribePopup.value = !userStore.isSubscribed;
});

const closeSubscribePopup = () => {
    subscribePopup.value = !subscribePopup.value;
};
</script>
