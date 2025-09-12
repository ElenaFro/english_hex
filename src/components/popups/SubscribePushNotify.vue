<template>
    <default-popup
        :is-visible="isVisible"
        title="Подпишись на&nbsp;уведомления от Di!"
        :message="message"
        :padding-class="paddingClass"
        titleLeft
        messageLeft
        @close="emit('closePopup')"
    >
        <template #actions>
            <button class="button button-cancel" @click="emit('reject')">Позже</button>
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

const message = `Чтобы не\u00A0пропускать важных уведомлений, получать напоминания об обучении и\u00A0закрепления новых слов, подпишись на рассылку push\u2011уведомления от Di!`;

const paddingClass = {
    padding: '22px 22px 28px 22px',
};

const emit = defineEmits(['closePopup', 'reject']);

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

        const userStore = useUserStore();
        userStore.checkUserSubscribe();
        emit('closePopup');
    } catch (error) {
        console.error('Ошибка при подписке на уведомления:', error);
    }
};
</script>

<style scoped lang="scss">
.button {
    border: none;
    border-radius: 20px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    &-confirm {
        background: #262060;
        color: #ffffff;
        padding: 10px 20px;
    }
    &-cancel {
        background: #ffffff;
        margin-right: 5px;
        color: #000000;
        border: 2px solid #262060;
        padding: 8px 20px;
    }
}

.confirm-button:hover {
    background-color: #262567;
}
</style>
