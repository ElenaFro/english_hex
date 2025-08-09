<template>
    <div class="notifications-container">
        <div class="content-container note-container">
            <div v-for="item in notifications" :key="item.id" ref="notificationItems">
                <notification-item
                    :notification-text="item.text"
                    :notification-title="item.title"
                    :send-data="item.created_at"
                    :readed="item.readed"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import NotificationItem from './NotificationItem.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const notifications = userStore.notifications;
const notificationItems = ref([]);

let observer = null;

onMounted(() => {
    observer = new IntersectionObserver(
        (entries) => {
            const unreadIds = [];
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = entry.target.dataset.index;
                    const notification = notifications[index];
                    if (notification && !notification.readed) {
                        unreadIds.push(notification.id);
                    }
                }
            });
            if (unreadIds.length > 0) {
                userStore.markReadNotifications(unreadIds);
            }
        },
        { threshold: 0.1 }
    );

    notificationItems.value.forEach((item, index) => {
        if (item) {
            item.dataset.index = index;
            observer.observe(item);
        }
    });
});

onUnmounted(() => {
    if (observer) {
        observer.disconnect();
    }
});
</script>

<style scoped>
.notifications-container {
    width: 100vw;
    max-width: 414px;
    height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    position: relative;
    box-sizing: border-box;
    margin-top: 0px;
    padding-top: 30px;
    background-color: #ffffff;
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
    gap: 16px;
}

.note-container {
    display: flex;
    flex-direction: row;
    align-items: start;
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
    gap: 4px;
}
</style>
