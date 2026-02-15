import axios from 'axios';
import { useUserStore } from '../stores/user';
import router from '@/router';

const apiClient = axios.create({
    baseURL: 'https://dicardz.com/api/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

export function setupInterceptors(pinia) {
    if (!pinia) {
        console.warn('Pinia instance not provided to setupInterceptors');
        return;
    }

    const authStore = useUserStore(pinia);

    apiClient.interceptors.request.use(
        (config) => {
            const token = authStore.token || localStorage.getItem('access_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                config._authTokenUsed = token;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    apiClient.interceptors.response.use(
        (response) => response,
        (error) => {
            const status = error.response?.status;
            const requestToken = error.config?._authTokenUsed;
            const currentToken = authStore.token || localStorage.getItem('access_token');
            const tokenChanged = requestToken && currentToken && requestToken !== currentToken;

            if ((status === 401 || status === 403) && !tokenChanged && !authStore.isLoggingIn) {
                authStore.logout();
            }

            if ([404, 408, 410, 500, 501, 502, 503].includes(status)) {
                router?.push(`/error/${status}`);
            }

            return Promise.reject(error.response?.data || { message: 'Server error' });
        }
    );
}

export default apiClient;
