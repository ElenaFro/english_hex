<template>
    <section class="popup-overlay">
        <section class="popup relative">
            <div class="girl_top">
                <img src="@/assets/img/girl_popup.png" alt="girl" class="girl">
            </div>
            <p class="popup__header pt-45 pb-25">
                {{ title }}
            </p>
            <div>
                {{ message }}
            </div>
            <div class="">
                <div class="flex items-end">
                    <button class="btn" @click="goToMainPage">
                        Вернуться на главную
                    </button>
                </div>
            </div>
        </section>
    </section>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { defineProps, defineEmits } from 'vue';

const router = useRouter();
const emit = defineEmits();

const props = defineProps({
    title: { type: String, default: '' },
    message: { type: String, default: '' },
    soundMp3: { type: String, default: '' }
})

const goToMainPage = () => {
    emit('close');
    router.push({name: ''});
};
</script>

<style scoped lang="scss">
.popup-overlay {
    position: fixed;
    height: 100vh;
    width: 100vw;
    backdrop-filter: blur(20px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    margin: 0;
}

.popup {
    max-height: 249px;
    height: 249px;
    z-index: 400;
    margin-bottom: 40vh;
    display: flex;
    flex-direction: column;
}

.btn {
    background-color: #262060;
    color: #fff;
    padding: 9px 24px;
    border-radius: 16px;
    font-weight: 500!important;
    font-size: 18px;
    line-height: 22px!important;
    letter-spacing: 0%;
    border: none !important;
    margin-top: 29px;
    text-decoration: none;
}
.girl_top {
    position : absolute;
    right: -20px;
    top: -116px;
}
.pb-25 {
    padding-bottom: 15px;
}
.pt-45 {
    padding-top: 27px;
}

</style>