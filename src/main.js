import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { setupInterceptors } from './api/axios';
import { registerSW } from 'virtual:pwa-register';
import { createNotivue } from 'notivue';
import 'notivue/notifications.css';
import 'notivue/animations.css'

import '@/assets/styles/styles.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(
    createNotivue({
        position: 'top-center',
        limit: 1,
        enqueue: true,
        avoidDuplicates: true,
        notifications: {
            global: {
                duration: 6000,
            },
        },
    })
);

setupInterceptors(pinia);

registerSW({
    immediate: true,
});

app.mount('#app');
