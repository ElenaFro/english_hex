<template>
    <div class="answers-card">
        <p class="answers-card__question-mark">?</p>
        <div class="img-container">
            <img class="girl-img" src="@/assets/img/girl-img.png" alt="" />
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
    height: 463px;
    background-image: url('@/assets/img/card-background.png');
    background-size: cover;
    background-position: center;
    border: 3px solid #262060;
    border-radius: 20px;

    &__question-mark {
        font-size: 180px;
        font-weight: 800;
        line-height: 100%;
        color: #262060;
        padding-top: 41px;
    }

    .img-container {
        position: fixed;
        bottom: 3px;
        left: 55px;

        .girl-img {
            height: 263px;
            width: auto;
        }
    }
}
</style>
