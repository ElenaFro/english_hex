<template>
    <div class="page-container">
        <!-- Шаг 1: Информация о категории -->
        <div v-if="step === '1'" class="categoryAddContainer">
            <div class="cover-upload">
                <label
                    class="cover-box"
                    :class="{
                        error: errors.category_photo,
                        'cover-box--filled': form.category_photo,
                    }"
                >
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

            <div class="radio-group">
                <label class="radio-label">
                    <input type="radio" v-model="form.is_paid" :value="false" />
                    <span>Бесплатная</span>
                </label>
                <label class="radio-label">
                    <input type="radio" v-model="form.is_paid" :value="true" />
                    <span>Платная</span>
                </label>
            </div>

            <div class="btn_container">
                <button class="continue-btn" @click="submitForm">Продолжить</button>
            </div>
        </div>

        <!-- Шаг 2: editing → меню выбора редактирования; creating → список карточек -->
        <add-category-edit-select
            v-else-if="step === '2' && props.updating"
            @edit-category="goToStep('9')"
            @edit-game="goToStep('4')"
        />
        <add-card-to-category
            v-else-if="step === '2' && !props.updating"
            :model-value="{ cards: form.cards }"
            :loading="loading"
            @update:model-value="(val) => (form.cards = val.cards)"
            @open-card="openCardForm"
            @add-game="goToStep('4')"
            @publish="saveAction"
        />

        <!-- Шаг 3: Форма создания/редактирования карточки -->
        <card-create-form
            v-else-if="step === '3'"
            :model-value="editingCard"
            @update:model-value="updateEditingCard"
            @save="handleCardSave"
            @close="handleCardClose"
        />

        <!-- Шаг 4: Меню создания игры -->
        <add-category-game
            v-else-if="step === '4'"
            :tasks="form.tasks"
            :loading="loading"
            @add-task="openTaskForm(null)"
            @edit-task="(i) => openTaskForm(i)"
            @delete-task="(i) => form.tasks.splice(i, 1)"
            @preview="goToStep('6')"
        />

        <!-- Шаг 5: Форма создания/редактирования задания -->
        <add-category-task
            v-else-if="step === '5'"
            :model-value="editingTask"
            @save="handleTaskSave"
            @close="goToStep('4')"
        />

        <!-- Шаг 6: Обзор категории перед публикацией -->
        <add-category-overview
            v-else-if="step === '6'"
            :name="form.name"
            :description="form.description"
            :cards="form.cards"
            :loading="loading"
            :progress="publishProgress"
            :failed-count="failedCount"
            :is-updating="props.updating"
            @preview-deck="goToStep('7')"
            @preview-game="goToStep('8')"
            @edit="goToStep('9')"
            @publish="saveAction"
            @retry="saveAction"
        />

        <!-- Шаг 7: Предпросмотр колоды -->
        <lessons-page
            v-else-if="step === '7'"
            :props-cards="form.cards"
            is-preview
            @close-preview="goToStep('6')"
        />

        <!-- Шаг 8: Предпросмотр игры -->
        <galaxy-phrases-game
            v-else-if="step === '8'"
            :questions="form.tasks"
            is-preview
            @finish="goToStep('6')"
        />

        <!-- Шаг 9: editing → список карточек; creating → меню выбора редактирования -->
        <add-card-to-category
            v-else-if="step === '9' && props.updating"
            :model-value="{ cards: form.cards }"
            :loading="loading"
            :show-save="true"
            @update:model-value="(val) => (form.cards = val.cards)"
            @open-card="openCardForm"
            @save="handleCardsSave"
            @publish="saveAction"
        />
        <add-category-edit-select
            v-else-if="step === '9' && !props.updating"
            @edit-category="goToStep('2')"
            @edit-game="goToStep('4')"
        />
    </div>
</template>

