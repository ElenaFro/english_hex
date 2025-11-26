<template>
    <div v-if="showPreview" class="bg-image-preview">
        <lessons-page :props-cards="[localForm]" @close-preview="closePreview" />
    </div>

    <div v-else class="add-card-container font">
        <div class="add-card-container__form">
            <div class="flip-card" :class="{ flipped: activeSide === 'back' }">
                <div class="flip-card__inner">
                    <div class="flip-card__side flip-card__front">
                        <div class="card-preview">
                            <label class="upload-box bg_image" :class="photoAdded">
                                <input
                                    type="file"
                                    accept="image/*"
                                    class="hidden"
                                    @change="handlePhotoUpload"
                                />
                                <div v-if="localForm.photo" class="preview">
                                    <img :src="localForm.photo" alt="Photo preview" />
                                </div>
                                <div v-else class="placeholder">
                                    <img src="@/assets/icons/add_icon.svg" class="plus" alt="add" />
                                    <p>Добавить превью</p>
                                </div>
                                <span v-if="coverError" class="error-msg text-center">{{
                                    coverError
                                }}</span>
                            </label>
                        </div>
                    </div>
                    <div class="flip-card__side flip-card__back">
                        <div class="upload-box bg_image">
                            <div class="text-display">
                                <h3 class="english-word">
                                    {{ localForm.translation_word || '?' }}
                                </h3>
                                <button class="audio-play-btn" @click="playAudio">
                                    <img src="@/assets/img/sound-icon.svg" alt="play_audio_icon" />
                                </button>
                                <p class="translation d-mt-8">
                                    {{ localForm.word || '?' }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="tabs">
                <button :class="{ active: activeSide === 'front' }" @click="activeSide = 'front'">
                    Лицевая
                </button>
                <button :class="{ active: activeSide === 'back' }" @click="activeSide = 'back'">
                    Изнанка
                </button>
            </div>

            <div v-if="activeSide === 'front'" class="front-side">
                <div class="video-section">
                    <button class="video-btn" :class="videoAdded" @click="triggerVideoUpload">
                        {{ addVideoText }}
                    </button>
                    <input
                        type="file"
                        accept="video/*"
                        class="hidden"
                        ref="videoInput"
                        @change="handleVideoUpload"
                    />
                    <button class="delete-btn" :disabled="!localForm.video" @click="deleteVideo">
                        <img src="@/assets/icons/delete_icon.svg" alt="Delete" />
                    </button>
                </div>
                <span v-if="videoError" class="error-msg text-center">{{ videoError }}</span>
            </div>

            <div v-if="activeSide === 'back'" class="back-side">
                <p class="add-info-section">Добавить информацию</p>
                <div class="back-form">
                    <div class="form-group">
                        <div class="input-wrapper">
                            <input
                                v-model="localForm.translation_word"
                                type="text"
                                placeholder="Введите слово на английском"
                                :class="englishAdded"
                            />
                            <button
                                class="audio-btn"
                                :class="audioAdded"
                                @click="triggerAudioUpload"
                            >
                                <img src="@/assets/img/sound-icon.svg" alt="add_audio" />
                            </button>
                            <input
                                type="file"
                                accept="audio/*"
                                class="hidden"
                                ref="audioInput"
                                @change="handleAudioUpload"
                            />
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="input-wrapper">
                            <input
                                v-model="localForm.word"
                                type="text"
                                placeholder="Введите перевод"
                                :class="wordAdded"
                            />
                            <button
                                class="delete-btn"
                                :disabled="!localForm.audio"
                                @click="deleteAudio"
                            >
                                <img src="@/assets/icons/delete_icon.svg" alt="Delete" />
                            </button>
                        </div>
                    </div>
                </div>
                <div class="btn-container">
                    <button class="action-btn" @click="saveCard">Сохранить</button>
                    <button class="action-btn outline" @click="previewCard">Предпросмотр</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue';
import { useFormValidation } from '@/composables/useFormValidation';
import { useFileUpload } from '@/composables/useFileUpload';
import LessonsPage from './Learning/LessonsPage.vue';
import { useImageValidation } from '@/composables/useImageValidation';
import { useVideoValidation } from '@/composables/useVideoValidation';

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({
            photo: null,
            video: null,
            translation_word: '',
            word: '',
            audio: null,
        }),
    },
});
const emit = defineEmits(['update:modelValue', 'save', 'close']);

const localForm = reactive({ ...props.modelValue });
const photoUpload = useFileUpload();

