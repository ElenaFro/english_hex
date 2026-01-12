<template>
    <div class="page-container">
        <div v-if="!showAddCard" class="categoryAddContainer">
            <div class="cover-upload">
                <label class="cover-box" :class="{ error: errors.category_photo }">
                    <input
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="handleCoverUpload"
                    />
                    <div v-if="form.category_photo" class="cover-preview">
                        <img :src="form.category_photo" alt="cover" />
                    </div>
                    <div v-else class="plus">+</div>
                </label>
                <span v-if="coverError" class="error-msg text-center">{{ coverError }}</span>
            </div>

            <div class="form-group" :class="{ error: errors.name }">
                <label>Название категории</label>
                <input v-model="form.name" type="text" placeholder="Введите название" />
                <span v-if="errors.name" class="error-msg">Поле заполнено некорректно</span>
            </div>

            <div class="form-group" :class="{ error: errors.description }">
                <label>Описание категории</label>
                <textarea v-model="form.description" placeholder="Введите описание"></textarea>
                <span v-if="errors.description" class="error-msg">Поле заполнено некорректно</span>
            </div>

            <div class="btn_container">
                <button class="continue-btn" @click="submitForm">Продолжить</button>
            </div>
        </div>
        <add-card-to-category
            v-else
            :model-value="{ cards: form.cards }"
            @update:model-value="(val) => (form.cards = val.cards)"
            @publish="publishCategory"
        />
    </div>
</template>

<script setup>
//vue
import { reactive, ref, onUnmounted, computed, watch } from 'vue';
//comonents
import addCardToCategory from './addCardToCategory.vue';
//composables
import { useFormValidation } from '@/composables/useFormValidation';
import { useFileUpload } from '@/composables/useFileUpload';
import { useImageValidation } from '@/composables/useImageValidation';
import { useCategoriesStore } from '@/stores/categories';
import { Notivue, Notification, push } from 'notivue';

const props = defineProps({
    updating: { type: Boolean, default: false },
});

const showAddCard = ref(false);
const categoryStore = useCategoriesStore();
const currentCategory = computed(() => categoryStore.chosedCategory);
const loading = ref(false);

const form = reactive({
    name: props.updating ? currentCategory.value.name : '',
    description: props.updating ? currentCategory.value.description : '',
    category_photo: props.updating
        ? `${import.meta.env.VITE_STORAGE_URI}/${currentCategory.value?.id}/images/${currentCategory.value.category_photo}`
        : null,
    cards: props.updating ? currentCategory.value.cards : [],
});

const uploadCover = useFileUpload();
const { error: coverError, validateAndUpload } = useImageValidation({
    minWidth: 50,
    minHeight: 50,
    maxWidth: 100,
    maxHeight: 100,
});

const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await validateAndUpload(file, uploadCover.handleUpload);
    if (result) {
        form.category_photo = result;
        e.target.value = '';
    } else {
        e.target.value = '';
    }
};

const { errors, validateForm, isValid } = useFormValidation(form, {
    name: (val) => {
        const trimmed = val?.trim() || '';
        if (!trimmed) return true;
        const englishRegex = /^[a-zA-Z\s]+$/;
        return !englishRegex.test(trimmed);
    },
    description: (val) => !val.trim(),
    category_photo: (val) => !val,
});

const submitForm = () => {
    validateForm();
    if (isValid.value) {
        showAddCard.value = true;
    }
};

const publishCategory = async () => {
    loading.value = true;
    validateForm();
    if (!isValid.value) return;

    try {
        const response = await categoryStore.createCategory({
            name: form.name,
            description: form.description,
            category_photo: form.category_photo,
        });

        const categoryId = response?.data?.id;
        if (!categoryId) {
            push.error({
                title: 'Ошибка создания категории',
                message: 'Категория не создана',
            });
            throw new Error('Не удалось создать категорию');
        }

        await Promise.all(form.cards.map((card) => categoryStore.createCard(categoryId, card)));
    } catch (error) {
        console.error(error);
        push.error({
            title: 'Ошибка создания категории',
            message: 'Категория не создана',
        });
    } finally {
        loading.value = false;
    }
};

watch(
    () => props.updating,
    (isUpdating) => {
        if (!isUpdating || !currentCategory.value?.cards) return;

        form.cards = currentCategory.value.cards.map((item) => ({
            ...item,
            card_photo: `${import.meta.env.VITE_STORAGE_URI}/${currentCategory.value.id}/cards/${item.id}/word_image/${item.card_photo}`,
            video: `${import.meta.env.VITE_STORAGE_URI}/${currentCategory.value.id}/cards/${item.id}/video/${item.video}`,
            audio: `${import.meta.env.VITE_STORAGE_URI}/${currentCategory.value.id}/cards/${item.id}/audio/${item.audio}`,
        }));
    },
    { immediate: true }
);

onUnmounted(() => uploadCover.cleanup());
</script>

<style scoped>
.page-container {
    padding: 20px 0 0 0 !important;
}
.cover-upload {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 4px;
}
.cover-box {
    width: min(40dvw, 115px);
    height: min(20dvh, 146px);
    background: #2e236d;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 32px;
    cursor: pointer;
}
.cover-preview img {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    object-fit: cover;
}
.hidden {
    display: none;
}
.form-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    width: 100%;
}
.form-group label {
    margin-bottom: 6px;
    font-size: 14px;
    color: #311d5d;
    font-family: Mulish;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 20px;
    line-height: 100%;
    letter-spacing: 0%;
}

.d-mb-20 {
    margin-bottom: 20px !important;
}

input,
textarea {
    border: 2px solid #4700b547;
    border-radius: 8px;
    padding: 10px;
    font-size: 14px;
    outline: none;
    font-family: Mulish;
    font-weight: 400;
    font-style: Regular;
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0%;
    color: #262060;
}
textarea {
    min-height: 112px;
}
.form-group.error input,
.form-group.error textarea,
.cover-box.error {
    border: 2px solid #c6070b80;
}
.error-msg {
    font-size: 12px;
    color: red;
    margin-top: 4px;
}

.cards {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}
.card-box {
    width: min(40dvw, 104px);
    height: min(20dvh, 138px);
    border: 2px dashed #262060;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.plus {
    font-size: 4rem;
}
.card-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem !important;
    color: #262060;
}
.card-img img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    object-fit: cover;
}
.card-box.add {
    font-size: 3rem;
    color: #262060;
}

.btn_container {
    display: flex;
    justify-content: flex-start;
    width: 100%;
}

.continue-btn {
    width: 160px;
    padding: 12px 24px;
    background: #2e236d;
    color: white;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    font-family: Mulish;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 18px;
    line-height: 120%;
    letter-spacing: 0%;
}

.categoryAddContainer {
    width: 100%;
    height: auto;
    padding: 0 20px;
}
</style>