<script setup>
//vue
import { reactive, ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
//components
import addCardToCategory from './addCardToCategory.vue';
import cardCreateForm from './cardCreateForm.vue';
import addCategoryGame from './AddCategoryGame.vue';
import addCategoryTask from './AddCategoryTask.vue';
import addCategoryOverview from './AddCategoryOverview.vue';
import addCategoryEditSelect from './AddCategoryEditSelect.vue';
import lessonsPage from '@/components/Learning/LessonsPage.vue';
import galaxyPhrasesGame from '@/pages/games/galaxyPhrases/components/GalaxyPhrasesGame.vue';
//composables
import { useFormValidation } from '@/composables/useFormValidation';
import { useFileUpload } from '@/composables/useFileUpload';
import { useImageValidation } from '@/composables/useImageValidation';
import { useCategoriesStore } from '@/stores/categories';
import { useUserStore } from '@/stores/user';
import { push } from 'notivue';

const props = defineProps({
    updating: { type: Boolean, default: false },
});

const route = useRoute();
const router = useRouter();
const categoryStore = useCategoriesStore();
const userStore = useUserStore();
const currentCategory = computed(() => categoryStore.selectedCategory);
const loading = ref(false);
const publishProgress = ref(0);
const createdCategoryId = ref(null);
const failedCards = ref([]);
const failedTasks = ref([]);
const pendingRetry = ref(null); 
const failedCount = computed(() => {
    if (pendingRetry.value) {
        const { categoryDiff, toCreate, toUpdate, toDelete, toCreateTasks, toUpdateTasks, toDeleteTaskIds } = pendingRetry.value;
        return (Object.keys(categoryDiff ?? {}).length ? 1 : 0)
            + toCreate.length + toUpdate.length + toDelete.length
            + toCreateTasks.length + toUpdateTasks.length + toDeleteTaskIds.length;
    }
    return failedCards.value.length + failedTasks.value.length;
});
const originalCategory = ref(null);
const originalCards = ref([]);
const originalTasks = ref([]);

const form = reactive({
    name: props.updating ? currentCategory.value.name : '',
    description: props.updating ? currentCategory.value.description : '',
    category_photo: props.updating ? currentCategory.value?.category_photo : null,
    category_photo_preview: null,
    is_paid: props.updating ? (currentCategory.value?.is_paid ?? false) : false,
    cards: props.updating ? currentCategory.value.cards : [],
    tasks: props.updating ? (currentCategory.value?.tasks ?? []) : [],
});

// ─── Навигация по шагам ──────────────────────────────────────────────────────
const step = computed(() => route.query.step ?? '1');

const goToStep = (s) => router.push({ query: { step: s } });

const isFormFilled = computed(() =>
    props.updating
        ? Boolean(currentCategory.value?.id)
        : Boolean(form.name && form.description && form.category_photo)
);

watch(
    step,
    (newStep) => {
        if (newStep !== '1' && !isFormFilled.value) {
            router.replace({ query: { step: '1' } });
        }
    },
    { immediate: true }
);

// ─── Состояние формы карточки (поднято из addCardToCategory) ─────────────────
const editingIndex = ref(null);
const editingCard = ref({});

const openCardForm = ({ index = null, card = {} }) => {
    editingIndex.value = index;
    editingCard.value = { ...card };
    goToStep('3');
};

const updateEditingCard = (updated) => {
    editingCard.value = { ...updated };
};

const handleCardSave = (savedCard) => {
    const saved = {
        ...savedCard,
        id: editingIndex.value === null ? Date.now() : savedCard.id,
    };
    if (editingIndex.value !== null) {
        form.cards[editingIndex.value] = saved;
    } else {
        form.cards.push(saved);
    }
};

const handleCardClose = () => {
    // editing: список карточек на шаге 9; creating: на шаге 2
    goToStep(props.updating ? '9' : '2');
};

// Сохранение карточек в режиме редактирования → возврат к меню редактирования
const handleCardsSave = async () => {
    loading.value = true;
    try {
        const { toCreate, toUpdate, toDelete } = getCardsDiff();
        await Promise.all([
            ...toCreate.map((card) => categoryStore.createCard(currentCategory.value.id, card)),
            ...toUpdate.map((card) => categoryStore.updateCard(card)),
            ...toDelete.map((id) => categoryStore.deleteCard(id)),
        ]);
        push.success({ message: 'Карточки обновлены' });
        goToStep('2'); // возврат к меню выбора редактирования
    } catch (error) {
        console.error(error);
        push.error({ title: 'Ошибка', message: 'Не удалось обновить карточки' });
    } finally {
        loading.value = false;
    }
};

// ─── Шаг 4-5: задания игры ────────────────────────────────────────────────────
const editingTaskIndex = ref(null);
const editingTask = ref(null);

const openTaskForm = (index = null) => {
    editingTaskIndex.value = index;
    editingTask.value = index !== null ? { ...form.tasks[index] } : null;
    goToStep('5');
};

const handleTaskSave = (task) => {
    if (editingTaskIndex.value !== null) {
        form.tasks[editingTaskIndex.value] = task;
    } else {
        form.tasks.push(task);
    }
    goToStep('4');
};

// ─── Форма категории ──────────────────────────────────────────────────────────
const saveAction = computed(() => (props.updating ? updateCategory : publishCategory));

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
    if (isValid.value) goToStep('2');
};