watch(
    () => props.modelValue,
    (newVal) => Object.assign(localForm, newVal),
    { deep: true }
);
watch(localForm, () => emit('update:modelValue', localForm), { deep: true });

const { error: coverError, validateAndUpload } = useImageValidation({
    minWidth: 150,
    minHeight: 120,
    maxWidth: 320,
    maxHeight: 465,
});

const { error: videoError, validateAndUpload: validateVideoAndUpload } = useVideoValidation({
    exactWidth: 720,
    exactHeight: 960,
});

const { errors, validateForm } = useFormValidation(localForm, {
    translation_word: (val) => {
        const trimmed = val?.trim() || '';
        if (!trimmed) return true;
        const englishRegex = /^[a-zA-Z\s]+$/;
        return !englishRegex.test(trimmed);
    },
    word: (val) => {
        const trimmed = val?.trim() || '';
        if (!trimmed) return true;
        const englishRegex = /^[а-яА-Я\s]+$/;
        return !englishRegex.test(trimmed);
    },
    photo: (val) => !val,
    video: (val) => !val,
    audio: (val) => !val,
});

const activeSide = ref('front');
const showPreview = ref(false);
const previewSide = ref('front');

const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await validateAndUpload(file, photoUpload.handleUpload);
    if (result) {
        localForm.photo = result;
        e.target.value = '';
    } else {
        e.target.value = '';
    }
};

const videoUpload = useFileUpload();
const triggerVideoUpload = () => videoInput.value?.click();

const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await validateVideoAndUpload(file, videoUpload.handleUpload);
    if (result) {
        localForm.video = result;
        e.target.value = '';
    } else {
        e.target.value = '';
    }
};

const deleteVideo = () => {
    localForm.video = null;
    videoUpload.cleanup();
};
const videoInput = ref(null);

const audioUpload = useFileUpload();
const triggerAudioUpload = () => audioInput.value?.click();
const handleAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) localForm.audio = audioUpload.handleUpload(file);
};
const deleteAudio = () => {
    localForm.audio = null;
    audioUpload.cleanup();
};
const audioInput = ref(null);

const playAudio = () => {
    if (localForm.audio) new Audio(localForm.audio).play().catch(console.error);
};

const addVideoText = computed(() => (localForm.video ? 'Видео загружено' : 'Загрузить видео'));
const videoAdded = computed(() => [
    { 'green-border': localForm.video, 'error-border': errors.video },
]);
const audioAdded = computed(() => [
    { 'green-border': localForm.audio, 'error-border': errors.audio },
]);
const englishAdded = computed(() => [
    { 'green-border': localForm.translation_word, 'error-border': errors.translation_word },
]);
const wordAdded = computed(() => [{ 'green-border': localForm.word, 'error-border': errors.word }]);

const photoAdded = computed(() => [
    { 'green-border': localForm.photo, 'error-border': errors.photo },
]);

const saveCard = () => {
    const valid = validateForm();
    console.log(valid, errors);
    if (valid) {
        emit('save', localForm);
        emit('close');
    }
};

const previewCard = () => (showPreview.value = true);
const closePreview = () => (showPreview.value = false);
const closeForm = () => emit('close');
</script>

<style scoped>
.scroll-container {
    height: auto;
}
.font {
    font-family: Mulish;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 18px;
    leading-trim: NONE;
    line-height: 120%;
    letter-spacing: 0%;
    vertical-align: middle;
}

.add-card-container {
    background: #f5f5f9;
    border-radius: 12px;
    text-align: center;
    width: 100%;
    padding: 0 20px;
}

.card-preview {
    margin-bottom: 20px;
}

.upload-box {
    width: 173px;
    height: 250px;
    background: #f6f6fe;
    border: 2px solid #262060;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #262060;
    cursor: pointer;
    margin: 0 auto;
    position: relative;
}

.placeholder p {
    font-size: 20px;
    text-align: center;
    padding: 10px;
}

.plus {
    margin: 0 auto;
}

.preview img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 12px;
    max-width: 190px;
    max-height: 250px;
}

.preview,
.placeholder {
    position: relative;
}

.delete-btn {
    top: 5px;
    right: 5px;
    background: transparent;
    border: 2px solid #262060;
    cursor: pointer;
    padding: 10px 22px;
    border-radius: 16px;
    max-width: 69px;
}

.delete-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.delete-btn img {
    max-width: 30px;
}

.tabs {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 10px;
}

