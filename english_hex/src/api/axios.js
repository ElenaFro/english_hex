import axios from "axios";
import { boot } from "quasar/wrappers";

const apiClient = axios.create({
  baseURL: "https://api.english_hex.com",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});


export { apiClient };

export default boot(({ store }) => {
  apiClient.interceptors.request.use(
    (config) => {
      const authStore = store.use("auth");
      const token = authStore.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  //для обработки ответов
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const authStore = store.use("auth");
      if (error.response?.status === 401) {
        authStore.logout();
      }
      return Promise.reject(
        error.response?.data || { message: "Server error" }
      );
    }
  );
});
