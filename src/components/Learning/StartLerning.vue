<template>
    <div class="scroll-container">
        <loader class="loader" v-if="!currentCategory?.name" />
        <section v-else>
            <div class="img-container">
                <div class="img-stack">
                    <img
                        v-for="(img, index) in previewImages"
                        :key="img.id || index"
                        :src="img.card_photo"
                        class="stack-img"
                        :class="`stack-img--${index}`"
                        alt="card preview"
                    />
                </div>
            </div>

            <h1 class="page-content__title">{{ title }}</h1>
            <p class="page-content__text">{{ description }}</p>
            <div class="btn-container">
                <button
                    @click="$emit('switch-component', 'LessonsPage')"
                    class="button button--blue"
                >
                    Перейти к изучению
                </button>
                <button v-if="isAdmin" @click="openEditConfirmPopup" class="button button--blue">
                    <img src="@/assets/icons/editPencil.svg" />
                </button>
            </div>
            <button
                v-if="categoryComplite"
                @click="showPopup = !showPopup"
                class="button button--blue d-mt-24"
            >
                Перейти к играм
            </button>
        </section>
    </div>
    <defaultPopup
        :is-visible="showPopup"
        title="Новая игра"
        :message="popupMessage"
        @confirm="goToGames"
        @close="showPopup = !showPopup"
    />

    <defaultPopup
        :is-visible="goEditConfirmPopup"
        title="Перейти к редактированию колоды?"
        @confirm="goToEditCategory"
        @close="goEditConfirmPopup = !goEditConfirmPopup"
    />
</template>

<script setup>
import { useCategoriesStore } from '@/stores/categories';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Loader from '../Loader.vue';
import defaultPopup from '../popups/defaultPopup.vue';
import animalsImg from '@/assets/categoryLessonImg/animals.svg';
import clothesImg from '@/assets/categoryLessonImg/clothes.svg';
import body_partImg from '@/assets/categoryLessonImg/body_part.svg';
import femalyImg from '@/assets/categoryLessonImg/femaly.svg';
import food_baseImg from '@/assets/categoryLessonImg/food_base.svg';
import house_baseImg from '@/assets/categoryLessonImg/house_base.svg';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const currentCategory = ref({});
const showPopup = ref(false);
const goEditConfirmPopup = ref(false);
const popupMessage =
    'Если вы хотите получить больше звёзд пройдите остальные три игры, за прохождение пройденных игр звёзды не начисляются';

onMounted(async () => {
    await useCategoriesStore().getChosedCategory(route.params.id);
    currentCategory.value = useCategoriesStore().chosedCategory;
});

const previewImages = computed(() => {
    return (
        currentCategory.value?.cards?.slice(0, 3).map((item) => ({
            ...item,
            card_photo: `${import.meta.env.VITE_STORAGE_URI}/${currentCategory.value.id}/cards/${item.id}/word_image/${item.card_photo}`,
        })) || []
    );
});

const title = computed(() => currentCategory.value.name);
const description = computed(() => useCategoriesStore().chosedCategory.description);
const categoryComplite = computed(() => currentCategory.value.completed_category);
const isAdmin = computed(() => userStore.isAdmin);
const goToGames = () => {
    router.push({ name: 'games', query: { id: currentCategory.value.id } });
};

const imgSource = computed(() => {
    if (currentCategory.value?.name === 'Животные') return animalsImg;
    if (currentCategory.value?.name === 'Базовая одежда') return clothesImg;
    if (currentCategory.value?.name === 'Части тела') return body_partImg;
    if (currentCategory.value?.name === 'Семья') return femalyImg;
    if (currentCategory.value?.name === 'Базовая еда') return food_baseImg;
    return house_baseImg;
});

const openEditConfirmPopup = () => {
    goEditConfirmPopup.value = true;
};

const goToEditCategory = () => {
    router.push({ name: 'editCategory', params: { id: currentCategory.value.id } });
};
</script>
<style scoped lang="scss">
.img-container {
    display: block;
    position: relative;
    padding-bottom: 19px;
    align-self: center;
    max-height: 34dvh;
}

.learning-img {
    width: 100%;
    height: 100%;
    max-height: 34dvh;
}

.page-content__title {
    font-size: 24px;
    font-weight: 700;
    line-height: 100%;
    color: rgba(49, 29, 93, 1);
    margin-bottom: 16px;
}

.page-content__text {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: rgba(38, 32, 96, 1);
    margin-bottom: 25px;
}
.loader {
    margin-top: 35vh;
}

.btn-container {
    display: flex;
    justify-content: space-between;
}

.img-container {
    display: flex;
    justify-content: center;
    position: relative;
    padding-bottom: 24px;
}

.img-stack {
    position: relative;
    width: 220px;
    height: 280px;
}

.stack-img {
    position: absolute;
    width: 180px;
    height: 260px;
    border-radius: 20px;
    object-fit: cover;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease;
}

/* Задняя */
.stack-img--0 {
    transform: rotate(-10deg) translateX(-30px);
    z-index: 1;
    opacity: 0.9;
}

/* Средняя */
.stack-img--1 {
    transform: rotate(5deg) translateX(20px);
    z-index: 2;
}

/* Передняя */
.stack-img--2 {
    transform: rotate(0deg);
    z-index: 3;
}
</style>
