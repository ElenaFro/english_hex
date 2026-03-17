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
    async function getInfinityMode() {
        try {
            const response = await apiClient.get('/games/infinity-mode');
            return response.data;
        } catch (error) {
            console.error('Ошибка получения данных для infinity mode:', error);
            throw error;
        }
    }

    async function finishInfinityMode(wordsRepeated) {
        try {
            await apiClient.post('/games/infinity-mode/finish', {
                words_repeated: wordsRepeated,
            });
        } catch (error) {
            console.error('Ошибка получения infinity mode:', error);
            throw error;
        }
    }

    return {
        wordsForGame,
        getWordForConstellatonGame,
        getWordForTwinkleGame,
        fetchDataForPlanetAttack,
        getInfinityMode,
        finishInfinityMode,
    };
});






