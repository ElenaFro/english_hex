<template>
    <div class="edit-select">
        <div class="edit-card" @click="emit('edit-category')">
            <div class="edit-card__text">
                <p class="edit-card__title">Категория</p>
                <p class="edit-card__desc">Отредактировать категорию</p>
            </div>
            <button class="edit-btn">Отредактировать</button>
        </div>

        <div class="edit-card" @click="emit('edit-game')">
            <div class="edit-card__text">
                <p class="edit-card__title">Игра</p>
                <p class="edit-card__desc">Отредактировать игру</p>
            </div>
            <button class="edit-btn">Отредактировать</button>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['edit-category', 'edit-game']);
</script>

<style scoped>
.edit-select {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0 20px;
    width: 100%;
}

.edit-card {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    background: #262060;
    border-radius: 20px;
    padding: 20px 17px 12px;
    gap: 12px;
    cursor: pointer;
}

.edit-card__text {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.edit-card__title {
    font-family: Mulish;
    font-weight: 800;
    font-size: 20px;
    color: #fff;
}

.edit-card__desc {
    font-family: Mulish;
    font-weight: 400;
    font-size: 16px;
    color: #fff;
    margin-bottom: 14px;
}

.edit-btn {
    padding: 4px 22px;
    margin-left: -35px;
    background: transparent;
    border: 2px solid #fff;
    border-radius: 14px;
    background: #fff;
    font-family: Mulish;
    font-weight: 600;
    font-size: 18px;
    line-height: 120%;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
}
</style>
