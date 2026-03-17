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
                            :key="`row-${row.min_rating}`"
                            class="edit-planet-page__row"
                        >
                            <div class="edit-planet-page__level-item">
                                {{ row.min_rating }}
                                <img src="@/assets/icons/yelow_star.svg" alt="star" />
                            </div>
                            <button
                                v-for="col in 3"
                                :key="`${row.min_rating}-${col}`"
                                type="button"
                                class="edit-planet-page__planet-slot"
                                :class="{
                                    'edit-planet-page__planet-slot--selected':
                                        selectedSlotByRow[row.min_rating] === col - 1,
                                    'edit-planet-page__planet-slot--not-available':
                                        !row.skins[col - 1]?.is_available &&
                                        selectedSlotByRow[row.min_rating] !== col - 1,
                                }"
                                :aria-label="`slot-${row.min_rating}-${col}`"
                                @click="openChoosePlanetPopup(row, col - 1)"
                            >
                                <img
                                    :src="row.skinImages[col - 1]"
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
import { computed, onMounted, ref, watch } from 'vue';
import BButton from '@/shared/components/BaseButton.vue';
import InviteUsersPopup from './popups/InviteUsersPopup.vue';
import ChoosePlanetPopup from './popups/ChoosePlanetPopup.vue';
import { usePlanetStore } from '@/stores/planet';
import { push } from 'notivue';

const isAddFriendLink = ref(false);
const isChoosePlanetPopupVisible = ref(false);
const selectedRowCost = ref(0);
const selectedRowPlanets = ref([]);
const selectedRowSkins = ref([]);
const selectedPlanetIndex = ref(null);
const selectedSlotByRow = ref({});

const planetStore = usePlanetStore();

const planetImages = import.meta.glob('@/assets/planets/*.svg', {
    eager: true,
    import: 'default',
});

const resolvePlanetImage = (skinKey) => {
    const normalizedKey = (skinKey ?? 'planet_default').replace(/\.svg$/i, '');
    const match = Object.entries(planetImages).find(([path]) =>
        path.endsWith(`/${normalizedKey}.svg`)
    );
    return match ? match[1] : planetImages['/src/assets/planets/planet_default.svg'];
};

const rows = computed(() =>
    (planetStore.planetSkins ?? []).map((row) => ({
        ...row,
        skinImages: row.skins.map((skin) => resolvePlanetImage(skin.sprite_key)),
    }))
);

const pageClass = computed(() =>
    isAddFriendLink.value || isChoosePlanetPopupVisible.value ? 'transparent' : ''
);

const syncSelectedSlots = () => {
    const next = {};
    const selectedId = planetStore.planetSkinsOptions?.selected_skin ?? null;
    if (!selectedId) {
        selectedSlotByRow.value = next;
        return;
    }
    for (const row of rows.value) {
        const selectedIndex = row.skins.findIndex(
            (skin) => skin.id === selectedId || skin.skin_id === selectedId
        );
        if (selectedIndex >= 0) {
            next[row.min_rating] = selectedIndex;
            break;
        }
    }
    selectedSlotByRow.value = next;
};

onMounted(async () => {
    await planetStore.getPlanetSkins();
    syncSelectedSlots();
});

watch(rows, syncSelectedSlots);

const closeLinkPopup = () => {
    isAddFriendLink.value = false;
};

const openLinkPopup = () => {
    isAddFriendLink.value = true;
};

const openChoosePlanetPopup = (row, initialIndex) => {
    const skin = row.skins?.[initialIndex];
    const isSelected = selectedSlotByRow.value[row.min_rating] === initialIndex;
    if (isSelected) {
        push.error({ message: 'Выбрать планету той же категории нельзя' });
        return;
    }
    if (skin && !skin.is_available && !isSelected) {
        push.error({ message: 'Данная планета недоступна' });
        return;
    }
    selectedRowCost.value = row.min_rating;
    selectedRowPlanets.value = row.skinImages;
    selectedRowSkins.value = row.skins;
    selectedPlanetIndex.value = selectedSlotByRow.value[row.min_rating] ?? initialIndex;
    isChoosePlanetPopupVisible.value = true;
};

const closeChoosePlanetPopup = () => {
    isChoosePlanetPopupVisible.value = false;
};

const handlePlanetConfirm = async ({ selectedIndex }) => {
    selectedSlotByRow.value[selectedRowCost.value] = selectedIndex;
    const selectedSkin = selectedRowSkins.value[selectedIndex];
    if (selectedSkin?.id) {
        await planetStore.selectSkin(selectedSkin.id);
        await planetStore.getPlanetSkins();
    }
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
        border: 2px solid #2f266f;
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
        border-color: green;
    }

    &__planet-slot--not-available {
        opacity: 0.4;
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