.tabs button {
    padding: 10px 24px;
    background: transparent;
    border: 2px solid #262060;
    border-radius: 16px;
    cursor: pointer;
    font-size: 18px;
    font-weight: 600;
}

.tabs button.active {
    background: #262060;
    color: white;
}

.front-side,
.back-side {
    margin-bottom: 20px;
}

.video-section,
.audio-section {
    margin-top: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
}
.video-btn {
    width: 100%;
}

.video-btn,
.audio-btn {
    padding: 10px 18px;
    background: transparent;
    border: 2px solid #262060;
    border-radius: 16px;
    cursor: pointer;
}
.audio-btn {
    max-width: 69px;
    max-height: 50px;
}

.audio-btn img {
    max-width: 30px;
}

.video-info,
.audio-info {
    margin-top: 5px;
    color: #262060;
}

.form-group {
    margin-bottom: 15px;
    text-align: left;
    color: #262060;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    color: #262060;
}

.form-group input {
    width: 100%;
    padding: 14px;
    color: #262060;
    border: 1px solid #262060;
    border-radius: 8px;
    background: #f8f5ff;
}

.btn-container {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.action-btn {
    padding: 10px 20px;
    background: #262060;
    color: white;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    flex: 1;
}

.preview-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
}

.preview-content {
    background: white;
    padding: 20px;
    border-radius: 12px;
    max-width: 300px;
    text-align: center;
}

.preview-front img,
.preview-front video {
    width: 100%;
    max-height: 200px;
    margin-bottom: 10px;
}

.close-btn {
    padding: 8px 16px;
    background: #262060;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    margin-top: 10px;
}

.hidden {
    display: none;
}

.bg_image {
    background-image: url('@/assets/lesson/word_card_bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}

.green-border {
    border: 2px solid #3e9d47 !important;
}

.flip-card {
    perspective: 1000px;
    width: 100%;
    max-width: 356px;
    height: 250px;
    position: relative;
    flex-shrink: 0;
    max-height: 50dvh;
    margin: 0 auto 20px;
}

.flip-card__inner {
    position: relative;
    width: 100%;
    transform-style: preserve-3d;
    transition: transform 0.8s ease-in-out;
}

.flip-card.flipped .flip-card__inner {
    transform: rotateY(180deg);
}

.flip-card__side {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    backface-visibility: hidden;
    border-radius: 20px;
    overflow: hidden;
}

.flip-card__back {
    transform: rotateY(180deg);
}

.answers-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    background-image: url('@/assets/lesson/word_card_bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    border: 3px solid #262060;
    border-radius: 20px;
    z-index: 1000;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
}

.answers-card__question-mark {
    font-size: 10rem;
    font-weight: 800;
    line-height: 100%;
    color: #262060;
    padding-top: 1dvh;
    margin: 0;
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
}

.text-display {
    position: relative;
    z-index: 2;
    text-align: center;
    margin-top: 20px;
}

.english-word,
.translation {
    font-size: 1.5rem;
    font-weight: bold;
    color: #262060;
}

.audio-play-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    width: 60px;
    height: 60px;
    padding: 10px;
}

.img-container {
    position: absolute;
    bottom: 3px;
    left: 16dvw;
    z-index: 1;
}

.girl-img {
    height: 25dvh;
    width: auto;
}

.add-info-section {
    color: #311d5d;
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 16px;
    text-align: start;
}

.add-info-btn {
    width: 100%;
    padding: 12px 16px;
    background: transparent;
    border: 2px solid #262060;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #262060;
    font-size: 16px;
}

.add-info-btn img {
    width: 20px;
    height: 20px;
}

.reset-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 12px;
    background: #f6f6fe;
    border-radius: 8px;
    color: #262060;
    font-size: 14px;
}

.reset-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 5px;
}

.reset-btn img {
    width: 20px;
    height: 20px;
}

.back-form {
    margin-bottom: 20px;
}

.input-wrapper {
    display: flex;
    align-items: center;
    gap: 24px;
}

.input-wrapper input {
    width: 100%;
    border: 2px solid #262060;
    border-radius: 18px;
}

input::placeholder {
    font-weight: 400;
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0%;
    color: #262060;
}

.input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    z-index: 1;
}

.outline {
    background: transparent;
    border: 2px solid #262060;
    color: black;
}
.error-border {
    border: 2px solid #c6070b80 !important;
}

.error-msg {
    font-size: 10px;
    color: red;
    margin-top: 4px;
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
