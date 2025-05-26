<template>
    <div class="notifications-container">
        <div class="content-container note-container">
            <div class="message-block-notification">
                <p class="message-block__title18">Заголовок уведомления</p>
                <p class="message-block__text14">Какое-то очень важное событие в приложении, не пропусти</p>
            </div>
            <div>
                <p class="message-block__day">29 марта</p>
            </div>
        </div>
        <div class="content-container note-container">
            <div class="message-block-notification">
                <p class="message-block__title18">Заголовок уведомления</p>
                <p class="message-block__text14">Какое-то очень важное событие в приложении, не пропусти</p>
            </div>
            <div>
                <p class="message-block__day">29 марта</p>
                <div class="day-container">
                    <img src="@/assets/icons/navBarIcon/Ellipse red.svg" class="note-icon" alt="New" />
                </div>
            </div>
        </div>
        <div class="content-container note-container">
            <div class="message-block-notification">
                <p class="message-block__title18">Заголовок уведомления</p>
                <p class="message-block__text14">Текст — зафиксированная на каком-либо материальном носителе человеческая мысль; в общем плане связная и полная последовательность символов. Существуют две основные трактовки понятия «текст»: </p>
            </div>
            <div>
                <p class="message-block__day">29 марта</p>
                <div class="day-container">
                    <img src="@/assets/icons/navBarIcon/Ellipse red.svg" class="note-icon" alt="New" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.notifications-container {
    width: 100vw;               
    height: 100vh;           
    overflow-y: auto;         
    display: flex;            
    flex-direction: column;     
    justify-content: start;    
    align-items: center;      
    position: relative;       
    box-sizing: border-box;    
    margin-top: 0px; 
    padding-top: 30px;  
    background-color: #ffffff;  
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;      
}

.message-block__title18 {
    align-self: flex-start;
    font-size: 18px;
    font-weight: 600;
    color:#311D5D;
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
    color:#747474;
}
.note-container{
    display: flex;
    flex-direction: row;
    align-items: start;
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