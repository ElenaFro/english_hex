import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

throw new Error('error');

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
                enabled: true, // чтобы работало во время разработки
            },
            manifest: {
                name: 'My Vue App',
                short_name: 'VueApp',
                start_url: '/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#000000',
                icons: [
                    {
                        src: '/icon.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/icon.png',
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
        port: 5173,
        watch: {
            usePolling: true,
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
