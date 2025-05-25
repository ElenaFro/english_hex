<template>
    <!-- для админа -->
    <div class="add-container">
        <div class="content-container_white">
            <div class="add-block">
                <button  class="button button--purple button-padding">
                    <img src="@/assets/img/plus_big.svg" alt="plus" />
                </button>
            </div>
            <p class="add-block__text">Название категории</p>
			<div class="add-form__input-container">
				<input ref="categoryInput" v-model="categoryName" type="text" placeholder="Введите название" :class="{
				'add-form__input-field': true,
				'add-form__input-field--error': inputError
				}" />
			</div>
            <p class="add-block__text">Описание категории</p>
            <textarea ref="descriptionInput" v-model="categoryDescription" placeholder="Введите описание" :class="{
                'add-form__input-field': true,
                'add-form__input-field--error': inputError
            }" style="height: 112px;"></textarea>
            <p class="add-block__text pt-20">Добавить новые карточки</p>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.add-container {
    width: 100%;               
    height: 100vh;           
    display: flex;            
    flex-direction: column;     
    justify-content: start;    
    align-items: center;      
    position: relative;       
    box-sizing: border-box;    
    margin-top: 80px; 
    /* overflow-y: auto;         */
}
/* Скрытие полосы прокрутки в WebKit браузерах */
/* .scrollable-block::-webkit-scrollbar {
    display: none; 
} */

.add-block__title {
    align-self: flex-start;
}

.add-block__text {
    margin-bottom: 2px;
    align-self: flex-start;
    font-family: Mulish;
    font-weight: 600;
    font-size: 20px;
    line-height: 100%;
    letter-spacing: 0%;
}
.button-padding {
    padding: 52.82px 35.82px;
}
.pt-20 {
    padding-top: 20px;
}
</style>