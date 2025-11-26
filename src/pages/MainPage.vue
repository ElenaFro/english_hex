<template>
    <watchStarsPopup v-if="!popupShowed" @close="handlePopup" />
    <div class="username-container">
        <div class="username-container__img-container">
            <div class="username-container__img-container-inner">
                <img :src="avatarIcon" alt="" class="user-img" />
            </div>
        </div>
        <p class="username-container__name">{{ userName }}</p>
    </div>
    <div class="page-content" :class="{ background_blur: !popupShowed }">
        <loader v-if="loading" />
        <div v-else class="scroll-container" :class="{ content_blur: !popupShowed }">
            <add-categories-card v-if="isAdmin" />
            <CategoryChoice
                v-for="section in sections"
                :key="section.id"
                :id="section.id"
                :sectionName="section.english_name"
                :imgUrl="section.category_photo"
                :backgroundColor="randomColor(section.id)"
                :progress="section.completed_category"
                :locked="true"
            />
        </div>
    </div>

    <InstallAppPopup />

    <HelloPopupWithSound
        v-if="openHelloPopup"
        :title="titlePopup"
        :message="messagePopup"
        :sound-mp3="SoundForPopup"
        @close="closePopup"
        @arrow-click="closePopup"
    />

    <subscribe-push-notify
        :is-visible="subscribePopup"
        @close-popup="closeSubscribePopup"
        @reject="rejectSubscribe"
    />
</template>

<script setup>
//vue
import { ref, onMounted, computed } from 'vue';
//components
import CategoryChoice from '@/components/MainPage/CategoryChoice.vue';
import loader from '@/components/Loader.vue';
import HelloPopupWithSound from '@/components/popups/HelloPopupWithSound.vue';
import watchStarsPopup from '@/components/popups/watchStarsPopup.vue';
import InstallAppPopup from '@/components/popups/InstallAppPopup.vue';
import SubscribePushNotify from '@/components/popups/SubscribePushNotify.vue';
import AddCategoriesCard from '@/components/categories/AddCategoriesCard.vue';
//source
import BoyIcon from '@/assets/img/DefaultUserAvatar/male.svg';
import GirlIcon from '@/assets/img/DefaultUserAvatar/female.svg';
import SoundForPopup from '@/assets/audio/helloFromDi.wav';
//store
import { useUserStore } from '@/stores/user';
import { useCategoriesStore } from '@/stores/categories';

const loading = ref(true);
const openHelloPopup = ref(false);
const popupShowed = ref(true);
const subscribePopup = ref(false);
const userStore = useUserStore();
const isAdmin = computed(() => userStore.isAdmin);

onMounted(async () => {
    await useCategoriesStore().getCategories();
    userStore.getUserNotifications();

    if (localStorage.getItem('markFirstGame')) {
        popupShowed.value = false;
        localStorage.removeItem('markFirstGame');
    }

    loading.value = false;
    if (!hasVisited.value) {
        openHelloPopup.value = true;
        hasVisited.value = true;
        localStorage.setItem('hasVisited', 'true');
    }

    if (userStore.user.ever_played_game) {
        if (userStore.isSubscribed === null) await userStore.checkUserSubscribe();
        subscribePopup.value = !userStore.isSubscribed;
    }
    if (userStore.unsubscribed_at && userStore.isSubscribed === 'unsubscribe')
        checkTimeForLastReject();
});

const colorPalette = ['#BD8BCF', '#F6B390', '#79BBFB', '#FF98A5'];

const generateColors = (count) => {
    const result = [];
    const repeats = Math.floor(count / colorPalette.length);
    const remainder = count % colorPalette.length;

    for (let i = 0; i < repeats; i++) {
        result.push(...colorPalette);
    }

    const shuffled = [...colorPalette].sort(() => Math.random() - 0.5);
    result.push(...shuffled.slice(0, remainder));

    return result.sort(() => Math.random() - 0.5);
};

const randomColor = (id) => colorsForSections.value[id];

const hasVisited = ref(localStorage.getItem('hasVisited') === 'true');

const currentUser = computed(() => userStore.getCurrentUser());
const userName = computed(() => currentUser.value.name);
const avatarIcon = computed(() => (currentUser.value.gender === 'male' ? BoyIcon : GirlIcon));
const sections = computed(() => useCategoriesStore().categories);

const colorsForSections = computed(() => {
    const total = sections.value.length;
    const colors = generateColors(total);
    const mapping = {};
    sections.value.forEach((section, index) => {
        mapping[section.id] = colors[index];
    });
    return mapping;
});

const closePopup = () => {
    openHelloPopup.value = !openHelloPopup.value;
    openHelloPopup.value = false;
};

const titlePopup = 'Добро пожаловать!';
const messagePopup =
    'Привет! Меня зовут Di, и я рада приветствовать тебя в мире изучения английских слов! Ты сделал важный шаг к своей мечте - свободному владению иностранным языком.';

const checkTimeForLastReject = () => {
    if (!userStore.unsubscribed_at) return false;
    const unsubscribeDate = new Date(userStore.unsubscribed_at.replace(' ', 'T'));
    subscribePopup.value = Date.now() - unsubscribeDate >= 24 * 60 * 60 * 1000;
};

const handlePopup = async () => {
    popupShowed.value = true;
};

const closeSubscribePopup = () => {
    subscribePopup.value = !subscribePopup.value;
};

const rejectSubscribe = () => {
    userStore.unSubscribeUser();
    closeSubscribePopup();
};
</script>

<style scoped>
.username-container {
    position: relative;
    box-sizing: content-box;
    height: 64px;
    padding: 0 0 21px 27px;
    display: flex;
    align-items: center;
    align-self: flex-start;
    z-index: 101;
}

.username-container__img-container-inner {
    width: 55px;
    height: 55px;
    border: 1px solid rgba(161, 161, 0, 0.5);
    border-radius: 50%;
    background: rgba(255, 243, 237, 1);
    box-shadow: 0 0 106px 0 rgba(46, 236, 197, 0.1);
}

.username-container__img-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border: 1px solid rgba(240, 172, 25, 1);
    border-radius: 50%;
    box-shadow: 0 0 250px 0 rgba(191, 166, 25, 0.1);
    margin-right: 11px;
}

.username-container__name {
    font-size: 20px;
    font-weight: 600;
    line-height: 100%;
    text-align: center;
    color: rgba(255, 255, 255, 1);
}

.content-container {
    display: flex;
    flex: 1;
    overflow: hidden;
    width: 100%;
    border-radius: 40px 40px 0 0;
    padding: 57px 30px 0;
    background-color: rgba(246, 246, 254, 1);
}

.scroll-container {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 220px;
    justify-content: space-between;
    gap: 20px;
}

.background_blur {
    backdrop-filter: blur(4px);
    background: #f6f6fe;
}

.content_blur {
    filter: blur(4px);
}

.user-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
</style>
