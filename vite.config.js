import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            strategies: 'generateSW', // Используем generateSW вместо injectManifest
            workbox: {
                globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,mp3}'],
                maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
                // Настройка Workbox для push-уведомлений (опционально)
                runtimeCaching: [
                    {
                        urlPattern: /.*/i,
                        handler: 'NetworkFirst',
                    },
                ],
            },
            devOptions: {
                enabled: true,
                type: 'module', // Убедитесь, что сервис-воркер работает как ES-модуль
            },
            manifest: {
                name: 'dicardz',
                short_name: 'dicardz',
                start_url: '/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#000000',
                icons: [
                    {
                        src: '/icon_192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/icon_512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 8000,
        watch: {
            usePolling: true,
        },
        headers: {
            'Service-Worker-Allowed': '/',
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import "@/assets/styles/styles.scss";',
            },
        },
    },
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
            },
        },
    },
});
