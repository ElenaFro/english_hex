<template>
    <div class="page-container">
        <div class="avatar-section">
            <img :src="avatarIcon" class="avatar" alt="User avatar" @click="toggleGender" />
        </div>
        <div class="profile-card">
            <div class="form-group">
                <label for="name">Имя</label>
                <div class="input-with-icon">
                    <input id="name" v-model="form.name" type="text" maxlength="17" placeholder="Введите ваше имя"
                        class="form-input" :class="{ 'error': errors.name }" @input="clearError('name')" />
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
						<span class="edit-icon" @click="focusInput('email')">
							<img v-if="edit" src="@/assets/icons/editPencil.svg" />
						</span>
					</div>
					<span v-if="errors.email" class="error-message">{{ errors.email }}</span>
				</div>
            <div class="form-group">
                <label for="password">Пароль</label>
                <div class="input-with-icon">
                    <input id="password" v-model="form.password" type="password" maxlength="30" placeholder="Ваш пароль"
                        class="form-input" :class="{ 'error': errors.password }" @input="clearError('password')" />
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

        <defaultPopup :isVisible="showPopup" title="Сохранить изменения?" @confirm="confirmSave"
            @update:isVisible="showPopup = $event" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BoyIcon from "@/assets/img/DefaultUserAvatar/male.svg";
import GirlIcon from "@/assets/img/DefaultUserAvatar/female.svg";
import { useAuthStore } from "@/stores/auth";
import apiClient from "@/api/axios";
import { compareObjects } from "@/shared/compareObject";
import defaultPopup from "@/components/popups/defaultPopup.vue";


const form = ref({});
const initialForm = ref({})

const errors = ref({
    gender: "",
    name: "",
    email: "",
    password: "",
});

onMounted(async () => {
    form.value = useAuthStore().getCurrentUser();
    initialForm.value = JSON.parse(JSON.stringify(form.value));
})

const isSaving = ref(false);
const showPopup = ref(false);
const edit = ref(true);

const avatarIcon = computed(() => form.value?.gender === "male" ? BoyIcon : GirlIcon);

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
        await apiClient.patch('/profile/update', payload)
            .then(async () => {
                await useAuthStore().fetchUser();
                closePopup();
            }).catch((error) => { throw error })
    } catch (error) {
        console.error("Ошибка сохранения:", error);
    } finally {
        isSaving.value = false;
        form.value = useAuthStore().getCurrentUser()
    }
};
</script>

<style scoped>
.profile-page {
    width: 100%;
    height: 100vh;
    min-height: 100%;
    padding: 40px 30px;
    background-color: #F6F6FE;
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

    @media (min-width:375px) {
        width: 375px;
    }

    @media (max-width:375px) {
        width: 100%;
    }
}

.page-container {
    row-gap: 25px;

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

.button-section {
    display: flex;
    width: 100%;
    justify-content: start;
    align-items: start;
    padding-bottom: 200px;
}

.action-button {
    max-width: 240px;
}
</style>