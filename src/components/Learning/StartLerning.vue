<template>
    <div class="scroll-container">
        <loader class="loader" v-if="!currentCategory?.name" />
        <section v-else>
            <div class="img-container">
                <img class="learning-img" :src="imgSource" alt="image" />
            </div>
            <h1 class="page-content__title">{{ title }}</h1>
            <p class="page-content__text">{{ description }}</p>
            <button @click="$emit('switch-component', 'LessonsPage')" class="button button--blue">
                Перейти к изучению
            </button>
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

const route = useRoute();
const router = useRouter();
const currentCategory = ref({});
const showPopup = ref(false);
const popupMessage =
    'Если вы хотите получить больше звёзд пройдите остальные три игры, за прохождение пройденных игр звёзды не начисляются';

onMounted(async () => {
    await useCategoriesStore().getChosedCategory(route.params.id);
    currentCategory.value = useCategoriesStore().chosedCategory;
});

const title = computed(() => currentCategory.value.name);
const description = computed(() => useCategoriesStore().chosedCategory.description);
const categoryComplite = computed(() => currentCategory.value.completed_category);

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
</style>
