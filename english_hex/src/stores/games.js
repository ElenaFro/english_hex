import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '../api/axios';

export const useGamesStore = defineStore('games', () => {
    const wordsForGame = ref([]);

    async function getWordForConstellatonGame(id) {
        try {
            const response = await apiClient.get(`/games/constellation-of-the-word/get/${id}`);
            console.log(response.data);

            return (wordsForGame.value = response.data);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    return {
        wordsForGame,
        getWordForConstellatonGame,
    };
});
