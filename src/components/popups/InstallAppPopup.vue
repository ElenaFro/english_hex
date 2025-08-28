<template>
    <div v-if="showPopup" class="install-popup">
        <div class="popup-content">
            <div class="header">
                <span class="popup-title"
                    >Установи иконку, открой портал к миру иностранного языка!</span
                >
                <button class="close-button" @click="closePopup">×</button>
            </div>

            <!-- Для PWA -->
            <div v-if="canInstall">
                <p class="popup-message">
                    Чтобы доступ к изучению языка был в один клик, добавь иконку на главный экран
                    устройства.
                </p>
                <div>
                    <img src="/public/installPopup-icon.svg" alt="girl-dicardz" />
                </div>
                <div>
                    <button class="popup-actions" @click="installPWA">
                        Установить <img src="@/assets/img/arrow_icon.svg" alt="arrow" />
                    </button>
                </div>
            </div>

            <!-- Для iOS Safari -->
            <div v-else-if="isIos && !isInStandalone">
                <ol class="ios-steps">
                    <li>
                        <p>Нажмите "Поделиться"</p>
                        <div>
                            <img
                                src="/public/ios_install/share_btn.svg"
                                alt="Share icon"
                                class="inline-icon"
                            />
                        </div>
                    </li>
                    <li class="d-mt-16">
                        <p>Выберите "На экран домой"</p>
                        <img
                            src="/public/ios_install/home_instructions.svg"
                            alt="Share icon"
                            class="inline-icon"
                        />
                    </li>
                </ol>
            </div>

            <!-- Для других устройств -->
            <div v-else>
                <p>Добавьте сайт в закладки или создайте ярлык через меню браузера.</p>
                <div class="popup-actions">
                    <button @click="closePopup">Закрыть</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const showPopup = ref(false);
const canInstall = ref(false);
const isIos = ref(false);
const isInStandalone = ref(false);
let deferredPrompt = null;

onMounted(() => {
    isIos.value = /iPhone|iPad|iPod/i.test(navigator.userAgent) && !navigator.standalone;
    isInStandalone.value =
        window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;

    const hasSeenPopup = localStorage.getItem('hasSeenInstallPopup');
    if (hasSeenPopup) return;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        canInstall.value = true;
        showPopup.value = true;
    });

    if (isIos.value && !isInStandalone.value) {
        setTimeout(() => {
            showPopup.value = true;
        }, 5000);
    }

    window.addEventListener('appinstalled', () => {
        showPopup.value = false;
        localStorage.setItem('hasSeenInstallPopup', 'true');
    });
});

async function installPWA() {
    if (!deferredPrompt) return;
    showPopup.value = false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        localStorage.setItem('hasSeenInstallPopup', 'true');
    } else {
        localStorage.setItem('hasSeenInstallPopup', 'false');
    }
    deferredPrompt = null;
}

function closePopup() {
    showPopup.value = false;
    localStorage.setItem('hasSeenInstallPopup', 'false');
}
</script>

<style scoped>
.install-popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(20px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-in-out;
}

.popup-content {
    background: #fff;
    border-radius: 20px;
    padding: 22px;
    padding-bottom: 0;
    padding-right: 0;
    width: 90%;
    max-width: 315px;
    position: relative;
    color: #311d5d;
    text-align: center;
}

.popup-actions {
    padding: 12px 24px;
    border: none;
    border-radius: 20px;
    background: #262060;
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    margin-top: 25px;

    img {
        margin-left: 12px;
    }
}

.header {
    display: flex;
    align-items: flex-start;
}

.close-button {
    position: absolute;
    top: -2px;
    right: 10px;
    background: none;
    border: none;
    font-size: 38px;
    color: #262060;
    cursor: pointer;
}

.popup-title {
    text-align: start;
    font-size: 22px;
    font-weight: 700;
    line-height: 120%;
    max-width: 270px;
    margin-bottom: 6px;
}

.popup-message {
    font-size: 18px;
    font-weight: 400;
    line-height: 120%;
    margin-bottom: 12px;
    letter-spacing: 0px;
    text-align: start;
}

.ios-steps {
    text-align: left;
    padding-left: 18px;
    margin: 0;
}

p {
    padding-left: 10px;
    margin-bottom: 0;
    color: #311d5d;
    font-family: Mulish;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 16px;
    line-height: 120%;
    letter-spacing: 0%;
}

.inline-icon {
    width: auto;
    vertical-align: middle;
    align-items: center;
    margin: 16px 10px 0 10px;
}

/* Анимации */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Адаптивность */
@media (max-width: 400px) {
    .popup-content {
        width: 95%;
        padding: 15px;
    }
    button {
        padding: 8px 16px;
        font-size: 14px;
    }
}
</style>
