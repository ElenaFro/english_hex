import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import apiClient from '../api/axios';
import { useUserStore } from './user';

export const useTeacherStore = defineStore('teacher', () => {
    const userStore = useUserStore();
    const isTeacher = computed(() => userStore.isTeacher);
    const allClasses = ref(null);
    const currentClass = ref(null);
    const searchedStudents = ref([]);

    async function registerTeacher(name, email, password, confirm_agreement) {
        const response = await apiClient.post('/registration-teacher', {
            email: email,
            password: password,
            name: name,
            confirm_agreement: confirm_agreement,
        });
        return response.data;
    }

    async function createClass(form) {
        try {
            if (isTeacher.value) {
                const response = await apiClient.post('/classes/store', {
                    title: form.title,
                    grade: form.grade,
                });
                return response.data;
            }
        } catch (error) {
            console.error(error);
            throw new Error();
        }
    }

    async function getAllClasses() {
        if (!userStore.token) return;
        try {
            const response = await apiClient.get('/classes/get');
            allClasses.value = response.data.data;
        } catch (error) {
            console.error('Fetch role error:', error);
        }
    }

    async function getClassById(id) {
        if (!userStore.token) return;
        try {
            const response = await apiClient.get(`/classes/show/${id}`);
            currentClass.value = response.data;
        } catch (error) {
            console.error('Fetch role error:', error);
        }
    }

    async function searchClass(name) {
        if (!userStore.token) return;
        try {
            const response = await apiClient.get('/classes/search_classes', {
                params: { search: name },
            });

            allClasses.value = response.data.data;
        } catch (error) {
            console.error('Fetch role error:', error);
        }
    }

    async function searchStudents(id, name) {
        if (!userStore.token) return;
        try {
            const response = await apiClient.get('/classes/search_students', {
                params: { class_id: id, search: name },
            });

            searchedStudents.value = response.data.data;
        } catch (error) {
            console.error('Fetch role error:', error);
        }
    }

    async function addStudentToClass(classId, userId) {
        if (!userStore.token) return;
        try {
            await apiClient.patch(`/classes/add_student/${classId}/${userId}`);
            await getAllClasses();

            if (currentClass.value && currentClass.value.id === classId) {
                await getClassById(classId);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteStudentFromClass(classId, userId) {
        if (!userStore.token) return;
        try {
            await apiClient.delete(`/classes/delete_student/${classId}/${userId}`);
            await getAllClasses();

            if (currentClass.value && currentClass.value.id === classId) {
                await getClassById(classId);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return {
        allClasses,
        currentClass,
        searchedStudents,
        registerTeacher,
        createClass,
        getAllClasses,
        getClassById,
        addStudentToClass,
        deleteStudentFromClass,
        searchClass,
        searchStudents,
    };
});
