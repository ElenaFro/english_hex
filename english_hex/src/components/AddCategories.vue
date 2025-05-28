<template>
    <div class="add-container">
        <div class="content-container">
            <div class="message-block">
                <h1 class="message-block__title">Страница редактирования</h1>
                <p class="message-block__text">В работе 
                </p>
            </div>
        </div>
    </div>
</template>


<script setup>

</script>

<style scoped>
.add-container {
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
    
    
    max-width: 414px;              
    /* background-color: #ffffff;   */
    border-radius: 40px;

}

.message-block__title {
    align-self: flex-start;
}

.message-block__text {
    margin-bottom: 16px;
}
</style>