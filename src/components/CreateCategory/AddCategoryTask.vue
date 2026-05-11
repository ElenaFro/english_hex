<template>
    <div class="task-form">
        <p class="task-form__title">
            {{ isEditing ? 'Редактировать предложение' : 'Новое предложение' }}
        </p>

        <div class="field-group">
            <label class="field-group__label">Предложение</label>
            <div class="field-group__input-wrap">
                <input
                    ref="sentenceInput"
                    v-model="form.sentence_en"
                    type="text"
                    class="field-group__input"
                    :class="{ 'field-group__input--error': errors.sentence_en }"
                    placeholder="The ___?___ is round"
                    @keydown="blockSentenceKeys"
                    @beforeinput="handleSentenceBeforeInput"
                />
                <img src="@/assets/icons/edit_icon.svg" alt="edit" class="field-group__icon" />
            </div>
            <button class="insert-btn" type="button" @click="insertBlank">Вставить пропуск</button>
            <span v-if="errors.sentence_en" class="error-msg">{{ sentenceEnError }}</span>
        </div>

        <div class="field-group">
            <label class="field-group__label">Перевод</label>
            <div class="field-group__input-wrap">
                <input
                    v-model="form.sentence_ru"
                    type="text"
                    class="field-group__input"
                    :class="{ 'field-group__input--error': errors.sentence_ru }"
                    placeholder="Яйцо круглое"
                    @keydown="blockNonRu"
                />
                <img src="@/assets/icons/edit_icon.svg" alt="edit" class="field-group__icon" />
            </div>
            <span v-if="errors.sentence_ru" class="error-msg">Заполните поле</span>
        </div>

        <div class="field-group">
            <label class="field-group__label">Правильный ответ</label>
            <div class="field-group__input-wrap">
                <input
                    v-model="form.correct_answer"
                    type="text"
                    class="field-group__input"
                    :class="{ 'field-group__input--error': errors.correct_answer }"
                    placeholder="egg"
                    @keydown="blockNonEn"
                />
                <img src="@/assets/icons/edit_icon.svg" alt="edit" class="field-group__icon" />
            </div>
            <span v-if="errors.correct_answer" class="error-msg">Заполните поле</span>
        </div>

        <div class="field-group">
            <label class="field-group__label">Неправильные варианты</label>
            <div
                v-for="(_, i) in form.wrong_answers"
                :key="i"
                class="field-group__input-wrap"
                :class="{ 'field-group__input-wrap--gap': i > 0 }"
            >
                <input
                    v-model="form.wrong_answers[i]"
                    type="text"
                    class="field-group__input"
                    :class="{ 'field-group__input--error': errors.wrong_answers }"
                    placeholder="Слово на английском"
                    @keydown="blockNonEn"
                />
                <img src="@/assets/icons/edit_icon.svg" alt="edit" class="field-group__icon" />
            </div>
            <span v-if="errors.wrong_answers" class="error-msg">Заполните все варианты</span>
        </div>

        <div class="task-form__footer">
            <button
                class="audio-btn"
                :class="{ 'audio-btn--filled': form.audio, 'audio-btn--error': errors.audio }"
                @click="triggerAudio"
            >
                <img src="@/assets/img/sound-icon.svg" alt="audio" />
            </button>
            <input
                ref="audioInput"
                type="file"
                accept="audio/*"
                class="hidden"
                @change="handleAudioUpload"
            />
            <button class="continue-btn" @click="submit">Продолжить</button>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, computed, nextTick, watch } from 'vue';

const BLANK = '___?___';

const props = defineProps({
    modelValue: { type: Object, default: () => null },
});

const emit = defineEmits(['save', 'close']);

const isEditing = computed(() => Boolean(props.modelValue?.sentence_en));

const form = reactive({
    id: props.modelValue?.id ?? null,
    sentence_en: props.modelValue?.sentence_en ?? '',
    sentence_ru: props.modelValue?.sentence_ru ?? '',
    correct_answer: props.modelValue?.correct_answer ?? '',
    wrong_answers: props.modelValue?.wrong_answers?.length
        ? [...props.modelValue.wrong_answers]
        : ['', '', ''],
    audio: props.modelValue?.audio ?? null,
});

