<template>
    <section class="page-content" :class="pageClass">
        <InviteUsersPopup v-if="isAddFriendLink" @close="closeLinkPopup" />
        <ChoosePlanetPopup
            v-else-if="isChoosePlanetPopupVisible"
            :is-visible="isChoosePlanetPopupVisible"
            :stars-cost="selectedRowCost"
            :planet-images="selectedRowPlanets"
            :initial-selected-index="selectedPlanetIndex"
            @close="closeChoosePlanetPopup"
            @confirm="handlePlanetConfirm"
        />
        <div v-else class="edit-planet-page">
            <b-button
                label="Ссылка приглашение"
                label-class="text-white"
                class="button button--purple button--big edit-planet-page__invite"
                @click="openLinkPopup"
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
                                :class="{
                                    'edit-planet-page__planet-slot--selected':
                                        selectedSlotByRow[row.level] === col - 1,
                                }"
                                :aria-label="`slot-${row.level}-${col}`"
                                @click="openChoosePlanetPopup(row, col - 1)"
                            >
                                <img
                                    :src="row.planets[col - 1]"
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
import { computed, ref } from 'vue';
import BButton from '@/shared/components/BaseButton.vue';
import InviteUsersPopup from './popups/InviteUsersPopup.vue';
import ChoosePlanetPopup from './popups/ChoosePlanetPopup.vue';
import planet1 from '@/assets/img/planets/planet-img 1.png';
import planet2 from '@/assets/img/planets/planet-img 2.png';
import planet3 from '@/assets/img/planets/planet-img 3.png';
import planet4 from '@/assets/img/planets/planet-img 4.png';

const isAddFriendLink = ref(false);
const isChoosePlanetPopupVisible = ref(false);
const selectedRowCost = ref(0);
const selectedRowPlanets = ref([]);
const selectedPlanetIndex = ref(0);
const selectedSlotByRow = ref({});

const rows = [
    { level: 100, planets: [planet1, planet2, planet3] },
    { level: 200, planets: [planet2, planet3, planet4] },
    { level: 300, planets: [planet3, planet4, planet1] },
    { level: 400, planets: [planet4, planet1, planet2] },
    { level: 500, planets: [planet1, planet3, planet4] },
    { level: 600, planets: [planet2, planet4, planet1] },
    { level: 700, planets: [planet3, planet1, planet2] },
    { level: 800, planets: [planet4, planet2, planet3] },
];

const pageClass = computed(() =>
    isAddFriendLink.value || isChoosePlanetPopupVisible.value ? 'transparent' : ''
);

const closeLinkPopup = () => {
    isAddFriendLink.value = false;
};

const openLinkPopup = () => {
    isAddFriendLink.value = true;
};

const openChoosePlanetPopup = (row, initialIndex) => {
    selectedRowCost.value = row.level;
    selectedRowPlanets.value = row.planets;
    selectedPlanetIndex.value = selectedSlotByRow.value[row.level] ?? initialIndex;
    isChoosePlanetPopupVisible.value = true;
};

const closeChoosePlanetPopup = () => {
    isChoosePlanetPopupVisible.value = false;
};

const handlePlanetConfirm = ({ selectedIndex }) => {
    selectedSlotByRow.value[selectedRowCost.value] = selectedIndex;
    closeChoosePlanetPopup();
};
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

    &__invite {
        min-height: 42px;
        border-radius: 12px;
        font-size: 20px;
    }

    &__content {
        min-height: 0;
        flex: 1;
    }

    &__level-item {
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

    &__grid-scroll {
        min-height: 0;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        padding-right: 2px;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    &__matrix {
        display: grid;
        grid-template-columns: minmax(56px, 0.9fr) repeat(3, minmax(0, 1fr));
        gap: 12px;
        align-items: stretch;
        padding-bottom: 90px;
    }

    &__row {
        display: contents;
    }

    &__planet-slot {
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

    &__planet-slot--selected {
        border-color: #2f266f;
        box-shadow: 0 0 0 2px rgba(47, 38, 111, 0.2);
    }

    &__planet-placeholder {
        position: absolute;
        bottom: -50%;
        width: 90%;
        height: auto;
    }
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

.transparent {
    background-color: transparent;
}
</style>
