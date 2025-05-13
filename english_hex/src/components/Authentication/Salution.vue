<template>
    <div class="main-container">
      <div class="content-container">
        <div class="image-container">
          <img src="@/assets/img/hand.svg" alt="DICARDZ" class="img" />
        </div>
        <div class="message-block message-block--shadow">
          <p class="message-block__title">Привет! Давай учить английский вместе</p>
          <button @click="$emit('change-component', 'AgeVerif')" class="button button--purple">
            Начать
            <img src="@/assets/img/arrow_icon.svg" alt="arrow" />
          </button>
        </div>
      </div>
    </div>
  </template>

<script setup>

</script>

<style scoped>
.content-container {
  bottom: 15%;
}

.image-container {
  width: 439px;
  height: 439px;
  position: relative;
  top: 110px;
}

.message-block {
  text-align: center;
  z-index: 100;
}

.message-block__title {
  font-size: 24px;
  line-height: 100%;
  margin-bottom: 22px;
}

.button img {
  margin-left: 12px;
  width: 23px;
}
</style>