// ─── Diff-логика для редактирования ──────────────────────────────────────────
const getCategoryDiff = () => {
    const diff = {};
    if (form.name !== originalCategory.value.name) diff.name = form.name;
    if (form.description !== originalCategory.value.description)
        diff.description = form.description;
    if (form.category_photo instanceof File) diff.category_photo = form.category_photo;
    if (form.is_paid !== originalCategory.value.is_paid) diff.is_paid = form.is_paid;
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
        if (currentValue !== originalValue) diff[key] = currentValue;
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
        if (Object.keys(diff).length) toUpdate.push({ id: card.id, ...diff });

        originalMap.delete(card.id);
    }

    for (const [id] of originalMap) toDelete.push(id);

    return { toCreate, toUpdate, toDelete };
};

const getTasksDiff = () => {
    const toCreate = [];
    const toUpdate = [];
    const toDeleteIds = [];

    const originalMap = new Map(originalTasks.value.map((t) => [t.id, t]));

    for (const task of form.tasks) {
        if (!task.id || !originalMap.has(task.id)) {
            toCreate.push(task);
            continue;
        }
        const original = originalMap.get(task.id);
        const changed =
            task.sentence_en !== original.sentence_en ||
            task.sentence_ru !== original.sentence_ru ||
            task.correct_answer !== original.correct_answer ||
            JSON.stringify(task.wrong_answers) !== JSON.stringify(original.wrong_answers) ||
            task.audio instanceof File;
        if (changed) toUpdate.push(task);
        originalMap.delete(task.id);
    }

    for (const [id] of originalMap) toDeleteIds.push(id);

    return { toCreate, toUpdate, toDeleteIds };
};

