<template>
    <div class="raiting-container">
        <div class="content-container">
            <div class="message-block">
                <h1 class="message-block__title">Страница рейтинга</h1>
                <p class="message-block__text">В работе 
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.raiting-container {
    width: 100%;               
    height: 100vh;           
    overflow-y: auto;         
    display: flex;            
    flex-direction: column;     
    justify-content: center;    
    align-items: center;      
    position: relative;       
    box-sizing: border-box;    
    margin-top: 80px;          
}

.message-block__title {
    align-self: flex-start;
}

.message-block__text {
    margin-bottom: 16px;
}
</style>