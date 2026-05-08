<template>
    <article class="active-card">
        <div class="active-card__top">
            <img
                src="@/assets/Di_avatar/girl_with_achive.svg"
                alt=""
                class="active-card__img"
                aria-hidden="true"
            />
        </div>
        <div class="active-card__body">
            <p class="active-card__badge">Подписка активна</p>
            <h2 class="active-card__plan">{{ subscription.plan.name }}</h2>
            <div class="active-card__info">
                <div class="active-card__info-row">
                    <span class="active-card__info-label">Действует до</span>
                    <span class="active-card__info-value">{{ subscription.expires_at }}</span>
                </div>
                <div class="active-card__info-row">
                    <span class="active-card__info-label">Осталось дней</span>
                    <span class="active-card__info-value">{{ subscription.days_left }}</span>
                </div>
            </div>
            <button class="active-card__btn" type="button" @click="emit('continue')">
                Продолжить обучение
            </button>
        </div>
    </article>
</template>

<script setup>
defineProps({
    subscription: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['continue']);
</script>

<style scoped lang="scss">
.active-card {
    background: #262060;
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &__top {
        display: flex;
        justify-content: center;
        padding: 0 20px;
        height: 150px;
        overflow: hidden;
    }

    &__img {
        height: 150px;
        width: auto;
        object-fit: contain;
        margin-top: 6px;
    }

    &__body {
        padding: 0 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    &__badge {
        margin: 0;
        display: inline-flex;
        align-self: center;
        background: rgba(255, 255, 255, 0.15);
        color: #ffffff;
        font-size: 12px;
        font-weight: 700;
        border-radius: 20px;
        padding: 4px 14px;
    }

    &__plan {
        margin: 0;
        color: #ffffff;
        font-size: 22px;
        font-weight: 800;
        line-height: 1.2;
    }

    &__info {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    &__info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__info-label {
        color: rgba(255, 255, 255, 0.65);
        font-size: 14px;
        font-weight: 500;
    }

    &__info-value {
        color: #ffffff;
        font-size: 15px;
        font-weight: 700;
    }

    &__btn {
        margin-top: 4px;
        background: #ffffff;
        border: none;
        border-radius: 20px;
        color: #262060;
        font-size: 16px;
        font-weight: 700;
        font-family: Mulish, sans-serif;
        padding: 12px;
        cursor: pointer;
        transition: opacity 0.15s;
        width: 100%;

        &:hover {
            opacity: 0.9;
        }
    }
}
</style>