// ─── Сохранение / обновление ──────────────────────────────────────────────────
const publishCategory = async () => {
    validateForm();
    if (!isValid.value) return;

    loading.value = true;
    publishProgress.value = 0;

    const isRetry = !!createdCategoryId.value;
    const cardsToProcess = isRetry ? [...failedCards.value] : form.cards;
    const tasksToProcess = isRetry ? [...failedTasks.value] : form.tasks;

    if (isRetry) {
        failedCards.value = [];
        failedTasks.value = [];
    }

    const totalOps = (isRetry ? 0 : 1) + cardsToProcess.length + tasksToProcess.length;
    let completed = 0;
    const tick = () => {
        completed++;
        publishProgress.value = totalOps > 0 ? Math.round((completed / totalOps) * 100) : 100;
    };

    try {
        if (!isRetry) {
            const response = await categoryStore.createCategory({
                name: form.name,
                description: form.description,
                category_photo: form.category_photo,
                is_paid: form.is_paid,
            });
            tick();

            const categoryId = response?.category?.id;
            if (!categoryId) {
                push.error({ title: 'Ошибка создания категории', message: 'Категория не создана' });
                return;
            }
            createdCategoryId.value = categoryId;
        }

        const categoryId = createdCategoryId.value;

        const cardResults = await Promise.allSettled(
            cardsToProcess.map((card) =>
                categoryStore.createCard(categoryId, card).then((r) => { tick(); return r; })
            )
        );
        cardResults.forEach((result, i) => {
            if (result.status === 'rejected') failedCards.value.push(cardsToProcess[i]);
        });

        if (tasksToProcess.length > 0) {
            const taskResults = await Promise.allSettled(
                tasksToProcess.map((task) =>
                    categoryStore.createGameTask(categoryId, task).then((r) => { tick(); return r; })
                )
            );
            taskResults.forEach((result, i) => {
                if (result.status === 'rejected') failedTasks.value.push(tasksToProcess[i]);
            });
        }

        if (failedCards.value.length || failedTasks.value.length) {
            push.error({
                title: 'Часть данных не сохранена',
                message: `${failedCount.value} элемент(ов) не загружено. Нажмите «Повторить» для повторной попытки.`,
            });
        } else {
            push.success({ message: 'Категория успешно создана' });
            createdCategoryId.value = null;
            router.push({ name: 'mainPage' });
        }
    } catch (error) {
        console.error(error);
        push.error({ title: 'Ошибка создания категории', message: 'Категория не создана' });
    } finally {
        loading.value = false;
        publishProgress.value = 0;
    }
};

const updateCategory = async () => {
    loading.value = true;
    publishProgress.value = 0;

    const isRetry = !!pendingRetry.value;
    let categoryDiff, toCreate, toUpdate, toDelete, toCreateTasks, toUpdateTasks, toDeleteTaskIds;

    if (isRetry) {
        ({ categoryDiff, toCreate, toUpdate, toDelete, toCreateTasks, toUpdateTasks, toDeleteTaskIds } = pendingRetry.value);
        pendingRetry.value = null;
    } else {
        validateForm();
        if (!isValid.value) { loading.value = false; return; }
        categoryDiff = getCategoryDiff();
        ({ toCreate, toUpdate, toDelete } = getCardsDiff());
        ({ toCreate: toCreateTasks, toUpdate: toUpdateTasks, toDeleteIds: toDeleteTaskIds } = getTasksDiff());
    }

    const opsCount =
        (Object.keys(categoryDiff).length ? 1 : 0)
        + toCreate.length + toUpdate.length + toDelete.length
        + toCreateTasks.length + toUpdateTasks.length + toDeleteTaskIds.length;
    let completed = 0;
    const tick = () => {
        completed++;
        publishProgress.value = opsCount > 0 ? Math.round((completed / opsCount) * 100) : 100;
    };

    try {
        let failedCategoryDiff = {};
        if (Object.keys(categoryDiff).length) {
            try {
                await categoryStore.updateCategory({ id: currentCategory.value.id, ...categoryDiff });
                tick();
            } catch (e) {
                console.error(e);
                failedCategoryDiff = categoryDiff;
            }
        }

        const failedCreate = [];
        const failedUpdate = [];
        const failedDelete = [];
        const failedCreateTasks = [];
        const failedUpdateTasks = [];
        const failedDeleteTaskIds = [];

        const [createResults, updateResults, deleteResults, createTaskResults, updateTaskResults, deleteTaskResults] =
            await Promise.all([
                Promise.allSettled(toCreate.map((card) => categoryStore.createCard(currentCategory.value.id, card).then((r) => { tick(); return r; }))),
                Promise.allSettled(toUpdate.map((card) => categoryStore.updateCard(card).then((r) => { tick(); return r; }))),
                Promise.allSettled(toDelete.map((id) => categoryStore.deleteCard(id).then((r) => { tick(); return r; }))),
                Promise.allSettled(toCreateTasks.map((task) => categoryStore.createGameTask(currentCategory.value.id, task).then((r) => { tick(); return r; }))),
                Promise.allSettled(toUpdateTasks.map((task) => categoryStore.updateGameTask(task).then((r) => { tick(); return r; }))),
                Promise.allSettled(toDeleteTaskIds.map((id) => categoryStore.deleteGameTask(id).then((r) => { tick(); return r; }))),
            ]);

        createResults.forEach((r, i) => { if (r.status === 'rejected') failedCreate.push(toCreate[i]); });
        updateResults.forEach((r, i) => { if (r.status === 'rejected') failedUpdate.push(toUpdate[i]); });
        deleteResults.forEach((r, i) => { if (r.status === 'rejected') failedDelete.push(toDelete[i]); });
        createTaskResults.forEach((r, i) => { if (r.status === 'rejected') failedCreateTasks.push(toCreateTasks[i]); });
        updateTaskResults.forEach((r, i) => { if (r.status === 'rejected') failedUpdateTasks.push(toUpdateTasks[i]); });
        deleteTaskResults.forEach((r, i) => { if (r.status === 'rejected') failedDeleteTaskIds.push(toDeleteTaskIds[i]); });

        const totalFailed =
            (Object.keys(failedCategoryDiff).length ? 1 : 0)
            + failedCreate.length + failedUpdate.length + failedDelete.length
            + failedCreateTasks.length + failedUpdateTasks.length + failedDeleteTaskIds.length;

        if (totalFailed > 0) {
            pendingRetry.value = {
                categoryDiff: failedCategoryDiff,
                toCreate: failedCreate,
                toUpdate: failedUpdate,
                toDelete: failedDelete,
                toCreateTasks: failedCreateTasks,
                toUpdateTasks: failedUpdateTasks,
                toDeleteTaskIds: failedDeleteTaskIds,
            };
            push.error({
                title: 'Часть данных не сохранена',
                message: `${totalFailed} операций не выполнено. Нажмите «Повторить» для повторной попытки.`,
            });
        } else {
            push.success({ message: 'Категория успешно обновлена' });
            router.push({ name: 'mainPage' });
        }
    } catch (error) {
        console.error(error);
        push.error({ title: 'Ошибка обновления категории', message: 'Категория не обновлена' });
    } finally {
        loading.value = false;
        publishProgress.value = 0;
    }
};

