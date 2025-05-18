<template>
    <div>
        <Header />
	</div>
    <div class="profile-page">
        <div class="avatar-section">
            <img :src="avatarIcon" class="avatar" alt="User avatar" @click="toggleGender" />
        </div>
        <div class="profile-card">
            <div class="form-group">
                <label for="name">Имя</label>
                <div class="input-with-icon">
                    <input id="name" v-model="form.name" type="text" maxlength="17" placeholder="Введите ваше имя"
                        class="form-input" :class="{ 'error': errors.name }" @input="clearError('name')" />
                    <span class="edit-icon" @click="focusInput('name')"><img v-if="edit"
                            src="@/assets/icons/editPencil.svg" /></span>
                </div>
                <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>

            <div class="form-group">
                <label>Пол</label>
                <div class="gender-options">
                    <label class="gender-label">
                        <input type="radio" name="gender" value="male" v-model="form.gender" @change="updateAvatar" />
                        <span class="custom-radio"></span>
                        Мужской
                    </label>
                    <label class="gender-label">
                        <input type="radio" name="gender" value="female" v-model="form.gender" @change="updateAvatar" />
                        <span class="custom-radio"></span>
                        Женский
                    </label>
                </div>
                <span v-if="errors.gender" class="error-message">{{ errors.gender }}</span>
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <div class="input-with-icon">
                    <input id="email" v-model="form.email" type="email" maxlength="30" placeholder="Ваш email"
                        class="form-input" :class="{ 'error': errors.email }" @input="clearError('email')" />
                    <span class="edit-icon" @click="focusInput('email')"><img v-if="edit"
                            src="@/assets/icons/editPencil.svg" /></span>
                </div>
                <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <div class="form-group">
                <label for="password">Пароль</label>
                <div class="input-with-icon">
                    <input id="password" v-model="form.password" type="password" maxlength="30" placeholder="Ваш пароль"
                        class="form-input" :class="{ 'error': errors.password }" @input="clearError('password')" />
                    <span class="edit-icon" @click="focusInput('password')"><img v-if="edit"
                            src="@/assets/icons/editPencil.svg" /></span>
                </div>
                <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            </div>
        </div>
        <div class="button-section">
            <button class="save-button" :disabled="isSaving" @click="saveChanges">
                Сохранить изменения
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import BoyIcon from "@/assets/img/DefaultUserAvatar/male.svg";
import GirlIcon from "@/assets/img/DefaultUserAvatar/female.svg";
import Header from '@/components/Header.vue';

const form = ref({
    gender: "male",
    name: "",
    email: "",
    password: "",
});

const errors = ref({
    gender: "",
    name: "",
    email: "",
    password: "",
});

const isSaving = ref(false);

const router = useRouter();

const avatarIcon = computed(() => {
    return form.value.gender === "male" ? BoyIcon : GirlIcon;
});

const toggleGender = () => {
    form.value.gender = form.value.gender === "male" ? "female" : "male";
};

const updateAvatar = () => {
    clearError("gender");
};

const focusInput = (field) => {
    document.getElementById(field).focus();
};

const clearError = (field) => {
    errors.value[field] = "";
};

const validateForm = () => {
    let isValid = true;
    errors.value = { gender: "", name: "", email: "", password: "" };

    if (!form.value.name.trim()) {
        errors.value.name = "Поле заполнено некорректно";
        isValid = false;
    }

    const emailRegex = /^(?=.*[A-Za-z0-9])[^<>{}()[\],;:\\/"* ]{8,30}$/;
    if (!form.value.email) {
        errors.value.email = "Поле заполнено некорректно";
        isValid = false;
    } else if (!emailRegex.test(form.value.email) || !form.value.email.includes("@")) {
        errors.value.email = "Поле заполнено некорректно";
        isValid = false;
    }

    const passwordRegex = /^(?=.*[A-Za-z0-9]).{8,30}$/;
    if (!form.value.password) {
        errors.value.password = "Поле заполнено некорректно";
        isValid = false;
    } else if (!passwordRegex.test(form.value.password)) {
        errors.value.password = "Поле заполнено некорректно";
        isValid = false;
    }

    return isValid;
};

const saveChanges = async () => {
    if (!validateForm()) return;

    isSaving.value = true;
    try {
        console.log("Сохранение данных:", form.value);
    } catch (error) {
        console.error("Ошибка сохранения:", error);
    } finally {
        isSaving.value = false;
    }
};
</script>

<style scoped>
.profile-page {
    min-height: 100vh;
    width: 100%;
    display: flex;
    row-gap: 25px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    margin-top: 76px;
}

.profile-card {
    background: #262060;
    border-radius: 20px;
    padding: 18px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.avatar-section {
    text-align: center;
}

.avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    cursor: pointer;
    object-fit: cover;
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

.gender-label input[type="radio"] {
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

.gender-label input[type="radio"]:checked+.custom-radio::after {
    content: "";
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

.save-button {
    padding: 12px 24px;
    border: none;
    border-radius: 16px;
    background: linear-gradient(94.6deg, #355CD5 4.52%, #714AB4 107.33%);
    color: #ffffff;
    font-size: 16px;
    cursor: pointer;
    width: 100%;
    max-width: 240px;
    transition: background-color 0.2s;
}

.save-button:hover {
    background-color: #60a5fa;
}

.save-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.button-section {
    display: flex;
    width: 100%;
    margin-left: 30px;
    justify-content: start;
    align-items: start;
}
</style>