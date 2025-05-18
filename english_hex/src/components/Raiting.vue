<template>
    <div class="raiting-container">
        <div class="content-container">
            <div class="message-block">
                <h1 class="message-block__title">Страница рейтинга</h1>
                <p class="message-block__text">В работе 
                </p>
                <!-- <div class="button-container button-container--column">
                    <button @click="$emit('change-component', 'RegistForm')" class="button button--purple">
                        Да, мне есть 14 лет
                    </button>        
                    <button @click="$emit('change-component', 'RegistForm')" class="button button--purple">
                        Мне нет 14 лет
                    </button>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.raiting-container {
    width: 100%;                /* Full width */
    height: 100vh;             /* Full viewport height */
    overflow-y: auto;          /* Enable vertical scrolling */
    display: flex;             /* Use flexbox for alignment */
    flex-direction: column;     /* Stack children vertically */
    justify-content: center;    /* Center content vertically */
    align-items: center;        /* Center content horizontally */
    position: relative;         /* Positioning context */
    box-sizing: border-box;     /* Include padding and border in element's total width and height */
    margin-top: 80px;          /* Adjust margin as needed */
}

.content-container {
    padding: 20px;             /* Add padding if needed */
    flex: 1;                   /* Allow it to grow and fill space */
}

.message-block__title {
    align-self: flex-start;
}

.message-block__text {
    margin-bottom: 16px;
}
</style>