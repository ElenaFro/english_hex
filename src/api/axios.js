import axios from 'axios';
import { unref } from 'vue';
import { useUserStore } from '../stores/user';
import router from '@/router';

const apiClient = axios.create({
    baseURL: 'https://dicardz.com/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

let interceptorsInitialized = false;

export function setupInterceptors(pinia) {
    if (!pinia) {
        console.warn('Pinia instance not provided to setupInterceptors');
        return;
    }
    if (interceptorsInitialized) return;

    const authStore = useUserStore(pinia);
    interceptorsInitialized = true;

    apiClient.interceptors.request.use(
        (config) => {
            const token = unref(authStore.token) || localStorage.getItem('access_token');
            config.headers = config.headers ?? {};

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                config._authTokenUsed = token;
            } else {
                delete config.headers.Authorization;
                config._authTokenUsed = null;
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
            const currentToken = unref(authStore.token) || localStorage.getItem('access_token');
            const tokenChanged = requestToken && currentToken && requestToken !== currentToken;
            const isLoggingIn = unref(authStore.isLoggingIn);

            if ((status === 401 || status === 403) && !tokenChanged && !isLoggingIn) {
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
