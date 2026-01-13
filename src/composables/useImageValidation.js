// src/composables/useImageValidation.js
import { ref } from 'vue';

export function useImageValidation({ minWidth = 0, minHeight = 0, maxWidth, maxHeight }) {
    const error = ref(null);

    const validate = async (file) => {
        error.value = null;

        if (!file || !file.type.startsWith('image/')) {
            error.value = 'Выберите изображение.';
            return false;
        }

        return new Promise((resolve) => {
            const img = new Image();

            img.onload = () => {
                const { naturalWidth: width, naturalHeight: height } = img;

                if (
                    width < minWidth ||
                    (maxWidth && width > maxWidth) ||
                    height < minHeight ||
                    (maxHeight && height > maxHeight)
                ) {
                    error.value = `Размер изображения должен быть от ${minWidth}×${minHeight} до ${maxWidth}×${maxHeight}. Текущий: ${width}×${height}.`;
                    resolve(false);
                    return;
                }

                resolve(true);
            };

            img.onerror = () => {
                error.value = 'Ошибка чтения изображения.';
                resolve(false);
            };

            img.src = URL.createObjectURL(file);
        });
    };

    return {
        error,
        validate,
    };
}
