// src/composables/useVideoValidation.js
import { ref } from 'vue';

export function useVideoValidation({
    exactWidth,
    exactHeight,
    minWidth = 0,
    minHeight = 0,
    maxWidth = Infinity,
    maxHeight = Infinity,
}) {
    const error = ref(null);

    const validateVideo = async (file) => {
        error.value = null;

        if (!file || !file.type.startsWith('video/')) {
            error.value = 'Выберите видео-файл.';
            return false;
        }

        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';

            video.onloadedmetadata = () => {
                const { videoWidth: width, videoHeight: height } = video;

                if (
                    exactWidth !== undefined &&
                    exactHeight !== undefined &&
                    (width !== exactWidth || height !== exactHeight)
                ) {
                    error.value = `Разрешение видео должно быть ${exactWidth}×${exactHeight}px. Сейчас: ${width}×${height}px.`;
                    URL.revokeObjectURL(video.src);
                    resolve(false);
                    return;
                }

                if (
                    exactWidth === undefined &&
                    (width < minWidth ||
                        width > maxWidth ||
                        height < minHeight ||
                        height > maxHeight)
                ) {
                    error.value = `Разрешение видео должно быть от ${minWidth}×${minHeight} до ${maxWidth}×${maxHeight}px. Сейчас: ${width}×${height}px.`;
                    URL.revokeObjectURL(video.src);
                    resolve(false);
                    return;
                }

                URL.revokeObjectURL(video.src);
                resolve(true);
            };

            video.onerror = () => {
                error.value = 'Ошибка чтения видео.';
                resolve(false);
            };

            video.src = URL.createObjectURL(file);
        });
    };

    return {
        error,
        validateVideo,
    };
}
