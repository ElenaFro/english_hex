import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,mp3}'],
                maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
                runtimeCaching: [
                    {
                        urlPattern: /\/planetAttackPage/,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'pages-cache',
                        },
                    },
                ],
            },
            devOptions: {
                enabled: true,
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
            outDir: 'dist',
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
});
