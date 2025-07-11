import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { setupInterceptors } from "./api/axios";

import "@/assets/styles/styles.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

setupInterceptors(pinia);

app.mount("#app");
