<template>
    <div class="page-container">
        <div class="avatar-section">
            <div class="avatar-wrapper" @click="toggleAvatar">
                <img :src="avatarIcon" class="avatar" :class="opacityClass" alt="User avatar" />
                <img
                    v-if="isEditAvatar"
                    src="@/assets/icons/profile/edit-blue-pencile.svg"
                    class="edit-avatar-icon"
                />
            </div>
            <div class="logout-wrapper">
                <img
                    src="@/assets/icons/profile/logout.svg"
                    class="logout-wrapper__icon"
                    alt="logout"
                    @click="logout"
                />
            </div>
        </div>
        <div v-if="isAvatarEditing" class="avatar-edit">
            <section class="avatar-edit-card">
                <p class="avatar-edit-card__title">Базовые</p>
                <div class="avatar-grid avatar-grid--basic">
                    <button
                        v-for="item in basicAvatars"
                        :key="item.id"
                        type="button"
                        class="avatar-tile"
                        :class="{ 'avatar-tile--selected': isAvatarSelected(item.value) }"
                        @click="selectAvatar(item.value)"
                        :aria-label="`Выбрать аватар ${item.id}`"
                    >
                        <img class="avatar-tile__img" :src="item.src" alt="" />
                    </button>
                </div>
            </section>

            <section class="avatar-edit-card">
                <p class="avatar-edit-card__title">Премиум</p>
                <div class="avatar-grid avatar-grid--premium">
                    <button
                        v-for="item in premiumAvatars"
                        :key="item.id"
                        type="button"
                        class="avatar-tile"
                        :class="{ 'avatar-tile--selected': isAvatarSelected(item.value) }"
                        @click="selectAvatar(item.value)"
                        :aria-label="`Выбрать премиум-аватар ${item.id}`"
                    >
                        <img class="avatar-tile__img" :src="item.src" alt="" />
                    </button>
                </div>
            </section>
        </div>

        <div v-else class="profile-card">
            <div class="form-group">
                <label for="name">Имя</label>
                <div class="input-with-icon">
                    <input
                        id="name"
                        v-model="form.name"
                        type="text"
                        maxlength="17"
                        placeholder="Введите ваше имя"
                        class="form-input"
                        :class="{ error: errors.name }"
                        @input="clearError('name')"
                    />
                    <span class="edit-icon" @click="focusInput('name')">
                        <img v-if="edit" src="@/assets/icons/editPencil.svg" />
                    </span>
                </div>
                <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>
            <div class="form-group">
                <label>Пол</label>
                <div class="gender-options">
                    <label class="gender-label">
                        <input
                            type="radio"
                            name="gender"
                            value="male"
                            v-model="form.gender"
                            @change="updateAvatar"
                        />
                        <span class="custom-radio"></span>
                        Мужской
                    </label>
                    <label class="gender-label">
                        <input
                            type="radio"
                            name="gender"
                            value="female"
                            v-model="form.gender"
                            @change="updateAvatar"
                        />
                        <span class="custom-radio"></span>
                        Женский
                    </label>
                </div>
                <span v-if="errors.gender" class="error-message">{{ errors.gender }}</span>
            </div>

            <div class="form-group">
                <label for="email">Почта</label>
                <div class="input-with-icon">
                    <input
                        id="email"
                        v-model="form.email"
                        type="email"
                        maxlength="30"
                        placeholder="Ваш email"
                        class="form-input"
                        :class="{ error: errors.email }"
                        @input="clearError('email')"
                    />
                    <span class="edit-icon" @click="focusInput('email')">
                        <img v-if="edit" src="@/assets/icons/editPencil.svg" />
                    </span>
                </div>
                <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>
            <div class="form-group">
                <label for="password">Пароль</label>
                <div class="input-with-icon">
                    <input
                        id="password"
                        v-model="form.password"
                        type="password"
                        autocomplete="new-password"
                        maxlength="30"
                        placeholder="Ваш пароль"
                        class="form-input"
                        :class="{ error: errors.password }"
                        @input="clearError('password')"
                    />
                    <span class="edit-icon" @click="focusInput('password')">
                        <img v-if="edit" src="@/assets/icons/editPencil.svg" />
                    </span>
                </div>
                <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            </div>
        </div>

        <div class="button-section">
            <button class="action-button" :disabled="isSaving" @click="openPopup">
                Сохранить изменения
            </button>
        </div>

        <defaultPopup
            :isVisible="showPopup"
            title="Сохранить изменения?"
            @confirm="confirmSave"
            @update:isVisible="showPopup = $event"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BoyIcon from '@/assets/img/DefaultUserAvatar/male.webp';
