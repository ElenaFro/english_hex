<template>
    <div class="page-content">
        <search-input
            placeholder="Введи название группы"
            @search="console.log($event)"
            enable-auto-search
        />

        <div v-if="classes.length === 0" class="empty-state">
            <p class="empty-state__text">У тебя пока нет групп с учениками, создайте их скорее</p>
            <div class="add-block" @click="openClassForm">+</div>
            <img src="@/assets/img/empty-friends.webp" alt="girl" class="empty-state__img" />
        </div>

        <section v-else>
            <div class="add-block" @click="openClassForm">+</div>
            <div class="classes-list">
                <div v-for="classItem in classes" :key="classItem.id" class="class-item"></div>
            </div>
        </section>
        <create-class-form v-if="isFormOpen" @close="closeClassForm" />
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SearchInput from '@/shared/ui/SearchInput.vue';
import UserCardWithStar from '@/shared/ui/UserCardWithStar.vue';
import createClassForm from '@/pages/ClassesPage/components/CreateClassForm.vue';
import { useUserStore } from '@/stores/user';
import { push } from 'notivue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const isFormOpen = ref(false);
const classes = ref([
    // { id: 8, name: 'odilbek_arziev', rating: 145, gender: 'male', place: 1 },
    // { id: 2, name: 'fdgbvbhgf', rating: 0, gender: 'male', place: 2 },
    // { id: 3, name: 'gfhfghsfgh', rating: 0, gender: 'male', place: 3 },
    // { id: 4, name: 'dfgsdfg', rating: 0, gender: 'male', place: 4 },
    // { id: 5, name: 'TestAndrew', rating: 0, gender: 'male', place: 5 },
    // { id: 6, name: 'Марина', rating: 0, gender: 'female', place: 6 },
    // { id: 7, name: 'odilbek', rating: 0, gender: 'male', place: 7 },
    // { id: 9, name: 'Ovrono', rating: 0, gender: 'male', place: 8 },
    // { id: 12, name: 'Mark_lebovski', rating: 0, gender: 'male', place: 11 },
]);

onMounted(() => {
    userStore.setHeaderTitle('Ученики');
});

const openClassForm = (value) => {
    isFormOpen.value = true;
};

const closeClassForm = (value) => {
    isFormOpen.value = false;
};
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
    }
}

.add-block {
    display: flex;
    width: 100%;
    height: 10dvh;
    border: 2px dashed #262060;
    border-spacing: 10px;
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    cursor: pointer;
    margin-top: 3dvh;
}

.friends-menu {
    &__section-title {
        margin: 5px 0 19px;
        font-size: 22px;
        font-weight: 800;
        color: #311d5d;
    }
}

.friends-list {
    max-height: 78dvh;
    overflow-y: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    padding-bottom: 60px;
}

.friends-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    border-radius: 12px;
}

.friends-item__delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    margin-left: 7px;
    border: 2px solid #262060;
    border-radius: 20px;
    padding: 15px 19px;
}

.friends-item__delete-icon {
    width: 25px;
    height: 25px;
    transition: transform 0.2s;
}

.friends-item__delete-btn:hover .dictionary-item__delete-icon {
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
