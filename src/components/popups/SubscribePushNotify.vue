<template>
    <default-popup
        :is-visible="isVisible"
        title="Подпишись на уведомления от Di!"
        message="Чтобы не пропустить важных уведомлений и получать напоминания для продожения изучения и закрепления новых слов, подпишись на push-уведомления от Di"
        @close="emit('closePopup')"
    >
        <template #actions>
            <button class="button button-cancel" @click="emit('closePopup')">Отменить</button>
            <button class="button button-confirm" @click="subscribeNotification">
                Подписаться
            </button>
        </template>
    </default-popup>
</template>

<script setup>
import defaultPopup from './defaultPopup.vue';
import { useUserStore } from '@/stores/user';
import apiClient from '@/api/axios';

defineProps({
    isVisible: { type: Boolean, default: false },
});

const emit = defineEmits(['closePopup']);

navigator.serviceWorker.register('sw.js');

const subscribeNotification = async () => {
    try {
        const permission = await Notification.requestPermission();

        if (permission !== 'granted') {
            console.warn('Пользователь запретил уведомления');
            return;
        }

        const sw = await navigator.serviceWorker.ready;

        const subscription = await sw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey:
                'BIx6eDWy8MH4lu7NrstPPURGABtp3hR7_tZZae15_Po_gm75kwmWsBmT8rq1EciHsfiYSHx3q_jwrXjmsV9ivJ8',
        });

        await apiClient.patch('/push/subscribe', subscription);

        alert('Ураа, теперь ты на связи с Di');

        const userStore = useUserStore();
        userStore.checkUserSubscribe();
    } catch (error) {
        console.error('Ошибка при подписке на уведомления:', error);
    }
};
</script>

<style scoped lang="scss">
.button {
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    &-confirm {
        background: #262060;
    }
    &-cancel {
        background: #525252;
        margin-right: 10px;
    }
}

.confirm-button:hover {
    background-color: #262567;
}
</style>
