import { reactive, watch, computed } from 'vue';

export const useFormValidation = (formPart, validators) => {
    console.log(formPart, validators);

    const errors = reactive({});

    const validateField = (field) => {
        errors[field] = !!validators[field](formPart[field]);
    };

    const validateForm = () => {
        Object.keys(validators).forEach(validateField);
        return isValid.value;
    };

    Object.keys(validators).forEach((field) => {
        watch(
            () => formPart[field],
            () => validateField(field),
            { debounce: 300 }
        );
    });

    const isValid = computed(() => Object.values(errors).every((e) => !e));

    return { errors, validateForm, isValid };
};
