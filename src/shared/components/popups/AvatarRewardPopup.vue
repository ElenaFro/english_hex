<template>
    <teleport to="body">
        <div v-if="isVisible" class="reward-overlay">
            <img class="girl" src="@/assets/Di_avatar/girl-img-2.webp" alt="girl" />

            <div class="reward-card">
                <h2 class="reward-card__title">Поздравляю с заслуженной наградой!</h2>
                <p class="reward-card__subtitle">
                    Заходи каждый день, изучай новые слова и получай награду!
                </p>
            </div>

            <div class="avatars-card">
                <div class="avatars-scene">
                    <!-- верхние два аватара -->
                    <img
                        :src="getAvatarSrc(displayAvatarKeys[0])"
                        class="avatar-img avatar-img--tl"
                        alt=""
                    />
                    <img
                        :src="getAvatarSrc(displayAvatarKeys[1])"
                        class="avatar-img avatar-img--tr"
                        alt=""
                    />
                    <!-- нижние два аватара -->
                    <img
                        :src="getAvatarSrc(displayAvatarKeys[2])"
                        class="avatar-img avatar-img--bl"
                        alt=""
                    />
                    <img
                        :src="getAvatarSrc(displayAvatarKeys[3])"
                        class="avatar-img avatar-img--br"
                        alt=""
                    />
                    <!-- сундук в центре -->
                    <img src="@/assets/img/chest-2.svg" class="chest" alt="chest" />
                </div>
                <button class="go-btn" @click="handleGoToAvatars">Перейти к наградам</button>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { getAvatarSrc } from '@/shared/utils/avatarMap';

const props = defineProps({
    isVisible: {
        type: Boolean,
        default: false,
    },
    avatarKeys: {
        type: Array,
        default: null,
    },
});

const emit = defineEmits(['close']);

const router = useRouter();

const defaultAvatarKeys = ['male_astronaut', 'female_astronaut', 'boy_astronaut', 'girl_astronaut'];

const displayAvatarKeys = computed(() =>
    props.avatarKeys?.length ? props.avatarKeys : defaultAvatarKeys
);

const handleGoToAvatars = () => {
    emit('close');
    router.push({ name: 'profileAvatars' });
};
</script>

<style scoped>
.reward-overlay {
    position: fixed;
    inset: 0;
    z-index: 201;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    background:
        url('/src/assets/img/background_stars.png'),
        linear-gradient(
            to top,
            rgba(235, 182, 105, 1),
            rgba(200, 153, 116, 1),
            rgba(161, 119, 128, 1),
            rgba(129, 93, 124, 1),
            rgba(93, 70, 117, 1),
            rgba(57, 43, 88, 1),
            rgba(43, 32, 64, 1),
            rgba(30, 22, 41, 1),
            rgba(26, 20, 36, 1),
            rgba(25, 19, 33, 1)
        );
    background-size: contain;
    background-position: top;
    background-repeat: no-repeat;
    padding: 24px 20px 40px;
}

.girl {
    width: 160px;
    margin-bottom: -30px;
    z-index: 2;
}

.reward-card {
    background: #fff;
    border-radius: 24px;
    padding: 32px 12px;
    width: 100%;
    max-width: 315px;
    text-align: center;
}

.reward-card__title {
    font-size: 22px;
    font-weight: 700;
    color: #311d5d;
    line-height: 120%;
    margin: 0 0 12px;
}

.reward-card__subtitle {
    font-size: 18px;
    font-weight: 400;
    color: #262060;
    line-height: 120%;
    margin: 0;
    text-align: start;
}

.avatars-card {
    background-image: url('@/assets/img/background_stars.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #311d5d;
    border-radius: 20px;
    padding: 32px 10px;
    width: 100%;
    max-width: 315px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.avatars-scene {
    position: relative;
    width: 220px;
    height: 160px;
}

.avatar-img {
    position: absolute;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
    object-position: top;
    border: 2px solid rgba(255, 255, 255, 0.25);
    background: #3a2080;
}

.avatar-img--tl {
    top: 0;
    left: 40px;
}
.avatar-img--tr {
    top: 0;
    right: 40px;
}
.avatar-img--bl {
    bottom: 50px;
    left: 20px;
}
.avatar-img--br {
    bottom: 50px;
    right: 20px;
}

.chest {
    position: absolute;
    width: 106px;
    height: 106px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -42%);
    z-index: 1;
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5));
}

.avatar-img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    object-fit: cover;
    object-position: top;
    background: #3a2080;
    z-index: 2;
}

.go-btn {
    width: 100%;
    max-width: 315px;
    background: #fff;
    color: #262060;
    font-size: 18px;
    font-weight: 600;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    transition: opacity 0.2s;
    padding: 5px 0;
}

.go-btn:active {
    opacity: 0.8;
}
</style>
