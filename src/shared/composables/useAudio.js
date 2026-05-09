/**
 * Глобальный синглтон для воспроизведения аудио.
 * Гарантирует, что одновременно играет только один звук:
 * каждый новый вызов playAudio() останавливает предыдущий.
 */

let _current = null;

export const stopAudio = () => {
    if (_current) {
        _current.pause();
        _current.currentTime = 0;
        _current = null;
    }
};

export const playAudio = (src) => {
    if (!src) return;
    stopAudio();
    const audio = new Audio(src);
    _current = audio;
    audio.addEventListener('ended', () => {
        if (_current === audio) _current = null;
    });
    audio.play().catch((err) => console.error('Audio play error:', err));
};

export const useAudio = () => ({ playAudio, stopAudio });
