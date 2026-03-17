<template>
    <div class="page-content">
        <div class="content-container">
            <div class="content-container-inner">
                <h1 class="page-content__name-game">Мерцание слов</h1>
                <p class="page-content__short-describe-game">
                    Внимание и визуальная память - ключ к успеху!
                </p>
                <p class="page-content__describe-game">
                    Смотри на изображение 4 секунды и запомни все детали. После этого картинка
                    исчезнет, и появится вопрос с четырьмя вариантами ответа на английском. Выбери
                    правильный перевод. За каждую ошибку добавится +1 секунда к общему времени.
                    Готов проверить свою память и внимание?
                </p>
                <button class="button button--blue" @click="start">Начать</button>
            </div>
            <div class="img-container">
                <img src="@/assets/img/girl-img2.png" alt="" class="img-container__girl-img" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const props = defineProps({
    gameName: { type: String, default: '' },
    id: { type: String, default: '' },
});

const router = useRouter();

const start = () => {
    router.push({ name: 'flyAnimation', query: { name: props.gameName, id: props.id } });
};
</script>

<style scoped lang="scss">
.page-content {
    .content-container {
        position: relative;
        height: 100%;
        justify-content: flex-start;
        padding-bottom: 65px;
        min-height: 100dvh;
        width: 100%;
    }

    &__name-game {
        font-size: 26px;
        font-weight: 800;
        line-height: 100%;
        text-align: center;
        color: #311d5d;
        margin-bottom: 12px;
    }

    &__short-describe-game {
        font-size: 22px;
        font-weight: 800;
        line-height: 100%;
        text-align: center;
        color: #311d5d;
        margin: 0 auto;
        margin-bottom: 12px;
        max-width: 274px;
    }

    &__describe-game {
        font-size: 18px;
        font-weight: 500;
        line-height: 120%;
        text-align: justify;
        color: #262060;
        margin-bottom: 30px;
    }

    .button {
        align-self: flex-start;
    }

    .content-container-inner {
        position: relative;
    }

    .img-container {
        width: 230px;
        height: 230px;
        position: absolute;
        bottom: 150px;
        left: 30%;
    }
}
</style>
