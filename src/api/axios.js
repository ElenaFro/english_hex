import axios from 'axios';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

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

    const authStore = useUserStore(pinia);

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
			const status = error.response?.status

			if (status === 401) {
				authStore.logout();
			}
			
			if ([404, 408, 410, 500, 501, 502, 503].includes(status)) {
				router.push(`/error/${status}`)
			}

			return Promise.reject(
				error.response?.data || { message: "Server error" }
			);
    	}
  	);
}

export default apiClient;