// ─── Watchers ─────────────────────────────────────────────────────────────────
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
            is_paid: category.is_paid ?? false,
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

onMounted(async () => {
    userStore.setHeaderTitle(props.updating ? 'Редактирование' : 'Создание');

    if (props.updating && currentCategory.value?.id) {
        try {
            const raw = await categoryStore.getGameTasks(currentCategory.value.id);
            const tasks = raw.map((t) => ({
                ...t,
                wrong_answers: (t.options ?? []).filter((o) => o !== t.correct_answer),
            }));
            form.tasks = tasks;
            originalTasks.value = tasks.map((t) => ({ ...t, wrong_answers: [...t.wrong_answers] }));
        } catch (e) {
            console.error('Не удалось загрузить задания игры', e);
        }
    }
});

onUnmounted(() => {
    userStore.setHeaderTitle(null);
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
    transition: background-color 0.3s ease;
}
.cover-box--filled {
    background: #79bbfb;
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
    margin-bottom: 16px;
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
    color: #fff;
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

.radio-group {
    display: flex;
    gap: 20px;
    margin-bottom: 16px;
}

.radio-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-family: Mulish;
    font-weight: 600;
    font-size: 16px;
    color: #262060;
}

.radio-label input[type='radio'] {
    appearance: none;
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #262060;
    border-radius: 50%;
    outline: none;
    cursor: pointer;
    flex-shrink: 0;
    position: relative;
    transition: border-color 0.2s;
}

.radio-label input[type='radio']:checked {
    border-color: #2e236d;
}

.radio-label input[type='radio']:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: #2e236d;
}
</style>
