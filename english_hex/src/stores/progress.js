import apiClient from '@/api/axios';

export const markFirstGame = async () => {
	try {
		await apiClient.patch( '/profile/update', {
			ever_played_game: true,
			popup_show: true
		});
	} catch (error) {
		console.error(error)
	}
}