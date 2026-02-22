<template>
    <div class="popup-container">
        <img src="@/assets/img/arrow-img.png" alt="" class="arrow-img" />
        <div class="popup">
            <img class="popup__img" src="@/assets/img/girl_popup.png" alt="" />
            <h1 class="popup__header">Звезды</h1>
            <p class="popup__text">Посмотреть страницу с отображением планет</p>
            <button class="button button--purple" @click="closePopup">Продолжить</button>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['close']);

const closePopup = async () => {
    emit('close');
};
</script>

<style scoped lang="scss">
.popup-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.arrow-img {
    width: 110px;
    position: absolute;
    top: 55px;
    left: 100px;
    z-index: 502;
}

.popup {
    position: absolute;
    top: 210px;
    z-index: 101;
    border: 3px solid #262060;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    text-align: start;

    &__header {
        color: #311d5d;
        margin-bottom: 12px;
    }

    &__text {
        margin-bottom: 30px;
    }

    &__img {
        position: absolute;
        bottom: 140px;
        left: 160px;
    }
}
</style>
