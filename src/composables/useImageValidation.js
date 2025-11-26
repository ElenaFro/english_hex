// src/composables/useImageValidation.js
import { ref } from 'vue';

export function useImageValidation({ minWidth = 0, minHeight = 0, maxWidth, maxHeight }) {
    const error = ref(null);

    const validateAndUpload = async (file, uploadHandler) => {
        error.value = null;

        if (!file.type.startsWith('image/')) {
            error.value = 'Выберите только изображение.';
            return null;
        }

        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const { naturalWidth: width, naturalHeight: height } = img;

                if (
                    width < minWidth ||
                    width > maxWidth ||
                    height < minHeight ||
                    height > maxHeight
                ) {
                    error.value = `Размер изображения должен быть от ${minWidth}×${minHeight} до ${maxWidth}×${maxHeight} пикселей. Текущий: ${width}×${height}.`;
                    resolve(null);
                    return;
                }

                const uploadResult = uploadHandler(file);

                if (uploadResult && typeof uploadResult.then === 'function') {
                    uploadResult
                        .then((result) => {
                            resolve(result);
                        })
                        .catch((err) => {
                            error.value = 'Ошибка загрузки изображения.';
                            resolve(null);
                        });
                } else {
                    resolve(uploadResult);
                }
            };
            img.onerror = () => {
                error.value = 'Ошибка загрузки изображения.';
                resolve(null);
            };
            img.src = URL.createObjectURL(file);
        });
    };

    return {
        error,
        validateAndUpload,
    };
}
