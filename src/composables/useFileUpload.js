import { ref } from 'vue';
export const useFileUpload = () => {
    const url = ref(null);
    const handleUpload = (file) => {
        if (url.value) URL.revokeObjectURL(url.value);
        return (url.value = URL.createObjectURL(file));
    };
    const cleanup = () => {
        if (url.value) URL.revokeObjectURL(url.value);
        url.value = null;
    };
    return { handleUpload, cleanup };
};
