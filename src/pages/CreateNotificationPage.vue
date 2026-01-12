<template>
    <div class="page-container">
        <div class="categoryAddContainer">
            <div class="form-group" :class="{ error: errors.title }">
                <label>Название темы</label>
                <input v-model="form.title" type="text" placeholder="Введите название" />
                <span v-if="errors.title" class="error-msg">Поле заполнено некорректно</span>
            </div>

            <div class="form-group" :class="{ error: errors.description }">
                <label>Описание</label>
                <textarea v-model="form.description" placeholder="Введите описание"></textarea>
                <span v-if="errors.description" class="error-msg">Поле заполнено некорректно</span>
            </div>

            <div class="btn_container">
                <button class="button button--blue" @click="openConfirmPopup">Опубликовать</button>
            </div>
        </div>
        <defaultPopup
            :is-visible="publishConfirmPopup"
            title="Вы уверены что хотите опубликовать новое уведомление?"
            @confirm="publishNotify"
            @close="publishConfirmPopup = !publishConfirmPopup"
        />
    </div>
</template>

<script setup>
//vue
import { reactive, ref, computed } from 'vue';
//composables
import { useFormValidation } from '@/composables/useFormValidation';
import { Notivue, Notification, push } from 'notivue';
import defaultPopup from '@/components/popups/defaultPopup.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const publishConfirmPopup = ref(false);

const form = reactive({
    title: '',
    description: '',
});

const { errors, validateForm, isValid } = useFormValidation(form, {
    title: (val) => !val.trim(),
    description: (val) => !val.trim(),
});

const openConfirmPopup = () => {
    validateForm();
    if (isValid.value) {
        publishConfirmPopup.value = true;
    }
};

const publishNotify = async () => {
    loading.value = true;
    validateForm();
    if (!isValid.value) return;

    try {
        // const response = await categoryStore.createCategory({
        //     name: form.name,
        //     description: form.description,
        //     category_photo: form.category_photo,
        // });
        // const categoryId = response?.data?.id;
        // if (!categoryId) {
        //     push.error({
        //         title: 'Ошибка создания категории',
        //         message: 'Категория не создана',
        //     });
        //     throw new Error('Не удалось создать категорию');
        // }
        // await Promise.all(form.cards.map((card) => categoryStore.createCard(categoryId, card)));
        push.success({
            message: 'Уведомление создано',
        });
        router.go(-1);
    } catch (error) {
        console.error(error);
        push.error({
            title: 'Ошибка создания уведомления',
            message: 'Уведомление не создано',
        });
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.page-container {
    padding: 35px 0 0 0 !important;
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

.form-group ::placeholder {
    color: #262060;
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
    justify-content: flex-end;
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
