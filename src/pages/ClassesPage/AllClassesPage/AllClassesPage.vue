<template>
    <div class="page-content">
        <Loader v-if="loading" />
        <div v-else>
            <search-input
                placeholder="Введи название группы"
                @search="searchClass"
                enable-auto-search
            />

            <div v-if="classes?.length === 0" class="empty-state">
                <p class="empty-state__text">{{ emptyText }}</p>
                <div v-if="!isHasSearch" class="add-block" @click="openClassForm">+</div>
                <img src="@/assets/img/empty-friends.webp" alt="girl" class="empty-state__img" />
            </div>

            <section v-else>
                <div class="add-block" @click="openClassForm">+</div>
                <div class="classes-list">
                    <div
                        v-for="classItem in classes"
                        :key="classItem.id"
                        class="class-item"
                        @click="goToClass(classItem.id)"
                    >
                        <p class="class-item__title">{{ classItem.title }}</p>
                        <div class="class-item__meta">
                            <span class="class-item__grade">{{ classItem.grade }} класс</span>
                            <span class="class-item__students">
                                <span class="class-item__count">{{
                                    classItem.students?.length
                                }}</span>
                                <svg
                                    class="class-item__students-icon"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M12 12.5a4 4 0 1 0-3.999-4 4.003 4.003 0 0 0 4 4Zm0 2c-3.314 0-6 2.015-6 4.5V20h12v-1c0-2.485-2.686-4.5-6-4.5Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </section>
            <create-class-form v-if="isFormOpen" @close="closeClassForm" />
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import Loader from '@/shared/components/Loader.vue';
import SearchInput from '@/shared/ui/SearchInput.vue';
import createClassForm from '@/pages/ClassesPage/components/CreateClassForm.vue';
import { useUserStore } from '@/stores/user';
import { useTeacherStore } from '@/stores/teacher';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const teacherStore = useTeacherStore();

const isFormOpen = ref(false);
const loading = ref(false);
const classes = computed(() => teacherStore.allClasses);
const searchValue = ref('');
const isHasSearch = computed(() => searchValue.value.trim().length > 0);

onMounted(async () => {
    loading.value = true;
    userStore.setHeaderTitle('Классы');
    await teacherStore.getAllClasses();
    loading.value = false;
});

const emptyText = computed(() =>
    isHasSearch.value
        ? 'К сожалению не нашла такой класс'
        : 'У тебя пока нет групп с учениками, создайте их скорее'
);

const openClassForm = (value) => {
    isFormOpen.value = true;
};

const closeClassForm = (value) => {
    isFormOpen.value = false;
};

const searchClass = async (event) => {
    searchValue.value = event ?? '';
    await teacherStore.searchClass(event);
};

const goToClass = async (id) => {
    await teacherStore.getClassById(id);
    router.push({ name: 'classProfile', params: { id: id } });
};

onUnmounted(() => {
    userStore.setHeaderTitle(null);
});
</script>
<style scoped lang="scss">
.empty-state {
    text-align: center;
    margin-top: 2dvh;

    &__img {
        width: min(61dvw, 297px);
        height: auto;
        margin-top: 4dvh;
    }

    &__text {
        font-size: 30px;
        color: #262060;
        font-weight: 800;
        line-height: normal;
        max-width: 305px;
        margin: 0 auto;
        margin-bottom: 3dvh;
    }
}

.add-block {
    display: flex;
    width: 100%;
    height: 9dvh;
    border: 2px dashed #262060;
    border-spacing: 10px;
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    cursor: pointer;
}

.classes-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 2dvh;
}

.class-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #f6b390;
    border-radius: 20px;
    padding: 14px 16px 12px;
    height: 92px;
    cursor: pointer;

    &__title {
        font-size: 18px;
        font-weight: 800;
        margin: 0 0 10px;
        color: #311d5d;
    }

    &__meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        font-weight: 500;
        color: #262060;
    }

    &__grade,
    &__count {
        color: #262060;
    }

    &__students {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-right: 12px;
    }

    &__students-icon {
        width: 16px;
        height: 16px;
        display: block;
    }
}
</style>
