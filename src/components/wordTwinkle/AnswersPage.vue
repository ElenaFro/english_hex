<template>
    <div class="answers-card">
        <p class="answers-card__question-mark">?</p>
        <div class="img-container">
            <img class="girl-img" src="@/assets/img/girl-img.svg" alt="" />
        </div>
    </div>
</template>

<script setup></script>

<style scoped lang="scss">
.answers-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    max-width: 300px;
    margin: 0 auto;
    background-color: #ffffff;
    background-image: url('@/assets/lesson/word_card_bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    border: 3px solid #262060;
    border-radius: 20px;
    overflow: hidden;
    z-index: 1000;

    &__question-mark {
        font-size: 10rem;
        font-weight: 800;
        line-height: 100%;
        color: #262060;
        padding-top: 1dvh;
    }

    .img-container {
        position: absolute;
        bottom: 0;
        left: 40%;
        height: 50%;

        .girl-img {
            height: 100%;
            width: auto;
        }
    }
}
</style>