import GirlIcon from '@/assets/img/DefaultUserAvatar/female.svg';
import { useUserStore } from '@/stores/user';
import apiClient from '@/api/axios';
import { compareObjects } from '@/shared/compareObject';
import defaultPopup from '@/shared/components/popups/defaultPopup.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = ref({});
const initialForm = ref({});
const isEditAvatar = ref(false);
const isAvatarEditing = ref(false);

const errors = ref({
    gender: '',
    name: '',
    email: '',
    password: '',
});

onMounted(async () => {
    form.value = { ...useUserStore().getCurrentUser() };
    initialForm.value = JSON.parse(JSON.stringify(form.value));
});

const isSaving = ref(false);
const showPopup = ref(false);
const edit = ref(true);

const avatarIcon = computed(() => {
    const avatar = form.value?.avatar;
    if (typeof avatar === 'string' && avatar.trim()) {
        if (avatar === 'male' || avatar === 'male.webp' || avatar.endsWith('/male.webp'))
            return BoyIcon;
        if (avatar === 'female' || avatar === 'female.svg' || avatar.endsWith('/female.svg'))
            return GirlIcon;
        // Если с бэка приходит уже готовый url/путь
        return avatar;
    }

    return form.value?.gender === 'male' ? BoyIcon : GirlIcon;
});

const basicAvatars = computed(() =>
    Array.from({ length: 8 }, (_, index) => ({
        id: `basic-${index + 1}`,
        value: 'male.webp',
        src: BoyIcon,
    }))
);

const premiumAvatars = computed(() =>
    Array.from({ length: 4 }, (_, index) => ({
        id: `premium-${index + 1}`,
        value: 'male.webp',
        src: BoyIcon,
    }))
);

const selectAvatar = (avatar) => {
    form.value = {
        ...form.value,
        avatar,
    };
};

const isAvatarSelected = (avatar) => form.value?.avatar === avatar;

const opacityClass = computed(() => ({
    'opacity-20': isEditAvatar.value,
}));

const toggleAvatar = () => {
    if (isAvatarEditing.value) {
        isAvatarEditing.value = false;
        isEditAvatar.value = false;
        return;
    }

    isEditAvatar.value === true ? switchAvatarEditing(true) : (isEditAvatar.value = true);
};

const updateAvatar = () => {
    clearError('gender');
};

const switchAvatarEditing = (value) => {
    isAvatarEditing.value = !!value;
};

const focusInput = (field) => {
    document.getElementById(field).focus();
};

const clearError = (field) => {
    errors.value[field] = '';
};

const logout = () => {
    useUserStore().logout();
    router.push({ name: 'AuthPage' });
};

