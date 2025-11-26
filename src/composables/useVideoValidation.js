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

    const validateAndUpload = async (file, uploadHandler) => {
        error.value = null;

        if (!file.type.startsWith('video/')) {
            error.value = 'Выберите только видео-файл.';
            return null;
        }

        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';

            video.onloadedmetadata = () => {
                const { videoWidth: width, videoHeight: height } = video;

                if (exactWidth !== undefined && exactHeight !== undefined) {
                    if (width !== exactWidth || height !== exactHeight) {
                        error.value = `Разрешение видео должно быть ровно ${exactWidth}×${exactHeight} пикселей. Текущее: ${width}×${height}.`;
                        URL.revokeObjectURL(video.src);
                        resolve(null);
                        return;
                    }
                } else {
                    if (
                        width < minWidth ||
                        width > maxWidth ||
                        height < minHeight ||
                        height > maxHeight
                    ) {
                        error.value = `Разрешение видео должно быть от ${minWidth}×${minHeight} до ${maxWidth}×${maxHeight} пикселей. Текущее: ${width}×${height}.`;
                        URL.revokeObjectURL(video.src);
                        resolve(null);
                        return;
                    }
                }

                const uploadResult = uploadHandler(file);

                if (uploadResult && typeof uploadResult.then === 'function') {
                    uploadResult
                        .then((result) => {
                            resolve(result);
                        })
                        .catch((err) => {
                            error.value = 'Ошибка загрузки видео.';
                            resolve(null);
                        });
                } else {
                    resolve(uploadResult);
                }
            };

            video.onerror = () => {
                error.value = 'Ошибка загрузки видео.';
                resolve(null);
            };

            video.src = URL.createObjectURL(file);
        });
    };

    return {
        error,
        validateAndUpload,
    };
}
