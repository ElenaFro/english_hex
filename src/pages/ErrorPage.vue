<template>
    <div class="main-container">
        <div class="content-container">
            <div class="code-container">
                <p class="error-code">{{ errorCode }}</p>
                <img src="@/assets/img/error-img.png" alt="" class="error-girl" />
            </div>
            <div class="error-container">
                <p class="error-container__text">
                    Мы столкнулись с небольшой проблемой. Извиняемся за неудобства! Попробуйте
                    обновить приложение или перезагрузить устройство.
                </p>
                <button @click="goToMainPage" class="button button--purple">Вернись обратно</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
    code: {
        type: [String, Number],
        default: 404,
    },
});

const errorCode = props.code;

const goToMainPage = () => {
    router.push({ name: 'mainPage' });
};
</script>

<style scoped>
.code-container {
    position: relative;
    display: flex;
    justify-content: center;
}

.error-code {
    font-size: 200px;
    font-weight: 700;
    line-height: 100%;
    text-align: center;
    color: rgba(255, 255, 255, 1);
    text-shadow: 7px 9px 14px rgba(0, 0, 0, 0.25);
    opacity: 20%;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 55%;
    z-index: 1;
}

.error-girl {
    margin-bottom: 42px;
    z-index: 2;
}

.error-container {
    padding: 21px 18px;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 1);
}

.error-container__text {
    font-size: 18px;
    font-weight: 400;
    line-height: 120%;
    color: rgba(38, 32, 96, 1);
    margin-bottom: 20px;
}
</style>
