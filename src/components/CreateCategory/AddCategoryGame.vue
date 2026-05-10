<template>
    <div class="game-step">
        <p class="game-step__title">Список заданий</p>

        <div class="game-step__actions">
            <button class="btn btn--primary" @click="emit('add-task')">
                {{ tasks.length > 0 ? '+ Задание' : 'Новое задание' }}
            </button>
            <button class="btn btn--outline" @click="emit('preview')">Предпросмотр</button>
        </div>

        <div v-if="tasks.length > 0" class="task-list">
            <div v-for="(task, index) in tasks" :key="index" class="task-card">
                <div class="task-card__text">
                    <p class="task-card__ru">{{ task.sentence_ru }}</p>
                    <p class="task-card__en">{{ task.sentence_en }}</p>
                </div>
                <div class="task-card__actions">
                    <button class="icon-btn" @click="emit('delete-task', index)">
                        <img src="@/assets/icons/delete_icon.svg" alt="Удалить" />
                    </button>
                    <button class="btn btn--primary btn--sm" @click="emit('edit-task', index)">
                        Редактировать
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    tasks: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
});

const emit = defineEmits(['add-task', 'edit-task', 'delete-task', 'preview']);
</script>

<style scoped>
.game-step {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
}

.game-step__title {
    font-family: Mulish;
    font-weight: 700;
    font-size: 20px;
    color: #311d5d;
    text-align: center;
}

.game-step__actions {
    display: flex;
    justify-content: space-between;
}

.btn {
    padding: 7px 15px;
    border-radius: 16px;
    font-family: Mulish;
    font-weight: 600;
    font-size: 18px;
    cursor: pointer;
    border: none;
    line-height: 120%;
}

.btn--primary {
    background: #2e236d;
    color: #fff;
}

.btn--outline {
    background: transparent;
    border: 2px solid #262060;
    color: #262060;
}

.btn--sm {
    padding: 6px 22px;
    font-size: 18px;
    font-weight: 600;
}

.task-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.task-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #fff;
    border-radius: 20px;
    border: 2px solid #262060;
    padding: 20px 16px;
}

.task-card__text {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.task-card__ru {
    font-family: Mulish;
    font-weight: 800;
    font-size: 20px;
    color: #311d5d;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.task-card__en {
    font-family: Mulish;
    font-weight: 400;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.task-card__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
}

.icon-btn {
    background: transparent;
    border: 2px solid #262060;
    border-radius: 16px;
    cursor: pointer;
    padding: 5px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-btn img {
    width: 20px;
    height: 20px;
}
</style>
