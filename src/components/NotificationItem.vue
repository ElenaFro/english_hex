<template>
    <section>
        <div class="message-block-notification">
            <p class="message-block__title18">{{ notificationTitle }}</p>
            <p class="message-block__text14">
                {{ notificationText }}
            </p>
        </div>
        <div>
            <p class="message-block__day">{{ formatedData }}</p>
            <div class="day-container">
                <img src="@/assets/icons/navBarIcon/Ellipse red.svg" class="note-icon" alt="New" />
            </div>
        </div>
    </section>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
    notificationTitle: { type: String, default: '' },
    notificationText: { type: String, default: '' },
    sendData: { type: String, default: '' },
    readed: { type: Boolean, default: false },
});

const formatedData = computed(() => formatDateToRussian(props.sendData));

const formatDateToRussian = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
    });
};
</script>
<style scoped lang="scss">
.message-block__title18 {
    align-self: flex-start;
    font-size: 18px;
    font-weight: 600;
    color: #311d5d;
}

.message-block__text14 {
    font-size: 14px;
    font-weight: 400;
    color: #262060;
}
.message-block__day {
    font-size: 14px;
    font-weight: 600;
    line-height: 27px;
    color: #747474;
    width: 84px;
    text-align: right;
}

.note-icon {
    padding-top: 16px;
}
.day-container {
    display: flex;
    width: 100%;
    justify-content: end;
}
</style>