const errors = reactive({
    sentence_en: false,
    sentence_ru: false,
    correct_answer: false,
    wrong_answers: false,
    audio: false,
});

const blankCount = () => form.sentence_en.split(BLANK).length - 1;

watch(() => form.sentence_en, (val) => {
    if (errors.sentence_en && val.trim() && blankCount() === 1) errors.sentence_en = false;
});
watch(() => form.sentence_ru, (val) => {
    if (errors.sentence_ru && val.trim()) errors.sentence_ru = false;
});
watch(() => form.correct_answer, (val) => {
    if (errors.correct_answer && val.trim()) errors.correct_answer = false;
});
watch(() => [...form.wrong_answers], () => {
    if (errors.wrong_answers && form.wrong_answers.every((w) => w.trim())) errors.wrong_answers = false;
});

const sentenceEnError = computed(() => {
    if (!form.sentence_en.trim()) return 'Заполните поле';
    const count = blankCount();
    if (count === 0) return 'Добавьте пропуск в предложение';
    if (count > 1) return 'Допустим только один пропуск';
    return '';
});

const isControlKey = (e) =>
    e.ctrlKey ||
    e.metaKey ||
    e.altKey ||
    [
        'Backspace',
        'Delete',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
        'Tab',
        'Enter',
    ].includes(e.key);

// Поле "Предложение": только латинские буквы, цифры, пробел, пунктуация — без _
// Backspace/Delete удаляют ___?___ целиком если курсор касается пропуска
const blockSentenceKeys = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (
        ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Tab', 'Enter'].includes(
            e.key
        )
    )
        return;

    if (e.key === 'Backspace' || e.key === 'Delete') {
        const el = sentenceInput.value;
        if (!el) return;

        const selStart = el.selectionStart;
        const selEnd = el.selectionEnd;
        const text = form.sentence_en;
        const blankPos = text.indexOf(BLANK);

        if (blankPos === -1) return;

        const blankEnd = blankPos + BLANK.length;

        const touches =
            selStart !== selEnd
                ? selStart < blankEnd && selEnd > blankPos
                : e.key === 'Backspace'
                  ? selStart > blankPos && selStart <= blankEnd
                  : selStart >= blankPos && selStart < blankEnd;

        if (touches) {
            e.preventDefault();
            form.sentence_en = text.slice(0, blankPos) + text.slice(blankEnd);
            nextTick(() => {
                el.focus();
                el.setSelectionRange(blankPos, blankPos);
            });
        }
        return;
    }

    if (e.key === '_') {
        e.preventDefault();
        return;
    }
    if (!/^[a-zA-Z0-9 .,!?;:'"()\-]$/.test(e.key)) e.preventDefault();
};

// Перехватываем beforeinput для удаления ___?___ целиком
const handleSentenceBeforeInput = (e) => {
    const deletionTypes = [
        'deleteContentBackward',
        'deleteContentForward',
        'deleteWordBackward',
        'deleteWordForward',
        'deleteSoftLineBackward',
        'deleteSoftLineForward',
        'deleteByDrag',
        'deleteByCut',
    ];
    if (!deletionTypes.includes(e.inputType)) return;

    const text = form.sentence_en;
    const blankPos = text.indexOf(BLANK);
    if (blankPos === -1) return;

    const blankEnd = blankPos + BLANK.length;
    const el = sentenceInput.value;
    if (!el) return;

    const selStart = el.selectionStart;
    const selEnd = el.selectionEnd;

    const touches =
        selStart !== selEnd
            ? selStart < blankEnd && selEnd > blankPos
            : e.inputType.includes('Backward')
              ? selStart > blankPos && selStart <= blankEnd
              : selStart >= blankPos && selStart < blankEnd;

    if (touches) {
        e.preventDefault();
        form.sentence_en = text.slice(0, blankPos) + text.slice(blankEnd);
        nextTick(() => {
            el.focus();
            el.setSelectionRange(blankPos, blankPos);
        });
    }
};

const blockNonEn = (e) => {
    if (isControlKey(e)) return;
    if (!/^[a-zA-Z ]$/.test(e.key)) e.preventDefault();
};

const blockNonRu = (e) => {
    if (isControlKey(e)) return;
    if (!/^[а-яёА-ЯЁ ]$/.test(e.key)) e.preventDefault();
};

const sentenceInput = ref(null);
const insertBlank = async () => {
    const el = sentenceInput.value;
    if (!el) return;

    const start = el.selectionStart ?? form.sentence_en.length;
    const end = el.selectionEnd ?? start;
    const before = form.sentence_en.slice(0, start);
    const after = form.sentence_en.slice(end);

    // Убираем старый пропуск если уже есть — допускаем только один
    const withoutBlank = (before + after).replace(BLANK, '');
    const insertPos = before.replace(BLANK, '').length;

    const textBefore = withoutBlank.slice(0, insertPos);
    const textAfter = withoutBlank.slice(insertPos);

    // Пробел перед пропуском — если не начало строки и перед ним нет пробела
    const prefix = textBefore.length > 0 && !textBefore.endsWith(' ') ? ' ' : '';
    // Пробел после пропуска — всегда
    const suffix = ' ';

    form.sentence_en = textBefore + prefix + BLANK + suffix + textAfter;

    await nextTick();
    const newPos = insertPos + prefix.length + BLANK.length + suffix.length;
    el.focus();
    el.setSelectionRange(newPos, newPos);
};

const validate = () => {
    errors.sentence_en = !form.sentence_en.trim() || blankCount() !== 1;
    errors.sentence_ru = !form.sentence_ru.trim();
    errors.correct_answer = !form.correct_answer.trim();
    errors.wrong_answers = form.wrong_answers.some((w) => !w.trim());
    errors.audio = !form.audio;

    return !Object.values(errors).some(Boolean);
};

const audioInput = ref(null);
const triggerAudio = () => audioInput.value?.click();

const handleAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    form.audio = file;
    errors.audio = false;
};

