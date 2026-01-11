<template>
    <div class="w-100">
        <div v-if="showPreview" class="bg-image-preview">
            <lessons-page :props-cards="cards" @close-preview="closePreview" />
        </div>
        <div v-else>
            <div v-if="!createCardOpen" class="form-group">
                <div class="header">
                    <label class="header-text">Добавить новые карточки</label>
                    <img
                        src="@/assets/icons/delete_icon.svg"
                        alt="Delete"
                        class="header_delete-icon"
                        @click.stop="handleHeaderDeleteClick"
                    />
                </div>
                <div class="cards" :class="{ error: errors.cards }">
                    <button v-if="cards.length < 20" class="card-box add" @click="addCard">
                        +
                    </button>
                    <div
                        v-for="(card, index) in cards"
                        :key="card.id"
                        class="card-box"
                        @click="editCard(index)"
                    >
                        <input
                            v-if="isSelectionMode"
                            type="checkbox"
                            :checked="selectedCards.has(card.id)"
                            @change="toggleCardSelection(card.id)"
                            class="card-checkbox"
                        />
                        <div v-if="card.photo" class="card-img">
                            <img :src="card.photo" alt="card" />
                        </div>
                    </div>
                </div>
                <span v-if="errors.cards" class="error-msg">Добавьте хотя бы одну карточку</span>

                <div class="btn_container">
                    <button class="btn publish-btn" @click="openPublishModal">Опубликовать</button>
                    <button class="btn continue-btn" @click="openPreviewModal">Предпросмотр</button>
                </div>
            </div>

            <card-create-form
                v-else
                :model-value="editingCard"
                @update:model-value="updateEditingCard"
                @save="handleCardSave"
                @close="closeCardForm"
            />

            <default-popup
                :is-visible="showDeleteModal"
                title="Вы уверены что хотете удалить выбранные элементы?"
                confirm-text="Продолжить"
                @close="closeDeleteModal"
                @confirm="deleteSelectedCards"
            />

            <default-popup
                :is-visible="showPreviewModal"
                title="Перейти к просмотру карточек?"
                confirm-text="Продолжить"
                @close="closePreviewModal"
                @confirm="previewCategory"
            />

            <default-popup
                :is-visible="showPreviewModal"
                title="Вы уверены что хотете Опубликовать?"
                confirm-text="Продолжить"
                @close="closePublishModal"
                @confirm="publishCategory"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useFormValidation } from '@/composables/useFormValidation';
import cardCreateForm from '../CreateCategory/cardCreateForm.vue';
import DefaultPopup from '../popups/defaultPopup.vue';
import LessonsPage from '../Learning/LessonsPage.vue';

const props = defineProps({
    modelValue: { type: Object, default: () => ({ cards: [] }) },
});
const emit = defineEmits(['update:modelValue', 'publish']);

const cards = computed({
    get: () => props.modelValue.cards,
    set: (val) => emit('update:modelValue', { ...props.modelValue, cards: val }),
});

const { errors, validateForm } = useFormValidation(
    { cards },
    {
        cards: (val) => val.length === 0,
    }
);

const showDeleteModal = ref(false);
const showPublishModal = ref(false);
const cardToDelete = ref(null);
const createCardOpen = ref(false);
const editingIndex = ref(null);
const editingCard = ref({});

const isSelectionMode = ref(false);
const selectedCards = ref(new Set());

const addCard = () => {
    editingIndex.value = null;
    editingCard.value = {
        photo: null,
        video: null,
        translation_word: '',
        word: '',
        audio: null,
    };
    createCardOpen.value = true;
    exitSelectionMode();
};

const editCard = (index) => {
    if (isSelectionMode.value) {
        toggleCardSelection(cards.value[index].id);
        return;
    }
    editingIndex.value = index;
    editingCard.value = { ...cards.value[index] };
    createCardOpen.value = true;
    exitSelectionMode();
};

const updateEditingCard = (updated) => {
    editingCard.value = updated;
};

const handleCardSave = () => {
    const saved = {
        ...editingCard.value,
        id: editingIndex.value === null ? Date.now() : editingCard.value.id,
    };
    if (editingIndex.value !== null) {
        cards.value[editingIndex.value] = saved;
    } else {
        cards.value.push(saved);
    }
    closeCardForm();
    validateForm();
};

const closeCardForm = () => {
    createCardOpen.value = false;
    editingIndex.value = null;
    editingCard.value = {};
};

