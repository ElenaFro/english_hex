<template>
    <section class="page-content">
        <div class="edit-planet-page">
            <b-button
                label="Ссылка приглашение"
                label-class="text-white"
                class="button button--purple button--big edit-planet-page__invite"
            />

            <div class="edit-planet-page__content">
                <div class="edit-planet-page__grid-scroll">
                    <div class="edit-planet-page__matrix">
                        <div
                            v-for="row in rows"
                            :key="`row-${row.level}`"
                            class="edit-planet-page__row"
                        >
                            <div class="edit-planet-page__level-item">
                                {{ row.level }}
                                <img src="@/assets/icons/yelow_star.svg" alt="star" />
                            </div>
                            <button
                                v-for="col in 3"
                                :key="`${row.level}-${col}`"
                                type="button"
                                class="edit-planet-page__planet-slot"
                                :aria-label="`slot-${row.level}-${col}`"
                            >
                                <img
                                    src="@/assets/planets_icon/green_planet_1.svg"
                                    class="edit-planet-page__planet-placeholder"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import BButton from '@/shared/components/BaseButton.vue';

const rows = [
    { level: 100 },
    { level: 200 },
    { level: 300 },
    { level: 400 },
    { level: 500 },
    { level: 600 },
    { level: 700 },
    { level: 800 },
];
</script>

<style scoped lang="scss">
.edit-planet-page {
    width: 100%;
    border-radius: 28px;
    background: #f6f6fe;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: calc(100dvh - 230px);
}

.edit-planet-page__invite {
    min-height: 42px;
    border-radius: 12px;
    font-size: 20px;
}

.edit-planet-page__content {
    min-height: 0;
    flex: 1;
}

.edit-planet-page__level-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 3px;
    font-size: 20px;
    font-weight: 700;
    line-height: 100%;
    white-space: nowrap;

    img {
        width: 22px;
        height: 22px;
    }
}

.edit-planet-page__grid-scroll {
    min-height: 0;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 2px;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.edit-planet-page__matrix {
    display: grid;
    grid-template-columns: minmax(56px, 0.9fr) repeat(3, minmax(0, 1fr));
    gap: 12px;
    align-items: stretch;
    padding-bottom: 90px;
}

.edit-planet-page__row {
    display: contents;
}

.edit-planet-page__planet-slot {
    position: relative;
    width: 100%;
    aspect-ratio: 1.15 / 1;
    border: 2px solid #6e67a6;
    border-radius: 14px;
    background: #ffffff;
    padding: 6px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
}

.edit-planet-page__planet-placeholder {
    position: absolute;
    bottom: -50%;
    width: 90%;
    height: auto;
}

@media (max-width: 414px) {
    .edit-planet-page__invite {
        font-size: 18px;
    }

    .edit-planet-page__level-item {
        font-size: 17px;
    }

    .edit-planet-page__matrix {
        gap: 8px;
    }
}
</style>