const submit = () => {
    form.sentence_en = form.sentence_en.trimEnd();
    if (!validate()) return;
    emit('save', { ...form, wrong_answers: [...form.wrong_answers] });
};
</script>

<style scoped>
.task-form {
    padding: 0 20px 160px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    width: 100%;
    height: 100dvh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.task-form__title {
    font-family: Mulish;
    font-weight: 800;
    font-size: 20px;
    color: #262060;
    text-align: center;
    line-height: normal;
}

.field-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.field-group__label {
    font-family: Mulish;
    font-weight: 800;
    font-size: 20px;
    color: #311d5d;
    line-height: normal;
}

.field-group__input-wrap {
    position: relative;
    display: flex;
    align-items: center;
}

.field-group__input-wrap--gap {
    margin-top: 8px;
}

.field-group__input {
    width: 100%;
    padding: 14px;
    border: 2px solid #262060;
    border-radius: 18px;
    font-family: Mulish;
    font-weight: 400;
    font-size: 16px;
    color: #262060;
    outline: none;
    background: #fff;
}

.field-group__input::placeholder {
    color: #26206066;
}

.field-group__input--error {
    border-color: #c6070b80;
}

.field-group__icon {
    position: absolute;
    right: 12px;
    width: 16px;
    height: 16px;
    pointer-events: none;
}

.insert-btn {
    align-self: flex-start;
    padding: 6px 14px;
    border: 2px dashed #262060;
    border-radius: 16px;
    background: transparent;
    font-family: Mulish;
    font-weight: 600;
    font-size: 14px;
    color: #262060;
    cursor: pointer;
    transition: background 0.2s;
}
.insert-btn:hover {
    background: #26206010;
}

.error-msg {
    font-size: 12px;
    color: red;
}

.task-form__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 14px;
}

.audio-btn {
    width: 69px;
    height: 46px;
    border-radius: 16px;
    padding: 12px 20px;
    border: 2px solid #262060;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background 0.2s;
}

.audio-btn--filled {
    border-color: #3e9d47;
}

.audio-btn--error {
    border-color: #c6070b80;
}

.audio-btn img {
    width: 24px;
    height: 24px;
}

.continue-btn {
    padding: 9px 24px;
    background: #2e236d;
    color: #fff;
    border: none;
    border-radius: 16px;
    font-family: Mulish;
    font-weight: 600;
    font-size: 18px;
    cursor: pointer;
    line-height: 120%;
}

.hidden {
    display: none;
}
</style>
