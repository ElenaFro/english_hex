<template>
    <div class="scroll-container">
        <loader class="loader" v-if="!currentCategory?.name" />
        <section v-else>
            <div class="img-container">
                <img class="learning-img" src="@/assets/img/learning-img-group.png" alt="" />
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
</script>
<style scoped lang="scss">
.img-container {
    display: block;
    position: relative;
    padding-bottom: 19px;
    align-self: center;
}

.page-content__title {
    font-size: 24px;
    font-weight: 700;
    line-height: 100%;
    color: rgba(49, 29, 93, 1);
    margin-bottom: 25px;
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
