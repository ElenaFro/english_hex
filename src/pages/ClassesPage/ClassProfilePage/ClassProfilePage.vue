<template>
    <div class="page-content">
        <Loader v-if="loading" />
        <div v-else>
            <search-input
                placeholder="Найди или добавь ученика"
                @search="searchStudent"
                enable-auto-search
            />

            <div v-if="students.length === 0" class="empty-state">
                <img src="@/assets/img/empty-friends.webp" alt="girl" class="empty-state__img" />
                <p class="empty-state__text">В этом классе еще нет учеников, добавь их скорее</p>
            </div>

            <section v-else>
                <div class="title-wrapper">
                    <p class="students-menu__section-title">{{ classTitle }}</p>
                    <p class="students-menu__section-garde">{{ classGrade }} класс</p>
                </div>
                <div class="students-list">
                    <div v-for="student in students" :key="student.id" class="students-item">
                        <user-card-with-star :user="student" @click="goToUserProfile(student.id)" />
                        <button
                            class="students-item__delete-btn"
                            @click="removeStudentFromClass(student.id)"
                        >
                            <img
                                src="@/assets/icons/delete_icon.svg"
                                alt="Удалить"
                                class="students-item__delete-icon"
                            />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Loader from '@/shared/components/Loader.vue';
import SearchInput from '@/shared/ui/SearchInput.vue';
import UserCardWithStar from '@/shared/ui/UserCardWithStar.vue';
import { useUserStore } from '@/stores/user';
import { useTeacherStore } from '@/stores/teacher';
import { push } from 'notivue';

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
const teacherStore = useTeacherStore();

const loading = ref(false);
const students = ref([]);

onMounted(async () => {
    userStore.setHeaderTitle('Ученики');
    loading.value = true;
    if (currentClass.value === null) await teacherStore.getClassById(currentClassId.value);
    await userStore.searchUsers('', 1);
    students.value = userStore.currentSearchedUsers;
    loading.value = false;
});

const currentClass = computed(() => teacherStore.currentClass);
const currentClassId = computed(() => currentClass.value?.id || route.params?.id);

const classTitle = computed(() => currentClass.value?.title);

const classGrade = computed(() => currentClass.value?.grade);

const removeStudentFromClass = async (id) => {
    try {
        await teacherStore.deleteStudentFromClass(currentClassId.value, id);
        push.success({
            message: 'Ученик успешно удален',
        });
    } catch (error) {
        push.error({
            message: 'Не удалось удалить ученика',
        });
    }
};

const goToUserProfile = (userId) => {
    router.push({ name: 'profileAchievements', params: { id: userId } });
};
</script>
<style scoped lang="scss">
.empty-state {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 60px;

    &__img {
        width: min(61dvw, 297px);
        height: auto;
        margin-bottom: 18px;
    }

    &__text {
        font-size: 30px;
        color: #262060;
        font-weight: 800;
        line-height: normal;
        max-width: 310px;
    }
}

.title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px 0 20px;
}

.students-menu__section {
    &-title {
        font-size: 22px;
        font-weight: 800;
        color: #311d5d;
    }
    &-grade {
        font-size: 14px;
        font-weight: 500;
    }
}

.students-list {
    max-height: 78dvh;
    overflow-y: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    padding-bottom: 60px;
}

.students-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    border-radius: 12px;
}

.students-item__delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    margin-left: 7px;
    border: 2px solid #262060;
    border-radius: 20px;
    padding: 15px 19px;
}

.students-item__delete-icon {
    width: 25px;
    height: 25px;
    transition: transform 0.2s;
}

.students-item__delete-btn:hover .dictionary-item__delete-icon {
    transform: scale(1.2);
}

:deep(.user-item-section) {
    border-color: #311d5d;

    .user-name {
        color: #311d5d;
    }

    .user-stars {
        color: #311d5d;
    }
}
</style>
