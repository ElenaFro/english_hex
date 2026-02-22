<template>
    <teleport to="body">
        <div v-if="isVisible" class="popup-overlay" @click.self="closePopup">
            <div class="popup-card">
                <button class="close-button" type="button" aria-label="Закрыть" @click="closePopup">
                    <span></span>
                    <span></span>
                </button>

                <h2 class="popup-title">Больше друзей<br />больше звезд</h2>

                <p class="popup-subtitle">
                    Пригласи человека по своей уникальной ссылке, и заработай больше звезд
                </p>

                <ul class="rewards-list">
                    <li>
                        <b>1 друг - 10</b> <img src="@/assets/icons/yelow_star.svg" alt="star" />
                    </li>
                    <li>
                        <b>3 друга - 30</b> <img src="@/assets/icons/yelow_star.svg" alt="star" />
                    </li>
                    <li>
                        <b>5 друзей - 50</b> <img src="@/assets/icons/yelow_star.svg" alt="star" />
                    </li>
                    <li>
                        <b>10 друзей - 100</b>
                        <img src="@/assets/icons/yelow_star.svg" alt="star" />
                    </li>
                    <li>
                        <b>30 друзей - 300</b>
                        <img src="@/assets/icons/yelow_star.svg" alt="star" />
                    </li>
                    <li>
                        <b>50 друзей - 500</b>
                        <img src="@/assets/icons/yelow_star.svg" alt="star" />
                    </li>
                </ul>

                <div class="actions-row">
                    <button type="button" class="share-button" @click="shareInviteLink">
                        <span class="text-white">Поделиться</span>
                        <img src="@/assets/icons/arrow_right.svg" alt="arrow" />
                    </button>
                    <div class="friends-counter">
                        <span>5</span>
                        <img src="@/assets/icons/profile-violet.svg" alt="profile" />
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close']);
const isVisible = ref(true);

const closePopup = () => {
    isVisible.value = false;
    emit('close');
};

const shareInviteLink = async () => {
    const shareText = 'Присоединяйся и получай звезды вместе со мной!';

    if (navigator.share) {
        try {
            await navigator.share({ text: shareText, url: window.location.origin });
            return;
        } catch {}
    }

    try {
        await navigator.clipboard.writeText(window.location.origin);
    } catch {}
};
</script>

<style scoped lang="scss">
.popup-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(3px);
    z-index: 1000;
}

.popup-card {
    width: 315px;
    max-width: calc(100vw - 20px);
    border-radius: 20px;
    background: #f3f1fb;
    padding: 24px 20px 18px;
    color: #31216a;
    position: relative;
}

.close-button {
    position: absolute;
    right: 12px;
    top: 10px;
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;

    span {
        position: absolute;
        top: 11px;
        left: 2px;
        width: 22px;
        height: 2px;
        background: #2c2668;
        border-radius: 2px;
    }

    span:first-child {
        transform: rotate(45deg);
    }

    span:last-child {
        transform: rotate(-45deg);
    }
}

.popup-title {
    margin: 0 40px 12px 0;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.2;
    color: #311d5d;
}

.popup-subtitle {
    margin: 0 0 14px;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.2;
    max-width: 100%;
    color: #2c2668;
}

.rewards-list {
    list-style: none;
    padding: 0;
    margin: 0 0 18px;
    display: flex;
    flex-direction: column;
    gap: 5px;

    li {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 22px;
        font-weight: 500;
        color: #311d5d;
        line-height: 1.2;
    }

    img {
        width: 18px;
        height: 18px;
    }
}

.actions-row {
    display: flex;
    align-items: center;
    gap: 14px;
}

.share-button {
    border: none;
    border-radius: 14px;
    background: #2f266f;
    color: #fff;
    height: 40px;
    min-width: 156px;
    padding: 9px 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 17px;
    font-weight: 700;
    cursor: pointer;
    line-height: 1;

    img {
        width: 24px;
        height: 14px;
    }
}

.friends-counter {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #2f266f;

    span {
        font-size: 30px;
        font-weight: 700;
        line-height: 1;
    }

    svg {
        width: 28px;
        height: 28px;
    }
}
</style>
