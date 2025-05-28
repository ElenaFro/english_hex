import axios from "axios";
import { useAuthStore } from "../stores/auth";

const apiClient = axios.create({
  baseURL: "http://62.109.0.225:8000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export function setupInterceptors(pinia) {
  if (!pinia) {
    console.warn("Pinia instance not provided to setupInterceptors");
    return;
  }

  const authStore = useAuthStore(pinia);

  apiClient.interceptors.request.use(
    (config) => {
      const token = authStore.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        authStore.logout();
      }
      return Promise.reject(
        error.response?.data || { message: "Server error" }
      );
    }
  );
}

export default apiClient;
