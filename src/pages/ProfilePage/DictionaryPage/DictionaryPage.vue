<template>
    <RouterView v-if="!isRootDictionary" />

    <div v-else class="page-content">
        <Loader v-if="loading" />
        <section v-else>
            <search-input placeholder="Введи слово" @search="searchFavorite" enable-auto-search />

            <div v-if="words.length === 0" class="empty-state">
                <img src="@/assets/Di_avatar/girl-img2.webp" alt="girl" class="empty-state__img" />
                <p class="empty-state__text">У тебя пока нет избранных слов</p>
            </div>

            <section v-else>
                <div class="dictionary-list">
                    <div v-for="word in words" :key="word.id" class="dictionary-item">
                        <div
                            class="dictionary-item__content"
                            @click="goToWord(word.card.id, word.card.category_id, word.id)"
                        >
                            <span class="dictionary-item__category"
                                >Категория {{ word.card.categorie?.name }}:
                                {{ word.card.word }}</span
                            >
                        </div>
                        <button class="dictionary-item__delete-btn" @click="removeWord(word.id)">
                            <img
                                src="@/assets/icons/delete_icon.svg"
                                alt="Удалить"
                                class="dictionary-item__delete-icon"
                            />
                        </button>
                    </div>
                </div>
            </section>
        </section>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SearchInput from '@/shared/ui/SearchInput.vue';
import Loader from '@/shared/components/Loader.vue';
import { useCategoriesStore } from '@/stores/categories';

const router = useRouter();
const route = useRoute();

const categoryStore = useCategoriesStore();

const loading = ref(false);
const words = ref([]);

onMounted(async () => {
    loading.value = true;
    await categoryStore.getFavoriteCards();
    loading.value = false;
});

const isRootDictionary = computed(() => route.name === 'dictionary');

const removeWord = async (id) => {
    await categoryStore.deleteCardFromFavorite(id);
};

const goToWord = (id, category_id, favoriteId) => {
    router.push({
        name: 'cardPreview',
        params: { id: id },
        query: { categoryId: category_id, favoriteId: favoriteId },
    });
};

const searchFavorite = async (event) => {
    if (event !== '') return await categoryStore.searchFavorite(event);
    await categoryStore.getFavoriteCards();
};

watch(
    () => categoryStore.favoriteCards,
    (newVal) => {
        words.value = newVal;
    },
    { deep: true }
);
</script>
<style scoped>
.empty-state {
    text-align: center;
    margin-top: 60px;
}

.empty-state__img {
    width: 200px;
    height: auto;
    margin: 0 auto;
    margin-bottom: -10px;
}

.empty-state__text {
    font-size: 30px;
    color: #262060;
    font-weight: 800;
    line-height: normal;
}

.dictionary-list {
    max-height: 78dvh;
    overflow-y: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    padding-bottom: 60px;
}

.dictionary-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    border-radius: 12px;
}

.dictionary-item__content {
    display: flex;
    gap: 5px;
    border: 2px solid #311d5d;
    border-radius: 20px;
    width: 100%;
    padding: 16px;
    cursor: pointer;
}

.dictionary-item__category {
    font-size: 14px;
    color: #311d5d;
    font-weight: 700;
}

.dictionary-item__delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    margin-left: 7px;
    border: 2px solid #262060;
    border-radius: 20px;
    padding: 15px 19px;
}

.dictionary-item__delete-icon {
    width: 20px;
    height: 20px;
    transition: transform 0.2s;
}

.dictionary-item__delete-btn:hover .dictionary-item__delete-icon {
    transform: scale(1.2);
}
</style>
