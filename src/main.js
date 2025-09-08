import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { setupInterceptors } from './api/axios';
import { registerSW } from 'virtual:pwa-register';

import '@/assets/styles/styles.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

setupInterceptors(pinia);

// Регистрация сервис-воркера
const sw = registerSW({
    immediate: true,
    onRegisteredSW(swUrl, registration) {
        console.log('Service Worker зарегистрирован:', swUrl);
        // Настройка push-уведомлений
        if (registration) {
            // Запрашиваем разрешение на уведомления
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    console.log('Разрешение на уведомления получено');
                    // Подписка на push-уведомления
                    registration.pushManager
                        .subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: 'ВАШ_КЛЮЧ_VAPID', // Замените на ваш публичный ключ VAPID
                        })
                        .then((subscription) => {
                            console.log('Подписка на push-уведомления:', subscription);
                            // Отправьте subscription на ваш сервер для отправки уведомлений
                        })
                        .catch((err) => {
                            console.error('Ошибка подписки:', err);
                        });
                }
            });
        }
    },
});

app.mount('#app');
