import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import apiClient from '../api/axios';
import { push } from 'notivue';

export const usePlanetStore = defineStore('planet', () => {
    const planetSkinsOptions = ref(null);
    const planetSkins = ref([]);
    const selectedSkin = computed(() => {
        const selectedId = planetSkinsOptions.value?.selected_skin;
        if (selectedId == null) {
            return 'planet_default';
        }

        const groups = planetSkins.value ?? [];
        for (const group of groups) {
            const list = group?.skins ?? [];
            const found = list.find(
                (skin) => skin.id === selectedId || skin.skin_id === selectedId
            );
            if (found?.sprite_key) {
                return found.sprite_key;
            }
        }

        return 'planet_default';
    });

    async function getPlanetSkins() {
        try {
            const response = await apiClient.get('/me/planet/skins');

            planetSkinsOptions.value = response.data;
            planetSkins.value = planetSkinsOptions.value.rows;
        } catch (error) {
            console.error('Fetch users error:', error);
        }
    }

    async function selectSkin(id) {
        try {
            await apiClient.post('/me/planet/skins/select', { skin_id: id });
        } catch (error) {
            if (error.message.includes('Skin is not unlocked yet.')) {
                push.error({ message: 'Данная планета еще недоступна' });
                return;
            }
            console.error('Ошибка выбора скина', error);
        }
    }

    return {
        planetSkinsOptions,
        planetSkins,
        selectedSkin,
        getPlanetSkins,
        selectSkin,
    };
});
