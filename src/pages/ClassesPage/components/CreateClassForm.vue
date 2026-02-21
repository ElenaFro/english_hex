<template>
    <div class="create-form-overlay">
        <div class="create-form">
            <button class="close-button" @click="emit('close')">×</button>
            <div class="create-form__wrapper">
                <label>Название группы</label>
                <input v-model="form.title" type="text" placeholder="Введите название" />
            </div>
            <div class="create-form__wrapper">
                <label>Класс</label>
                <input v-model="form.grade" type="text" placeholder="Введите название" />
                <p v-if="gradeError" class="create-form__error">{{ gradeError }}</p>
            </div>
            <b-button
                class="create-form__btn"
                label="Создать класс"
                :disabled="!isValid || loading"
                :loading="loading"
                @click="createClass"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTeacherStore } from '@/stores/teacher';
import { push } from 'notivue';
import BButton from '@/shared/components/BaseButton.vue';

const emit = defineEmits(['close']);
const teacherStore = useTeacherStore();
const loading = ref(false);

const form = ref({
    title: '',
    grade: '',
});

const gradeError = computed(() => {
    const raw = form.value.grade.trim();
    if (!raw) return '';

    const numberValue = Number(raw);
    if (!Number.isInteger(numberValue)) {
        return 'Класс должен быть целым числом';
    }

    if (numberValue < 1 || numberValue > 11) {
        return 'Класс должен быть от 1 до 11';
    }

    return '';
});

const isValid = computed(() => {
    return (
        Boolean(form.value.title.trim()) && Boolean(form.value.grade.trim()) && !gradeError.value
    );
});

const handleClose = () => {
    form.value = { title: '', grade: '' };
    emit('close');
};

const createClass = async () => {
    if (!isValid.value || loading.value) return;
    loading.value = true;
    try {
        await teacherStore.createClass(form.value);
        await teacherStore.getAllClasses();
        handleClose();
        push.success({ message: 'Класс успешно создан' });
    } catch (error) {
        console.error(error);
        push.error({ message: 'Ошибка создания класса' });
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped lang="scss">
.create-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    top: 50%;
    left: 50%;
    width: 315px;
    background-color: #262060;
    transform: translate(-50%, -50%);
    padding: 24px 18px;
    border-radius: 20px;
    z-index: 300;

    &__wrapper {
        width: 100%;
    }

    &__btn {
        background-color: #fff;
        padding: 9px 24px;
        border-radius: 16px;
        border: none;
        font-size: 16px;
        font-weight: 600;
        line-height: 120%;
        margin-top: 32px;
        cursor: pointer;
        transition: opacity 0.2s ease;
        min-width: 162px;
    }

    &__btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &__error {
        margin-top: 6px;
        font-size: 12px;
        color: #ffb4b4;
    }
}

.create-form-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 300;
    display: flex;
    justify-content: center;
    align-items: center;
}

.close-button {
    position: absolute;
    top: -2px;
    right: 10px;
    background: none;
    border: none;
    font-size: 34px;
    cursor: pointer;
    color: #fff;
}

label {
    display: block;
    margin-top: 16px;
    font-size: 12px;
    font-weight: 400;
    color: #fff;
}

input {
    width: 100%;
    border: none;
    border-bottom: 1px solid #ffffff;
    font-size: 20px;
    font-weight: 600;
    background-color: transparent;
    padding: 8px 0;
    color: #fff;
    opacity: 1;
}

input:focus {
    outline: none;
    border-color: #fff;
}

input::placeholder {
    color: #ffffff;
    opacity: 0.8;
}
</style>