const validateForm = () => {
    let isValid = true;
    errors.value = { gender: '', name: '', email: '', password: '' };

    if (!form.value.name.trim()) {
        errors.value.name = 'Поле заполнено некорректно';
        isValid = false;
    }

    const emailRegex = /^(?=.*[A-Za-z0-9])[^<>{}()[\],;:\\/"* ]{8,30}$/;
    if (!form.value.email) {
        errors.value.email = 'Поле заполнено некорректно';
        isValid = false;
    } else if (!emailRegex.test(form.value.email) || !form.value.email.includes('@')) {
        errors.value.email = 'Поле заполнено некорректно';
        isValid = false;
    }

    // const passwordRegex = /^(?=.*[A-Za-z0-9]).{8,30}$/;
    // if (!form.value.password) {
    //     errors.value.password = "Поле заполнено некорректно";
    //     isValid = false;
    // } else if (!passwordRegex.test(form.value.password)) {
    //     errors.value.password = "Поле заполнено некорректно";
    //     isValid = false;
    // }

    return isValid;
};

const openPopup = () => {
    if (!validateForm()) return;
    showPopup.value = true;
};

const closePopup = () => {
    showPopup.value = false;
};

const confirmSave = async () => {
    isSaving.value = true;
    try {
        const payload = compareObjects(initialForm.value, form.value);
        await apiClient
            .patch('/profile/update', payload)
            .then(async () => {
                await useUserStore().fetchUser();
                closePopup();
                isAvatarEditing.value = false;
            })
            .catch((error) => {
                throw error;
            });
    } catch (error) {
        console.error('Ошибка сохранения:', error);
    } finally {
        isSaving.value = false;
        form.value = useUserStore().getCurrentUser();
    }
};
</script>

<style scoped lang="scss">
.profile-page {
    width: 100%;
    height: 100vh;
    min-height: 100%;
    padding: 40px 30px;
    background-color: #f6f6fe;
    border-radius: 40px;
}

.profile-page__inner {
    overflow-y: scroll;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 25px;
    scrollbar-width: none;
    overflow-y: auto;
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;

    @media (min-width: 375px) {
        width: 375px;
    }

    @media (max-width: 375px) {
        width: 100%;
    }
}

.page-container {
    row-gap: 25px;
    scrollbar-width: none;
    padding-top: 34px;
}

.profile-card {
    background: #262060;
    border-radius: 20px;
    padding: 18px;
    width: 100%;
    max-width: 400px;
    max-height: 800px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 15px;
}

.avatar-section {
    display: flex;
    justify-content: space-between;
    text-align: center;
    width: 100%;
}

.avatar-wrapper {
    position: relative;
    height: 150px;
    width: 150px;
    border-radius: 50%;
    border: 3px solid #262060;
}

.avatar {
    cursor: pointer;
    object-fit: cover;
    object-position: top;
    border-radius: 50%;
    width: 100%;
    height: 100%;
}

.edit-avatar-icon {
    position: absolute;
    top: 30%;
    left: 32%;
    width: 54px;
    height: 54px;
    cursor: pointer;
    z-index: 20;
}

.form-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.form-group label {
    font-size: 12px;
    font-weight: 400;
    color: #fff;
}

.form-input {
    padding: 0 0 4px 0;
    border: none;
    border-bottom: 2px solid #ffffff;
    font-size: 20px;
    font-weight: 600;
    background: transparent;
    color: #ffffff;
    outline: none;
    width: 100%;
}

.form-input::placeholder {
    color: #a3bffa;
}

.form-input:-webkit-autofill,
.form-input:-webkit-autofill:hover,
.form-input:-webkit-autofill:focus,
.form-input:-webkit-autofill:active {
    -webkit-text-fill-color: #ffffff;
    -webkit-box-shadow: 0 0 0 1000px #262060 inset;
    box-shadow: 0 0 0 1000px #262060 inset;
    transition: background-color 9999s ease-in-out 0s;
}

.form-input.error {
    border-bottom: 2px solid #ff0000;
}

.input-with-icon {
    position: relative;
}

.edit-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #3b82f6;
    font-size: 16px;
}

.edit-icon:hover {
    color: #60a5fa;
}

.edit-icon img {
    width: 16px;
    height: 16px;
}

.gender-options {
    display: flex;
    gap: 30px;
    padding-top: 5px;
    padding-bottom: 4px;
    border-bottom: 2px solid #ffffff;
}

.gender-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 20px !important;
    font-weight: 600 !important;
    cursor: pointer;
}

.gender-label input[type='radio'] {
    display: none;
}

.custom-radio {
    width: 12px;
    height: 12px;
    border: 1px solid #fff;
    border-radius: 6px;
    padding: 2px;
    position: relative;
    transition: background-color 0.2s;
}

.gender-label input[type='radio']:checked + .custom-radio::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background: #ffffff;
    border-radius: 50%;
}

.error-message {
    color: #ff0000;
    font-size: 12px;
    text-align: center;
}

.button-section {
    display: flex;
    width: 100%;
    justify-content: flex-start;
    align-items: start;
    padding-bottom: 36dvh;
}

.action-button {
    max-width: 240px;
}

.logout-wrapper {
    position: relative;
    width: 50px;

    &__icon {
        position: absolute;
        top: -10px;
        right: -10px;
        cursor: pointer;
    }
}

.opacity-20 {
    opacity: 20%;
}

.avatar-edit {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.avatar-edit-card {
    &__title {
        margin: 0 0 12px 0;
        font-size: 22px;
        font-weight: 800;
        line-height: 1.1;
        color: #311d5d;
    }
}

.avatar-grid {
    display: grid;
    gap: 12px;
    background: #262060;
    border-radius: 20px;
    padding: 18px;

    &--basic {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    &--premium {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
}

.avatar-tile {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease,
        transform 0.06s ease;

    &:active {
        transform: scale(0.98);
    }

    &--selected {
        border-color: #79bbfb;
        box-shadow: 0 0 0 3px rgba(121, 187, 251, 0.35);
    }

    &__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top;
        border-radius: 50%;
        display: block;
    }
}
</style>
