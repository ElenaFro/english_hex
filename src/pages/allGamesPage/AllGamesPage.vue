<template>
    <div class="page-content">
        <div class="scroll-container">
            <section class="all-games">
                <div class="all-games__list">
                    <button
                        v-for="game in games"
                        :key="game.id"
                        class="all-games__card"
                        type="button"
                        :aria-disabled="game.disabled ? 'true' : 'false'"
                        :tabindex="game.disabled ? -1 : 0"
                        @click="goToGame(game)"
                    >
                        <div class="all-games__card-text">
                            <p class="all-games__card-title">{{ game.title }}</p>
                            <p v-if="game.subtitle" class="all-games__card-subtitle">
                                {{ game.subtitle }}
                            </p>
                        </div>

                        <span
                            class="all-games__card-btn"
                            :class="{ 'all-games__card-btn--locked': !hasCompletedCategory }"
                        >Начать</span>
                    </button>
                </div>
            </section>
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategoriesStore } from '@/stores/categories';

const router = useRouter();
const route = useRoute();
const categoriesStore = useCategoriesStore();

const hasCompletedCategory = computed(() =>
    categoriesStore.categories.some((c) => c.completed_category)
);

const games = ref([
    {
        id: 'constellation',
        title: 'Созвездие слов',
        subtitle: 'Найди пару слову',
        routeName: 'constellationGame',
        disabled: false,
    },
    {
        id: 'wordTwinkle',
        title: 'Мерцание слов',
        subtitle: 'Найди пару слову',
        routeName: 'wordTwinkle',
        disabled: false,
    },
    {
        id: 'planetAttack',
        title: 'Атака планеты',
        subtitle: 'Найди пару слову',
        routeName: 'planetGame',
        disabled: false,
    },
    {
        id: 'galaxyPhrases',
        title: 'Галактика фраз',
        subtitle: 'Собери слова в\nпредложения',
        routeName: 'galaxyPhrasesGame',
        disabled: false,
    },
    {
        id: 'endless',
        title: 'Бесконечный режим',
        subtitle: null,
        routeName: 'infinityGame',
        disabled: false,
    },
]);

const goToGame = (game) => {
    if (!game?.routeName || game.disabled || !hasCompletedCategory.value) return;
    if (game.id === 'endless') {
        router.push({ name: game.routeName });
        return;
    }

    const query = route.query?.id
        ? { id: route.query.id }
        : { allCategories: 'true' };

    router.push({ name: game.routeName, query });
};
</script>

<style scoped lang="scss">
.all-games {
    width: 100%;
    display: flex;
    justify-content: center;

    &__list {
        width: 100%;
        max-width: 325px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    &__card {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 14px;
        height: 127px;

        position: relative;
        padding: 18px 16px;
        border-radius: 22px;
        border: none;
        background-color: #262060;

        text-align: left;
        cursor: pointer;
    }

    &__card-text {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding-right: 120px;
        min-width: 0;
    }

    &__card-title {
        margin: 0;
        font-size: 20px;
        font-weight: 800;
        line-height: 1.1;
        color: #ffffff;
    }

    &__card-subtitle {
        margin: 0;
        white-space: pre-line;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.2;
        color: rgba(255, 255, 255, 0.85);
    }

    &__card-btn {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        position: absolute;
        right: 16px;
        bottom: 18px;

        height: 35px;
        padding: 0 22px;
        border-radius: 16px;
        background-color: #ffffff;

        font-size: 18px;
        font-weight: 700;
        line-height: 1.2;
        color: #262060;

        &--locked {
            background-color: rgba(255, 255, 255, 0.4);
            color: rgba(49, 29, 93, 0.5);
            cursor: not-allowed;

            &::after {
                content: 'Пройдите хотя бы одну категорию';
                position: absolute;
                bottom: calc(100% + 8px);
                right: 0;
                white-space: nowrap;
                background: #ffffff;
                color: #000000;
                font-size: 13px;
                font-weight: 500;
                padding: 6px 12px;
                border-radius: 10px;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.15s ease;
            }

            &:hover::after,
            &:active::after {
                opacity: 1;
            }
        }
    }
}
</style>
