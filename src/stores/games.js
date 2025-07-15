import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '../api/axios';

export const useGamesStore = defineStore('games', () => {
    const wordsForGame = ref([]);

    async function getWordForConstellatonGame(id) {
        try {
            const response = await apiClient.get(`/games/constellation-of-the-word/get/${id}`);
            return (wordsForGame.value = response.data);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function getWordForTwinkleGame(id) {
        try {
            const response = await apiClient.get(`/games/flickering-words/get/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function fetchDataForPlanetAttack(id) {
        try {
            const response = await apiClient.get(`/games/planet-attack/get/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении вопросов:', error);
        }
    }
    return {
        wordsForGame,
        getWordForConstellatonGame,
        getWordForTwinkleGame,
        fetchDataForPlanetAttack,
    };
});
