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

registerSW({
    immediate: true,
    onNeedRefresh() {
        console.log('Новая версия доступна');
    },
    onOfflineReady() {
        console.log('PWA готова к оффлайну');
    },
});

app.mount('#app');
