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
                        <img :src="form.category_photo_preview" alt="cover" />
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
            :loading="loading"
            @update:model-value="(val) => (form.cards = val.cards)"
            @publish="saveAction"
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
import { useRouter } from 'vue-router';

const props = defineProps({
    updating: { type: Boolean, default: false },
});

const router = useRouter();
const showAddCard = ref(false);
const categoryStore = useCategoriesStore();
const currentCategory = computed(() => categoryStore.chosedCategory);
const loading = ref(false);
const originalCategory = ref(null);
const originalCards = ref([]);

const saveAction = computed(() => (props.updating ? updateCategory : publishCategory));

const form = reactive({
    name: props.updating ? currentCategory.value.name : '',
    description: props.updating ? currentCategory.value.description : '',
    category_photo: props.updating ? currentCategory.value?.category_photo : null,
    category_photo_preview: null,
    cards: props.updating ? currentCategory.value.cards : [],
});

if (props.updating && currentCategory.value?.category_photo) {
    form.category_photo_preview = `${import.meta.env.VITE_STORAGE_URI}/${currentCategory.value.id}/images/${currentCategory.value.category_photo}`;
}

const uploadCover = useFileUpload();
const { error: coverError, validate } = useImageValidation({
    minWidth: 50,
    minHeight: 50,
    maxWidth: 100,
    maxHeight: 100,
});

const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = await validate(file);
    if (!isValid) return;

    form.category_photo_preview = URL.createObjectURL(file);

    form.category_photo = file;
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

const getCategoryDiff = () => {
    const diff = {};

    if (form.name !== originalCategory.value.name) {
        diff.name = form.name;
    }

    if (form.description !== originalCategory.value.description) {
        diff.description = form.description;
    }

    if (form.category_photo instanceof File) {
        diff.category_photo = form.category_photo;
    }

    return diff;
};

const CARD_DB_FIELDS = ['id', 'word', 'translation_word', 'card_photo', 'audio', 'video'];

const CARD_IGNORED_FIELDS = ['card_photo_preview', 'video_preview', 'audio_preview'];

const getCardDiff = (current, original) => {
    const diff = {};

    CARD_DB_FIELDS.forEach((key) => {
        if (key === 'id') return;
        if (CARD_IGNORED_FIELDS.includes(key)) return;

        const currentValue = current[key];
        const originalValue = original[key];

        if (currentValue instanceof File) {
            diff[key] = currentValue;
            return;
        }

        if (currentValue !== originalValue) {
            diff[key] = currentValue;
        }
    });

    return diff;
};

const getCardsDiff = () => {
    const toCreate = [];
    const toUpdate = [];
    const toDelete = [];

    const originalMap = new Map(originalCards.value.map((card) => [card.id, card]));

    for (const card of form.cards) {
        if (!card.id || !originalMap.has(card.id)) {
            const payload = {};

            CARD_DB_FIELDS.forEach((key) => {
                if (key === 'id') return;
                if (card[key] instanceof File) payload[key] = card[key];
                else payload[key] = card[key] ?? null;
            });

            toCreate.push(payload);
            continue;
        }

        const original = originalMap.get(card.id);
        if (!original) continue;

        const diff = getCardDiff(card, original);

        if (Object.keys(diff).length) {
            toUpdate.push({
                id: card.id,
                ...diff,
            });
        }

        originalMap.delete(card.id);
    }

    for (const [id] of originalMap) {
        toDelete.push(id);
    }

    return { toCreate, toUpdate, toDelete };
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

        const categoryId = response?.category?.id;
        if (!categoryId) {
            push.error({
                title: 'Ошибка создания категории',
                message: 'Категория не создана',
            });
            throw new Error('Не удалось создать категорию');
        }

        await Promise.all(form.cards.map((card) => categoryStore.createCard(categoryId, card)));
        push.success({
            message: 'Категория успешно создана',
        });
        router.push({ name: 'mainPage' });
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

const updateCategory = async () => {
    loading.value = true;
    try {
        validateForm();
        if (!isValid.value) return;

        const categoryDiff = getCategoryDiff();

        if (Object.keys(categoryDiff).length) {
            await categoryStore.updateCategory({
                id: currentCategory.value.id,
                ...categoryDiff,
            });
        }

        const { toCreate, toUpdate, toDelete } = getCardsDiff();

        await Promise.all([
            ...toCreate.map((card) => categoryStore.createCard(currentCategory.value.id, card)),
            ...toUpdate.map((card) => categoryStore.updateCard(card)),
            ...toDelete.map((id) => categoryStore.deleteCard(id)),
        ]);

        push.success({ message: 'Категория успешно обновлена' });
        router.push({ name: 'mainPage' });
    } catch (error) {
        console.error(error);
        push.error({
            title: 'Ошибка обновления категории',
            message: 'Категория не обновлена',
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
            card_photo_preview: `${import.meta.env.VITE_STORAGE_URI}/${currentCategory.value.id}/cards/${item.id}/word_image/${item.card_photo}`,
            video_preview: `${import.meta.env.VITE_STORAGE_URI}/${currentCategory.value.id}/cards/${item.id}/video/${item.video}`,
            audio_preview: `${import.meta.env.VITE_STORAGE_URI}/${currentCategory.value.id}/cards/${item.id}/audio/${item.audio}`,
        }));
    },
    { immediate: true }
);

watch(
    () => currentCategory.value,
    (category) => {
        if (!category || Object.keys(category).length === 0) return;

        originalCategory.value = {
            name: category.name,
            description: category.description,
            category_photo: category.category_photo,
        };

        originalCards.value = category.cards.map((card) => {
            const clean = {};

            CARD_DB_FIELDS.forEach((key) => {
                clean[key] = card[key] ?? null;
            });

            return clean;
        });
    },
    { immediate: true }
);

onUnmounted(() => {
    if (form.category_photo_preview?.startsWith('blob:')) {
        URL.revokeObjectURL(form.category_photo_preview);
    }
    uploadCover.cleanup();
});
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
