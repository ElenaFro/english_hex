<template>
    <RouterView v-if="!isRootDictionary" />

    <div v-else class="page-content">
        <div class="search-container">
            <input type="text" placeholder="Введи слово" class="search-input" />
            <img src="@/assets/icons/profile/search.svg" alt="search" class="search-icon" />
        </div>

        <div v-if="words.length === 0" class="empty-state">
            <img src="@/assets/Di_avatar/girl-img2.webp" alt="girl" class="empty-state__img" />
            <p class="empty-state__text">У тебя пока нет избранных слов</p>
        </div>

        <section v-else>
            <div class="dictionary-list">
                <div v-for="word in words" :key="word.id" class="dictionary-item">
                    <div class="dictionary-item__content" @click="goToWord">
                        <span class="dictionary-item__category"
                            >Категория {{ word.category }}: {{ word.translation_word }}</span
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
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const words = ref([
    { id: 1, category: 'Животные', translation_word: 'Собака' },
    { id: 2, category: 'Еда', translation_word: 'Пицца' },
    { id: 3, category: 'Технологии', translation_word: 'Компьютер' },
    { id: 4, category: 'Природа', translation_word: 'Дерево' },
    { id: 5, category: 'Спорт', translation_word: 'Футбол' },
    { id: 6, category: 'Музыка', translation_word: 'Гитара' },
    { id: 7, category: 'Искусство', translation_word: 'Картина' },
    { id: 8, category: 'Наука', translation_word: 'Физика' },
    { id: 9, category: 'География', translation_word: 'Река' },
    { id: 10, category: 'Литература', translation_word: 'Роман' },
]);

const isRootDictionary = computed(() => route.name === 'dictionary');

const removeWord = (id) => {
    words.value = words.value.filter((word) => word.id !== id);
};

const goToWord = (id) => {
    router.push({ name: 'cardPreview', params: { id: 1 }, query: { categoryId: 1 } });
};
</script>
<style scoped>
.search-container {
    position: relative;
    margin-bottom: 20px;
}

.search-input {
    width: 100%;
    margin-top: 10px;
    padding: 12px 40px 12px 30px;
    border: 1px solid #262060;
    border-radius: 12px;
    font-size: 16px;
    outline: none;
}

.search-icon {
    position: absolute;
    right: 15px;
    top: 58%;
    transform: translateY(-50%);
    width: 22px;
    height: 22px;
    pointer-events: none;
}

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

<style>
.search-input::placeholder {
    font-size: 16px;
    font-weight: 600;
    color: #311d5d;
}
</style>