const closeDeleteModal = () => {
    showDeleteModal.value = false;
    cardToDelete.value = null;
};

const closePublishModal = () => {
    showPreviewModal.value = false;
};

const openPublishModal = () => {
    showPreviewModal.value = true;
};

const enterSelectionMode = () => {
    isSelectionMode.value = true;
    selectedCards.value.clear();
};

const exitSelectionMode = () => {
    isSelectionMode.value = false;
    selectedCards.value.clear();
};

const toggleCardSelection = (cardId) => {
    if (selectedCards.value.has(cardId)) {
        selectedCards.value.delete(cardId);
    } else {
        selectedCards.value.add(cardId);
    }
};

const deleteSelectedCards = () => {
    if (selectedCards.value.size === 0) {
        exitSelectionMode();
        return;
    }

    const indicesToDelete = Array.from(selectedCards.value)
        .map((id) => cards.value.findIndex((card) => card.id === id))
        .filter((idx) => idx !== -1)
        .sort((a, b) => b - a);

    indicesToDelete.forEach((idx) => {
        cards.value.splice(idx, 1);
    });

    selectedCards.value.clear();
    isSelectionMode.value = false;
    validateForm();
};

const handleHeaderDeleteClick = () => {
    if (!isSelectionMode.value) {
        enterSelectionMode();
    } else {
        if (selectedCards.value.size > 0) return (showDeleteModal.value = true);
        exitSelectionMode();
    }
};

watch(
    cards,
    () => {
        selectedCards.value = new Set(
            Array.from(selectedCards.value).filter((id) =>
                cards.value.some((card) => card.id === id)
            )
        );
    },
    { deep: true }
);

const showPreview = ref(false);
const showPreviewModal = ref(false);
const previewFlipped = ref({});

const openPreviewModal = () => {
    showPreviewModal.value = true;
};

const closePreviewModal = () => {
    showPreviewModal.value = false;
};

const previewCategory = () => {
    closePreviewModal();
    showPreview.value = true;
    exitSelectionMode();
};
const closePreview = () => {
    showPreview.value = false;
};
const togglePreviewFlip = (id) => {
    previewFlipped.value[id] = !previewFlipped.value[id];
};
const playAudio = (src) => {
    if (src) new Audio(src).play().catch(console.error);
};

const publishCategory = () => {
    validateForm();
    if (Object.values(errors).every((e) => !e)) {
        emit('publish');
    }
};
</script>

<style scoped lang="scss">
.form-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 20px;
}

.cards {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.card-box {
    width: min(40dvw, 104px);
    height: min(20dvh, 151px);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: transparent;
    position: relative;
}

.card-checkbox {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 20px;
    height: 20px;
    z-index: 1;
    cursor: pointer;
    border: 1px solid black;
    appearance: none;
    border-radius: 50%;
    background-color: white;
    transition: all 0.2s ease;
    display: block;

    &:checked {
        background-color: #262060;
        border-color: #262060;

        &::after {
            content: '✔';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 12px;
            font-weight: bold;
        }
    }

    &:focus {
        outline: 2px solid #262060;
        outline-offset: 2px;
    }

    &:hover {
        border-color: #2e236d;
    }
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
    border-radius: 20px;
    object-fit: cover;
    position: relative;
    transition: background-color 0.3s ease;
}

.card-img:hover {
    opacity: 0.4;
}

.card-box.add {
    font-size: 3rem;
    color: #262060;
    border: 2px dashed #262060;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.header_delete-icon {
    width: 24px;
    height: 24px;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s ease;
}

.header_delete-icon:hover {
    opacity: 1;
}

.modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal-content {
    background: white;
    border-radius: 12px;
    padding: 20px;
    max-width: 300px;
}
.preview-cards {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}
.preview-cards img {
    width: 60px;
    height: 80px;
    object-fit: cover;
    border-radius: 6px;
}

.btn_container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 10px;
    margin-top: 20px;
}

.btn {
    width: auto;
    padding: 10px 16px;
    background-color: transparent;
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
.continue-btn {
    border: 2px solid #262060;
}

.publish-btn {
    background: #2e236d;
    color: white;
}

.header-text {
    color: #311d5d;
    font-weight: 600;
    font-size: 20px;
}

.bg-image-preview {
    width: 100%;
    background-image: url('@/assets/lesson/lesson_card_bg.svg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    max-height: 430px;
    z-index: 100;
}
</style>
